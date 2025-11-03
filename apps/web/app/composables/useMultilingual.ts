import { useCoreStore } from "~/stores/core";
import { useSetI18nParams } from '#i18n';
import { useI18n } from 'vue-i18n'

/**
 * Interface for Sanity translation data structure
 */
interface SanityTranslation {
  value: {
    _id: string;
    _type: string;
    language: string;
    slug: {
      _type: 'slug';
      current: string;
    };
    title: string;
    seo?: any;
  };
}

/**
 * Interface for route translation parameters
 */
interface RouteTranslationParams {
  [localeCode: string]: {
    slug: string[];
  };
}

/**
 * Interface for front page configuration
 */
interface FrontPage {
  locale: string;
  slug: string;
}

/**
 * Interface for store settings
 */
interface StoreSettings {
  front_pages?: FrontPage[];
  [key: string]: any;
}

/**
 * Composable for handling multilingual functionality with Sanity data
 * 
 * @version 2.0.0
 * @description Provides methods for managing multilingual routes and translations for Sanity CMS
 */
export const useMultilingual = () => {
  const { locales, locale } = useI18n();
  const store = useCoreStore();
  const setI18nParams = useSetI18nParams();

  /**
   * Sets the current route translations for all available locales using Sanity data
   * 
   * @param page - The current page data containing _translations array
   * @returns void
   * 
   * @example
   * ```typescript
   * const { setCurrentRouteTranslations } = useMultilingual();
   * 
   * // Set translations for current page
   * setCurrentRouteTranslations(pageData);
   * ```
   */
  const setCurrentRouteTranslations = (page: any): void => {
    if (!page?._translations || !Array.isArray(page._translations)) {
      return;
    }

    const translations: RouteTranslationParams = {};

    locales.value.forEach((locale) => {
      // Find the translation for this locale
      const translation = page._translations.find((t: SanityTranslation) => 
        t.value.language === locale.code
      );

      if (translation?.value?.slug?.current) {
        let slug = translation.value.slug.current;

        // Handle root path
        if (slug === '/' || slug === '') {
          slug = '';
        } else {
          // Remove locale prefix from slug if present
          const localePrefix = `${locale.code}/`;
          if (slug.startsWith(localePrefix)) {
            slug = slug.substring(localePrefix.length);
          }

          // Clean up the path to prevent double slashes
          if (slug.startsWith('/')) {
            slug = slug.substring(1);
          }

          // Remove trailing slash since i18n will add it back
          slug = slug.replace(/\/+$/, '');

          // Ensure we don't have any double slashes in the middle
          slug = slug.replace(/\/+/g, '/');
        }

        // Handle front pages
        const settings = store.settings as StoreSettings;
        const frontPages = settings?.front_pages;

        frontPages?.forEach((frontPage: FrontPage) => {
          if (`${frontPage.locale}/${frontPage.slug}` === translation.value.slug.current) {
            slug = '';
          }
        });

        // Ensure slug is always a string, not an object
        if (typeof slug !== 'string') {
          slug = '';
        }

        translations[locale.code] = { slug: [slug] };
      } else {
        // If no translation found for this locale, use empty slug
        translations[locale.code] = { slug: [''] };
      }
    });

    // Validate the translations object before setting
    const isValidTranslations = Object.keys(translations).every(localeCode => {
      const translation = translations[localeCode];
      return translation && 
             typeof translation === 'object' && 
             Array.isArray(translation.slug) && 
             translation.slug.every(s => typeof s === 'string');
    });

    if (!isValidTranslations) {
      return;
    }

    setI18nParams(translations);
  };

  return {
    setCurrentRouteTranslations,
  };
};

