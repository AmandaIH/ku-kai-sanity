import { createSanityClient } from '../../utils/sanity'

export default cachedEventHandler(
  async (event) => {
    try {
      const query = getQuery(event)
      const menuSlug = query.slug as string

      // Validate menuSlug format if provided
      if (menuSlug && typeof menuSlug !== 'string') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid menu slug format'
        })
      }

      // Build dynamic GROQ query with conditional filters
      const filterClause = menuSlug ? ` && slug.current == $menuSlug` : ''
      const limitClause = menuSlug ? '[0]' : ''
      
      const groqQuery = `
        *[_type == "menu"${filterClause}]${limitClause} {
          _id,
          title,
          slug,
          menuItems[]{
            ...,
            internalLink->{
              _id,
              _type,
              title,
              slug
            },
            children[]{
              ...,
              internalLink->{
                _id,
                _type,
                title,
                slug
              },
              children[]{
                ...,
                internalLink->{
                  _id,
                  _type,
                  title,
                  slug
                }
              }
            }
          }
        }
      `

      const sanityClient = createSanityClient()
      const result = await sanityClient.fetch(groqQuery, { menuSlug })

      // Transform the Sanity menu data to match the expected structure
      const transformMenu = (menu: any) => {
        if (!menu || !menu.menuItems) return []
        
        // Define types for better TypeScript support
        interface MenuItem {
          ID: string
          title: string
          url: string
          _type: string
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
            url = internalLink.slug?.current ? `/${internalLink.slug.current}` : '/'
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
      const menuSlug = query.slug || 'all'
      return `menus-${menuSlug}`
    },
    shouldBypassCache: () => process.env.NODE_ENV !== 'production'
  }
) 