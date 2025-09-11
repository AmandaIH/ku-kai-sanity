/**
 * Composable for handling redirects
 * 
 * Provides utilities for working with redirects from the WordPress backend
 */
export const useRedirects = () => {
    /**
     * Fetch all redirects from the cached API
     */
    const fetchRedirects = async () => {
        try {
            const data = await $fetch('/api/redirects');
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Failed to fetch redirects:', error);
            return [];
        }
    };

    /**
     * Check if a URL has a redirect
     * @param url - The URL to check
     * @returns The redirect target URL if found, null otherwise
     */
    const checkRedirect = async (url: string): Promise<string | null> => {
        const redirects = await fetchRedirects();
        
        if (!redirects || redirects.length === 0) {
            return null;
        }

        const cleanCurrentUrl = cleanUrl(url);
        const matchingRedirect = redirects.find(redirect => {
            const cleanSourceUrl = cleanUrl(redirect.source_url);
            return cleanSourceUrl === cleanCurrentUrl;
        });

        return matchingRedirect ? matchingRedirect.target_url : null;
    };

    /**
     * Perform a client-side redirect if one exists for the current route
     * @param url - Optional URL to check, defaults to current route
     */
    const performRedirect = async (url?: string) => {
        const route = useRoute();
        const router = useRouter();
        const checkUrl = url || route.fullPath;
        
        const targetUrl = await checkRedirect(checkUrl);
        
        if (targetUrl) {
            // Check if it's an external URL
            if (targetUrl.startsWith('http://') || targetUrl.startsWith('https://')) {
                // External redirect
                await navigateTo(targetUrl, { external: true });
            } else {
                // Internal redirect
                await router.push(targetUrl);
            }
        }
    };

    return {
        fetchRedirects,
        checkRedirect,
        performRedirect
    };
};

/**
 * Clean URL for consistent comparison
 * Matches the cleaning logic from the WordPress plugin and middleware
 */
function cleanUrl(url: string): string {
    if (!url) return '';
    
    // Remove query parameters and fragments
    const urlWithoutQuery = url.split('?')[0];
    const finalUrl = urlWithoutQuery ? urlWithoutQuery.split('#')[0] : '';
    
    if (!finalUrl) return '/';
    
    // Remove trailing slashes and normalize
    let cleanedUrl = finalUrl.replace(/\/+$/, '');
    
    // Ensure it starts with / for relative URLs
    if (!cleanedUrl.startsWith('/') && !cleanedUrl.match(/^https?:\/\//)) {
        cleanedUrl = '/' + cleanedUrl;
    }
    
    // Handle root path
    if (cleanedUrl === '') {
        cleanedUrl = '/';
    }
    
    return cleanedUrl;
} 