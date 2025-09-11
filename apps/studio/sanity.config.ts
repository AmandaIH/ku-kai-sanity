import {defineConfig, defineField} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {media, mediaAssetSource} from 'sanity-plugin-media'
import {schemaTypes} from './schemaTypes'
import {structure} from './customStructure'

// Load environment variables from .env file

export default defineConfig({
  name: 'default',
  title: 'Thylander',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,

  apiVersion: 'v2025-07-24',

  // plugins
  plugins: [
    structureTool({
      structure: structure
    }), 
    visionTool(), 
    media()
  ],
  form: {
    image: {
      assetSources: previousAssetSources => [mediaAssetSource]
    }
  },
  schema: {
    types: schemaTypes,
  },
})
