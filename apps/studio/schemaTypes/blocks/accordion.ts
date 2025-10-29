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
            // Accordion Image
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true
              },
              description: 'Optional image for this accordion item'
            },
            // CTA Buttons
            {
              name: 'ctas',
              title: 'Call to Action Buttons',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'cta',
                  title: 'CTA Button',
                  fields: [
                    {
                      name: 'linkTitle',
                      title: 'Button Text',
                      type: 'string',
                      validation: (Rule: any) => Rule.required()
                    },
                    {
                      name: 'linkType',
                      title: 'Link Type',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Internal Link', value: 'internal' },
                          { title: 'External Link', value: 'external' }
                        ]
                      },
                      initialValue: 'internal'
                    },
                    {
                      name: 'internalLink',
                      title: 'Internal Link',
                      type: 'reference',
                      to: [
                        { type: 'page' },
                        { type: 'article' },
                        { type: 'portfolio' },
                        { type: 'solutions' }
                      ],
                      hidden: ({ parent }: any) => parent?.linkType !== 'internal'
                    },
                    {
                      name: 'externalLink',
                      title: 'External Link',
                      type: 'object',
                      fields: [
                        {
                          name: 'url',
                          title: 'URL',
                          type: 'url',
                          validation: (Rule: any) => Rule.required()
                        },
                        {
                          name: 'openInNewTab',
                          title: 'Open in New Tab',
                          type: 'boolean',
                          initialValue: false
                        }
                      ],
                      hidden: ({ parent }: any) => parent?.linkType !== 'external'
                    },
                    {
                      name: 'variant',
                      title: 'Button Style',
                      type: 'string',
                      options: {
                        list: [
                          { title: 'Primary', value: 'primary' },
                          { title: 'Secondary', value: 'secondary' },
                          { title: 'Outline', value: 'outline' }
                        ]
                      },
                      initialValue: 'primary'
                    }
                  ],
                  preview: {
                    select: {
                      title: 'linkTitle',
                      linkType: 'linkType',
                      internalTitle: 'internalLink.title',
                      externalUrl: 'externalLink.url'
                    },
                    prepare({ title, linkType, internalTitle, externalUrl }: any) {
                      const linkText = linkType === 'internal' ? internalTitle : externalUrl
                      return {
                        title: title,
                        subtitle: linkText || 'No link set'
                      }
                    }
                  }
                }
              ]
            },
            // Form Button
            {
              name: 'formButton',
              title: 'Form Button',
              type: 'object',
              description: 'Button that opens a contact form',
              fields: [
                {
                  name: 'linkTitle',
                  title: 'Button Text',
                  type: 'string',
                  description: 'Text displayed on the button',
                  validation: (Rule: any) => Rule.required()
                },
                {
                  name: 'variant',
                  title: 'Button Style',
                  type: 'string',
                  options: {
                    list: [
                      { title: 'Primary', value: 'primary' },
                      { title: 'Secondary', value: 'secondary' },
                      { title: 'Secondary 2', value: 'secondary2' }
                    ]
                  },
                  initialValue: 'primary'
                },
                {
                  name: 'formConfig',
                  title: 'Form Configuration',
                  type: 'object',
                  fields: [
                    {
                      name: 'id',
                      title: 'Form ID',
                      type: 'string',
                      description: 'Unique identifier for the form',
                      initialValue: 'contact-form'
                    },
                    {
                      name: 'title',
                      title: 'Form Title',
                      type: 'string',
                      description: 'Title shown in the form modal',
                      initialValue: 'Indhent et tilbud'
                    },
                    {
                      name: 'description',
                      title: 'Form Description',
                      type: 'text',
                      description: 'Description shown in the form modal',
                      initialValue: 'Udfyld felterne nedenfor, så vi kan give dig et tilbud hurtigt.'
                    }
                  ]
                }
              ],
              preview: {
                select: {
                  title: 'linkTitle',
                  variant: 'variant'
                },
                prepare({ title, variant }: any) {
                  return {
                    title: title || 'Form Button',
                    subtitle: `Style: ${variant || 'primary'}`
                  }
                }
              }
            }
          ],
          preview: {
            select: {
              title: 'title',
              media: 'image'
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