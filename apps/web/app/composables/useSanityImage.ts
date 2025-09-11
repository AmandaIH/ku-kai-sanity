import imageUrlBuilder from '@sanity/image-url';

/**
 * Interface for Sanity image object structure
 */
interface SanityImageObject {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  alt?: string;
  caption?: string;
}

/**
 * Composable for handling Sanity images
 */
export const useSanityImage = () => {
  const config = useRuntimeConfig();
  const sanityConfig = config.public.sanity as {
    projectId: string;
    dataset: string;
  };

  // Check if Sanity config is available
  if (!sanityConfig?.projectId || !sanityConfig?.dataset) {
    console.warn('Sanity configuration is missing. Please check your environment variables.');
    return {
      getImageUrl: () => '',
      getResponsiveImageUrls: () => ({}),
      getImageAlt: () => '',
    };
  }

  const imageBuilder = imageUrlBuilder({
    projectId: sanityConfig.projectId,
    dataset: sanityConfig.dataset,
  });

  /**
   * Generate a Sanity image URL with specified parameters
   */
  const getImageUrl = (
    image: SanityImageObject,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'jpg' | 'png';
      fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min';
    } = {}
  ) => {
    if (!image || !image.asset) {
      return '';
    }

    let builder = imageBuilder.image(image);

    if (options.width) {
      builder = builder.width(options.width);
    }

    if (options.height) {
      builder = builder.height(options.height);
    }

    if (options.quality) {
      builder = builder.quality(options.quality);
    }

    if (options.format) {
      builder = builder.format(options.format);
    } else {
      // Auto-format for optimal image format (AVIF, WebP, etc.) when no specific format is requested
      builder = builder.auto('format');
    }

    if (options.fit) {
      builder = builder.fit(options.fit);
    }

    // Get the Sanity URL and convert it to use our local CDN proxy
    const sanityUrl = builder.url();
    if (!sanityUrl) return '';

    try {
      const url = new URL(sanityUrl);
      // Extract the path after the domain (e.g., /images/<projectId>/<dataset>/<assetId>.<ext>)
      const pathAfterDomain = url.pathname + url.search;
      // Return the local CDN proxy path
      return `/cdn${pathAfterDomain}`;
    } catch (error) {
      console.warn('Failed to parse Sanity URL:', sanityUrl);
      return sanityUrl; // Fallback to original URL if parsing fails
    }
  };

  /**
   * Generate responsive image URLs for different breakpoints
   */
  const getResponsiveImageUrls = (
    image: SanityImageObject,
    breakpoints: { [key: string]: number } = {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    }
  ) => {
    const urls: { [key: string]: string } = {};

    Object.entries(breakpoints).forEach(([breakpoint, width]) => {
      urls[breakpoint] = getImageUrl(image, { width });
    });

    return urls;
  };

  /**
   * Get the alt text from a Sanity image
   */
  const getImageAlt = (image: SanityImageObject): string => {
    return image?.alt || '';
  };

  return {
    getImageUrl,
    getResponsiveImageUrls,
    getImageAlt,
  };
}; 