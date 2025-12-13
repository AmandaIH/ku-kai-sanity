import { createSanityClient, commonFields, ctaReferences, getTranslationsQuery } from '../../../utils/sanity'

export default cachedEventHandler(
  async (event) => {
    try {
      const query = getQuery(event)
      const limit = parseInt(query.limit as string) || 10
      const offset = parseInt(query.offset as string) || 0
      const path = query.path as string
      const language = query.language as string || 'en' // Default to English

      // If path is provided, lookup single solution by slug
      if (path) {
        // Strip leading slash and remove language prefix from path
        let cleanPath = path.startsWith('/') ? path.slice(1) : path
        
        // Remove language prefix from path (e.g., "en/service-slug" -> "service-slug")
        // Sanity slugs don't include language prefixes
        const languagePrefixPattern = /^[a-z]{2}\//;
        if (languagePrefixPattern.test(cleanPath)) {
          cleanPath = cleanPath.replace(languagePrefixPattern, '');
        }
        
        const groqQuery = `
          *[_type == "solutions" && slug.current == $path && language == $language][0] {
            ${commonFields},
            ${ctaReferences},
            ${getTranslationsQuery('solutions')}
          }
        `

        const sanityClient = createSanityClient()
        const solution = await sanityClient.fetch(groqQuery, { path: cleanPath, language })

        if (!solution) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Solution not found'
          })
        }

        return {
          data: solution,
          meta: {
            language
          }
        }
      }

      // Base query for solutions with language filter
      let groqQuery = `
        *[_type == "solutions" && language == $language] {
          ${commonFields},
          ${ctaReferences},
          ${getTranslationsQuery('solutions')}
        }
      `

      // Add ordering and pagination
      groqQuery += ` | order(_createdAt desc) [${offset}...${offset + limit}]`

      const sanityClient = createSanityClient()
      
      // Fetch solutions and total count in parallel
      const [solutions, totalCount] = await Promise.all([
        sanityClient.fetch(groqQuery, { language }),
        sanityClient.fetch(`count(*[_type == "solutions" && language == $language])`, { language })
      ])

      return {
        data: solutions,
        meta: {
          limit,
          offset,
          total: totalCount,
          language
        }
      }
    } catch (error: any) {
      console.error('Error fetching solutions:', error)
      
      // Re-throw if it's already a Nuxt error
      if (error.statusCode) {
        throw error
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch solutions'
      })
    }
  },
  {
    maxAge: 30, // Cache for 5 minutes
    getKey: (event) => {
      const query = getQuery(event)
      return `solutions-${JSON.stringify(query)}`
    },
    shouldBypassCache: () => process.env.NODE_ENV !== 'production'
  }
)
