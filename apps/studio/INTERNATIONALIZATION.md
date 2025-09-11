# Internationalization Setup

This document explains the internationalization setup for the Sanity Studio.

## Overview

The studio is configured to support multiple languages with a centralized configuration system that makes it easy to manage and extend.

## Configuration

### Centralized Configuration

All internationalization settings are centralized in `config/internationalization.ts`:

```typescript
export const INTERNATIONALIZATION_CONFIG = {
  // Supported languages
  supportedLanguages: [
    { id: 'da', title: 'Danish' },
    { id: 'en', title: 'English' }
  ],
  
  // Schema types that support internationalization
  schemaTypes: ['page', 'post', 'siteSettings'],
  
  // Schema types that are singletons (only one instance per language)
  singletonSchemaTypes: ['siteSettings'],
  
  // Default language
  defaultLanguage: 'da',
  
  // Helper methods
  get regularDocumentTypes() { /* ... */ },
  getLanguageById(id: string) { /* ... */ },
  getLanguageTitle(id: string) { /* ... */ }
}
```

### Supported Languages

Currently supported languages:
- **Danish (da)** - Default language
- **English (en)** - Secondary language

### Schema Types

The following schema types support internationalization:

1. **Pages** (`page`) - Regular documents, multiple per language
2. **Posts** (`post`) - Regular documents, multiple per language  
3. **Site Settings** (`siteSettings`) - Singleton, one per language

## Structure

### Dynamic Structure

The studio structure is now dynamic and automatically handles:

- **Singleton Documents**: Site Settings are organized with language filtering options
- **Regular Documents**: Pages and Posts are organized with language filtering options
- **Media**: Standard media management

### Structure Organization

```
Content
├── Site Settings
│   ├── All
│   ├── Danish
│   ├── English
│   └── Quick Create (if missing)
├── Pages
│   ├── All
│   ├── Danish
│   └── English
├── Posts
│   ├── All
│   ├── Danish
│   └── English
└── Media
```

## Adding New Languages

To add a new language:

1. Update `config/internationalization.ts`:
   ```typescript
   supportedLanguages: [
     { id: 'da', title: 'Danish' },
     { id: 'en', title: 'English' },
     { id: 'de', title: 'German' } // New language
   ],
   ```

2. The structure will automatically update to include the new language

## Adding New Schema Types

To add internationalization to a new schema type:

1. Add the schema type to `config/internationalization.ts`:
   ```typescript
   schemaTypes: ['page', 'post', 'siteSettings', 'newType'],
   ```

2. Add the language field to your schema:
   ```typescript
   import { commonFields } from './common'
   
   // In your schema fields array:
   commonFields.language,
   ```

3. Update the preview function to show language information:
   ```typescript
   preview: {
     select: {
       title: 'title',
       language: 'language'
     },
     prepare({ title, language }) {
       const languageLabel = language === 'en' ? 'English' : 'Danish';
       return {
         title,
         subtitle: languageLabel
       }
     }
   }
   ```

## Document Internationalization Plugin

The studio uses the `@sanity/document-internationalization` plugin which:

- Automatically creates metadata documents for translations
- Provides translation linking between documents
- Adds slug fields to metadata documents
- Enables translation workflows

## Best Practices

1. **Always use the centralized configuration** - Don't hardcode language settings
2. **Use the language field** - Include `commonFields.language` in all internationalized schemas
3. **Update preview functions** - Show language information in document previews
4. **Test both languages** - Ensure content works correctly in all supported languages

## Migration Notes

If you're migrating from the old hardcoded structure:

1. The new structure is fully backward compatible
2. Existing documents will continue to work
3. The language field will be automatically added to new documents
4. Preview functions have been updated to show language information
5. Site Settings now works like regular documents - showing only existing instances 