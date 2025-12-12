import { contentFields, settingsFields } from '../common'

export const menuBlock = {
  name: 'menuBlock',
  title: 'Menu Block',
  type: 'object',
  description: 'Display a menu with sections (RAMEN, DRINKS, SIDES) that can be reordered. Each section contains items with prices and ingredients.',
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
    
    // Menu Sections
    {
      name: 'menuSections',
      title: 'Menu Sections',
      type: 'array',
      group: 'content',
      description: 'Add menu sections (e.g., RAMEN, DRINKS, SIDES). You can reorder them by dragging.',
      of: [
        {
          type: 'object',
          name: 'menuSection',
          title: 'Menu Section',
          fields: [
            {
              name: 'title',
              title: 'Section Title',
              type: 'string',
              description: 'Name of the section (e.g., "RAMEN", "DRINKS", "SIDES")',
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'items',
              title: 'Menu Items',
              type: 'array',
              description: 'Items in this section',
              of: [
                {
                  type: 'object',
                  name: 'menuItem',
                  title: 'Menu Item',
                  fields: [
                    {
                      name: 'name',
                      title: 'Item Name',
                      type: 'string',
                      description: 'Name of the menu item',
                      validation: (Rule: any) => Rule.required()
                    },
                    {
                      name: 'price',
                      title: 'Price',
                      type: 'string',
                      description: 'Price (e.g., "100,-", "50,-")',
                      validation: (Rule: any) => Rule.required()
                    },
                    {
                      name: 'ingredients',
                      title: 'Ingredients',
                      type: 'array',
                      description: 'List of ingredients (optional)',
                      of: [
                        {
                          type: 'string'
                        }
                      ]
                    },
                    {
                      name: 'description',
                      title: 'Description',
                      type: 'text',
                      description: 'Optional description for this item'
                    }
                  ],
                  preview: {
                    select: {
                      title: 'name',
                      price: 'price'
                    },
                    prepare({ title, price }: any) {
                      return {
                        title: title || 'Untitled',
                        subtitle: price ? `Price: ${price}` : 'No price'
                      }
                    }
                  }
                }
              ],
              validation: (Rule: any) => Rule.min(1)
            },
            {
              name: 'illustrations',
              title: 'Illustrations / SVGs',
              type: 'array',
              description: 'Add up to 2 illustrations/SVGs for this section (e.g., for TOPPING section)',
              of: [
                {
                  type: 'image',
                  options: {
                    hotspot: true
                  }
                }
              ],
              validation: (Rule: any) => Rule.max(2)
            }
          ],
          preview: {
            select: {
              title: 'title',
              items: 'items'
            },
            prepare({ title, items }: any) {
              return {
                title: title || 'Untitled Section',
                subtitle: items ? `${items.length} item${items.length !== 1 ? 's' : ''}` : 'No items'
              }
            }
          }
        }
      ],
      validation: (Rule: any) => Rule.required().min(1)
    },
    
    // Logo (placed between sections in the grid)
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      group: 'content',
      description: 'Logo to display between menu sections (e.g., between DRINKS and SIDES)',
      options: {
        hotspot: true
      }
    },
    
    // Component settings
    ...settingsFields.layout
  ],
  preview: {
    select: {
      title: 'header',
      sections: 'menuSections'
    },
    prepare({ title, sections }: any) {
      return {
        title: title || 'Menu Block',
        subtitle: sections ? `${sections.length} section${sections.length !== 1 ? 's' : ''}` : 'No sections'
      }
    }
  }
}


