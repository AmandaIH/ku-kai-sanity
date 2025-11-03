import { createSanityClient, commonFields, ctaReferences, getTranslationsQuery } from '../../../utils/sanity'

export default cachedEventHandler(
  async (event) => {
    try {
      const query = getQuery(event)
      const limit = parseInt(query.limit as string) || 10
      const offset = parseInt(query.offset as string) || 0
      const path = query.path as string
      const language = query.language as string || 'da' // Default to Danish

      // If path is provided, lookup single portfolio by slug
      if (path) {
        // Strip leading slash and remove language prefix from path
        let cleanPath = path.startsWith('/') ? path.slice(1) : path
        
        // Remove language prefix from path (e.g., "en/portfolio-slug" -> "portfolio-slug")
        // Sanity slugs don't include language prefixes
        const languagePrefixPattern = /^[a-z]{2}\//;
        if (languagePrefixPattern.test(cleanPath)) {
          cleanPath = cleanPath.replace(languagePrefixPattern, '');
        }
        
        const groqQuery = `
          *[_type == "portfolio" && slug.current == $path && language == $language][0] {
            ${commonFields},
            ${ctaReferences},
            ${getTranslationsQuery('portfolio')}
          }
        `

        const sanityClient = createSanityClient()
        const portfolio = await sanityClient.fetch(groqQuery, { path: cleanPath, language })

        if (!portfolio) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Portfolio not found'
          })
        }

        return {
          data: portfolio,
          meta: {
            language
          }
        }
      }

      // Base query for portfolios with language filter
      let groqQuery = `
        *[_type == "portfolio" && language == $language] {
          ${commonFields},
          ${ctaReferences},
          ${getTranslationsQuery('portfolio')}
        }
      `

      // Add ordering and pagination
      groqQuery += ` | order(coalesce(date, _createdAt) desc) [${offset}...${offset + limit}]`

      const sanityClient = createSanityClient()
      
      // Fetch portfolios and total count in parallel
      const [portfolios, totalCount] = await Promise.all([
        sanityClient.fetch(groqQuery, { language }),
        sanityClient.fetch(`count(*[_type == "portfolio" && language == $language])`, { language })
      ])

      return {
        data: portfolios,
        meta: {
          limit,
          offset,
          total: totalCount,
          language
        }
      }
    } catch (error: any) {
      console.error('Error fetching portfolios:', error)
      
      // Re-throw if it's already a Nuxt error
      if (error.statusCode) {
        throw error
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch portfolios'
      })
    }
  },
  {
    maxAge: 30, // Cache for 5 minutes
    getKey: (event) => {
      const query = getQuery(event)
      return `portfolios-${JSON.stringify(query)}`
    },
    shouldBypassCache: () => process.env.NODE_ENV !== 'production'
  }
) 