import { createSanityClient } from '../../../../utils/sanity'

export default cachedEventHandler(
  async (event) => {
    try {
      const query = getQuery(event)
      const language = (query.language as string) || 'da' // Default to Danish

      // Query for all materiel with only the requested fields
      const groqQuery = `
        *[_type == "materiel" && language == $language] {
          _id,
          "slug": slug.current,
          language,
          title,
          short_description,
          featuredImage
        } | order(_createdAt desc)
      `

      const sanityClient = createSanityClient()
      const materiel = await sanityClient.fetch(groqQuery, { language })

      return {
        data: materiel,
        meta: {
          language,
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

