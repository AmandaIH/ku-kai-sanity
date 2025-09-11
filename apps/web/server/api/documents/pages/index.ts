import { createSanityClient, commonFields, ctaReferences } from '../../../utils/sanity'

export default cachedEventHandler(
  async (event) => {
    try {
      const query = getQuery(event)
      const limit = parseInt(query.limit as string) || 10
      const offset = parseInt(query.offset as string) || 0
      const path = query.path as string
      const type = query.type as string || 'page' // Default to 'page' if no type specified

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
        const cleanPath = path.startsWith('/') ? path.slice(1) : path
        
        const groqQuery = `
          *[slug.current == $path && _type in ["page", "solutions", "article", "portfolio"]][0] {
            ${commonFields},
            ${ctaReferences}
          }
        `

        const sanityClient = createSanityClient()
        const document = await sanityClient.fetch(groqQuery, { path: cleanPath })

        if (!document) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Document not found'
          })
        }

        return {
          data: document,
          meta: {
            type: document._type
          }
        }
      }

      // Base query for documents - search across all types if no specific type requested
      let groqQuery = `
        *[_type in ["page", "solutions", "article", "portfolio"]] {
          ${commonFields},
          ${ctaReferences}
        }
      `

      // If a specific type is requested, filter by that type
      if (type && type !== 'all') {
        groqQuery = `
          *[_type == $type] {
            ${commonFields},
            ${ctaReferences}
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
      const documents = await sanityClient.fetch(groqQuery, type && type !== 'all' ? { type } : {})

      return {
        data: documents,
        meta: {
          limit,
          offset,
          total: documents.length,
          type
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
  },
  {
    maxAge: 30, // Cache for 30 seconds
    getKey: (event) => {
      const query = getQuery(event)
      return `documents-${JSON.stringify(query)}`
    },
    shouldBypassCache: () => process.env.NODE_ENV !== 'production'
  }
) 