import { contentFields, settingsFields } from '../common'

export const leadFormBlock = {
  name: 'leadFormBlock',
  title: 'Lead Form Block',
  type: 'object',
  description: 'Contact form block with form type selection. Best used for lead generation and contact pages.',
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
    
    // Form Type Selection (Required)
    {
      name: 'formType',
      title: 'Form Type',
      type: 'string',
      description: 'Select the type of form to display',
      group: 'content',
      options: {
        list: [
          { title: 'Offer Form', value: 'offer-form' }
        ]
      },
      validation: (Rule: any) => Rule.required(),
      initialValue: 'offer-form'
    },
       
    // Component settings
    ...settingsFields.layout
  ],
  preview: {
    select: {
      title: 'header',
      formType: 'formType',
      formTitle: 'formTitle'
    },
    prepare({ title, formType, formTitle }: any) {
      const formTypeLabel = formType === 'offer-form' ? 'Offer Form' : formType || 'No form type'
      return {
        title: title || formTitle || 'Lead Form Block',
        subtitle: `Form Type: ${formTypeLabel}`
      }
    }
  }
}

