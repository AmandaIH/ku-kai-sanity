import { defineField } from 'sanity'

export const employee = {
  name: 'employee',
  title: 'Employee',
  type: 'document',
  groups: [
    {
      name: 'content',
      title: 'Content',
      default: true
    },
    {
      name: 'contact',
      title: 'Contact Information',
    }
  ],
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      group: 'content'
    },
    {
      name: 'jobTitle',
      title: 'Job Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      group: 'content'
    },
    {
      name: 'picture',
      title: 'Picture',
      type: 'image',
      options: {
        hotspot: true
      },
      group: 'content'
    },
    {
      name: 'phoneNumber',
      title: 'Phone Number',
      type: 'string',
      group: 'contact',
      validation: (Rule: any) => Rule.regex(/^[\+]?[1-9][\d]{0,15}$/, {
        name: 'phone',
        invert: false
      }).error('Please enter a valid phone number')
    },
    {
      name: 'emailAddress',
      title: 'Email Address',
      type: 'string',
      group: 'contact',
      validation: (Rule: any) => Rule.email()
    }
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'jobTitle',
      media: 'picture'
    },
    prepare({ title, subtitle, media }: any) {
      return {
        title: title || 'Unnamed Employee',
        subtitle: subtitle || 'No job title',
        media: media || null
      }
    }
  }
}
