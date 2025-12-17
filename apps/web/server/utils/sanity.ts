import { createClient } from '@sanity/client'

// Initialize Sanity client
export const createSanityClient = () => {
  // Access runtime config directly in server context
  const config = useRuntimeConfig()
  const sanityConfig = config.sanity as {
    projectId: string
    dataset: string
    apiVersion: string
  }
  
  // Check if projectId is available
  if (!sanityConfig?.projectId) {
    // During build time, return a mock client to prevent build failures
    if (process.env.NODE_ENV === 'production' && !process.env.SANITY_STUDIO_PROJECT_ID) {
      console.warn('Sanity projectId is not configured. Using mock client for build.')
      return {
        fetch: () => Promise.resolve(null),
        getDocument: () => Promise.resolve(null),
        getDocuments: () => Promise.resolve([]),
        create: () => Promise.resolve(null),
        createOrReplace: () => Promise.resolve(null),
        patch: () => Promise.resolve(null),
        delete: () => Promise.resolve(null),
      } as any
    }
    throw new Error('Sanity projectId is not configured. Please set SANITY_STUDIO_PROJECT_ID environment variable.')
  }
  
  // Allow bypassing CDN cache via query parameter or environment variable
  // This helps when new content is published and needs to be immediately available
  const bypassCdn = process.env.SANITY_BYPASS_CDN === 'true' || false
  
  return createClient({
    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
    apiVersion: sanityConfig.apiVersion,
    useCdn: !bypassCdn, // Use CDN for better performance, but allow bypassing for fresh content
    // Add cache revalidation - Sanity CDN typically caches for a few seconds to minutes
    // Setting a shorter perspective helps ensure fresh content
    perspective: 'published', // Only fetch published content
    // Add request tag for cache revalidation (if supported by Sanity)
    requestTagPrefix: 'kukai-ramen',
  })
}

// Common GROQ query fragments
export const commonFields = `
  _id,
  _type,
  title,
  slug,
  language,
  metaDescription,
  featuredImage,
  date,
  headline,
  bodyText,
  heroText,
  heroCtas,
  content,
  seo,
  settings,
  darkHeader,
  authorId,
  _createdAt,
  _updatedAt
`

// Function to expand CTAs with internal link data
export const ctaReferences = `
  content[]{
    ...,
    ctas[]{
      ...,
      internalLink->{
        _id,
        _type,
        title,
        slug
      }
    },
    items[]{
      ...,
      ctas[]{
        ...,
        internalLink->{
          _id,
          _type,
          title,
          slug
        }
      }
    },
    linkItems[]{
      ...,
      ctaButton{
        ...,
        internalLink->{
          _id,
          _type,
          title,
          slug
        }
      }
    },
    employeeCollection[]->{
      _id,
      _type,
      name,
      jobTitle,
      picture,
      emailAddress,
      phoneNumber
    }
  },
  heroCtas[]{
    ...,
    internalLink->{
      _id,
      _type,
      title,
      slug
    }
  }
`

// Function to get translations for a document
export const getTranslationsQuery = (documentType: string) => `
  "_translations": *[_type == "translation.metadata" && references(^._id)].translations[]{
    value->{
      _id,
      _type,
      title,
      slug,
      language,
      seo
    }
  }
`
