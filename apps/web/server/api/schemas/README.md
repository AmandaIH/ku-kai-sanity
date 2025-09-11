# Schema API Endpoints

This directory contains API endpoints for accessing Sanity schema information.

## Endpoints

### `/api/schema`
**Method:** GET  
**Description:** Fetches schema information directly from Sanity using the Sanity client or direct API calls.

**Response:**
```json
{
  "success": true,
  "data": {
    "raw": { /* Raw schema data from Sanity */ },
    "metadata": {
      "projectId": "your-project-id",
      "dataset": "production",
      "apiVersion": "v2025-07-24",
      "timestamp": "2025-01-27T10:30:00.000Z"
    }
  },
  "timestamp": "2025-01-27T10:30:00.000Z"
}
```

### `/api/schema/static`
**Method:** GET  
**Description:** Returns static schema information based on the project structure. Useful as a fallback or for development.

**Response:**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "name": "page",
        "title": "Page",
        "description": "Page document type",
        "fields": ["title", "slug", "language", "metaDescription", "featuredImage", "content"]
      }
    ],
    "commonTypes": [
      {
        "name": "ctaButton",
        "title": "CTA Button",
        "description": "Call-to-action button component",
        "fields": ["text", "url", "style", "icon"]
      }
    ],
    "contentBlocks": [
      {
        "name": "heroBlock",
        "title": "Hero Block",
        "description": "Hero section with background and content",
        "fields": ["title", "subtitle", "background", "ctaButton"]
      }
    ],
    "metadata": {
      "source": "static",
      "description": "Static schema information based on project structure",
      "timestamp": "2025-01-27T10:30:00.000Z"
    }
  },
  "timestamp": "2025-01-27T10:30:00.000Z"
}
```

### `/api/schema/definitions`
**Method:** GET  
**Description:** Returns detailed schema definitions imported directly from the studio folder. Provides complete field definitions, types, validation rules, and options.

**Response:**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "name": "page",
        "title": "Page",
        "type": "document",
        "description": null,
        "category": "document",
        "fields": [
          {
            "name": "title",
            "title": "Title",
            "type": "string",
            "description": null,
            "validation": "Has validation",
            "initialValue": null,
            "hidden": null
          },
          {
            "name": "slug",
            "title": "Slug",
            "type": "slug",
            "description": null,
            "validation": "Has validation",
            "initialValue": null,
            "hidden": null,
            "options": "Dynamic source"
          }
        ],
        "preview": {
          "select": {
            "title": "title",
            "slug": "slug.current",
            "language": "language"
          },
          "prepare": "Function"
        }
      }
    ],
    "commonTypes": [
      {
        "name": "ctaButton",
        "title": "Call to Action Button",
        "type": "object",
        "description": null,
        "category": "common",
        "fields": [
          {
            "name": "text",
            "title": "Button Text",
            "type": "string",
            "description": null,
            "validation": "Has validation",
            "initialValue": null,
            "hidden": null
          },
          {
            "name": "styleVariant",
            "title": "Style Variant",
            "type": "string",
            "description": null,
            "validation": null,
            "initialValue": null,
            "hidden": null,
            "options": [
              { "title": "Primary", "value": "primary" },
              { "title": "Secondary", "value": "secondary" }
            ]
          }
        ],
        "preview": null
      }
    ],
    "contentBlocks": [
      {
        "name": "heroBlock",
        "title": "Hero Block",
        "type": "object",
        "description": "A prominent banner with visuals and compelling text...",
        "category": "block",
        "fields": [
          {
            "name": "eyebrow",
            "title": "Eyebrow",
            "type": "string",
            "description": "Small text displayed above the main header",
            "validation": null,
            "initialValue": null,
            "hidden": null
          }
        ],
        "preview": {
          "select": {
            "title": "header",
            "subtitle": "eyebrow",
            "media": "background.image"
          },
          "prepare": "Function"
        }
      }
    ],
    "commonFields": [
      {
        "name": "language",
        "title": "Language",
        "type": "string",
        "description": null,
        "validation": "Has validation",
        "initialValue": "da",
        "hidden": null,
        "options": [
          { "title": "Dansk", "value": "da" },
          { "title": "English", "value": "en" }
        ]
      }
    ],
    "metadata": {
      "source": "studio-schema-definitions",
      "description": "Schema definitions imported directly from studio folder",
      "timestamp": "2025-01-27T10:30:00.000Z",
      "totalSchemas": 17
    }
  },
  "timestamp": "2025-01-27T10:30:00.000Z"
}
```

## Usage Examples

### Fetching Schema Information
```javascript
// Using fetch
const response = await fetch('/api/schema')
const schemaData = await response.json()

// Using $fetch (Nuxt)
const schemaData = await $fetch('/api/schema')
```

### Error Handling
```javascript
try {
  const schemaData = await $fetch('/api/schema')
  if (schemaData.success) {
    console.log('Schema data:', schemaData.data)
  } else {
    console.error('Failed to fetch schema:', schemaData.error)
  }
} catch (error) {
  console.error('API request failed:', error)
}
```

## CORS Support

Both endpoints include CORS headers and can be accessed from external domains:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

## Environment Variables

The endpoints use the following environment variables from your Nuxt config:
- `SANITY_STUDIO_PROJECT_ID`
- `SANITY_STUDIO_DATASET` (defaults to 'production')
- `SANITY_STUDIO_API_VERSION` (defaults to '2025-07-24')

Make sure these are properly configured in your environment. 