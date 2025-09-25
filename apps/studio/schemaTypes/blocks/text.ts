import { commonFields, contentFields, createWysiwygField, settingsFields } from '../common'

export const textBlock = {
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  description: 'Single or two-column layout for structured content. Best used for general content, articles, services, about.',
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
    
    // Layout
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      group: 'settings',
      options: {
        list: [
          { title: 'Left Aligned', value: 'left' },
          { title: 'Center Aligned', value: 'center' },
          { title: 'Right Aligned', value: 'right' }
        ]
      },
      initialValue: 'left'
    },
    
    // Main body text (WYSIWYG)
    {
      ...createWysiwygField('bodyText', 'Body Text'),
      group: 'content'
    },
    
    
    // Call-to-action buttons
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
      subtitle: 'header',
      layout: 'layout'
    },
    prepare({ subtitle, layout }: any) {
      return {
        title: subtitle || 'No title set',
        subtitle: `Text Block (${layout || 'left'} aligned)`
      }
    }
  }
} 