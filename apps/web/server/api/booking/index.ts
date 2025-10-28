import { createSanityClient } from '../../utils/sanity'

export default defineEventHandler(async (event) => {
  try {
    const sanityClient = createSanityClient()
    
    const query = `
      *[_type == "booking"][0] {
        _id,
        title,
        metaDescription,
        welcomeTitle,
        backgroundImage {
          asset->{
            _id,
            url
          },
          alt
        },
        backgroundOverlay {
          opacity,
          color
        },
        formSettings {
          usernamePlaceholder,
          passwordPlaceholder,
          loginButtonText,
          loadingText
        }
      }
    `

    const bookingData = await sanityClient.fetch(query)
    
    return {
      success: true,
      data: bookingData || null
    }
  } catch (error) {
    console.error('Error fetching booking page data:', error)
    return {
      success: false,
      error: 'Failed to fetch booking page data',
      data: null
    }
  }
})
