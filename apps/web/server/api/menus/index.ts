import { createSanityClient } from '../../utils/sanity'
import { INTERNATIONALIZATION_CONFIG } from '../../../../studio/config/internationalization'

export default cachedEventHandler(
  async (event) => {
    try {
      const query = getQuery(event)
      const language = query.language as string
      const menuSlug = query.slug as string // e.g., "main-menu-en"

      // If language is specified, validate it
      if (language) {
        const supportedLanguage = INTERNATIONALIZATION_CONFIG.getLanguageById(language)
        if (!supportedLanguage) {
          throw createError({
            statusCode: 400,
            statusMessage: `Unsupported language: ${language}. Supported languages: ${INTERNATIONALIZATION_CONFIG.supportedLanguages.map(l => l.id).join(', ')}`
          })
        }
      }

      // Validate menuSlug format if provided
      if (menuSlug && typeof menuSlug !== 'string') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid menu slug format'
        })
      }

      // Build dynamic GROQ query with conditional filters
      const filters = []
      if (menuSlug) filters.push('slug.current == $menuSlug')
      if (language && !menuSlug) filters.push('language == $language')
      
      const filterClause = filters.length > 0 ? ` && ${filters.join(' && ')}` : ''
      const limitClause = menuSlug ? '[0]' : ''
      
      const groqQuery = `
        *[_type == "menu"${filterClause}]${limitClause} {
          _id,
          title,
          slug,
          language,
          menuItems[]{
            ...,
            internalLink->{
              _id,
              _type,
              title,
              slug,
              language
            },
            children[]{
              ...,
              internalLink->{
                _id,
                _type,
                title,
                slug,
                language
              },
              children[]{
                ...,
                internalLink->{
                  _id,
                  _type,
                  title,
                  slug,
                  language
                }
              }
            }
          }
        }
      `

      const sanityClient = createSanityClient()
      const result = await sanityClient.fetch(groqQuery, { menuSlug, language })

      // Transform the Sanity menu data to match the expected structure
      const transformMenu = (menu: any) => {
        if (!menu || !menu.menuItems) return []
        
        // Define types for better TypeScript support
        interface MenuItem {
          ID: string
          title: string
          url: string
          _type: string
          linkType?: string
          reference: any
          isExternal: boolean
          openInNewTab: boolean
          children: MenuItem[]
        }
        
        // Recursive function to transform menu items
        const transformMenuItem = (item: any): MenuItem | null => {
          const linkType = item.linkType
          const internalLink = item.internalLink
          const externalUrl = item.externalUrl
          const externalTitle = item.externalTitle
          
          let url = ''
          let title = ''
          let id = ''
          let type = ''
          
          if (linkType === 'external' && externalUrl) {
            // External URL
            url = externalUrl
            title = externalTitle || externalUrl // Use title if provided, otherwise fallback to URL
            type = 'external'
          } else if (linkType === 'internal' && internalLink) {
            // Internal link
            title = internalLink.title
            id = internalLink._id
            type = internalLink._type
            
            // Construct URL - slugs already include language prefix (e.g., "en/services")
            const pageLanguage = internalLink.language || language || 'da'
            const slug = internalLink.slug?.current || ''
            
            if (!slug || slug === '/' || slug === '') {
              // Frontpage - no prefix for default locale, prefix for others
              url = pageLanguage === 'da' ? '/' : `/${pageLanguage}/`
            } else {
              // Check if slug already contains a language prefix
              const languagePrefixPattern = /^[a-z]{2}\//
              const hasLanguagePrefix = languagePrefixPattern.test(slug)
              
              if (hasLanguagePrefix) {
                // Slug already has language prefix (e.g., "en/services"), use as-is
                url = slug.startsWith('/') ? slug : `/${slug}`
              } else {
                // Slug doesn't have language prefix, add it for non-default locales
                const cleanSlug = slug.startsWith('/') ? slug.substring(1) : slug
                url = pageLanguage === 'da' ? `/${cleanSlug}` : `/${pageLanguage}/${cleanSlug}`
              }
            }
          } else {
            // Skip items with incomplete configuration
            return null
          }
          
          // Transform children recursively
          const children: MenuItem[] = []
          if (item.children && Array.isArray(item.children)) {
            item.children.forEach((child: any) => {
              const transformedChild = transformMenuItem(child)
              if (transformedChild) {
                children.push(transformedChild)
              }
            })
          }
          
          return {
            ID: id,
            title: title,
            url: url,
            _type: type,
            linkType: linkType, // Add linkType for filtering
            reference: internalLink || null,
            isExternal: linkType === 'external',
            openInNewTab: !!item.openInNewTab,
            children: children
          }
        }
        
        // Transform all top-level menu items
        const transformedItems: MenuItem[] = []
        menu.menuItems.forEach((item: any) => {
          const transformedItem = transformMenuItem(item)
          if (transformedItem) {
            transformedItems.push(transformedItem)
          }
        })
        
        return transformedItems
      }

      if (menuSlug) {
        // Return single menu
        if (!result) {
          throw createError({
            statusCode: 404,
            statusMessage: `Menu with slug "${menuSlug}" not found`
          })
        }
        
        return {
          data: transformMenu(result),
          meta: {
            menuSlug,
            menuTitle: result.title,
            language: result.language,
            count: result.menuItems?.length || 0,
            isSingleMenu: true
          }
        }
      } else {
        // Return all menus with their slugs as keys
        const menusBySlug: Record<string, any> = {}
        
        if (Array.isArray(result)) {
          result.forEach((menu: any) => {
            menusBySlug[menu.slug.current] = transformMenu(menu)
          })
        }
        
        return {
          data: menusBySlug,
          meta: {
            language: language || 'all',
            menuCount: Object.keys(menusBySlug).length,
            isSingleMenu: false
          }
        }
      }
    } catch (error: any) {
      console.error('Error fetching menus:', error)
      
      // Re-throw if it's already a Nuxt error
      if (error.statusCode) {
        throw error
      }
      
      // Handle specific Sanity errors
      if (error.message?.includes('GROQ')) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid query parameters'
        })
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch menus',
        data: {
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      })
    }
  },
  {
    maxAge: 600, // Cache for 10 minutes (longer cache since menus don't change often)
    getKey: (event) => {
      const query = getQuery(event)
      const language = query.language || 'all'
      const menuSlug = query.slug || 'all'
      return `menus-${language}-${menuSlug}`
    },
    shouldBypassCache: () => process.env.NODE_ENV !== 'production'
  }
) 