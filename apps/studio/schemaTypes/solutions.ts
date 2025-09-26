import { defineField } from 'sanity';
import slugify from 'slugify';
import { commonFields } from './common'
import { seo } from './objects/seo'

export const solutions = {
  name: 'solutions',
  title: 'Solutions',
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
        source: 'title',
        slugify: (input: string) => {
          const slugified = slugify(input, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
          return `solutions/${slugified}`;
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
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true
      },
      group: 'content'
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      description: 'Add content blocks to build your solution page',
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
