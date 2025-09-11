export const seo = {
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Title for search engines and social media (60 characters recommended). Leave blank to use page title.',
      validation: (Rule: any) => Rule.max(60).warning('Title should be under 60 characters')
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: 'Description for search engines and social media (150-160 characters recommended)',
      validation: (Rule: any) => Rule.max(160).warning('Description should be under 160 characters')
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
      description: 'Author of the content'
    },
    {
      name: 'socialImage',
      title: 'Social Media Image',
      type: 'image',
      description: 'Image for social media sharing (1200x630px recommended). If not set, the featured image will be used.',
      options: {
        hotspot: true
      }
    },
    {
      name: 'keywords',
      title: 'Keywords',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Keywords for search engines (comma separated)',
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'robots',
      title: 'Robots Meta',
      type: 'object',
      fields: [
        {
          name: 'noindex',
          title: 'No Index',
          type: 'boolean',
          description: 'Prevent search engines from indexing this page',
          initialValue: false
        },
        {
          name: 'nofollow',
          title: 'No Follow',
          type: 'boolean',
          description: 'Prevent search engines from following links on this page',
          initialValue: false
        },
        {
          name: 'noarchive',
          title: 'No Archive',
          type: 'boolean',
          description: 'Prevent search engines from caching this page',
          initialValue: false
        },
        {
          name: 'nosnippet',
          title: 'No Snippet',
          type: 'boolean',
          description: 'Prevent search engines from showing snippets',
          initialValue: false
        }
      ],
      description: 'Search engine crawling directives'
    },
    {
      name: 'twitter',
      title: 'Twitter Meta',
      type: 'object',
      fields: [
        {
          name: 'card',
          title: 'Twitter Card Type',
          type: 'string',
          description: 'Type of Twitter card to display',
          options: {
            list: [
              { title: 'Summary', value: 'summary' },
              { title: 'Summary Large Image', value: 'summary_large_image' },
              { title: 'App', value: 'app' },
              { title: 'Player', value: 'player' }
            ]
          },
          initialValue: 'summary_large_image'
        },
        {
          name: 'site',
          title: 'Twitter Site',
          type: 'string',
          description: '@username of the website\'s Twitter account'
        },
        {
          name: 'creator',
          title: 'Twitter Creator',
          type: 'string',
          description: '@username of the content creator'
        }
      ],
      description: 'Twitter specific metadata'
    },
    {
      name: 'structuredData',
      title: 'Structured Data (JSON-LD)',
      type: 'text',
      description: 'JSON-LD structured data for rich snippets'
    },
  ]
}