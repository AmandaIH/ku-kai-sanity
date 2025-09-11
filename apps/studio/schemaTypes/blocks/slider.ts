import { contentFields, settingsFields } from '../common'

export const sliderBlock = {
  name: 'sliderBlock',
  title: 'Logo Slider',
  type: 'object',
  description: 'Horizontal logo slider with repeatable logo images. Best used for showcasing client logos, partners, or brand references.',
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
    
    // Logos
    {
      name: 'logos',
      type: 'array',
      title: 'Logos',
      group: 'content',
      of: [
        {
          type: 'image',
          title: 'Image',
          options: {
            hotspot: true, // Enables hotspot editing for cropping and focus
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Short description of the image for accessibility',
            },
          ],
        },
      ],
      options: {
        layout: 'grid', // Display images in a grid
      },
    },
    
    // Component settings
    ...settingsFields.layout
  ],
  preview: {
    select: {
      title: 'header',
      slides: 'slides'
    },
    prepare({ title, slides }: any) {
      return {
        title: title || 'No title set',
        subtitle: `Logo Slider ${slides ? `(${slides.length} logos)` : ''}`,
        media: slides?.[0] || null
      }
    }
  }
} 