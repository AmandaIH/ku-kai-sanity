# Modular Content Schemas

This directory contains Sanity schemas for a modular content system based on the specifications in `modular-blocks-descriptions.md`.

## Structure

- `common.ts` - Shared fields used across multiple blocks (headers, CTAs, component settings)
- `blocks/` - Individual content block schemas
- `page.ts` - Example page schema showing how to use modular content
- `index.ts` - Main schema index that exports all schemas

## Content Blocks

### 1. Hero Block (`heroBlock`)
- Prominent banner with visuals and compelling text
- Supports image or video backgrounds
- Full or half screen size options
- Call-to-action buttons

### 2. Text Block (`textBlock`)
- Single or two-column layout for structured content
- WYSIWYG editor support
- Call-to-action buttons

### 3. Image Block (`imageBlock`)
- Showcase key visuals with adjustable width
- Alt text and caption support
- Alignment options

### 4. Video Block (`videoBlock`)
- Embed hosted or local videos
- Poster image support
- Video controls (autoplay, muted, loop)

### 5. Accordion Block (`accordionBlock`)
- Expandable sections for long-form content
- Single or multiple item open behavior
- WYSIWYG content support

### 6. Quote Block (`quoteBlock`)
- Stylish block for quotes or testimonials
- Quotee information (name, title, company, image)
- Multiple style options

### 7. Gallery Block (`galleryBlock`)
- Multi-image grid display
- Multiple layout options (grid, masonry, carousel, lightbox)
- Caption and link support

### 8. Form Block (`formBlock`)
- Embed contact or registration forms
- Built-in form types or custom embed support
- Form styling options

### 9. Archive Block (`archiveBlock`)
- Dynamic listing of posts or pages
- Pagination and filtering options
- Multiple layout options

### 10. Text & Image Block (`textAndImageBlock`)
- Text with image side by side
- Configurable image position and ratio
- Image styling options

### 11. Text & Video Block (`textAndVideoBlock`)
- Text and embedded video side by side
- Video controls and positioning
- Layout ratio options

### 12. Slider Block (`sliderBlock`)
- Horizontal slider with repeatable items
- Autoplay and navigation options
- Multiple layout modes

## Usage

### In a Document Schema

```typescript
import * as blocks from './schemaTypes/blocks'

export const myDocument = {
  name: 'myDocument',
  title: 'My Document',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string'
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      description: 'Add content blocks to build your page',
      of: [
        blocks.heroBlock,
        blocks.textBlock,
        blocks.imageBlock,
        blocks.videoBlock,
        blocks.accordionBlock,
        blocks.quoteBlock,
        blocks.galleryBlock,
        blocks.formBlock,
        blocks.archiveBlock,
        blocks.textAndImageBlock,
        blocks.textAndVideoBlock,
        blocks.sliderBlock
      ]
    }
  ]
}
```

### Common Fields

All blocks include these common fields:

- **Headers**: Eyebrow, Header, Subheader
- **Call-to-action Buttons**: Text, link, style variants, button types, sizes
- **Component Settings**: Spacing, background color, text color

## Features

- **Conditional Fields**: Many blocks use conditional field visibility based on selected options
- **Validation**: Required fields and validation rules where appropriate
- **Preview**: Custom preview configurations for better content management
- **Accessibility**: Alt text fields for images and proper labeling
- **Flexibility**: Multiple layout and styling options for each block type

## Adding New Blocks

To add a new content block:

1. Create a new file in `blocks/` directory
2. Import and use `commonFields` from `../common`
3. Export the block schema
4. Add it to `blocks/index.ts`
5. Add it to the main `schemaTypes/index.ts`
6. Add it to the `modularContent` field in `modularContent.ts` 