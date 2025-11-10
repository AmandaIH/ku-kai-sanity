<template>
  <nav 
    v-if="isMultilingualEnabled && alternateLocale" 
    class="language-switcher flex items-center gap-2" 
    aria-label="Language selection"
  >
    <NuxtLink
      :key="alternateLocale.code"
      :to="getLocalePath(alternateLocale.code)"
      :class="[
        'language-switcher__link',
        'flex items-center justify-center transition-all duration-200',
        'mb-0 m-0',
        'hover:opacity-70 focus:outline-none'
      ]"
      :aria-label="`Switch to ${alternateLocale.name}`"
      @click="handleLanguageSwitch"
    >
      <div 
        v-if="svgContent"
        class="w-6 h-6 rounded-full overflow-hidden"
        v-html="svgContent"
      ></div>
      <img
        v-else
        :src="flagSrc"
        :alt="`${alternateLocale.name} flag`"
        class="w-6 h-6 object-cover rounded-full block m-0 mb-0"
        width="24"
        height="24"
        @error="handleImageError"
      />
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { useSwitchLocalePath } from '#i18n';
import { useCoreStore } from '~/stores/core';

const currentPage = computed(() => useCoreStore().currentPage);
const svgContent = ref<string | null>(null);
const flagSrc = computed(() => `/flags/${alternateLocale.value?.code}.svg`);

// Embedded SVG flags to avoid file serving issues in production
const flagSvgs: Record<string, string> = {
  da: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_794_2402)">
<path d="M0 0H15.0029V15H0V0Z" fill="#C8102E"/>
<path d="M4.21973 0H6.36133V15H4.21973V0Z" fill="white"/>
<path d="M0 6.42749H15.0029V8.57202H0V6.42749Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_794_2402">
<rect width="15" height="15" rx="7.5" fill="white"/>
</clipPath>
</defs>
</svg>`,
  en: `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_794_2394)">
<path d="M0 0H15V15H0V0Z" fill="#012169"/>
<path d="M15 0V1.875L9.43359 7.5L15 12.9785V15H13.0371L7.44141 9.49219L1.99219 15H0V13.0078L5.44922 7.5293L0 2.16797V0H1.81641L7.44141 5.50781L12.8906 0H15Z" fill="white"/>
<path d="M5.39062 9.49219L5.71289 10.4883L1.23047 15H0V14.9121L5.39062 9.49219ZM9.02344 9.14062L10.6055 9.375L15 13.6816V15L9.02344 9.14062ZM15 0L9.375 5.74219L9.25781 4.45312L13.6523 0H15ZM0 0.0292969L5.6543 5.56641L3.92578 5.33203L0 1.43555V0.0292969Z" fill="#C8102E"/>
<path d="M5.15625 0V15H9.84375V0H5.15625ZM0 5.15625V9.84375H15V5.15625H0Z" fill="white"/>
<path d="M0 6.09375V8.90625H15V6.09375H0ZM6.09375 0V15H8.90625V0H6.09375Z" fill="#C8102E"/>
</g>
<defs>
<clipPath id="clip0_794_2394">
<rect width="15" height="15" rx="7.5" fill="white"/>
</clipPath>
</defs>
</svg>`
};

/**
 * Interface for locale configuration
 */
interface Locale {
  code: string;
  name: string;
}

/**
 * Component props
 */
interface Props {
  /**
   * Custom CSS classes to apply to the language switcher
   * @default ""
   */
  classes?: string;
  /**
   * Whether to show language names instead of codes
   * @default false
   */
  showNames?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  classes: '',
  showNames: false
});

/**
 * Get i18n composable
 */
const { locale } = useI18n();
const { locales, defaultLocale } = useNuxtApp().$i18n;

/**
 * Get switchLocalePath function
 */
const switchLocalePath = useSwitchLocalePath();

/**
 * Get runtime config for multilingual settings
 */
const config = useRuntimeConfig();

/**
 * Computed property to check if multilingual is enabled
 */
const isMultilingualEnabled = computed((): boolean => {
  return availableLocales.value.length > 1;
});

/**
 * Computed property to get current locale
 */
const currentLocale = computed((): string => {
  return locale.value;
});

/**
 * Computed property to get the alternate locale (the one that is NOT currently active)
 */
const alternateLocale = computed((): Locale | null => {
  const alternate = availableLocales.value.find(l => l.code !== currentLocale.value);
  return alternate || null;
});

/**
 * Computed property to get available locales
 * Only returns locales that have actual translations for the current page
 */
const availableLocales = computed((): Locale[] => {
  const all = (locales.value as unknown as Locale[]) || [];
  
  // If no current page, return all locales (fallback behavior)
  if (!currentPage.value) {
    return all;
  }
  
  // Check if translations exist and is a non-empty array
  const translations = (currentPage.value as any)._translations;
  if (!translations || !Array.isArray(translations) || translations.length === 0) {
    // If no translations, only return the current locale
    // This ensures alternateLocale will be null and the switcher will hide
    return all.filter(l => l.code === currentLocale.value);
  }
  
  // Get language codes from translations
  const translationLanguages = translations
    .map((t: any) => t.value?.language)
    .filter((lang: string) => lang); // Filter out any undefined/null values
  
  // Always include the current locale (the current page itself is available in that locale)
  // Then add any other locales that have translations
  const availableLanguageCodes = new Set([currentLocale.value, ...translationLanguages]);
  
  // Only return locales that have translations (including current locale)
  return all.filter(l => availableLanguageCodes.has(l.code));
});

/**
 * Safely get locale path with error handling
 * Only returns a path if a translation exists for the requested locale
 * 
 * @param localeCode - The locale code to switch to
 * @returns The path for the locale switch, or homepage if no translation exists
 */
const getLocalePath = (localeCode: string): string => {
  // First, check if a translation exists for this locale
  const alt = (currentPage.value as any)?._translations?.find(
    (t: any) => t.value?.language === localeCode
  );

  if (alt?.value?.slug?.current) {
    const doc = alt.value;

    // Remove any leading locale prefix from slug
    let cleanSlug = doc.slug.current.replace(/^([a-z]{2}\/)/, '').replace(/^\/+/, '');

    // Build URL: default locale has no prefix, others include locale
    if (localeCode === defaultLocale) {
      return `/${cleanSlug}`;
    } else {
      return `/${localeCode}/${cleanSlug}`;
    }
  }

  // If no translation exists, redirect to homepage for that locale
  // This prevents broken links when switching to a language without a translation
  if (localeCode === defaultLocale) {
    return '/';
  } else {
    return `/${localeCode}/`;
  }
};

/**
 * Handle language switch click event
 * 
 * @param event - The click event
 */
const handleLanguageSwitch = (event: Event): void => {
  // Add any additional logic here if needed
  // For example, analytics tracking, etc.
};

/**
 * Load SVG content inline for Safari compatibility
 * Uses embedded SVGs as fallback to avoid file serving issues
 */
const loadSvgContent = async (localeCode: string) => {
  if (!localeCode) return;
  
  // First, try to use embedded SVG (most reliable)
  if (flagSvgs[localeCode]) {
    svgContent.value = flagSvgs[localeCode];
    return;
  }
  
  // Fallback: try to fetch from server
  try {
    const response = await fetch(`/flags/${localeCode}.svg`, {
      method: 'GET',
      mode: 'cors', // Explicitly set CORS mode for Safari
      cache: 'default',
      headers: {
        'Accept': 'image/svg+xml,image/*,*/*',
      },
    });
    
    if (response.ok) {
      // Check if content type is correct (Safari is strict about this)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('svg')) {
        const svgText = await response.text();
        svgContent.value = svgText;
      } else {
        // Fallback: try to read anyway if content-type check fails
        const svgText = await response.text();
        svgContent.value = svgText;
      }
    } else {
      // If fetch fails, use embedded SVG if available
      svgContent.value = flagSvgs[localeCode] || null;
    }
  } catch (error) {
    console.warn('Failed to load SVG:', error);
    // Use embedded SVG as fallback
    svgContent.value = flagSvgs[localeCode] || null;
  }
};

/**
 * Handle image error fallback
 */
const handleImageError = () => {
  if (alternateLocale.value) {
    loadSvgContent(alternateLocale.value.code);
  }
};

// Watch for locale changes and load SVG
watch(alternateLocale, (newLocale) => {
  if (newLocale) {
    loadSvgContent(newLocale.code);
  } else {
    svgContent.value = null;
  }
}, { immediate: true });

// Load SVG on mount
onMounted(() => {
  if (alternateLocale.value) {
    loadSvgContent(alternateLocale.value.code);
  }
});
</script>

<style scoped>
.language-switcher__link {
  margin: 0 !important;
  margin-bottom: 0 !important;
  vertical-align: middle !important;
}

.language-switcher__link img,
.language-switcher__link > div {
  margin: 0 !important;
  margin-bottom: 0 !important;
  display: block;
  /* Safari SVG fixes */
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  /* Ensure proper rendering in Safari */
  object-fit: cover;
  object-position: center;
}

.language-switcher__link > div :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
  border-radius: 50%;
  object-fit: cover;
}
</style>

