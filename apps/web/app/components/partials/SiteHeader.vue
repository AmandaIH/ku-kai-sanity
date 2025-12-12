<template>
      <header ref="headerRef" class="site-header fixed top-0 w-full z-50 text-white backdrop-blur-md bg-black/80">
    <div ref="headerInnerRef" class="px-8 md:px-16 max-w-[1480px] mx-auto flex items-center justify-between">

      <!-- Logo -->
      <div class="z-[26] flex-shrink-0">
      <nuxt-link :to="frontpageRoute">
        <!-- Logo -->
        <SimpleLogo 
        class="w-auto" 
        style="height: 1.9rem;"
        :fill-color="'white'"
        :hide-text="false"
         ></SimpleLogo>
      </nuxt-link>
      </div>

      <!-- Desktop Navigation - Right Side -->
      <div class="hidden md:flex items-center justify-center gap-6 z-[22] pointer-events-auto">
        <!-- Main Menu Links -->
        <nav class="flex items-center gap-8">
          <NavigationLink 
            v-for="menuItem in mainMenu.filter(item => {
              const linkType = item.linkType || (item.isExternal === true ? 'external' : item.isExternal === false ? 'internal' : 'form')
              return linkType !== 'form' && item.url !== '/' && item.url !== '/index' && item.url !== '/frontpage'
            })" 
            :key="menuItem.ID" 
            :link="menuItem"
            class="nav-link text-sm uppercase font-medium whitespace-nowrap relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
            :style="{ color: 'white' }"
            :class="[
              isActivePage(menuItem.url) ? 'after:scale-x-100' : ''
            ]"
          >
            {{ menuItem.title }}
          </NavigationLink>
        </nav>

        <LanguageSwitcher />
        
        <!-- Menu Items from main-menu-2 -->
        <template v-for="(menuItem, index) in mainMenu2">
          <!-- Text Link Style (all items except last) -->
          <NavigationLink 
            v-if="index !== mainMenu2.length - 1"
            :key="`menu-item-text-${menuItem.ID}-${index}`"
            :link="menuItem"
            class="uppercase font-medium text-sm cursor-pointer relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
            :style="{ color: 'white' }"
          >
            {{ menuItem.title }}
          </NavigationLink>
          
          <!-- Button Style (last item) -->
          <NavigationLink 
            v-else
            :key="`menu-item-btn-${menuItem.ID}-${index}`"
            :link="menuItem"
            class="flex gap-4 items-center btn"
            :class="[
              'btn-primary',
              menuScrollActive ? 'btn-scrolled' : '',
              darkHeader ? 'btn-dark-header' : ''
            ].filter(Boolean).join(' ')"
          >
            {{ menuItem.title }}
          </NavigationLink>
        </template>
      </div>

      <!-- Mobile Burger Menu -->
      <div class="md:hidden flex items-center justify-center gap-4 z-[22]">
        <div class="flex items-center">
          <BurgerIcon />
          <BurgerMenu :main-menu="mainMenu" :is-scrolled="menuScrollActive" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useCoreStore } from '~/stores/core';
import Logo from '~/components/ui/Logo.vue';
import SimpleLogo from '~/components/ui/SimpleLogo.vue';
import NavigationLink from '~/components/ui/NavigationLink.vue';
import { useMultilingual } from '~/composables/useMultilingual';
import { gsap } from 'gsap';

const props = defineProps({
  textIsWhite: {
    type: Boolean,
    default: true
  },
});

const store = useCoreStore();
const route = useRoute();
const { locale, locales } = useI18n();
const { getCurrentFrontpage } = useMultilingual();

// Get the frontpage route for the current locale
const frontpageRoute = computed(() => getCurrentFrontpage());

// Get dark header setting from store
const darkHeader = computed(() => {
  // During SSR, the store might not be populated yet, so we need to handle this gracefully
  const currentPage = store.getCurrentPage;
  return currentPage?.darkHeader || false;
});

// Watch for changes in the store to handle hydration
watch(() => store.getCurrentPage, (newPage) => {
  if (newPage) {
    // Page data updated, component will reactively update
  }
}, { immediate: true });

const mainMenu = computed(() => {
  // Try both "main-menu" and "main-navigation" slugs
  let menu = store.getMenu('main-menu', locale.value) || [];
  if (menu.length === 0) {
    menu = store.getMenu('main-navigation', locale.value) || [];
  }
  // Debug: log menu items
  if (process.client && menu.length === 0) {
    console.log('No main-menu items found. Make sure you have created a menu with slug "main-menu-da" or "main-navigation-da" in Sanity Studio.');
    console.log('Available menus:', Object.keys(store.menues[locale.value] || {}));
  }
  return menu;
});

const mainMenu2 = computed(() => {
  // Try both "main-menu-2" and "main-navigation-2" slugs
  let menu = store.getMenu('main-menu-2', locale.value) || [];
  if (menu.length === 0) {
    menu = store.getMenu('main-navigation-2', locale.value) || [];
  }
  // Debug: log menu items
  if (process.client && menu.length === 0) {
    console.log('No main-menu-2 items found. Make sure you have created a menu with slug "main-menu-2-da" or "main-navigation-2-da" in Sanity Studio.');
    console.log('Available menus:', Object.keys(store.menues[locale.value] || {}));
  }
  return menu;
});

// Check if we're on the front page
const isFrontPage = computed(() => {
  return route.path === '/' || route.path === '/index' || route.path === '/frontpage';
});

// Check if a menu item is the active page
const isActivePage = (menuUrl) => {
  if (!menuUrl) return false;
  
  // Normalize the current route path
  const currentPath = route.path;
  
  // Normalize the menu URL
  const normalizedMenuUrl = menuUrl.startsWith('/') ? menuUrl : `/${menuUrl}`;
  
  // Check for exact match
  if (currentPath === normalizedMenuUrl) {
    return true;
  }
  
  // Check for subpages (e.g., if on /about/team and menu item is /about)
  if (currentPath.startsWith(normalizedMenuUrl + '/')) {
    return true;
  }
  
  return false;
};

// Determine text color based on scroll state
const shouldUseWhiteText = computed(() => {
  // Use black text by default (since background is light #F9F5EC)
  // Only use white text if explicitly needed (e.g., on dark hero images)
  // When scrolled, always use black text on white background
  if (menuScrollActive.value) {
    return false; // Black text when scrolled (white background)
  }
  // When not scrolled, use black text unless darkHeader is true
  return false; // Default to black text for visibility on light background
});

const hideTop = ref(false);
const lastScroll = ref(0);
const menuScrollActive = ref(false);
const scrollThreshold = 75;
const isMenuOpen = ref(false);

// Refs for GSAP animation
const headerRef = ref(null);
const headerInnerRef = ref(null);
let headerAnimation = null;

// Store scroll handler reference for cleanup
let scrollHandler = null;

function handleScroll() {
  if (typeof window === 'undefined') return;
  const currentScroll = window.scrollY || window.pageYOffset || 0;
  const shouldBeActive = currentScroll > scrollThreshold;
  
  // Only update if changed to avoid unnecessary reactivity
  if (menuScrollActive.value !== shouldBeActive) {
    menuScrollActive.value = shouldBeActive;
    
    // Animate header with GSAP for smooth transition
    if (process.client && headerRef.value && headerInnerRef.value) {
      if (headerAnimation) {
        headerAnimation.kill();
      }
      
      if (shouldBeActive) {
        // Scrolled state: black background with blur, smaller padding
        headerAnimation = gsap.to(headerRef.value, {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          duration: 0.4,
          ease: 'power2.out'
        });
        
        gsap.to(headerInnerRef.value, {
          paddingTop: window.innerWidth >= 768 ? '0.5rem' : '0.5rem',
          paddingBottom: window.innerWidth >= 768 ? '0.5rem' : '0.5rem',
          duration: 0.4,
          ease: 'power2.out'
        });
      } else {
        // Top state: black background with blur, larger padding
        headerAnimation = gsap.to(headerRef.value, {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          duration: 0.4,
          ease: 'power2.out'
        });
        
        gsap.to(headerInnerRef.value, {
          paddingTop: window.innerWidth >= 768 ? '1.5rem' : '1rem',
          paddingBottom: window.innerWidth >= 768 ? '1.5rem' : '1rem',
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    }
  }
  lastScroll.value = currentScroll;
}

function toggleBurger() {
  isMenuOpen.value = !isMenuOpen.value;
}


watch(isMenuOpen, (newVal) => {
  if (process.client && typeof document !== 'undefined') {
    if (newVal) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }
});

onMounted(() => {
  // Ensure we're on client and window is available
  if (typeof window === 'undefined' || !process.client) return;
  
  // Initialize header styles - black background with blur
  if (headerRef.value) {
    gsap.set(headerRef.value, {
      backgroundColor: 'rgba(0, 0, 0, 0.8)'
    });
  }
  
  if (headerInnerRef.value) {
    const padding = menuScrollActive.value 
      ? (window.innerWidth >= 768 ? '0.5rem' : '0.25rem')
      : (window.innerWidth >= 768 ? '1.5rem' : '1rem');
    gsap.set(headerInnerRef.value, {
      paddingTop: padding,
      paddingBottom: padding
    });
  }
  
  // Create handler function
  scrollHandler = handleScroll;
  
  // Use setTimeout to ensure DOM is fully ready in production
  setTimeout(() => {
    if (typeof window !== 'undefined' && scrollHandler) {
      window.addEventListener('scroll', scrollHandler, { passive: true });
      scrollHandler(); // Initial check
      
    }
  }, 0);
});

onUnmounted(() => {
  if (typeof window !== 'undefined' && scrollHandler) {
    window.removeEventListener('scroll', scrollHandler);
    scrollHandler = null;
  }
  
  // Clean up GSAP animations
  if (headerAnimation) {
    headerAnimation.kill();
    headerAnimation = null;
  }
});
</script>

<style scoped>
.site-header {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  background-color: rgba(0, 0, 0, 0.8);
}

/* Override any last-child rules that might affect navigation alignment */
nav a:last-child {
  margin-bottom: 0 !important;
  margin-top: 0 !important;
}

/* Ensure all navigation links have consistent vertical alignment */
nav a {
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  vertical-align: middle !important;
}
</style>
