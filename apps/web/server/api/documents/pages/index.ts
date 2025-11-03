import { createSanityClient, commonFields, ctaReferences, getTranslationsQuery } from '../../../utils/sanity'
import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler(async (event) => {
    try {
      const query = getQuery(event)
      const limit = parseInt(query.limit as string) || 10
      const offset = parseInt(query.offset as string) || 0
      const path = query.path as string
      const type = query.type as string || 'page' // Default to 'page' if no type specified
      const language = query.language as string || 'da' // Default to Danish

      // Validate document type
      const validTypes = ['page', 'solutions', 'article', 'portfolio', 'all']
      if (type && !validTypes.includes(type)) {
        throw createError({
          statusCode: 400,
          statusMessage: `Invalid document type. Must be one of: ${validTypes.join(', ')}`
        })
      }

      // If path is provided, lookup single document by slug across all types
      if (path) {
        // Strip leading slash from path
        let cleanPath = path.startsWith('/') ? path.slice(1) : path
        
        // Remove language prefix from path (e.g., "en/frontpage2" -> "frontpage2")
        // Sanity slugs don't include language prefixes
        const languagePrefixPattern = /^[a-z]{2}\//;
        if (languagePrefixPattern.test(cleanPath)) {
          cleanPath = cleanPath.replace(languagePrefixPattern, '');
        }
        
        const groqQuery = `
          *[slug.current == $path && _type in ["page", "solutions", "article", "portfolio"] && language == $language][0] {
            ${commonFields},
            ${ctaReferences},
            ${getTranslationsQuery('page')}
          }
        `

        const sanityClient = createSanityClient()
        // Try with cleaned path (without language prefix)
        let document = await sanityClient.fetch(groqQuery, { path: cleanPath, language })
        
        // If not found, try with leading slash
        if (!document) {
          document = await sanityClient.fetch(groqQuery, { path: `/${cleanPath}`, language })
        }
        
        // If still not found and path has a prefix pattern, try the full path as stored
        if (!document && languagePrefixPattern.test(path)) {
          document = await sanityClient.fetch(groqQuery, { path: path.replace(/^\//, ''), language })
        }

        if (!document) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Document not found'
          })
        }

        return {
          data: document,
          meta: {
            type: document._type,
            language
          }
        }
      }

      // Base query for documents - search across all types if no specific type requested
      let groqQuery = `
        *[_type in ["page", "solutions", "article", "portfolio"] && language == $language] {
          ${commonFields},
          ${ctaReferences},
          ${getTranslationsQuery('page')}
        }
      `

      // If a specific type is requested, filter by that type
      if (type && type !== 'all') {
        groqQuery = `
          *[_type == $type && language == $language] {
            ${commonFields},
            ${ctaReferences},
            ${getTranslationsQuery(type)}
          }
        `
      }

      // Add ordering and pagination
      // For articles, order by date field if it exists, otherwise by _createdAt
      if (type === 'article' || type === 'portfolio' || type === 'all') {
        groqQuery += ` | order(coalesce(date, _createdAt) desc) [${offset}...${offset + limit}]`
      } else {
        groqQuery += ` | order(_createdAt desc) [${offset}...${offset + limit}]`
      }

      const sanityClient = createSanityClient()
      const documents = await sanityClient.fetch(groqQuery, type && type !== 'all' ? { type, language } : { language })

      return {
        data: documents,
        meta: {
          limit,
          offset,
          total: documents.length,
          type,
          language
        }
      }
    } catch (error: any) {
      console.error('Error fetching documents:', error)
      
      // Re-throw if it's already a Nuxt error
      if (error.statusCode) {
        throw error
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch documents'
      })
    }
}) 