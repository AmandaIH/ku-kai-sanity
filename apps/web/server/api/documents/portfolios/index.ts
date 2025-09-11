import { createSanityClient, commonFields, ctaReferences } from '../../../utils/sanity'

export default cachedEventHandler(
  async (event) => {
    try {
      const query = getQuery(event)
      const limit = parseInt(query.limit as string) || 10
      const offset = parseInt(query.offset as string) || 0
      const path = query.path as string

      // If path is provided, lookup single portfolio by slug
      if (path) {
        const groqQuery = `
          *[_type == "portfolio" && slug.current == $path][0] {
            ${commonFields},
            ${ctaReferences}
          }
        `

        const sanityClient = createSanityClient()
        const portfolio = await sanityClient.fetch(groqQuery, { path })

        if (!portfolio) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Portfolio not found'
          })
        }

        return {
          data: portfolio,
          meta: {}
        }
      }

      // Base query for portfolios
      let groqQuery = `
        *[_type == "portfolio"] {
          ${commonFields},
          ${ctaReferences}
        }
      `

      // Add ordering and pagination
      groqQuery += ` | order(_createdAt desc) [${offset}...${offset + limit}]`

      const sanityClient = createSanityClient()
      
      // Fetch portfolios and total count in parallel
      const [portfolios, totalCount] = await Promise.all([
        sanityClient.fetch(groqQuery),
        sanityClient.fetch(`count(*[_type == "portfolio"])`)
      ])

      return {
        data: portfolios,
        meta: {
          limit,
          offset,
          total: totalCount
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