import { useSanityImage } from "~/composables/useSanityImage";

export function useSeoHead() {
    function getSeoHead(data: any) {
        if (data === undefined) {
            return [];
        }

        const config = useRuntimeConfig();
        
        // Get SEO data (could be nested under seo object)
        const seoData = data.seo || data;
        
        // Determine the title to use (SEO title with fallback to page title)
        const metaTitle = seoData.metaTitle || data.title;
        
        const metaData = [];
        let canonical = '';

        // Handle robots meta
        let robotsValues = [];
        if (seoData.robots) {
            if (seoData.robots.noindex) robotsValues.push('noindex');
            if (seoData.robots.nofollow) robotsValues.push('nofollow');
            if (seoData.robots.noarchive) robotsValues.push('noarchive');
            if (seoData.robots.nosnippet) robotsValues.push('nosnippet');
        }
        
        // Always add robots meta tag - when all values are false, it means "index, follow"
        const robotsContent = robotsValues.length > 0 ? robotsValues.join(", ") : "index, follow";
        metaData.push({
            hid: 'robots',
            name: 'robots',
            content: robotsContent,
        });

        // Meta description
        if (seoData.metaDescription) {
            metaData.push({
                hid: 'description',
                name: 'description',
                content: seoData.metaDescription,
            });
        }

        // Keywords
        if (seoData.keywords && seoData.keywords.length > 0) {
            metaData.push({
                hid: 'keywords',
                name: 'keywords',
                content: seoData.keywords.join(', '),
            });
        }

        // Author
        if (seoData.author) {
            metaData.push({
                hid: 'author',
                name: 'author',
                content: seoData.author,
            });
        }

        // Published date
        if (data._createdAt) {
            metaData.push({
                hid: 'article:published_time',
                property: 'article:published_time',
                content: data._createdAt,
            });
        }

        // Modified date
        if (data._updatedAt) {
            metaData.push({
                hid: 'article:modified_time',
                property: 'article:modified_time',
                content: data._updatedAt,
            });
        }

        // Open Graph title
        const ogTitle = seoData.metaTitle || data.title;
        if (ogTitle) {
            metaData.push({
                hid: 'og:title',
                property: 'og:title',
                content: ogTitle.replaceAll('&amp;', '&').replaceAll('&shy;', ''),
            });
        }

        // Open Graph image - use socialImage or fallback to featuredImage
        let ogImage = seoData.socialImage;
        if (!ogImage && data.featuredImage) {
            ogImage = data.featuredImage;
        }
        
        if (ogImage && ogImage._type === 'image' && ogImage.asset) {
            const { getImageUrl } = useSanityImage();
            const imageUrl = getImageUrl(ogImage, { 
                width: 1200, 
                height: 630, 
                format: 'webp' 
            });
            
            metaData.push({
                hid: 'og:image',
                property: 'og:image',
                content: imageUrl,
            });
        }

        // Open Graph description
        if (seoData.metaDescription) {
            metaData.push({
                hid: 'og:description',
                property: 'og:description',
                content: seoData.metaDescription,
            });
        }

        // Canonical URL
        if (data.slug?.current) {
            const baseUrl = config.public.siteUrl || 'http://localhost:3000';
            canonical = `${baseUrl}/${data.slug.current}`;
        }

        // Twitter Card meta tags
        if (seoData.twitter?.card) {
            metaData.push({
                hid: 'twitter:card',
                name: 'twitter:card',
                content: seoData.twitter.card,
            });
        }

        if (seoData.metaTitle || ogTitle) {
            metaData.push({
                hid: 'twitter:title',
                name: 'twitter:title',
                content: seoData.metaTitle || ogTitle,
            });
        }

        if (seoData.metaDescription) {
            metaData.push({
                hid: 'twitter:description',
                name: 'twitter:description',
                content: seoData.metaDescription,
            });
        }

        // Twitter image - use socialImage or fallback to featuredImage
        let twitterImage = seoData.socialImage;
        if (!twitterImage && data.featuredImage) {
            twitterImage = data.featuredImage;
        }
        
        if (twitterImage && twitterImage._type === 'image' && twitterImage.asset) {
            const { getImageUrl } = useSanityImage();
            const imageUrl = getImageUrl(twitterImage, { 
                width: 1200, 
                height: 600, 
                format: 'webp' 
            });
            
            metaData.push({
                hid: 'twitter:image',
                name: 'twitter:image',
                content: imageUrl,
            });
        }

        if (seoData.twitter?.site) {
            metaData.push({
                hid: 'twitter:site',
                name: 'twitter:site',
                content: seoData.twitter.site,
            });
        }

        if (seoData.twitter?.creator) {
            metaData.push({
                hid: 'twitter:creator',
                name: 'twitter:creator',
                content: seoData.twitter.creator,
            });
        }

        // Canonical link
        let links = [];
        if (canonical) {
            links.push({
                rel: 'canonical',
                href: canonical,
            });
        }



        // Google site verification
        metaData.push({
            name: 'google-site-verification',
            content: 'xxxx-xxxx',
        });

        // Structured data (JSON-LD)
        let script = [];
        if (seoData.structuredData) {
            try {
                const structuredData = JSON.parse(seoData.structuredData);
                script.push({
                    hid: 'structured-data',
                    type: 'application/ld+json',
                    children: JSON.stringify(structuredData),
                });
            } catch (error) {
                console.warn('Invalid structured data JSON:', error);
            }
        }

        return {
            htmlAttrs: {
                lang: 'en',
                dir: 'ltr',
            },
            title: metaTitle,
            meta: metaData,
            link: links,
            script: script,
        };
    }

    return {
        getSeoHead,
    };
}
