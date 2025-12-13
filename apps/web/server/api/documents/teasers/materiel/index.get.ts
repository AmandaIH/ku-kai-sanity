import { createSanityClient } from '../../../../utils/sanity'

export default cachedEventHandler(
  async (event) => {
    try {
      const query = getQuery(event)
      const language = (query.language as string) || 'en' // Default to English
      const serviceId = query.service as string | undefined

      // Build filter conditions
      let filterConditions = `_type == "materiel" && language == $language`
      const queryParams: Record<string, string> = { language }

      // Add service filter if serviceId is provided
      if (serviceId) {
        filterConditions += ` && service._ref == $serviceId`
        queryParams.serviceId = serviceId
      }

      // Query for materiel with only the requested fields
      const groqQuery = `
        *[${filterConditions}] {
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
      const materiel = await sanityClient.fetch(groqQuery, queryParams)

      return {
        data: materiel,
        meta: {
          language,
          serviceId: serviceId || null,
          total: materiel.length
        }
      }
    } catch (error: any) {
      console.error('Error fetching materiel:', error)
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch materiel'
      })
    }
  },
  {
    maxAge: 30, // Cache for 30 seconds
    getKey: (event) => {
      const query = getQuery(event)
      return `materiel-${JSON.stringify(query)}`
    },
    shouldBypassCache: () => process.env.NODE_ENV !== 'production'
  }
)

