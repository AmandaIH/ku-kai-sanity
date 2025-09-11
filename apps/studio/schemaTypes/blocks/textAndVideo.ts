import { commonFields, contentFields, settingsFields } from '../common'

export const textAndVideoBlock = {
  name: 'textAndVideoBlock',
  title: 'Text & Video Block',
  type: 'object',
  description: 'Text and embedded video side by side. Best used for demonstrations, tutorials, promotional content.',
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
    
    // Embed URL
    {
      name: 'embedUrl',
      title: 'Embed URL',
      type: 'url',
      description: 'YouTube, Vimeo, or other video platform embed URL',
      group: 'content',
    },
    
    // Video poster image
    {
      name: 'posterImage',
      title: 'Poster Image',
      type: 'image',
      description: 'Thumbnail image shown before video plays',
      group: 'content',
      options: {
        hotspot: true
      }
    },
    
    // Video position
    {
      name: 'videoPosition',
      title: 'Video Position',
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
      videoPosition: 'videoPosition',
      videoSource: 'videoSource',
      media: 'posterImage'
    },
    prepare({ title, videoPosition, videoSource, media }: any) {
      return {
        title: title || 'No title set',
        subtitle: `Text & Video Block (Video: ${videoPosition || 'Right'} ${videoSource === 'upload' ? ' (Uploaded)' : ' (Embedded)'})`,
        media: media || null
      }
    }
  }
} 