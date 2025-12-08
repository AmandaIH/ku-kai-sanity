import { contentFields, settingsFields } from '../common'

export const archiveBlock = {
  name: 'archiveBlock',
  title: 'Archive Block',
  type: 'object',
  description: 'Dynamic listing of articles or pages. Best used for blogs, directories, resource catalogs.',
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
    
    // Archive type
    {
      name: 'archiveType',
      title: 'Archive Type',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Pages', value: 'pages' }
        ]
      },
      initialValue: 'pages'
    },

    // Archive mode
    {
      name: 'archiveMode',
      title: 'Archive Mode',
      type: 'string',
      group: 'content',
      description: 'Choose between showing all items with pagination or just the latest items',
      options: {
        list: [
          { title: 'Full Archive (with pagination)', value: 'full' },
          { title: 'Latest 4 Items Only', value: 'latest' },
          { title: 'Manual Selection', value: 'manual' }
        ]
      },
      initialValue: 'full'
    },

    // Manual selection items (only shown when manual mode is selected)
    {
      name: 'manualItems',
      title: 'Manual Selection Items',
      type: 'array',
      group: 'content',
      description: 'Select specific items to display',
      hidden: ({ parent }: any) => parent?.archiveMode !== 'manual',
      of: [
        {
          type: 'reference',
          to: [
            { type: 'page' }
          ]
        }
      ]
    },

    // Pagination toggle (only shown when full archive mode is selected)
    {
      name: 'showPagination',
      title: 'Show Pagination',
      type: 'boolean',
      description: 'Display pagination controls',
      group: 'content',
      hidden: ({ parent }: any) => parent?.archiveMode !== 'full',
      initialValue: true,
    },

    // Button style
    {
      name: 'buttonStyle',
      title: 'Button Style',
      type: 'string',
      group: 'content',
      description: 'Choose the style for the "Read More" buttons',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Secondary 2', value: 'secondary2' }
        ]
      },
      initialValue: 'secondary2'
    },
    
    // Component settings
    ...settingsFields.layout
  ],
  preview: {
    select: {
      title: 'header',
      subtitle: 'archiveType',
    },
    prepare({ title, subtitle }: any) {
      return {
        title: title || 'No title set',
        subtitle: `Archive Block ${subtitle ? `(${subtitle})` : ''}`
      }
    }
  }
} 