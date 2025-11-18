/**
 * Interface for Sanity video/file object structure
 */
interface SanityVideoObject {
  _type: 'file';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

/**
 * Composable for handling Sanity video files
 */
export const useSanityVideo = () => {
  const config = useRuntimeConfig();
  const sanityConfig = config.public.sanity as {
    projectId: string;
    dataset: string;
  };

  // Check if Sanity config is available
  if (!sanityConfig?.projectId || !sanityConfig?.dataset) {
    console.warn('Sanity configuration is missing. Please check your environment variables.');
    return {
      getVideoUrl: () => '',
      getVideoAlt: () => '',
    };
  }

  /**
   * Generate a Sanity video URL
   */
  const getVideoUrl = (video: SanityVideoObject): string => {
    if (!video || !video.asset) {
      console.warn('useSanityVideo: Missing video or asset', { video });
      return '';
    }

    // Handle different Sanity asset reference formats
    let assetId = '';
    if (video.asset._ref) {
      // Standard Sanity asset reference: "file-abc123-def456-720p-mp4"
      // Remove "file-" prefix
      assetId = video.asset._ref.replace('file-', '');
      
      // Sanity file URLs need the extension in dot format
      // Convert "-mp4" to ".mp4", "-webm" to ".webm", etc.
      const extensionMap: { [key: string]: string } = {
        '-mp4': '.mp4',
        '-webm': '.webm',
        '-mov': '.mov',
        '-avi': '.avi'
      };
      
      // Convert extension format from dash to dot
      for (const [dashExt, dotExt] of Object.entries(extensionMap)) {
        if (assetId.endsWith(dashExt)) {
          assetId = assetId.replace(new RegExp(dashExt + '$', 'i'), dotExt);
          break;
        }
      }
      
      // If no extension was found, assume it's an mp4 video
      if (!assetId.includes('.')) {
        assetId = `${assetId}.mp4`;
      }
    } else {
      console.error('useSanityVideo: Unknown asset structure:', video.asset);
      return '';
    }

    // Sanity video URLs follow this pattern:
    // https://cdn.sanity.io/files/{projectId}/{dataset}/{assetId}
    const sanityUrl = `https://cdn.sanity.io/files/${sanityConfig.projectId}/${sanityConfig.dataset}/${assetId}`;

    try {
      const url = new URL(sanityUrl);
      // Extract the path after the domain (e.g., /files/<projectId>/<dataset>/<assetId>)
      const pathAfterDomain = url.pathname;
      // Return the local CDN proxy path
      const finalUrl = `/cdn${pathAfterDomain}`;
      if (process.client) {
        console.log('useSanityVideo: Generated URL', { 
          originalRef: video.asset._ref, 
          assetId, 
          sanityUrl, 
          finalUrl 
        });
      }
      return finalUrl;
    } catch (error) {
      console.warn('Failed to parse Sanity video URL:', sanityUrl, error);
      return sanityUrl; // Fallback to original URL if parsing fails
    }
  };

  /**
   * Get the alt text from a Sanity video
   */
  const getVideoAlt = (video: SanityVideoObject): string => {
    return video?.alt || '';
  };

  return {
    getVideoUrl,
    getVideoAlt,
  };
};
