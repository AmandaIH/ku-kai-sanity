import type { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) => {
  return S.list()
    .title('Content')
    .items([
      // Site Settings
      S.listItem()
        .id('siteSettings')
        .title('Site Settings')
        .child(
          S.documentTypeList('siteSettings')
            .title('Site Settings')
            .filter(`_type == "siteSettings"`)
            .apiVersion('v2025-07-24')
        ),
      
      // Divider after singletons
      S.divider(),
      
      // Document types
      S.listItem()
        .id('pages')
        .title('Pages')
        .child(
          S.documentTypeList('page')
            .title('Pages')
            .filter(`_type == "page"`)
            .apiVersion('v2025-07-24')
        ),
      
      S.listItem()
        .id('articles')
        .title('Articles')
        .child(
          S.documentTypeList('article')
            .title('Articles')
            .filter(`_type == "article"`)
            .apiVersion('v2025-07-24')
        ),
      
      S.listItem()
        .id('services')
        .title('Services')
        .child(
          S.documentTypeList('solutions')
            .title('Services')
            .filter(`_type == "solutions"`)
            .apiVersion('v2025-07-24')
        ),

      
      S.listItem()
        .id('menus')
        .title('Menus')
        .child(
          S.documentTypeList('menu')
            .title('Menus')
            .filter(`_type == "menu"`)
            .apiVersion('v2025-07-24')
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