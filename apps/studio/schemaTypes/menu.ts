import { defineField, defineType } from 'sanity';
import { commonFields } from './common'
import slugify from 'slugify';

export const menu = defineType({
  name: 'menu',
  title: 'Menu',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Menu Name',
      type: 'string',
      description: 'Internal name for this menu (e.g., "Main Navigation", "Footer Menu")',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc: any) => {
          const title = doc.title || 'untitled';
          const language = doc.language || 'da';
          
          // Always append language suffix
          return `${title}-${language}`;
        },
        slugify: (input: string) => {
          return slugify(input, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
        },
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      ...commonFields.language
    }),
    defineField({
      name: 'menuItems',
      title: 'Menu Items',
      type: 'array',
      description: 'Add top-level menu items. Use sub-menu items within each item for dropdowns.',
      of: [{ type: 'navigation.link' }],
      validation: (Rule) => Rule.max(8).warning('Consider limiting top-level menu items for better UX')
    })
  ],
  preview: {
    select: {
      name: 'title',
      slug: 'slug',
      language: 'language',
      itemCount: 'menuItems'
    },
    prepare({ name, language, itemCount }) {
      const count = itemCount ? itemCount.length : 0;
      const languageLabel = language === 'en' ? 'English' : 'Danish';
      
      // Count total items including children recursively
      const countAllItems = (items: any[]): number => {
        if (!items) return 0;
        return items.reduce((total, item) => {
          return total + 1 + (item.children ? countAllItems(item.children) : 0);
        }, 0);
      };
      
      const totalCount = countAllItems(itemCount || []);
      const topLevelCount = count;
      
      return {
        title: name,
        subtitle: `${languageLabel} • ${topLevelCount} top-level${totalCount > topLevelCount ? ` • ${totalCount} total` : ''}`
      }
    }
  }
}); 