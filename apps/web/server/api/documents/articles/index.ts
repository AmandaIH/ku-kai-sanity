import { createSanityClient, commonFields, ctaReferences } from '../../../utils/sanity'

export default cachedEventHandler(
  async (event) => {
    try {
      const query = getQuery(event)
      const limit = parseInt(query.limit as string) || 10
      const offset = parseInt(query.offset as string) || 0
      const path = query.path as string

      // If path is provided, lookup single article by slug
      if (path) {
        const groqQuery = `
          *[_type == "article" && slug.current == $path][0] {
            ${commonFields},
            ${ctaReferences}
          }
        `

        const sanityClient = createSanityClient()
        const article = await sanityClient.fetch(groqQuery, { path })

        if (!article) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Article not found'
          })
        }

        return {
          data: article,
          meta: {}
        }
      }

      // Base query for articles
      let groqQuery = `
        *[_type == "article"] {
          ${commonFields},
          ${ctaReferences}
        }
      `

      // Add ordering and pagination
      groqQuery += ` | order(_createdAt desc) [${offset}...${offset + limit}]`

      const sanityClient = createSanityClient()
      
      // Fetch articles and total count in parallel
      const [articles, totalCount] = await Promise.all([
        sanityClient.fetch(groqQuery),
        sanityClient.fetch(`count(*[_type == "article"])`)
      ])

      return {
        data: articles,
        meta: {
          limit,
          offset,
          total: totalCount
        }
      }
    } catch (error: any) {
      console.error('Error fetching articles:', error)
      
      // Re-throw if it's already a Nuxt error
      if (error.statusCode) {
        throw error
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch articles'
      })
    }
  },
  {
    maxAge: 30, // Cache for 5 minutes
    getKey: (event) => {
      const query = getQuery(event)
      return `articles-${JSON.stringify(query)}`
    },
    shouldBypassCache: () => process.env.NODE_ENV !== 'production'
  }
) 