import { contentFields, settingsFields, commonFields } from '../common'

export const heroTextBlock = {
  name: 'heroTextBlock',
  title: 'Hero Text Block',
  type: 'object',
  description: 'A compact hero banner with visuals and compelling text. Perfect for section introductions, smaller announcements, or secondary hero areas.',
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true
    },
    {
      name: 'settings',
      title: 'Settings',
    }
  ],
  fields: [
    // Headers
    ...contentFields.headers,
    
    // Background Image
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      group: 'content',
      hidden: ({ parent }: any) => parent?.backgroundType !== 'image',
      options: {
        hotspot: true
      },
    },

    
    // Background Video
    {
      name: 'backgroundVideo',
      title: 'Background Video',
      type: 'file',
      group: 'content',
      hidden: ({ parent }: any) => parent?.backgroundType !== 'video',
      options: {
        accept: 'video/*'
      }
    },
    
    // Component settings (without container field)
    { ...commonFields.customPadding, group: 'settings' },
    { ...commonFields.customMargin, group: 'settings' },
    
    // Background Type
    {
      name: 'backgroundType',
      title: 'Background Type',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' }
        ]
      },
      validation: (Rule: any) => Rule.required()
    },
    
    // Background overlay opacity
    {
      name: 'opacity',
      title: 'Opacity',
      type: 'number',
      group: 'settings',
      description: 'Background overlay opacity (0-100)',
      validation: (Rule: any) => Rule.min(0).max(100),
      initialValue: 0,
    },
  ],
  initialValue: {
    backgroundType: 'image'
  },
  preview: {
    select: {
      subtitle: 'header',
      media: 'backgroundImage'
    },
    prepare({ subtitle, media }: any) {
      return {
        title: subtitle || 'No title set',
        subtitle: 'Hero Text Block',
        media: media || null
      }
    }
  }
}

