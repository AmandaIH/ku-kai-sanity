#!/usr/bin/env node

/**
 * Script to update existing solutions documents to services type
 * Run this with: node update-document-types.js
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  apiVersion: process.env.SANITY_STUDIO_API_VERSION || '2025-07-24',
  token: process.env.SANITY_TOKEN, // You'll need to set this
  useCdn: false
})

async function updateDocumentTypes() {
  try {
    console.log('🔍 Fetching all solutions documents...')
    
    // Get all solutions documents
    const solutions = await client.fetch('*[_type == "solutions"]')
    console.log(`Found ${solutions.length} solutions documents`)
    
    if (solutions.length === 0) {
      console.log('No solutions documents found.')
      return
    }
    
    console.log('📝 Updating document types from solutions to services...')
    
    // Update each document's _type
    for (const solution of solutions) {
      console.log(`Updating: ${solution.title || solution._id}`)
      
      // Update the document type
      await client
        .patch(solution._id)
        .set({ _type: 'services' })
        .commit()
      
      console.log(`✅ Updated: ${solution.title || solution._id}`)
    }
    
    console.log('🎉 Migration completed successfully!')
    console.log(`✅ Updated ${solutions.length} documents to services type`)
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
updateDocumentTypes()
