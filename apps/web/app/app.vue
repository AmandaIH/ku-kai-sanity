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

/* Safari-specific body fixes */
body {
  /* Force Safari to apply styles */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* Safari box model */
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  /* Ensure body is visible by default for Safari */
  opacity: 1 !important;
  visibility: visible !important;
}

/* Force Safari to load Tailwind classes */
* {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

/* Safari-specific fixes for CSS loading */
@supports (-webkit-appearance: none) {
  /* Safari-specific styles */
  html, body {
    opacity: 1 !important;
    visibility: visible !important;
  }
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

// Force Safari to load CSS properly
if (process.client) {
  useHead({
    htmlAttrs: {
      class: 'safari-fix'
    }
  });
}

// Show content once everything is loaded - Safari-friendly version
onMounted(() => {
  const showContent = () => {
    document.documentElement.classList.add('loaded');
    // Force Safari to repaint
    if (process.client) {
      document.body.style.display = 'none';
      document.body.offsetHeight; // Trigger reflow
      document.body.style.display = '';
    }
  };

  // For Safari, show immediately and don't wait
  if (process.client) {
    // Show immediately for Safari compatibility
    showContent();
    
    // Also listen for load event as backup
    if (document.readyState === 'complete') {
      showContent();
    } else {
      window.addEventListener('load', showContent, { once: true });
    }
    
    // Additional Safari fix: force style recalculation
    requestAnimationFrame(() => {
      document.body.style.visibility = 'visible';
      document.body.style.opacity = '1';
    });
    
    // Check if CSS is loaded in Safari and fix if needed
    const checkStyles = () => {
      const links = document.querySelectorAll('link[rel="stylesheet"]');
      
      // Check if Tailwind classes work
      const testEl = document.createElement('div');
      testEl.className = 'flex';
      testEl.style.position = 'absolute';
      testEl.style.visibility = 'hidden';
      document.body.appendChild(testEl);
      
      const styles = window.getComputedStyle(testEl);
      const isFlex = styles.display === 'flex' || styles.display === '-webkit-flex';
      
      document.body.removeChild(testEl);
      
      if (!isFlex && navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')) {
        // Styles not loaded, force reload
        links.forEach((link) => {
          if (link.href && !link.href.includes('fonts.googleapis.com')) {
            const href = link.href;
            link.href = '';
            setTimeout(() => {
              link.href = href + '?t=' + Date.now();
            }, 100);
          }
        });
      }
    };
    
    // Check after a short delay
    setTimeout(checkStyles, 1000);
  }
});
</script>
