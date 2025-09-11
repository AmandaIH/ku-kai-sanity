import { commonFields, contentFields, settingsFields } from '../common'

export const accordionBlock = {
  name: 'accordionBlock',
  title: 'Accordion Block',
  type: 'object',
  description: 'Expandable sections for long-form content. Best used for FAQs, specifications, service/process details.',
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
    
    // Accordion items
    {
      name: 'items',
      title: 'Accordion Items',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'accordionItem',
          title: 'Accordion Item',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'content',
              title: 'Content',
              type: 'array',
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
                },
                {
                  type: 'image',
                  options: {
                    hotspot: true
                  }
                }
              ]
            },
          ],
          preview: {
            select: {
              title: 'title',
              media: 'content.0'
            }
          }
        }
      ],
      validation: (Rule: any) => Rule.required().min(1)
    },
    
    // Default open items
    {
      name: 'defaultOpen',
      title: 'Default Open Items',
      type: 'array',
      of: [{ type: 'number' }],
      description: 'Index of items to be open by default (0-based)',
      group: 'content',
      hidden: ({ parent }: any) => parent?.behavior !== 'multiple'
    },
    
    // Component settings
    ...settingsFields.layout
  ],
  preview: {
    select: {
      title: 'header',
      items: 'items'
    },
    prepare({ title, items }: any) {
      return {
        title: title || 'No title set',
        subtitle: 'Accordion Block' + (items ? ` (${items.length} items)` : '')
      }
    }
  }
} 