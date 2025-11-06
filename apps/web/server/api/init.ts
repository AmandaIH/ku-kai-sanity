import { createSanityClient } from '../utils/sanity'
import { defineEventHandler, getQuery, createError } from 'h3'

export default defineEventHandler(async (event) => {
    try {
      const query = getQuery(event)

      // Query to get the single siteSettings document with frontpage
      const groqQuery = `
        {
          "siteSettings": *[_type == "siteSettings"] {
            _id,
            _type,
            siteTitle,
            siteDescription,
            logos,
            companyInfo {
              companyCvr,
              companyEmail,
              location1 {
                companyName,
                address,
                zipCode,
                city,
                phone,
                email
              },
              location2 {
                companyName,
                address,
                zipCode,
                city,
                phone,
                email
              },
              location3 {
                companyName,
                phone,
                email
              }
            },
            socialMediaChannels,
            frontpage->{
              _id,
              _type,
              title,
              slug
            }
          }[0]
        }
      `

      const sanityClient = createSanityClient()
      const result = await sanityClient.fetch(groqQuery)

      if (!result.siteSettings) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Site settings not found. Please create a siteSettings document in Sanity Studio.'
        })
      }

      return {
        data: result.siteSettings,
        meta: {
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
}) 