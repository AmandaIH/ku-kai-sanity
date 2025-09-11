import { createSanityClient, commonFields, ctaReferences } from '../../../utils/sanity'

export default cachedEventHandler(
  async (event) => {
    try {
      const query = getQuery(event)
      const limit = parseInt(query.limit as string) || 10
      const offset = parseInt(query.offset as string) || 0
      const path = query.path as string

      // If path is provided, lookup single solution by slug
      if (path) {
        const groqQuery = `
          *[_type == "solutions" && slug.current == $path][0] {
            ${commonFields},
            ${ctaReferences}
          }
        `

        const sanityClient = createSanityClient()
        const solution = await sanityClient.fetch(groqQuery, { path })

        if (!solution) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Solution not found'
          })
        }

        return {
          data: solution,
          meta: {}
        }
      }

      // Base query for solutions
      let groqQuery = `
        *[_type == "solutions"] {
          ${commonFields},
          ${ctaReferences}
        }
      `

      // Add ordering and pagination
      groqQuery += ` | order(_createdAt desc) [${offset}...${offset + limit}]`

      const sanityClient = createSanityClient()
      const solutions = await sanityClient.fetch(groqQuery)

      return {
        data: solutions,
        meta: {
          limit,
          offset,
          total: solutions.length
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
