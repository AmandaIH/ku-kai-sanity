import { commonFields, createWysiwygField } from './common'
import slugify from 'slugify'
import { seo } from './objects/seo';

export const portfolio = {
  name: 'portfolio',
  title: 'Portfolio',
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
        source: 'title',
        slugify: (input: string) => {
          const slugified = slugify(input, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
          return `portfolios/${slugified}`;
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
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true
      },
      group: 'content'
    },
    {
      name: 'heroText',
      title: 'Hero Text',
      type: 'string',
      group: 'content'
    },
    {
      name: 'heroCtas',
      title: 'Hero Call to Action Buttons',
      type: 'array',
      group: 'content',
      of: [commonFields.cta],
      validation: (Rule: any) => Rule.max(1)
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      description: 'Add content blocks to build your page',
      of: [
        { type: 'textBlock' },
        { type: 'accordionBlock' },
        { type: 'employeesBlock' },
        { type: 'textAndImageBlock' },
        { type: 'textAndVideoBlock' },
        { type: 'sliderBlock' },
        { type: 'numbersBlock' },
        { type: 'serviceSliderBlock' }
      ],
      group: 'content'
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: seo.fields,
      group: 'seo'
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
      slug: 'slug.current'
    },
    prepare({ title, slug }: any) {
      return {
        title,
        subtitle: slug ? `/${slug}` : ''
      }
    }
  }
} 