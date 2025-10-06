import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'

// Create DOMPurify instance for server-side use
const window = new JSDOM('').window
const purify = DOMPurify(window as any)

// Sanitization function
const sanitizeInput = (input: string): string => {
  if (!input) return ''
  return purify.sanitize(input, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  }).trim()
}

export default defineEventHandler(async (event) => {
  // Only allow POST requests
  if (getMethod(event) !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method Not Allowed'
    })
  }

  try {
    // Get the form data from the request body
    const body = await readBody(event)
    
    // Sanitize all input fields
    const sanitizedData = {
      contactPerson: sanitizeInput(body.contactPerson || ''),
      email: sanitizeInput(body.email || ''),
      containerSize: sanitizeInput(body.containerSize || ''),
      transportType: sanitizeInput(body.transportType || ''),
      pickupLocation: sanitizeInput(body.pickupLocation || ''),
      destination: sanitizeInput(body.destination || ''),
      notes: sanitizeInput(body.notes || ''),
      privacyConsent: body.privacyConsent || false
    }
    
    // Validate required fields using sanitized data
    const requiredFields: (keyof typeof sanitizedData)[] = ['contactPerson', 'email', 'pickupLocation', 'destination']
    for (const field of requiredFields) {
      if (!sanitizedData[field] || sanitizedData[field].trim() === '') {
        throw createError({
          statusCode: 400,
          statusMessage: `Missing required field: ${field}`
        })
      }
    }

    // Validate email format using sanitized data
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitizedData.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }


    // Return success response
    return {
      success: true,
      message: 'Form submitted successfully',
      timestamp: new Date().toISOString()
    }

  } catch (error: any) {
    // Return error response
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error'
    })
  }
})
