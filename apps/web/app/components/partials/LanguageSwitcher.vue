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
 */
// const availableLocales = computed((): Locale[] => {
//   return (locales.value as unknown as Locale[]) || [];
// });
const availableLocales = computed((): Locale[] => {
  const all = (locales.value as unknown as Locale[]) || [];
  
  if (!currentPage.value || !(currentPage.value as any)._translations) {
    return all;
  }
  
  const translations = (currentPage.value as any)._translations?.map((t: any) => t.value.language) || [];
  return all.filter(l => translations.includes(l.code));
});

/**
 * Safely get locale path with error handling
 * 
 * @param localeCode - The locale code to switch to
 * @returns The path for the locale switch
 */
const getLocalePath = (localeCode: string): string => {
  const alt = (currentPage.value as any)?._translations?.find(
    (t: any) => t.value.language === localeCode
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

  // Fallback to default locale path
  try {
    const path = switchLocalePath(localeCode as 'da' | 'en');
    // Ensure we return a string, not an object
    if (typeof path === 'string') {
      return path;
    }
    // If it's an object, try to get the path property or fallback to current route
    if (path && typeof path === 'object' && 'path' in path) {
      return (path as any).path || '/';
    }
    return '/';
  } catch (error) {
    console.warn('Error getting locale path:', error);
    return '/';
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
 */
const loadSvgContent = async (localeCode: string) => {
  if (!localeCode) return;
  
  try {
    // Use explicit fetch options for Safari compatibility
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
      svgContent.value = null;
    }
  } catch (error) {
    console.warn('Failed to load SVG:', error);
    svgContent.value = null;
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

