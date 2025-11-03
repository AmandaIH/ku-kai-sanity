import { commonFields, createWysiwygField } from './common'
import slugify from 'slugify'
import { seo } from './objects/seo';

export const article = {
  name: 'article',
  title: 'Article',
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
    {
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
            return `${lang}/articles/${slugifiedRest}`;
          }
          const slugified = slugify(input, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
          return `articles/${slugified}`;
        },
      },
      validation: (Rule: any) => Rule.required(),
      group: 'content'
    },
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
      name: 'date',
      title: 'Article Date',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
      group: 'content'
    },
    {
      name: 'headline',
      title: 'Article Headline',
      type: 'string',
      group: 'content'
    },
    // Main body text (WYSIWYG)
    {
      ...createWysiwygField('bodyText', 'Body Text'),
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