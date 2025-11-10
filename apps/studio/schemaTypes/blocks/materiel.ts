import { contentFields, settingsFields } from '../common'

export const dynamicMaterielBlock = {
  name: 'dynamicMaterielBlock',
  title: 'Dynamic Materiel Block',
  type: 'object',
  description: 'Display materiel dynamically fetched from the API. Automatically shows all materiel with headers, images, and call-to-action buttons.',
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
    
    // Button Configuration
    {
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      description: 'Text to display on the CTA button (default: "Læs mere")',
      group: 'content',
      initialValue: 'Læs mere'
    },
    {
      name: 'buttonStyle',
      title: 'Button Style',
      type: 'string',
      description: 'Style variant for the CTA button',
      group: 'content',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Secondary 2', value: 'secondary2' },
          { title: 'Tertiary', value: 'tertiary' }
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
      eyebrow: 'eyebrow'
    },
    prepare({ title, eyebrow }: any) {
      return {
        title: title || 'Dynamic Materiel Block',
        subtitle: eyebrow ? `Eyebrow: ${eyebrow}` : 'Fetches materiel dynamically from API'
      }
    }
  }
}

