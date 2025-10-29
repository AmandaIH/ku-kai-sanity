import { defineField, defineType } from "sanity";

// Centralized list of document types that can be referenced in links
export const referenceableDocumentTypes = [
  { type: 'page' },
  { type: 'article' },
  { type: 'services' }
];

// Helper function to get document type labels for previews
export const getDocumentTypeLabel = (type: string) => {
  const typeLabels: Record<string, string> = {
    'page': 'Page',
    'article': 'Article',
    'services': 'Service'
  };
  return typeLabels[type] || type;
};

export const ctaButton = {
  name: 'ctaButton',
  title: 'Call to Action Button',
  type: 'object',
  fields: [
    {
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal Page', value: 'internal' },
          { title: 'External URL', value: 'external' },
          { title: 'Open Form', value: 'form' }
        ],
      },
      initialValue: 'internal',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'linkTitle',
      title: 'Link Title',
      type: 'string',
      description: 'Display text for the link',
    },
    {
      name: 'internalLink',
      title: 'Internal Link',
      type: 'reference',
      description: 'Select a page from your site',
      weak: true,
      to: referenceableDocumentTypes,
      hidden: ({ parent }: any) => parent?.linkType !== 'internal',
      validation: (Rule: any) => Rule.custom((internalLink: any, context: any) => {
        const parent = context?.parent as any;
        if (parent?.linkType === 'internal' && !internalLink) {
          return 'Please select a page';
        }
        return true;
      })
    },
    {
      name: 'externalLink',
      title: 'External Link',
      type: 'object',
      description: 'External link configuration',
      hidden: ({ parent }: any) => parent?.linkType !== 'external',
      fields: [
        {
          name: 'url',
          title: 'URL',
          type: 'url',
          description: 'Enter a full URL (e.g., https://example.com)',
          validation: (Rule: any) => Rule.custom((url: any, context: any) => {
            const parent = context?.parent;
            if (parent?.linkType === 'external' && !url) {
              return 'Please enter a URL for the external link';
            }
            return true;
          })
        },
        {
          name: 'openInNewTab',
          title: 'Open in New Tab',
          type: 'boolean',
          initialValue: false,
          description: 'Check this to open the link in a new browser tab'
        }
      ]
    },
    {
      name: 'formConfig',
      title: 'Form Configuration',
      type: 'object',
      description: 'Configure the form that will be opened',
      hidden: ({ parent }: any) => parent?.linkType !== 'form',
      fields: [
        {
          name: 'formId',
          title: 'Form ID',
          type: 'string',
          description: 'Unique identifier for the form (e.g., contact-form, newsletter-signup)',
          validation: (Rule: any) => Rule.custom((formId: any, context: any) => {
            const parent = context?.parent as any;
            if (parent?.linkType === 'form' && !formId) {
              return 'Please enter a form ID';
            }
            return true;
          })
        },
        {
          name: 'formTitle',
          title: 'Form Title',
          type: 'string',
          description: 'Title displayed in the form modal/overlay'
        },
        {
          name: 'formDescription',
          title: 'Form Description',
          type: 'text',
          description: 'Optional description text for the form'
        }
      ]
    },
    {
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
          { title: 'Secondary 2', value: 'secondary2' }
        ]
      },
      initialValue: 'primary'
    }
  ],
  preview: {
    select: {
      linkType: 'linkType',
      linkTitle: 'linkTitle',
      internalType: 'internalLink._type',
      internalLanguage: 'internalLink.language',
      externalUrl: 'externalLink.url',
      formId: 'formConfig.formId',
      formTitle: 'formConfig.formTitle'
    },
    prepare({ linkType, linkTitle, internalType, externalUrl, formId, formTitle }: any) {
      let displayTitle = 'Untitled Button';
      let subtitle = '';

      if (linkTitle) {
        displayTitle = linkTitle;
        if (linkType === 'internal') {
          const typeLabel = getDocumentTypeLabel(internalType);
          subtitle = `Internal • ${typeLabel}`;
        } else if (linkType === 'external') {
          try {
            const hostname = new URL(externalUrl).hostname;
            subtitle = `External • ${hostname}`;
          } catch {
            subtitle = 'External • Invalid URL';
          }
        } else if (linkType === 'form') {
          subtitle = `Form • ${formId || 'No ID set'}`;
        }
      } else if (linkType === 'external' && externalUrl) {
        displayTitle = externalUrl;
        try {
          const hostname = new URL(externalUrl).hostname;
          subtitle = `External • ${hostname}`;
        } catch {
          subtitle = 'External • Invalid URL';
        }
      } else if (linkType === 'internal') {
        displayTitle = 'Internal Link';
        const typeLabel = getDocumentTypeLabel(internalType);
        subtitle = `Internal • ${typeLabel}`;
      } else if (linkType === 'form') {
        displayTitle = formTitle || formId || 'Form Button';
        subtitle = `Form • ${formId || 'No ID set'}`;
      } else {
        displayTitle = 'Incomplete Button';
        subtitle = 'Please configure the link';
      }

      return {
        title: displayTitle,
        subtitle
      }
    }
  }
}

// Navigation Link - Recursive menu item
export const navigationLink = defineType({
  name: 'navigation.link',
  type: 'object',
  title: 'Navigation Link',
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          { title: 'Internal Page', value: 'internal' },
          { title: 'External URL', value: 'external' },
          { title: 'Open Form', value: 'form' }
        ],
      },
      initialValue: 'internal',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'internalLink',
      title: 'Internal Link',
      type: 'reference',
      description: 'Select a page from your site',
      weak: true,
      to: referenceableDocumentTypes,
      hidden: ({ parent }) => parent?.linkType !== 'internal',
      validation: (Rule) => Rule.custom((internalLink, context) => {
        const parent = context?.parent as any;
        if (parent?.linkType === 'internal' && !internalLink) {
          return 'Please select a page';
        }
        return true;
      })
    }),
    defineField({
      name: 'externalTitle',
      title: 'Link Title',
      type: 'string',
      description: 'Display text for the external link',
      hidden: ({ parent }) => parent?.linkType !== 'external',
      validation: (Rule) => Rule.custom((externalTitle, context) => {
        const parent = context?.parent as any;
        if (parent?.linkType === 'external' && !externalTitle) {
          return 'Please enter a title for the link';
        }
        return true;
      })
    }),
    defineField({
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      description: 'Enter a full URL (e.g., https://example.com)',
      hidden: ({ parent }) => parent?.linkType !== 'external',
      validation: (Rule) => Rule.custom((externalUrl, context) => {
        const parent = context?.parent as any;
        if (parent?.linkType === 'external' && !externalUrl) {
          return 'Please enter a URL';
        }
        return true;
      })
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in New Tab',
      type: 'boolean',
      initialValue: false,
      description: 'Check this to open the link in a new browser tab'
    }),
    defineField({
      name: 'formConfig',
      title: 'Form Configuration',
      type: 'object',
      description: 'Configure the form that will be opened',
      hidden: ({ parent }) => parent?.linkType !== 'form',
      fields: [
        defineField({
          name: 'formId',
          title: 'Form ID',
          type: 'string',
          description: 'Unique identifier for the form (e.g., contact-form, newsletter-signup)',
          validation: (Rule) => Rule.custom((formId, context) => {
            const parent = context?.parent as any;
            if (parent?.linkType === 'form' && !formId) {
              return 'Please enter a form ID';
            }
            return true;
          })
        }),
        defineField({
          name: 'formTitle',
          title: 'Form Title',
          type: 'string',
          description: 'Title displayed in the form modal/overlay'
        }),
        defineField({
          name: 'formDescription',
          title: 'Form Description',
          type: 'text',
          description: 'Optional description text for the form'
        })
      ]
    }),
    defineField({
      name: 'children',
      title: 'Sub-menu Items',
      type: 'array',
      description: 'Add child menu items to create a dropdown',
      of: [{ type: 'navigation.link' }],
      validation: (Rule) => Rule.max(10).warning('Consider limiting sub-menu items for better UX')
    })
  ],
  preview: {
    select: {
      linkType: 'linkType',
      internalTitle: 'internalLink.title',
      internalType: 'internalLink._type',
      internalLanguage: 'internalLink.language',
      externalUrl: 'externalUrl',
      externalTitle: 'externalTitle',
      formId: 'formConfig.formId',
      formTitle: 'formConfig.formTitle',
      hasChildren: 'children'
    },
    prepare({ linkType, internalTitle, internalType, externalUrl, externalTitle, formId, formTitle, hasChildren }) {
      let displayTitle = 'Untitled';
      let subtitle = '';

      if (linkType === 'internal' && internalTitle) {
        displayTitle = internalTitle;
        const typeLabel = getDocumentTypeLabel(internalType);
        subtitle = `Internal • ${typeLabel}`;
      } else if (linkType === 'external' && externalTitle) {
        displayTitle = externalTitle;
        try {
          const hostname = new URL(externalUrl).hostname;
          subtitle = `External • ${hostname}`;
        } catch {
          subtitle = 'External • Invalid URL';
        }
      } else if (linkType === 'external' && externalUrl) {
        displayTitle = externalUrl;
        try {
          const hostname = new URL(externalUrl).hostname;
          subtitle = `External • ${hostname}`;
        } catch {
          subtitle = 'External • Invalid URL';
        }
      } else if (linkType === 'form') {
        displayTitle = formTitle || formId || 'Form Link';
        subtitle = `Form • ${formId || 'No ID set'}`;
      } else {
        displayTitle = 'Incomplete Menu Item';
        subtitle = 'Please configure the link';
      }

      if (hasChildren && hasChildren.length > 0) {
        subtitle = `${hasChildren.length} child${hasChildren.length !== 1 ? 'ren' : ''} • ${subtitle}`;
      }

      return {
        title: displayTitle,
        subtitle
      }
    }
  }
});

// Reusable WYSIWYG field configuration
export const createWysiwygField = (name: string, title: string) => ({
  name,
  title,
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Blockquote', value: 'blockquote' }
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' }
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' }
        ],
        annotations: [
          {
            title: 'URL',
            name: 'link',
            type: 'object',
            fields: [
              {
                title: 'URL',
                name: 'href',
                type: 'url'
              }
            ]
          }
        ]
      }
    }
  ]
})

export const commonFields = {

  // Headers
  eyebrow: {
    name: 'eyebrow',
    title: 'Eyebrow',
    type: 'string',
    description: 'Small text displayed above the main header'
  },
  header: {
    name: 'header',
    title: 'Header',
    type: 'string',
    description: 'The main header'
  },
  subheader: {
    name: 'subheader',
    title: 'Subheader',
    type: 'string',
    description: 'Supporting text shown below the header'
  },

  // Call-to-action Buttons
  cta: {
    name: 'cta',
    title: 'Call to Action',
    type: 'ctaButton'
  },

  // Form Button
  formButton: {
    name: 'formButton',
    title: 'Form Button',
    type: 'object',
    fields: [
      {
        name: 'linkTitle',
        title: 'Button Text',
        type: 'string',
        description: 'Text displayed on the button',
        validation: (Rule: any) => Rule.required()
      },
      {
        name: 'variant',
        title: 'Button Style',
        type: 'string',
        options: {
          list: [
            { title: 'Primary', value: 'primary' },
            { title: 'Secondary', value: 'secondary' },
            { title: 'Secondary 2', value: 'secondary2' }
          ]
        },
        initialValue: 'primary'
      },
      {
        name: 'formConfig',
        title: 'Form Configuration',
        type: 'object',
        fields: [
          {
            name: 'formId',
            title: 'Form ID',
            type: 'string',
            description: 'Unique identifier for the form (e.g., contact-form, newsletter-signup)',
            validation: (Rule: any) => Rule.required()
          },
          {
            name: 'formTitle',
            title: 'Form Title',
            type: 'string',
            description: 'Title displayed in the form modal/overlay'
          },
          {
            name: 'formDescription',
            title: 'Form Description',
            type: 'text',
            description: 'Optional description text for the form'
          }
        ]
      }
    ],
    preview: {
      select: {
        linkTitle: 'linkTitle',
        variant: 'variant',
        formId: 'formConfig.formId',
        formTitle: 'formConfig.formTitle'
      },
      prepare({ linkTitle, variant, formId, formTitle }: any) {
        return {
          title: linkTitle || 'Untitled Form Button',
          subtitle: `${variant || 'primary'} • Form: ${formId || 'No ID'}`
        };
      }
    }
  },

  // Component Settings
  backgroundColor: {
    name: 'backgroundColor',
    title: 'Background Color',
    type: 'string',
    options: {
      list: [
        { title: 'None', value: 'none' },
        { title: 'Light', value: 'light' },
        { title: 'Dark', value: 'dark' },
        { title: 'Primary', value: 'primary' },
        { title: 'Secondary', value: 'secondary' }
      ]
    }
  },
  textColor: {
    name: 'textColor',
    title: 'Text Color',
    type: 'string',
    options: {
      list: [
        { title: 'Default', value: 'default' },
        { title: 'Light', value: 'light' },
        { title: 'Dark', value: 'dark' },
        { title: 'Primary', value: 'primary' },
        { title: 'Secondary', value: 'secondary' }
      ]
    }
  },
  // Padding Settings
  customPadding: {
    name: 'customPadding',
    title: 'Padding',
    type: 'object',
    description: 'Adjust component padding spacing',
    options: {
      collapsible: true,
      collapsed: false
    },
    fields: [
      {
        name: 'paddingTop',
        title: 'Padding Top',
        type: 'string',
        description: 'Adjust the component top spacing',
        options: {
          list: [
            { title: 'Default', value: 'default' },
            { title: 'None', value: 'none' },
            { title: '1 rem', value: 'rem1' },
            { title: '2 rem', value: 'rem2' },
            { title: '4 rem', value: 'rem4' },
            { title: '6 rem', value: 'rem6' },
            { title: '8 rem', value: 'rem8' },
            { title: '10 rem', value: 'rem10' },
            { title: '12 rem', value: 'rem12' },
            { title: '16 rem', value: 'rem16' },
            { title: '20 rem', value: 'rem20' }
          ]
        },
        initialValue: 'default'
      },
      {
        name: 'paddingBottom',
        title: 'Padding Bottom',
        type: 'string',
        description: 'Adjust the component bottom spacing',
        options: {
          list: [
            { title: 'Default', value: 'default' },
            { title: 'None', value: 'none' },
            { title: '1 rem', value: 'rem1' },
            { title: '2 rem', value: 'rem2' },
            { title: '4 rem', value: 'rem4' },
            { title: '6 rem', value: 'rem6' },
            { title: '8 rem', value: 'rem8' },
            { title: '10 rem', value: 'rem10' },
            { title: '12 rem', value: 'rem12' },
            { title: '16 rem', value: 'rem16' },
            { title: '20 rem', value: 'rem20' }
          ]
        },
        initialValue: 'default'
      },
      {
        name: 'paddingLeft',
        title: 'Padding Left',
        type: 'string',
        description: 'Adjust the component left spacing',
        options: {
          list: [
            { title: 'Default', value: 'default' },
            { title: 'None', value: 'none' },
            { title: '1 rem', value: 'rem1' },
            { title: '2 rem', value: 'rem2' },
            { title: '4 rem', value: 'rem4' },
            { title: '6 rem', value: 'rem6' },
            { title: '8 rem', value: 'rem8' },
            { title: '10 rem', value: 'rem10' },
            { title: '12 rem', value: 'rem12' },
            { title: '16 rem', value: 'rem16' },
            { title: '20 rem', value: 'rem20' }
          ]
        },
        initialValue: 'default'
      },
      {
        name: 'paddingRight',
        title: 'Padding Right',
        type: 'string',
        description: 'Adjust the component right spacing',
        options: {
          list: [
            { title: 'Default', value: 'default' },
            { title: 'None', value: 'none' },
            { title: '1 rem', value: 'rem1' },
            { title: '2 rem', value: 'rem2' },
            { title: '4 rem', value: 'rem4' },
            { title: '6 rem', value: 'rem6' },
            { title: '8 rem', value: 'rem8' },
            { title: '10 rem', value: 'rem10' },
            { title: '12 rem', value: 'rem12' },
            { title: '16 rem', value: 'rem16' },
            { title: '20 rem', value: 'rem20' }
          ]
        },
        initialValue: 'default'
      }
    ]
  },
  // Margin Settings
  customMargin: {
    name: 'customMargin',
    title: 'Margin',
    type: 'object',
    description: 'Adjust component margin spacing',
    options: {
      collapsible: true,
      collapsed: false
    },
    fields: [
      {
        name: 'marginTop',
        title: 'Margin Top',
        type: 'string',
        description: 'Adjust the component top spacing',
        options: {
          list: [
            { title: 'Default', value: 'default' },
            { title: 'None', value: 'none' },
            { title: '1 rem', value: 'rem1' },
            { title: '2 rem', value: 'rem2' },
            { title: '4 rem', value: 'rem4' },
            { title: '6 rem', value: 'rem6' },
            { title: '8 rem', value: 'rem8' },
            { title: '10 rem', value: 'rem10' },
            { title: '12 rem', value: 'rem12' },
            { title: '16 rem', value: 'rem16' },
            { title: '20 rem', value: 'rem20' }
          ]
        },
        initialValue: 'default'
      },
      {
        name: 'marginBottom',
        title: 'Margin Bottom',
        type: 'string',
        description: 'Adjust the component bottom spacing',
        options: {
          list: [
            { title: 'Default', value: 'default' },
            { title: 'None', value: 'none' },
            { title: '1 rem', value: 'rem1' },
            { title: '2 rem', value: 'rem2' },
            { title: '4 rem', value: 'rem4' },
            { title: '6 rem', value: 'rem6' },
            { title: '8 rem', value: 'rem8' },
            { title: '10 rem', value: 'rem10' },
            { title: '12 rem', value: 'rem12' },
            { title: '16 rem', value: 'rem16' },
            { title: '20 rem', value: 'rem20' }
          ]
        },
        initialValue: 'default'
      },
      {
        name: 'marginLeft',
        title: 'Margin Left',
        type: 'string',
        description: 'Adjust the component left spacing',
        options: {
          list: [
            { title: 'Default', value: 'default' },
            { title: 'None', value: 'none' },
            { title: '1 rem', value: 'rem1' },
            { title: '2 rem', value: 'rem2' },
            { title: '4 rem', value: 'rem4' },
            { title: '6 rem', value: 'rem6' },
            { title: '8 rem', value: 'rem8' },
            { title: '10 rem', value: 'rem10' },
            { title: '12 rem', value: 'rem12' },
            { title: '16 rem', value: 'rem16' },
            { title: '20 rem', value: 'rem20' }
          ]
        },
        initialValue: 'default'
      },
      {
        name: 'marginRight',
        title: 'Margin Right',
        type: 'string',
        description: 'Adjust the component right spacing',
        options: {
          list: [
            { title: 'Default', value: 'default' },
            { title: 'None', value: 'none' },
            { title: '1 rem', value: 'rem1' },
            { title: '2 rem', value: 'rem2' },
            { title: '4 rem', value: 'rem4' },
            { title: '6 rem', value: 'rem6' },
            { title: '8 rem', value: 'rem8' },
            { title: '10 rem', value: 'rem10' },
            { title: '12 rem', value: 'rem12' },
            { title: '16 rem', value: 'rem16' },
            { title: '20 rem', value: 'rem20' }
          ]
        },
        initialValue: 'default'
      }
    ]
  },
  // Container Settings
  container: {
    name: 'container',
    title: 'Container',
    type: 'string',
    options: {
      list: [
        { title: 'Contained', value: 'contained' },
        { title: 'Full Width', value: 'fullWidth' }
      ]
    },
    initialValue: 'contained'
  }
} 

// Pre-grouped field collections for easier reuse
export const contentFields = {
  headers: [
    { ...commonFields.eyebrow, group: 'content'},
    { ...commonFields.header, group: 'content'},
    { ...commonFields.subheader, group: 'content' }
  ],
  
  bodyText: (name = 'bodyText', title = 'Body Text') => ({
    ...createWysiwygField(name, title)
  }),
  
  ctas: {
    name: 'ctas',
    title: 'Call to Action Buttons',
    type: 'array',
    of: [commonFields.cta],
    validation: (Rule: any) => Rule.max(3)
  }
}

export const settingsFields = {
  layout: [
    { ...commonFields.customPadding, group: 'settings' },
    { ...commonFields.customMargin, group: 'settings' },
    { ...commonFields.container, group: 'settings' }
  ]
}

// Helper function to assign group to multiple fields
export const assignGroup = (group: string, fields: any[]) => 
  fields.map(field => ({ ...field, group }))

// Helper function to assign fieldset to multiple fields  
export const assignFieldset = (fieldset: string, fields: any[]) => 
  fields.map(field => ({ ...field, fieldset }))
