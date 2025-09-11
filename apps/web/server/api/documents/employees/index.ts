import { createSanityClient, commonFields, ctaReferences } from '../../../utils/sanity'

export default cachedEventHandler(
  async (event) => {
    try {
      const query = getQuery(event)
      const limit = parseInt(query.limit as string) || 10
      const offset = parseInt(query.offset as string) || 0
      const path = query.path as string

      // If path is provided, lookup single employee by slug
      if (path) {
        const groqQuery = `
          *[_type == "employee" && slug.current == $path][0] {
            ${commonFields},
            ${ctaReferences}
          }
        `

        const sanityClient = createSanityClient()
        const employee = await sanityClient.fetch(groqQuery, { path })

        if (!employee) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Employee not found'
          })
        }

        return {
          data: employee,
          meta: {}
        }
      }

      // Base query for employees
      let groqQuery = `
        *[_type == "employee"] {
          ${commonFields},
          ${ctaReferences}
        }
      `

      // Add ordering and pagination
      groqQuery += ` | order(_createdAt desc) [${offset}...${offset + limit}]`

      const sanityClient = createSanityClient()
      const employees = await sanityClient.fetch(groqQuery)

      return {
        data: employees,
        meta: {
          limit,
          offset,
          total: employees.length
        }
      }
    } catch (error: any) {
      console.error('Error fetching employees:', error)
      
      // Re-throw if it's already a Nuxt error
      if (error.statusCode) {
        throw error
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch employees'
      })
    }
  },
  {
    maxAge: 30, // Cache for 5 minutes
    getKey: (event) => {
      const query = getQuery(event)
      return `employees-${JSON.stringify(query)}`
    },
    shouldBypassCache: () => process.env.NODE_ENV !== 'production'
  }
)
