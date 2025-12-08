import {defineConfig, defineField} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {media, mediaAssetSource} from 'sanity-plugin-media'
import {documentInternationalization} from '@sanity/document-internationalization'
import {schemaTypes} from './schemaTypes'
import {structure} from './customStructure'
import {INTERNATIONALIZATION_CONFIG} from './config/internationalization'

// Load environment variables from .env file

export default defineConfig({
  name: 'default',
  title: 'Ku-Kai ramen',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID!,
  dataset: process.env.SANITY_STUDIO_DATASET!,

  apiVersion: 'v2025-07-24',

  // plugins
  plugins: [
    structureTool({
      structure: structure
    }), 
    visionTool(), 
    media(),
    documentInternationalization({
      // Required configuration
      supportedLanguages: INTERNATIONALIZATION_CONFIG.supportedLanguages,
      schemaTypes: INTERNATIONALIZATION_CONFIG.schemaTypes,
      // Adds additional fields to the metadata document
      metadataFields: [
        defineField({ name: 'slug', type: 'slug' }),
      ],
    })
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
