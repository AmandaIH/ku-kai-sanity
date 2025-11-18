import { createSanityClient, commonFields, ctaReferences, getTranslationsQuery } from '../../../utils/sanity'

export default cachedEventHandler(
  async (event) => {
    try {
      const query = getQuery(event)
      const limit = parseInt(query.limit as string) || 10
      const offset = parseInt(query.offset as string) || 0
      const path = query.path as string
      const language = query.language as string || 'da' // Default to Danish

      // If path is provided, lookup single article by slug
      if (path) {
        // Strip leading slash and remove language prefix from path
        let cleanPath = path.startsWith('/') ? path.slice(1) : path
        
        // Remove language prefix from path (e.g., "en/article-slug" -> "article-slug")
        // Sanity slugs don't include language prefixes
        const languagePrefixPattern = /^[a-z]{2}\//;
        if (languagePrefixPattern.test(cleanPath)) {
          cleanPath = cleanPath.replace(languagePrefixPattern, '');
        }
        
        const groqQuery = `
          *[_type == "article" && slug.current == $path && language == $language][0] {
            ${commonFields},
            ${ctaReferences},
            ${getTranslationsQuery('article')}
          }
        `

        const sanityClient = createSanityClient()
        const article = await sanityClient.fetch(groqQuery, { path: cleanPath, language })

        if (!article) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Article not found'
          })
        }

        return {
          data: article,
          meta: {
            language
          }
        }
      }

      // Base query for articles with language filter
      let groqQuery = `
        *[_type == "article" && language == $language] {
          ${commonFields},
          ${ctaReferences},
          ${getTranslationsQuery('article')}
        }
      `

      // Add ordering and pagination
      // Use _id as secondary sort to ensure deterministic ordering and prevent duplicates
      groqQuery += ` | order(coalesce(date, _createdAt) desc, _id desc) [${offset}...${offset + limit}]`

      const sanityClient = createSanityClient()
      
      // Fetch articles and total count in parallel
      const [articles, totalCount] = await Promise.all([
        sanityClient.fetch(groqQuery, { language }),
        sanityClient.fetch(`count(*[_type == "article" && language == $language])`, { language })
      ])

      return {
        data: articles,
        meta: {
          limit,
          offset,
          total: totalCount,
          language
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