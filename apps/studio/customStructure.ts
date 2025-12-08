import type { StructureBuilder } from 'sanity/structure'
import { INTERNATIONALIZATION_CONFIG } from './config/internationalization'

export const structure = (S: StructureBuilder) => {
  return S.list()
    .title('Content')
    .items([
      // Site Settings as shared singleton (no language filtering)
      ...INTERNATIONALIZATION_CONFIG.singletonSchemaTypes.map((schemaType: string) => 
        S.listItem()
          .id(schemaType)
          .title(getSchemaTitle(schemaType))
          .child(
            S.documentTypeList(schemaType)
              .title(getSchemaTitle(schemaType))
              .filter(`_type == "${schemaType}"`)
              .apiVersion('v2025-07-24')
          )
      ),
      
      // Divider after singletons
      ...(INTERNATIONALIZATION_CONFIG.singletonSchemaTypes.length > 0 ? [S.divider()] : []),
      
      // Internationalized document types with language filtering
      ...INTERNATIONALIZATION_CONFIG.regularDocumentTypes.map((schemaType: string) => 
        S.listItem()
          .id(schemaType)
          .title(getSchemaTitle(schemaType))
          .child(
            S.list()
              .title(getSchemaTitle(schemaType))
              .items([
                // All documents (only show if more than one language)
                ...(INTERNATIONALIZATION_CONFIG.supportedLanguages.length > 1 ? [
                  S.listItem()
                    .id(`${schemaType}-all`)
                    .title('All')
                    .child(
                      S.documentTypeList(schemaType)
                        .title('All')
                        .filter(`_type == "${schemaType}"`)
                        .apiVersion('v2025-07-24')
                    )
                ] : []),
                
                // Language-specific lists
                ...INTERNATIONALIZATION_CONFIG.supportedLanguages.map((lang: any) => 
                  S.listItem()
                    .id(`${schemaType}-${lang.id}`)
                    .title(lang.title)
                    .child(
                      S.documentTypeList(schemaType)
                        .title(lang.title)
                        .filter(`_type == "${schemaType}" && language == "${lang.id}"`)
                        .apiVersion('v2025-07-24')
                    )
                )
              ])
          )
      ),
      
      // Divider before media
      S.divider(),
      
      // Media
      S.listItem()
        .id('media')
        .title('Media')
        .child(
          S.list()
            .title('Media')
            .items([
              S.listItem()
                .id('images')
                .title('Images')
                .child(
                  S.documentTypeList('sanity.imageAsset')
                    .title('Images')
                ),
              S.listItem()
                .id('files')
                .title('Files & Videos')
                .child(
                  S.documentTypeList('sanity.fileAsset')
                    .title('Files & Videos')
                )
            ])
        ),
    ])
}

/**
 * Get a human-readable title for a schema type
 */
function getSchemaTitle(schemaType: string): string {
  const titles: Record<string, string> = {
    page: 'Pages',
    siteSettings: 'Site Settings',
    menu: 'Menus'
  }
  
  return titles[schemaType] || schemaType.charAt(0).toUpperCase() + schemaType.slice(1) + 's'
} 