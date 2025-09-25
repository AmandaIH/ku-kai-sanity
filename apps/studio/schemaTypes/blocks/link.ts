import { contentFields, settingsFields } from '../common'

export const serviceSliderBlock = {
  name: 'serviceSliderBlock',
  title: 'Service Slider',
  type: 'object',
  description: 'Display 1-5 link items with headers, images, and call-to-action buttons. Perfect for showcasing services, products, or featured content.',
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
    
    // Link Items
    {
      name: 'linkItems',
      title: 'Link Items',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'linkItem',
          title: 'Link Item',
          fields: [
            {
              name: 'header',
              title: 'Header',
              type: 'string',
              description: 'Title or heading for this link item',
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true
              },
              description: 'Image for this link item'
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              description: 'Description text for this service item'
            },
            {
              name: 'ctaButton',
              title: 'Call to Action Button',
              type: 'ctaButton',
              description: 'Add a call-to-action button for this link item'
            }
          ],
          preview: {
            select: {
              title: 'header',
              media: 'image'
            },
            prepare({ title, media }: any) {
              return {
                title: title || 'Untitled',
                subtitle: 'Link Item',
                media: media
              }
            }
          }
        }
      ],
      validation: (Rule: any) => Rule.required().min(1).max(5)
    },
    
    // Component settings
    ...settingsFields.layout
  ],
  preview: {
    select: {
      title: 'header',
      linkItems: 'linkItems'
    },
    prepare({ title, linkItems }: any) {
      return {
        title: title || 'No title set',
        subtitle: `Service Slider ${linkItems ? `(${linkItems.length} items)` : ''}`,
        media: linkItems?.[0]?.image || null
      }
    }
  }
}
