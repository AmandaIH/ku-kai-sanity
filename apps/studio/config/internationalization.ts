// Internationalization configuration
export const INTERNATIONALIZATION_CONFIG = {
  // Supported languages
  supportedLanguages: [
    { id: 'da', title: 'Danish' },
    { id: 'en', title: 'English' }
  ],
  
  // Schema types that support internationalization
  schemaTypes: ['page', 'article', 'menu', 'portfolio', 'solutions'],
  
  // Schema types that are singletons (only one instance per language)
  singletonSchemaTypes: ['siteSettings'],
  
  // Default language
  defaultLanguage: 'da',
  
  // Get regular document types (non-singletons)
  get regularDocumentTypes() {
    return this.schemaTypes.filter(type => !this.singletonSchemaTypes.includes(type as any))
  },
  
  // Get language by ID
  getLanguageById(id: string) {
    return this.supportedLanguages.find(lang => lang.id === id)
  },
  
  // Get language title by ID
  getLanguageTitle(id: string) {
    return this.getLanguageById(id)?.title || id
  }
}

// Type exports for TypeScript
export type SupportedLanguage = { id: 'da' | 'en'; title: string }
export type SchemaType = 'page' | 'article' | 'menu' | 'portfolio' | 'solutions'
export type SingletonSchemaType = 'siteSettings'

