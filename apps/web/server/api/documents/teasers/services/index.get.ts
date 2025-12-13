import { createSanityClient } from '../../../../utils/sanity'

export default cachedEventHandler(
  async (event) => {
    try {
      const query = getQuery(event)
      const language = (query.language as string) || 'en' // Default to English

      // Query for all solutions with only the requested fields
      const groqQuery = `
        *[_type == "solutions" && language == $language] {
          _id,
          "slug": slug.current,
          language,
          title,
          short_description,
          featuredImage,
          order
        } | order(coalesce(order, 999999) asc, _createdAt desc)
      `

      const sanityClient = createSanityClient()
      const services = await sanityClient.fetch(groqQuery, { language })

      return {
        data: services,
        meta: {
          language,
          total: services.length
        }
      }
    } catch (error: any) {
      console.error('Error fetching services:', error)
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch services'
      })
    }
  },
  {
    maxAge: 30, // Cache for 30 seconds
    getKey: (event) => {
      const query = getQuery(event)
      return `services-${JSON.stringify(query)}`
    },
    shouldBypassCache: () => process.env.NODE_ENV !== 'production'
  }
)

