/**
 * Interface for Sanity file object structure
 */
interface SanityFileObject {
  _type: 'file';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
}

/**
 * Composable for handling Sanity file objects (videos, documents, etc.)
 */
export const useSanityFile = () => {
  const config = useRuntimeConfig();
  const sanityConfig = config.public.sanity as {
    projectId: string;
    dataset: string;
  };

  // Check if Sanity config is available
  if (!sanityConfig?.projectId || !sanityConfig?.dataset) {
    console.warn('Sanity configuration is missing. Please check your environment variables.');
    return {
      getFileUrl: () => '',
      getFileAlt: () => '',
    };
  }

  /**
   * Generate a Sanity file URL
   */
  const getFileUrl = (file: SanityFileObject): string => {
    if (!file || !file.asset) {
      return '';
    }

    // Handle different Sanity asset reference formats
    let assetId = '';
    if (file.asset._ref) {
      // Standard Sanity asset reference: "file-abc123-def456-720p-mp4"
      assetId = file.asset._ref.replace('file-', '');
    } else {
      console.error('useSanityFile: Unknown asset structure:', file.asset);
      return '';
    }

    // Sanity file URLs follow this pattern:
    // https://cdn.sanity.io/files/{projectId}/{dataset}/{assetId}
    const sanityUrl = `https://cdn.sanity.io/files/${sanityConfig.projectId}/${sanityConfig.dataset}/${assetId}`;

    try {
      const url = new URL(sanityUrl);
      // Extract the path after the domain (e.g., /files/<projectId>/<dataset>/<assetId>)
      const pathAfterDomain = url.pathname;
      // Return the local CDN proxy path
      return `/cdn${pathAfterDomain}`;
    } catch (error) {
      console.warn('Failed to parse Sanity file URL:', sanityUrl);
      return sanityUrl; // Fallback to original URL if parsing fails
    }
  };

  /**
   * Get the alt text from a Sanity file
   */
  const getFileAlt = (file: SanityFileObject): string => {
    return file?.alt || '';
  };

  return {
    getFileUrl,
    getFileAlt,
  };
};
