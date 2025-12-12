import { settingsFields } from '../common'

export const imageGridBlock = {
  name: 'imageGridBlock',
  title: 'Image Grid',
  type: 'object',
  description: 'Display a simple grid of images and/or videos (3 columns on desktop). No background, text, or buttons - just media.',
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
    // Images and Videos
    {
      name: 'media',
      title: 'Images & Videos',
      type: 'array',
      group: 'content',
      description: 'Add images or videos to display in a 3-column grid',
      of: [
        {
          type: 'object',
          name: 'mediaItem',
          title: 'Media Item',
          fields: [
            {
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Image', value: 'image' },
                  { title: 'Video', value: 'video' }
                ]
              },
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true
              },
              hidden: ({ parent }: any) => parent?.type !== 'image'
            },
            {
              name: 'video',
              title: 'Video',
              type: 'file',
              options: {
                accept: 'video/*'
              },
              hidden: ({ parent }: any) => parent?.type !== 'video'
            }
          ],
          preview: {
            select: {
              type: 'type',
              image: 'image',
              video: 'video'
            },
            prepare({ type, image, video }: any) {
              return {
                title: type === 'image' ? 'Image' : 'Video',
                media: image || video || null
              }
            }
          }
        }
      ],
      validation: (Rule: any) => Rule.required().min(1).max(9)
    },
    
    // Component settings
    ...settingsFields.layout
  ],
  preview: {
    select: {
      media: 'media'
    },
    prepare({ media }: any) {
      const firstItem = media?.[0];
      return {
        title: 'Image Grid',
        subtitle: media ? `${media.length} item${media.length !== 1 ? 's' : ''}` : 'No media',
        media: firstItem?.image || firstItem?.video || null
      }
    }
  }
}

