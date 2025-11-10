import { defineField } from 'sanity';
import slugify from 'slugify';
import { commonFields } from './common'
import { seo } from './objects/seo'

export const materiel = {
  name: 'materiel',
  title: 'Materiel',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'settings',
      title: 'Settings',
    }
  ],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      group: 'content'
    },
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: (doc: any) => {
          const title = doc.title || 'untitled';
          const language = doc.language || 'da';
          
          // Only prefix with language if it's not 'da' (main language)
          if (language !== 'da') {
            return `${language}-${title}`;
          }
          return title;
        },
        slugify: (input: string) => {
          // Handle language prefix separately
          if (input.includes('-')) {
            const [lang, ...rest] = input.split('-');
            const slugifiedRest = slugify(rest.join('-'), { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
            return `${lang}/materiel/${slugifiedRest}`;
          }
          const slugified = slugify(input, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
          return `materiel/${slugified}`;
        },
      },
      validation: (Rule: any) => Rule.required(),
      group: 'content'
    }),
    {
      name: 'authorId',
      title: 'Author ID',
      type: 'string',
      readOnly: true,
      group: 'content'
    },
    {
      ...commonFields.language,
      group: 'content'
    },
    {
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true
      },
      group: 'content'
    },
    {
      name: 'short_description',
      title: 'Short Description',
      type: 'text',
      description: 'Brief description for teaser/preview displays',
      group: 'content'
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Controls the order in dynamic sliders. Lower numbers appear first. Leave empty to appear at the end (sorted by creation date).',
      group: 'content',
      validation: (Rule: any) => Rule.min(0).integer()
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      description: 'Add content blocks to build your materiel page',
      of: [
        { type: 'heroBlock' },
        { type: 'heroTextBlock' },
        { type: 'backgroundImageTextBlock' },
        { type: 'textBlock' },
        { type: 'accordionBlock' },
        { type: 'archiveBlock' },
        { type: 'employeesBlock' },
        { type: 'textAndImageBlock' },
        { type: 'textAndVideoBlock' },
        { type: 'sliderBlock' },
        { type: 'numbersBlock' },
        { type: 'serviceSliderBlock' },
        { type: 'dynamicMaterielBlock' }
      ],
      group: 'content'
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: seo.fields,
      group: 'seo'
    },
    {
      name: 'darkHeader',
      title: 'Dark Header',
      type: 'boolean',
      description: 'Enable dark header styling (logo, nav links, and buttons will be #262D62)',
      initialValue: false,
      group: 'settings'
    }
  ],
  initialValue: async (props: any, context: any) => {
    const { currentUser } = context
    return {
      authorId: currentUser?.id || 'system'
    }
  },
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      language: 'language'
    },
    prepare({ title, slug, language }: any) {
      const languageLabel = language === 'en' ? 'English' : 'Danish';
      return {
        title,
        subtitle: `${languageLabel}${slug ? ` • /${slug}` : ''}`
      }
    }
  }
}
