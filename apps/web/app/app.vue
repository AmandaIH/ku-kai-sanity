<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
/* Safari-specific CSS loading fixes */
html {
  /* Ensure smooth transitions */
  transition: opacity 0.1s ease-in-out;
  /* Safari font rendering */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* Force Safari to respect CSS */
  -webkit-text-size-adjust: 100%;
}

/* Hide content only during initial load */
html:not(.loaded) body {
  opacity: 0;
}

html.loaded body {
  opacity: 1;
}

/* Safari-specific body fixes */
body {
  /* Force Safari to apply styles */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* Safari box model */
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

/* Force Safari to load Tailwind classes */
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}
</style>

<script setup>
import { useCoreStore } from '~/stores/core';

// Initialize core store data when app starts
const store = useCoreStore();

// Use Nuxt's proper data fetching patterns for SSR compatibility
const { data: initData } = await useLazyFetch('/api/init/');
const { data: menuData } = await useLazyFetch('/api/menus/');

// Set data in store when available
if (initData.value) {
  store.settings = initData.value.data;
}

if (menuData.value && menuData.value.data) {
  Object.entries(menuData.value.data).forEach(([menuSlug, menuItems]) => {
    store.menues[menuSlug] = menuItems;
  });
}

// Show content once everything is loaded
onMounted(() => {
  const showContent = () => {
    document.documentElement.classList.add('loaded');
  };

  // If document is already ready, show immediately
  if (document.readyState === 'complete') {
    showContent();
  } else {
    // Wait for all resources to load
    window.addEventListener('load', showContent);
  }
});
</script>
