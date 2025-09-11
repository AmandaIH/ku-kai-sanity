// Import schema definitions from the studio
import { page } from '../../../../studio/schemaTypes/page'
import { article } from '../../../../studio/schemaTypes/article'
import { siteSettings } from '../../../../studio/schemaTypes/siteSettings'
import { menu } from '../../../../studio/schemaTypes/menu'
import { ctaButton, commonFields } from '../../../../studio/schemaTypes/common'
import * as blocks from '../../../../studio/schemaTypes/blocks'

// Helper function to extract field information
const extractFieldInfo = (field: any) => {
  const fieldInfo: any = {
    name: field.name,
    title: field.title,
    type: field.type,
    description: field.description || null,
    validation: field.validation ? 'Has validation' : null,
    initialValue: field.initialValue || null,
    hidden: field.hidden ? 'Conditional visibility' : null,
    group: field.group || null
  }

  // Handle options
  if (field.options) {
    if (field.options.list) {
      fieldInfo.options = field.options.list
    }
    if (field.options.source) {
      fieldInfo.options = 'Dynamic source'
    }
    if (field.options.hotspot) {
      fieldInfo.options = 'Hotspot enabled'
    }
    if (field.options.accept) {
      fieldInfo.options = `Accepts: ${field.options.accept}`
    }
  }

  // Handle array fields
  if (field.type === 'array' && field.of) {
    fieldInfo.of = field.of.map((item: any) => {
      const itemInfo: any = {
        type: item.type || item.name,
        title: item.title || item.name
      }
      
      // If the array item is an object with fields, extract those fields too
      if (item.type === 'object' && item.fields) {
        itemInfo.fields = item.fields.map(extractFieldInfo)
      }
      
      return itemInfo
    })
  }

  // Handle object fields
  if (field.type === 'object' && field.fields) {
    fieldInfo.fields = field.fields.map(extractFieldInfo)
  }

  return fieldInfo
}

// Helper function to process schema object
const processSchema = (schema: any, category: string) => {
  return {
    name: schema.name,
    title: schema.title,
    type: schema.type,
    description: schema.description || null,
    category,
    groups: schema.groups ? schema.groups.map((group: any) => ({
      name: group.name,
      title: group.title,
      default: group.default || false
    })) : [],
    fields: schema.fields ? schema.fields.map(extractFieldInfo) : [],
    preview: schema.preview ? {
      select: schema.preview.select,
      prepare: 'Function'
    } : null
  }
}

export default defineEventHandler(async (event) => {
  try {
    // Process document schemas
    const documents = [
      processSchema(page, 'document'),
      processSchema(article, 'document'),
      processSchema(siteSettings, 'document'),
      processSchema(menu, 'document')
    ]

    // Process common types
    const commonTypes = [
      processSchema(ctaButton, 'common')
    ]

    // Process content blocks
    const contentBlocks = [
      processSchema(blocks.heroBlock, 'block'),
      processSchema(blocks.heroSmallBlock, 'block'),
      processSchema(blocks.textBlock, 'block'),
      processSchema(blocks.accordionBlock, 'block'),
      processSchema(blocks.archiveBlock, 'block'),
      processSchema(blocks.employeesBlock, 'block'),
      processSchema(blocks.textAndImageBlock, 'block'),
      processSchema(blocks.textAndVideoBlock, 'block'),
      processSchema(blocks.sliderBlock, 'block'),
      processSchema(blocks.numbersBlock, 'block'),
      processSchema(blocks.linkBlock, 'block')
    ]

    // Process common fields
    const commonFieldDefinitions = Object.entries(commonFields).map(([key, field]) => ({
      name: key,
      ...extractFieldInfo(field)
    }))

    // Set CORS headers
    setResponseHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json'
    })

    return {
      documents,
      commonTypes,
      contentBlocks,
      commonFields: commonFieldDefinitions,
      metadata: {
        source: 'studio-schema-definitions',
        description: 'Schema definitions imported directly from studio folder',
        timestamp: new Date().toISOString(),
        totalSchemas: documents.length + commonTypes.length + contentBlocks.length
      } 
    }
  } catch (error) {
    console.error('Error processing schema definitions:', error)
    
    setResponseStatus(event, 500)
    return {
      success: false,
      error: 'Failed to process schema definitions',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }
  }
}) 