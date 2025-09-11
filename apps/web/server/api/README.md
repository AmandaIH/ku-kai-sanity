# API Endpoints

This directory contains the server-side API endpoints for fetching content from Sanity CMS.

## Language Support

All endpoints now support language filtering and include translations. The default language is Danish (`da`), and English (`en`) is also supported.

## Endpoints

### Pages

#### GET `/api/pages`
Fetches a list of pages with optional filtering and pagination.

**Query Parameters:**
- `language` (optional): Language code (`da` or `en`). Defaults to `da`
- `limit` (optional): Number of pages to return. Defaults to 10
- `offset` (optional): Number of pages to skip. Defaults to 0
- `slug` (optional): Filter by specific slug

**Response:**
```json
{
  "data": [
    {
      "_id": "...",
      "_type": "page",
      "title": "Page Title",
      "slug": { "current": "page-slug" },
      "language": "da",
      "metaDescription": "...",
      "featuredImage": "...",
      "content": [...],
      "_createdAt": "...",
      "_updatedAt": "...",
      "_translations": [
        {
          "_id": "...",
          "_type": "page",
          "title": "Page Title (English)",
          "slug": { "current": "en/page-slug" },
          "language": "en"
        }
      ]
    }
  ],
  "meta": {
    "limit": 10,
    "offset": 0,
    "total": 1,
    "language": "da"
  }
}
```

#### GET `/api/pages/[slug]`
Fetches a single page by slug.

**Query Parameters:**
- `language` (optional): Language code (`da` or `en`). Defaults to `da`

**Response:**
```json
{
  "data": {
    "_id": "...",
    "_type": "page",
    "title": "Page Title",
    "slug": { "current": "page-slug" },
    "language": "da",
    "metaDescription": "...",
    "featuredImage": "...",
    "content": [...],
    "_createdAt": "...",
    "_updatedAt": "...",
    "_translations": [...]
  },
  "meta": {
    "language": "da"
  }
}
```

### Posts

#### GET `/api/posts`
Fetches a list of posts with optional filtering and pagination.

**Query Parameters:**
- `language` (optional): Language code (`da` or `en`). Defaults to `da`
- `limit` (optional): Number of posts to return. Defaults to 10
- `offset` (optional): Number of posts to skip. Defaults to 0
- `slug` (optional): Filter by specific slug

**Response:**
```json
{
  "data": [
    {
      "_id": "...",
      "_type": "post",
      "title": "Post Title",
      "slug": { "current": "post-slug" },
      "language": "da",
      "metaDescription": "...",
      "featuredImage": "...",
      "content": [...],
      "_createdAt": "...",
      "_updatedAt": "...",
      "_translations": [...]
    }
  ],
  "meta": {
    "limit": 10,
    "offset": 0,
    "total": 1,
    "language": "da"
  }
}
```

#### GET `/api/posts/[slug]`
Fetches a single post by slug.

**Query Parameters:**
- `language` (optional): Language code (`da` or `en`). Defaults to `da`

**Response:**
```json
{
  "data": {
    "_id": "...",
    "_type": "post",
    "title": "Post Title",
    "slug": { "current": "post-slug" },
    "language": "da",
    "metaDescription": "...",
    "featuredImage": "...",
    "content": [...],
    "_createdAt": "...",
    "_updatedAt": "...",
    "_translations": [...]
  },
  "meta": {
    "language": "da"
  }
}
```

## Translation Structure

The `_translations` field contains an array of all translated versions of the document. Each translation includes:

- `_id`: The document ID
- `_type`: The document type
- `title`: The translated title
- `slug`: The translated slug
- `language`: The language code

## Caching

All endpoints are cached for 5 minutes to improve performance. The cache key includes the query parameters to ensure different language requests are cached separately.

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200`: Success
- `400`: Bad request (missing required parameters)
- `404`: Not found
- `500`: Internal server error

Error responses include a descriptive message:

```json
{
  "statusCode": 404,
  "statusMessage": "Page not found"
}
``` 