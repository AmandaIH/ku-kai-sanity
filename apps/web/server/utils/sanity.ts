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
  
  return createClient({
    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
    apiVersion: sanityConfig.apiVersion,
    useCdn: true, // Use CDN for better performance
  })
}

// Common GROQ query fragments
export const commonFields = `
  _id,
  _type,
  title,
  slug,
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
