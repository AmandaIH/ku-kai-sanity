import { contentFields, settingsFields, commonFields } from '../common'

export const heroBlock = {
  name: 'heroBlock',
  title: 'Hero Block (Large)',
  type: 'object',
  description: 'A prominent banner with visuals and compelling text. Best used for page introductions, campaign launches, key announcements, product showcases.',
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
    
    // Stats
    {
      name: 'stats',
      title: 'Stats',
      type: 'array',
      group: 'content',
      description: 'Add 1 to 3 stat values to display key metrics or achievements',
      of: [
        {
          type: 'string',
          name: 'statValue',
          title: 'Stat Value',
          validation: (Rule: any) => Rule.required()
        }
      ],
      validation: (Rule: any) => Rule.min(1).max(3)
    },
    
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
      group: 'settings',
      default: 'image',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' }
        ]
      }
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
  preview: {
    select: {
      subtitle: 'header',
      media: 'backgroundImage'
    },
    prepare({ subtitle, media }: any) {
      return {
        title: subtitle || 'No title set',
        subtitle: 'Hero Block (Large)',
        media: media || null
      }
    }
  }
} 