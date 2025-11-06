import { useCoreStore } from "~/stores/core";
import { useI18n } from "#i18n";

/**
 * Interface for SEO data structure
 */
interface SeoData {
  title?: string;
  og_title?: string;
  og_description?: string;
  og_image?: Array<{
    _type: string;
    url: string;
    [key: string]: any;
  }>;
  og_url?: string;
  robots?: {
    noindex?: boolean;
    nofollow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
  };
  keywords?: string[];
  author?: string;
  publishedAt?: string;
  modifiedAt?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: {
    _type: string;
    url: string;
    [key: string]: any;
  };
  twitterSite?: string;
  twitterCreator?: string;
  structuredData?: string;
  alternateLanguages?: Array<{
    language: string;
    url: string;
  }>;
}

/**
 * Interface for page data structure
 */
interface PageData {
  _id: string;
  _type: string;
  title: string;
  slug: {
    _type: string;
    current: string;
  };
  language: string;
  metaDescription?: string;
  featuredImage?: any;
  content?: any;
  seo?: SeoData;
  _createdAt: string;
  _updatedAt: string;
  _translations?: any[];
}

/**
 * Interface for frontpage settings
 */
interface FrontpageSettings {
  _id: string;
  _type: string;
  title: string;
  slug: {
    _type: string;
    current: string;
  };
  language: string;
  seo?: SeoData;
  _translations?: Array<{
    value: {
      _id: string;
      _type: string;
      title: string;
      slug: {
        _type: string;
        current: string;
      };
      language: string;
      seo?: SeoData;
    };
  }>;
}

/**
 * Interface for site settings
 */
interface SiteSettings {
  _id: string;
  _type: string;
  siteTitle: string;
  siteDescription: string;
  logo?: any;
  favicon?: any;
  frontpage?: FrontpageSettings;
  companyInfo?: {
    companyCvr?: string;
    companyEmail?: string;
    location1?: {
      companyName?: string;
      address?: string;
      zipCode?: string;
      city?: string;
      phone?: string;
      email?: string;
    };
    location2?: {
      companyName?: string;
      address?: string;
      zipCode?: string;
      city?: string;
      phone?: string;
      email?: string;
    };
    location3?: {
      companyName?: string;
      phone?: string;
      email?: string;
    };
  };
  socialMediaChannels?: {
    linkedin?: string;
    instagram?: string;
  };
  [key: string]: any;
}

/**
 * Interface for API response
 */
interface ApiResponse {
  data: PageData;
  meta: {
    language: string;
    limit?: number;
    offset?: number;
    total?: number;
  };
}

/**
 * Options interface for useCheckmateSingle composable
 */
interface CheckmateSingleOptions {
  path?: string;
  language?: string;
}

/**
 * Helper function to detect document type from path using conventions
 * Convention: /articles/slug -> article, /solutions/slug -> solutions, etc.
 */
function detectDocumentType(path: string): { documentType: string; apiEndpoint: string } {
  if (!path) {
    return { documentType: 'page', apiEndpoint: '/api/documents/pages' };
  }

  // Remove leading slash and language prefix for detection
  let cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Remove language prefix (en/, da/, etc.) to get clean path
  const languagePrefixPattern = /^[a-z]{2}\//;
  if (languagePrefixPattern.test(cleanPath)) {
    cleanPath = cleanPath.replace(languagePrefixPattern, '');
  }

  // Look for document type patterns: articles/, solutions/, etc.
  const documentTypeMatch = cleanPath.match(/^([a-z]+)\//);
  if (documentTypeMatch && documentTypeMatch[1]) {
    const pathType = documentTypeMatch[1];
    
    // Map path prefixes to document types
    const typeMapping: { [key: string]: string } = {
      'articles': 'article',
      'solutions': 'solutions',
      'pages': 'page',
      'portfolios': 'portfolio'
    };
    
    const documentType = typeMapping[pathType] || 'page';
    return {
      documentType: documentType,
      apiEndpoint: '/api/documents/pages' // Use unified pages endpoint
    };
  }

  // Default to page
  return { documentType: 'page', apiEndpoint: '/api/documents/pages' };
}

/**
 * Composable that can be used to set up page components for Singles.
 * Fetches page data from Sanity CMS based on current route or provided path.
 * Automatically handles frontpage detection by checking site settings.
 * Supports language-specific frontpage slugs from translations.
 * Uses convention-based document type detection (article/ -> article, product/ -> product).
 *
 * @version 2.2.0
 *
 * @example
 * // Basic usage - auto-detects document type from route
 * // /article/my-article -> uses article document type and /api/documents/articles
 * // /product/item -> uses product document type and /api/documents/products  
 * // /about -> uses page document type and /api/documents/pages
 * const { page, pending, error } = await useCheckmateSingle();
 * 
 * @example
 * // With custom path and language
 * const { page, pending, error } = await useCheckmateSingle({
 *   path: '/article/my-article',
 *   language: 'en'
 * });
 *
 * @param options - Configuration options for the API call
 */
export async function useCheckmateSingle(options: CheckmateSingleOptions = {}) {
    const store = useCoreStore();
    const { locale } = useI18n();

    // Set up reactive variables
    const page = ref<PageData | null>(null);
    const loading = ref(true);

    // Get the current path from route if not provided
    let path = options.path || useRoute().path;
    const language = options.language || locale.value;
    
    // Auto-detect document type using convention-based detection
    const { documentType, apiEndpoint } = detectDocumentType(path);

    // Check if we're on the frontpage (empty path or just '/')
    const isFrontpage = !path || path === '/' || path === '';

    if (isFrontpage) {
        // Get frontpage slug from settings
        const settings = store.getSettings as SiteSettings;

        if (settings?.frontpage?.slug?.current) {
            // Check if we need to use a language-specific slug from translations
            const frontpage = settings.frontpage;
            let frontpageSlug = frontpage.slug.current;
            
            // If the current language doesn't match the frontpage language, 
            // look for the translation with the correct slug
            if (frontpage.language !== language && frontpage._translations) {
                const translation = frontpage._translations.find(t => t.value.language === language);
                if (translation?.value.slug?.current) {
                    frontpageSlug = translation.value.slug.current;
                }
            }
            
            path = frontpageSlug;
        } else {
            // If no frontpage is configured, throw an error
            throw new Error('No frontpage configured in site settings');
        }
    } else {
        // For non-frontpage routes, we need to reconstruct the full path with language prefix
        // because Nuxt i18n removes the language prefix from route.params.slug
        // but Sanity stores the full path including the language prefix
        
        // Remove leading slash if present
        const cleanPath = path.startsWith('/') ? path.substring(1) : path;
        
        // Check if the path already contains a language prefix
        const hasLanguagePrefix = /^[a-z]{2}\//.test(cleanPath);
        
        // Only add language prefix if it's not already present and not the default locale (Danish)
        if (!hasLanguagePrefix && language !== 'da') {
            path = `/${language}/${cleanPath}`;
        } else {
            // Use the clean path as is (already has language prefix or is default locale)
            path = cleanPath;
        }
        
        // Strip leading slash for Sanity compatibility
        path = path.startsWith('/') ? path.substring(1) : path;
    }

    // Set loading to true
    loading.value = true;
    
    // Build query parameters
    const params = {
        path: path,
        language: language
    };
    
    const key = `${documentType}-${path.replace(/\//g, '-')}-${language}`;
    
    // Use Nuxt 4's improved data fetching with better deduplication
    const { data: responseData, pending, error, refresh } = await useAsyncData(
        key,
        async () => {
            const result = await $fetch(apiEndpoint, {
                query: params
            });
            return result;
        },
        {
            server: true,
            lazy: false,
            default: () => null
        }
    );
    // Set the page value - handle both single page and array responses
    const response = responseData.value as any;
    page.value = response?.data || null;


    // Set current page in store
    if (page.value) {
        store.setCurrentPage(page.value);
    }

    // Update loading state
    loading.value = pending.value;

    return {
        page,
        loading,
        pending,
        error,
        refresh
    };
}