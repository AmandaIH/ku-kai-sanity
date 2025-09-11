/**
 * Composoble for image proxying. Takes a URL and returns a proxied URL.
 *
 * @deprecated Use useSanityImage instead.
 * 
 * @param image_url
 */
export function useCheckmateImageProxy(image_url: string) {

    const config = useRuntimeConfig();
    const imageUrl = new URL(image_url);
    let url = image_url;

    const proxyUrl = config.public.siteUrl !== undefined && config.public.siteUrl !== null ? config.public.siteUrl : false;
    if (proxyUrl !== false && !proxyUrl.includes('localhost')) {
        // Creates a full URL for the proxied image.
        // url = proxyUrl + imageUrl.pathname.replace('/wp-content/uploads/', '/');
        url = proxyUrl + imageUrl.pathname;
    }
    // Returns the URL and whether the proxy was used - mostly for debugging.

    return {
        url,
        isProxy: proxyUrl !== false
    }

}
