import { contentFields, settingsFields, commonFields } from '../common'

export const backgroundImageTextBlock = {
  name: 'backgroundImageTextBlock',
  title: 'Background Image Text Block',
  type: 'object',
  description: 'A text block with background image/video and padding around the edges, creating a card-like appearance.',
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
    
    // Body Text
    contentFields.bodyText('paragraphText', 'Paragraph Text'),
    
    // CTAs
    { ...contentFields.ctas, group: 'content' },
    
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
    
    // Component settings
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
        subtitle: 'Background Image Text Block',
        media: media || null
      }
    }
  }
}

