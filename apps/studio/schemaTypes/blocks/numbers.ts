import { contentFields, settingsFields } from '../common'

export const numbersBlock = {
  name: 'numbersBlock',
  title: 'Numbers Block',
  type: 'object',
  description: 'Display 1-4 numbers with headers. Perfect for showcasing statistics, achievements, or key metrics.',
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
    
    // Numbers
    {
      name: 'numbers',
      title: 'Numbers',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'numberItem',
          title: 'Number Item',
          fields: [
            {
              name: 'header',
              title: 'Header',
              type: 'string',
              description: 'Title or label for this number',
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'number',
              title: 'Number',
              type: 'string',
              description: 'The number to display (can include symbols like +, %, etc.)',
              validation: (Rule: any) => Rule.required()
            }
          ],
          preview: {
            select: {
              title: 'header',
              subtitle: 'number'
            },
            prepare({ title, subtitle }: any) {
              return {
                title: title || 'Untitled',
                subtitle: subtitle || 'No number set'
              }
            }
          }
        }
      ],
      validation: (Rule: any) => Rule.required().min(1).max(4)
    },
    
    // Component settings
    ...settingsFields.layout
  ],
  preview: {
    select: {
      title: 'header',
      numbers: 'numbers'
    },
    prepare({ title, numbers }: any) {
      return {
        title: title || 'No title set',
        subtitle: `Numbers Block ${numbers ? `(${numbers.length} numbers)` : ''}`,
        media: null
      }
    }
  }
}
