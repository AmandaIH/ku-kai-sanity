import {setHeaders} from "h3";
import crypto from 'crypto';

/**
 * Set cache headers for Sanity pages
 * @param page - Sanity page data (single object)
 * @returns 
 */
export function usePageCacheHeaders(page: any) {

    if (process.server && page) {

        const pageData = page.value;
        
        if (!pageData) {
            return;
        }

        const event = useRequestEvent();
        
        if (!event) {
            return;
        }

        // Use _updatedAt for Sanity data
        const lastModified = pageData._updatedAt ? new Date(pageData._updatedAt).toUTCString() : null;

        // Create etag for headers.
        // TODO create hash also based on the current build.
        const contentKey = (pageData._updatedAt || '') + "-" + (pageData._id || '') + (process.env.BITBUCKET_COMMIT || '');
        const contentHash = crypto.createHash('md5').update(contentKey).digest('hex');
        const etag =  "W/\"" + contentHash + "\"" ;
        // console.log(contentKey, contentHash, etag);
        // console.log("ETAG", etag);

        // Using etag or last modified does not currently work well with new builds. Use at own risk.
        setHeaders(event, {
            // 'Last-Modified': lastModified,
            'Cache-Control': 'max-age=1, must-revalidate, stale-while-revalidate=59',
            'ETag': etag,
            'Vary': 'Accept-Encoding, Accept-Language'
            // 'alt-svc': 'h3-27=":443"; ma=86400, h3-28=":443"; ma=86400, h3-29=":443"; ma=86400, h3=":443"; ma=86400;',
            // 'Cache-Control': 'max-age=0, s-maxage=60'
        });
    }

}