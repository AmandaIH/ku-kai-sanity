import { createSanityClient } from '../utils/sanity'

// Import internationalization configuration
import { INTERNATIONALIZATION_CONFIG } from '../../../studio/config/internationalization'

export default cachedEventHandler(
  async (event) => {
    try {
      const query = getQuery(event)
      const language = query.language as string || INTERNATIONALIZATION_CONFIG.defaultLanguage

      // Validate that the requested language is supported
      const supportedLanguage = INTERNATIONALIZATION_CONFIG.getLanguageById(language)
      if (!supportedLanguage) {
        throw createError({
          statusCode: 400,
          statusMessage: `Unsupported language: ${language}. Supported languages: ${INTERNATIONALIZATION_CONFIG.supportedLanguages.map(l => l.id).join(', ')}`
        })
      }

      // Query to get the single siteSettings document with frontpage and its translations
      const groqQuery = `
        {
          "siteSettings": *[_type == "siteSettings"] {
            _id,
            _type,
            siteTitle,
            siteDescription,
            logos,
            companyInfo,
            frontpage->{
              _id,
              _type,
              title,
              slug,
              language
            }
          }[0]
        }
      `
      
      // First, get the siteSettings and frontpage
      const sanityClient = createSanityClient()
      const result = await sanityClient.fetch(groqQuery)
      
      if (!result.siteSettings) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Site settings not found. Please create a siteSettings document in Sanity Studio.'
        })
      }
      
      // If there's a frontpage, get its translations using the translation.metadata system
      let frontpageTranslations: any[] = []
      if (result.siteSettings.frontpage?._id) {
        const frontpageId = result.siteSettings.frontpage._id
        
        // First, try to find translations via translation.metadata
        // Find the metadata document that references the frontpage, then get all its translations
        const translationsQuery = `
          *[_type == "translation.metadata" && references($frontpageId)][0].translations[]{
            value->{
              _id,
              _type,
              title,
              slug,
              language
            }
          }
        `
        const translations = await sanityClient.fetch(translationsQuery, { frontpageId })
        
        if (translations && translations.length > 0) {
          frontpageTranslations = translations
        } else {
          // Fallback: if translation.metadata doesn't exist, try to find pages with similar slugs
          // This handles cases where pages might not be linked via translation.metadata
          const frontpageSlug = result.siteSettings.frontpage.slug?.current || ''
          const fallbackQuery = `
            *[_type == "page" && (
              slug.current == $frontpageSlug || 
              slug.current == "" || 
              slug.current == "/" ||
              defined(slug.current) == false
            )] {
              _id,
              _type,
              title,
              slug,
              language
            }
          `
          const fallbackPages = await sanityClient.fetch(fallbackQuery, { frontpageSlug })
          if (fallbackPages && fallbackPages.length > 0) {
            frontpageTranslations = fallbackPages.map((page: any) => ({ value: page }))
          }
        }
        
        // Always include the original frontpage in translations if it's not already there
        const hasOriginal = frontpageTranslations.some((t: any) => t.value?._id === frontpageId)
        if (!hasOriginal && result.siteSettings.frontpage) {
          frontpageTranslations.push({ value: result.siteSettings.frontpage })
        }
      }

      // Add translations to the frontpage
      const siteSettings = {
        ...result.siteSettings,
        frontpage: result.siteSettings.frontpage ? {
          ...result.siteSettings.frontpage,
          _translations: frontpageTranslations
        } : null
      }

      return {
        data: siteSettings,
        meta: {
          language,
          supportedLanguages: INTERNATIONALIZATION_CONFIG.supportedLanguages,
          defaultLanguage: INTERNATIONALIZATION_CONFIG.defaultLanguage,
          isSharedSingleton: true
        }
      }
    } catch (error: any) {
      console.error('Error fetching site settings:', error)
      
      // Re-throw if it's already a Nuxt error
      if (error.statusCode) {
        throw error
      }
      
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch site settings'
      })
    }
  },
  {
    maxAge: 60, // Cache for 10 minutes (longer cache since site settings don't change often)
    getKey: (event) => {
      const query = getQuery(event)
      return `init-${query.language || INTERNATIONALIZATION_CONFIG.defaultLanguage}`
    }
  }
) 