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
          name: 'companyName',
          title: 'Company Name',
          type: 'string',
          description: 'The official company name',
        },
        {
          name: 'companyAddress',
          title: 'Company Address',
          type: 'string',
          description: 'Street address of the company',
        },
        {
          name: 'companyZipCode',
          title: 'Company Zip Code',
          type: 'string',
          description: 'Postal/ZIP code of the company address',
        },
        {
          name: 'companyCity',
          title: 'Company City',
          type: 'string',
          description: 'City where the company is located',
        },
        {
          name: 'companyCvr',
          title: 'Company CVR',
          type: 'string',
          description: 'Main company CVR number',
        },
        {
          name: 'companyPhone',
          title: 'Company Phone',
          type: 'string',
          description: 'Main company phone number',
        },
        {
          name: 'companyEmail',
          title: 'Company Email',
          type: 'string',
          description: 'Main company email address',
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