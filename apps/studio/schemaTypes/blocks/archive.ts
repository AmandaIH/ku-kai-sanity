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
          { title: 'Articles', value: 'articles' },
          { title: 'Portfolios', value: 'portfolios' }
        ]
      },
      initialValue: 'articles'
    },

    // Pagination toggle
    {
      name: 'showPagination',
      title: 'Show Pagination',
      type: 'boolean',
      description: 'Display pagination controls',
      group: 'content',
      hidden: ({ parent }: any) => parent?.archiveType !== 'articles',
      initialValue: true,
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