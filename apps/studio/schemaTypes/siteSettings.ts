import { defineField } from 'sanity';

export const siteSettings = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Remove language field since this is a shared singleton
  fields: [
    {
      name: 'frontpage',
      title: 'Frontpage',
      type: 'reference',
      weak: true,
      to: [{ type: 'page' }],
      description: 'Select the page to use as the frontpage. Note: This is a weak reference, so the page can be deleted without breaking the site settings.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      description: 'The main title of the website',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      description: 'A brief description of the website for SEO purposes',
    },
    {
      name: 'logos',
      title: 'Logos',
      type: 'object',
      description: 'Logo configurations for different contexts',
      fields: [
        {
          name: 'logo_on_transparent',
          title: 'Logo on Transparent Background',
          type: 'image',
          options: {
            hotspot: true
          },
          description: 'Logo to use on transparent backgrounds',
        },
        {
          name: 'logo_on_scroll',
          title: 'Logo on Scroll',
          type: 'image',
          options: {
            hotspot: true
          },
          description: 'Logo to use when page is scrolled (e.g., in sticky header)',
        },
        {
          name: 'favicon',
          title: 'Favicon',
          type: 'image',
          description: 'Upload the site favicon (recommended size: 32x32px)',
        },
      ]
    },
    {
      name: 'companyInfo',
      title: 'Company Info',
      type: 'object',
      description: 'Company contact and address information',
      fields: [
        {
          name: 'companyCvr',
          title: 'Company CVR',
          type: 'string',
          description: 'Main company CVR number',
        },
        {
          name: 'companyEmail',
          title: 'Company Email',
          type: 'string',
          description: 'Main company email address',
        },
        {
          name: 'location1',
          title: 'Location 1',
          type: 'object',
          description: 'First company location',
          fields: [
            {
              name: 'companyName',
              title: 'Company Name',
              type: 'string',
              description: 'Company name for this location',
            },
            {
              name: 'address',
              title: 'Address',
              type: 'string',
              description: 'Street address',
            },
            {
              name: 'zipCode',
              title: 'Zip Code',
              type: 'string',
              description: 'Postal/ZIP code',
            },
            {
              name: 'city',
              title: 'City',
              type: 'string',
              description: 'City',
            },
            {
              name: 'phone',
              title: 'Phone',
              type: 'string',
              description: 'Phone number for this location',
            },
            {
              name: 'email',
              title: 'Email',
              type: 'string',
              description: 'Email address for this location',
            },
          ]
        },
        {
          name: 'location2',
          title: 'Location 2',
          type: 'object',
          description: 'Second company location',
          fields: [
            {
              name: 'companyName',
              title: 'Company Name',
              type: 'string',
              description: 'Company name for this location',
            },
            {
              name: 'address',
              title: 'Address',
              type: 'string',
              description: 'Street address',
            },
            {
              name: 'zipCode',
              title: 'Zip Code',
              type: 'string',
              description: 'Postal/ZIP code',
            },
            {
              name: 'city',
              title: 'City',
              type: 'string',
              description: 'City',
            },
            {
              name: 'phone',
              title: 'Phone',
              type: 'string',
              description: 'Phone number for this location',
            },
            {
              name: 'email',
              title: 'Email',
              type: 'string',
              description: 'Email address for this location',
            },
          ]
        },
      ]
    },
    {
      name: 'socialMediaChannels',
      title: 'Social Media Channels',
      type: 'object',
      description: 'Social media channels for the company',
      fields: [
        {
          name: 'linkedin',
          title: 'LinkedIn',
          type: 'string',
          description: 'LinkedIn page URL',
        },
        {
          name: 'instagram',
          title: 'Instagram',
          type: 'string',
          description: 'Instagram page URL',
        },
      ]
    },
    // other global settings fields...
  ],
  preview: {
    select: {
      title: 'siteTitle'
    },
    prepare({ title }: any) {
      return {
        title: title || 'Site Settings',
        subtitle: 'Global site configuration'
      }
    }
  },
  // Add document actions to help with missing documents
  __experimental_actions: ['create', 'update', 'delete', 'publish'],
} 