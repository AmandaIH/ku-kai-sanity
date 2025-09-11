import { commonFields, contentFields, settingsFields } from '../common'

export const textAndImageBlock = {
  name: 'textAndImageBlock',
  title: 'Text & Image Block',
  type: 'object',
  description: 'Text with image, side by side. Best used for storytelling, product highlights, team profiles.',
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
    
    // Body text (WYSIWYG)
    {
      name: 'bodyText',
      title: 'Body Text',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' }
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' }
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' }
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url'
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    
    // Image
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true
      },
      validation: (Rule: any) => Rule.required()
    },
    
    // Image alt text
    {
      name: 'imageAltText',
      title: 'Image Alt Text',
      type: 'string',
      description: 'Alternative text for accessibility',
      group: 'content',
      validation: (Rule: any) => Rule.required()
    },
    
    // // Image caption
    // {
    //   name: 'imageCaption',
    //   title: 'Image Caption',
    //   type: 'text',
    //   description: 'Optional caption below the image',
    //   group: 'content'
    // },
    
    // Image position
    {
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' }
        ]
      },
      initialValue: 'right'
    },

    
    // Optional CTAs
    {
      name: 'ctas',
      title: 'Call to Action Buttons',
      type: 'array',
      group: 'content',
      of: [commonFields.cta],
      validation: (Rule: any) => Rule.max(3)
    },
    
    // Component settings
    ...settingsFields.layout
  ],
  preview: {
    select: {
      title: 'header',
      imagePosition: 'imagePosition',
      media: 'image'
    },
    prepare({ title, imagePosition, media }: any) {
      return {
        title: title || 'No title set',
        subtitle: `Text & Image Block (Image: ${imagePosition || 'Right'})`,
        media: media || null
      }
    }
  }
} 