import { contentFields, settingsFields } from '../common'

export const foodSliderBlock = {
  name: 'foodSliderBlock',
  title: 'Food Slider',
  type: 'object',
  description: 'Display food items (like ramen bowls) with images, titles, and a call-to-action button. Perfect for showcasing featured menu items.',
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
      title: 'Food Items',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          name: 'linkItem',
          title: 'Food Item',
          fields: [
            {
              name: 'header',
              title: 'Name',
              type: 'string',
              description: 'Name of the food item (e.g., "Ramen name")',
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true
              },
              description: 'Image of the food item',
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              description: 'Optional description text for this food item'
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
                subtitle: 'Food Item',
                media: media
              }
            }
          }
        }
      ],
      validation: (Rule: any) => Rule.required().min(1).max(5)
    },
    
    // CTA Buttons (single button at bottom)
    {
      name: 'ctas',
      title: 'Call to Action Button',
      type: 'array',
      group: 'content',
      description: 'Add a call-to-action button (e.g., "See menu")',
      of: [{ type: 'ctaButton' }],
      validation: (Rule: any) => Rule.max(1)
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
        subtitle: `Food Slider ${linkItems ? `(${linkItems.length} items)` : ''}`,
        media: linkItems?.[0]?.image || null
      }
    }
  }
}

