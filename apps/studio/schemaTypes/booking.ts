import { defineType } from 'sanity'

export const booking = defineType({
  name: 'booking',
  title: 'Booking Page',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'The title that appears in the browser tab',
      initialValue: 'Booking System - WayStar Transport & Logistics'
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      description: 'SEO description for search engines',
      rows: 3
    },
    {
      name: 'welcomeTitle',
      title: 'Welcome Title',
      type: 'string',
      description: 'The main title shown on the login page',
      initialValue: 'Velkommen til WayStars booking system'
    },
    {
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description: 'Background image for the login page',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility'
        }
      ]
    },
    {
      name: 'backgroundOverlay',
      title: 'Background Overlay',
      type: 'object',
      description: 'Overlay settings for the background image',
      fields: [
        {
          name: 'opacity',
          title: 'Overlay Opacity',
          type: 'number',
          description: 'Opacity of the overlay (0-100)',
          initialValue: 50,
          validation: (Rule: any) => Rule.min(0).max(100)
        },
        {
          name: 'color',
          title: 'Overlay Color',
          type: 'string',
          description: 'Color of the overlay',
          initialValue: '#000000',
          options: {
            list: [
              { title: 'Black', value: '#000000' },
              { title: 'Dark Gray', value: '#333333' },
              { title: 'Blue', value: '#1e40af' },
              { title: 'Green', value: '#166534' },
              { title: 'Purple', value: '#7c3aed' }
            ]
          }
        }
      ]
    },
    {
      name: 'formSettings',
      title: 'Form Settings',
      type: 'object',
      fields: [
        {
          name: 'usernamePlaceholder',
          title: 'Username Placeholder',
          type: 'string',
          initialValue: 'Brugernavn'
        },
        {
          name: 'passwordPlaceholder',
          title: 'Password Placeholder',
          type: 'string',
          initialValue: 'Adgangskode'
        },
        {
          name: 'loginButtonText',
          title: 'Login Button Text',
          type: 'string',
          initialValue: 'LOGIN'
        },
        {
          name: 'loadingText',
          title: 'Loading Text',
          type: 'string',
          initialValue: 'Logger ind...'
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'backgroundImage'
    }
  }
})
