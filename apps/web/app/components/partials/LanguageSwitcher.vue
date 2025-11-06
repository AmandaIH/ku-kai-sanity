<template>
  <nav 
    v-if="isMultilingualEnabled" 
    class="language-switcher flex items-center gap-2" 
    aria-label="Language selection"
  >
    <NuxtLink
      v-for="locale in availableLocales"
      :key="locale.code"
      :to="getLocalePath(locale.code)"
      :class="[
        'language-switcher__link',
        'flex items-center justify-center transition-all duration-200',
        'w-7 h-7 border rounded-full box-border',
        'mb-0 m-0',
        'hover:opacity-70 focus:outline-none',
        {
          'opacity-70': locale.code !== currentLocale
        }
      ]"
      :style="locale.code === currentLocale ? { borderColor: 'currentColor' } : { borderColor: 'transparent' }"
      :aria-current="locale.code === currentLocale ? 'page' : undefined"
      :aria-label="`Switch to ${locale.name}`"
      @click="handleLanguageSwitch"
    >
      <img
        :src="`/flags/${locale.code}.svg`"
        :alt="`${locale.name} flag`"
        class="w-6 h-6 object-cover rounded-full block m-0 mb-0"
      />
    </NuxtLink>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useSwitchLocalePath } from '#i18n';
import { useCoreStore } from '~/stores/core';

const currentPage = computed(() => useCoreStore().currentPage);

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
</script>

<style scoped>
.language-switcher__link {
  margin: 0 !important;
  margin-bottom: 0 !important;
  vertical-align: middle !important;
}

.language-switcher__link img {
  margin: 0 !important;
  margin-bottom: 0 !important;
  display: block;
}
</style>

