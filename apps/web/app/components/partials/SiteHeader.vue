<template>
      <header ref="headerRef" class="site-header fixed top-0 w-full z-50" :class="[
        darkHeader ? 'text-[#111111]' : (shouldUseWhiteText ? 'text-white' : 'text-black')
      ]">
    <div ref="headerInnerRef" class="w-full px-8 md:px-8 lg:px-16 flex items-center justify-between">

      <!-- Logo -->
      <div class="z-[26] flex-shrink-0">
      <nuxt-link :to="frontpageRoute">
        <!-- Regular logo when not scrolled -->
        <Logo 
        v-if="!menuScrollActive"
        class="w-auto" 
        style="height: 3.5rem;"
        :fill-color="darkHeader ? '#111111' : (shouldUseWhiteText ? 'white' : 'black')"
        :hide-text="false"
         ></Logo>
        <!-- Simple logo when scrolled -->
        <SimpleLogo 
        v-else
        class="w-auto" 
        style="height: 1.9rem;"
        :fill-color="'#111111'"
         ></SimpleLogo>
      </nuxt-link>
      </div>

      <!-- Desktop Navigation - Centered -->
      <nav class="hidden md:flex items-center justify-center flex-1 z-[22]">
        <div class="flex items-center gap-8">
          <NavigationLink 
            v-for="menuItem in mainMenu.filter(item => {
              const linkType = item.linkType || (item.isExternal === true ? 'external' : item.isExternal === false ? 'internal' : 'form')
              return linkType !== 'form' && item.url !== '/' && item.url !== '/index' && item.url !== '/frontpage'
            })" 
            :key="menuItem.ID" 
            :link="menuItem"
            class="nav-link text-sm uppercase font-medium whitespace-nowrap relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
        :class="[
          menuScrollActive ? 'text-[#181D2D]' : (darkHeader ? 'text-[#111111]' : (shouldUseWhiteText ? 'text-white' : 'text-black')),
          isActivePage(menuItem.url) ? 'after:scale-x-100' : ''
        ]"
          >
            {{ menuItem.title }}
          </NavigationLink>

        </div>
      </nav>

      <!-- Desktop Buttons - Right Side -->
      <div class="hidden md:flex items-center justify-center gap-6 z-[22]">
        <LanguageSwitcher />
        
        <!-- Få tilbud - Text Link -->
        <button 
          class="uppercase font-medium text-sm cursor-pointer relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
          :class="[
            menuScrollActive ? 'text-[#181D2D]' : (darkHeader ? 'text-[#111111]' : (shouldUseWhiteText ? 'text-white' : 'text-black'))
          ]"
          @click="openFallbackForm"
        >
          Få tilbud
        </button>
        
        <!-- Booking Button -->
        <button 
          class="flex gap-4 items-center btn"
          :class="[
            'btn-primary',
            menuScrollActive ? 'btn-scrolled' : '',
            darkHeader ? 'btn-dark-header' : ''
          ].filter(Boolean).join(' ')"
          @click="navigateToBooking"
        >
          Booking
        </button>
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
import FormButton from '~/components/ui/FormButton.vue';
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
  return store.getMenu('main-menu', locale.value) || [];
});

// Hardcoded header form button configuration
const defaultHeaderFormButton = computed(() => {
  return {
    linkTitle: 'Få tilbud',
    variant: 'primary', // Keep primary but we'll handle styling via CSS
    formConfig: {
      formId: 'contact-form',
      formTitle: 'Indhent et tilbud',
      formDescription: 'Udfyld felterne nedenfor, så vi kan give dig et tilbud hurtigt.'
    }
  };
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
  // Always use white text when at the top of the page (not scrolled)
  // Use black text when scrolled
  return !menuScrollActive.value;
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
        // Scrolled state: white background, smaller padding
        headerAnimation = gsap.to(headerRef.value, {
          backgroundColor: '#FFFFFF',
          duration: 0.4,
          ease: 'power2.out'
        });
        
        gsap.to(headerInnerRef.value, {
          paddingTop: window.innerWidth >= 768 ? '0.5rem' : '0.25rem',
          paddingBottom: window.innerWidth >= 768 ? '0.5rem' : '0.25rem',
          duration: 0.4,
          ease: 'power2.out'
        });
      } else {
        // Top state: transparent background, larger padding
        headerAnimation = gsap.to(headerRef.value, {
          backgroundColor: 'transparent',
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

// Navigate to booking page
function navigateToBooking() {
  navigateTo('/booking');
}

// Fallback function to open form when menu data isn't available
const openFallbackForm = () => {
  const formData = {
    id: 'contact-form',
    title: 'Indhent et tilbud',
    description: 'Udfyld felterne nedenfor, så vi kan give dig et tilbud hurtigt.'
  }
  
  if (process.client) {
    window.dispatchEvent(new CustomEvent('openForm', { 
      detail: formData 
    }))
  }
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
  
  // Initialize header styles
  if (headerRef.value) {
    gsap.set(headerRef.value, {
      backgroundColor: menuScrollActive.value ? '#FFFFFF' : 'transparent'
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
