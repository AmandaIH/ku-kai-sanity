import { commonFields, contentFields, settingsFields } from '../common'

export const employeesBlock = {
  name: 'employeesBlock',
  title: 'Employees Block',
  type: 'object',
  description: 'Display a collection of employees with customizable layout and settings.',
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
    { ...commonFields.header, group: 'content'},
    
    // Employee collection
    {
      name: 'employeeCollection',
      title: 'Employee Collection',
      type: 'array',
      description: 'Select multiple employees to display',
      group: 'content',
      of: [
        {
          type: 'reference',
          weak: true,
          to: [{ type: 'employee' }]
        }
      ],
    },

    // Component settings
    ...settingsFields.layout
  ],
  preview: {
    select: {
      title: 'header',
      employeeCollection: 'employeeCollection'
    },
    prepare({ title, employeeCollection }: any) {
      const employeeCount = employeeCollection ? employeeCollection.length : 0
      return {
        title: title || 'No header set',
        subtitle: `Employees Block - ${employeeCount} employees`
      }
    }
  }
}
