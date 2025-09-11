import { useCoreStore } from "~/stores/core";

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
  metaDescription?: string;
  featuredImage?: any;
  content?: any;
  seo?: SeoData;
  _createdAt: string;
  _updatedAt: string;
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
  seo?: SeoData;
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
    companyName?: string;
    companyAddress?: string;
    companyZipCode?: string;
    companyCity?: string;
    companyCvr?: string;
    companyPhone?: string;
    companyEmail?: string;
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
}

/**
 * Helper function to detect document type from path using conventions
 * Convention: /articles/slug -> article, /solutions/slug -> solutions, etc.
 */
function detectDocumentType(path: string): { documentType: string; apiEndpoint: string } {
  if (!path) {
    return { documentType: 'page', apiEndpoint: '/api/documents/pages' };
  }

  // Remove leading slash for detection
  let cleanPath = path.startsWith('/') ? path.substring(1) : path;

  // Look for document type patterns: articles/, solutions/, etc.
  const documentTypeMatch = cleanPath.match(/^([a-z]+)\//);
  if (documentTypeMatch) {
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

    // Set up reactive variables
    const page = ref<PageData | null>(null);
    const loading = ref(true);

    // Get the current path from route if not provided
    let path = options.path || useRoute().path;
    
    // Auto-detect document type using convention-based detection
    const { documentType, apiEndpoint } = detectDocumentType(path);

    // Check if we're on the frontpage (empty path or just '/')
    const isFrontpage = !path || path === '/' || path === '';

    if (isFrontpage) {
        // Get frontpage slug from settings
        const settings = store.getSettings as SiteSettings;

        if (settings?.frontpage?.slug?.current) {
            path = settings.frontpage.slug.current;
        } else {
            // If no frontpage is configured, throw an error
            throw new Error('No frontpage configured in site settings');
        }
    } else {
        // Remove leading slash for Sanity compatibility
        path = path.startsWith('/') ? path.substring(1) : path;
    }

    // Set loading to true
    loading.value = true;
    
    // Build query parameters
    const params = {
        path: path
        // No need to pass type - API will search across all document types automatically
    };
    
    const key = `${documentType}-${path.replace(/\//g, '-')}`;
    
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