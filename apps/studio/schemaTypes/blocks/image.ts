import { commonFields, settingsFields } from '../common'

export const imageBlock = {
  name: 'imageBlock',
  title: 'Image Block',
  type: 'object',
  description: 'Showcase key visuals with adjustable width, alt text, and caption support.',
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
    // Image
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true
      },
      validation: (Rule: any) => Rule.required(),
      group: 'content'
    },
    {
      name: 'imageAltText',
      title: 'Alt Text',
      type: 'string',
      description: 'Describe the image for accessibility',
      group: 'content'
    },
    {
      name: 'imageCaption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption text below the image',
      group: 'content'
    },
    
    {
      name: 'imageStyle',
      title: 'Image Style',
      type: 'string',
      options: {
        list: [
          { title: 'Default', value: 'default' },
          { title: 'Rounded', value: 'rounded' },
          { title: 'Circular', value: 'circular' },
          { title: 'Framed', value: 'framed' }
        ]
      },
      initialValue: 'default',
      group: 'settings'
    },
    
    // Component settings
    ...settingsFields.layout
  ],
  preview: {
    select: {
      image: 'image',
      caption: 'imageCaption'
    },
    prepare({ image, caption }: any) {
      return {
        title: caption || 'Image Block',
        subtitle: 'Full width image',
        media: image
      }
    }
  }
}
