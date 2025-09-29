<template>
  <header class="site-header fixed top-0 w-full z-50 duration-300 transition-all" :class="[menuScrollActive ? 'bg-[#FFFFFF] text-[#181D2D]' : 'bg-transparent ' + (shouldUseWhiteText ? 'text-white' : 'text-black')]">
    <div class="w-full px-4 md:px-6 flex items-center justify-between" :class="menuScrollActive ? 'py-2 md:py-3' : 'py-4 md:py-6'">

      <!-- Logo -->
      <div class="z-[26] flex-shrink-0">
        <nuxt-link to="/">
          <Logo 
            class="w-8 h-8" 
            :class="[store.getShowMenu ? 'hidden sm:block' : '']"
            :fill-color="menuScrollActive ? '#181D2D' : (shouldUseWhiteText ? 'white' : 'black')"
            :fill-opacity="menuScrollActive ? '1' : '0.8'"
          ></Logo>
        </nuxt-link>
      </div>

      <!-- Desktop Navigation - Centered -->
      <nav class="hidden md:flex items-center justify-center flex-1 z-[22]">
        <div class="flex items-center gap-8">
          <nuxt-link 
            v-for="menuItem in mainMenu" 
            :key="menuItem.ID" 
            :to="menuItem.url" 
            class="font-medium transition-colors duration-300 hover:text-[#FF5D52] whitespace-nowrap"
            :class="menuScrollActive ? 'text-[#181D2D]' : (shouldUseWhiteText ? 'text-white' : 'text-black')"
          >
            {{ menuItem.title }}
          </nuxt-link>
        </div>
      </nav>

      <!-- Mobile Burger Menu -->
      <div class="md:hidden flex items-center gap-8 z-[22]">
        <div class="flex">
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

const props = defineProps({
  textIsWhite: {
    type: Boolean,
    default: true
  },
});

const store = useCoreStore();
const route = useRoute();

const mainMenu = computed(() => {
  const menu = store.getMenu('main-menu') || [];
  return menu;
});

// Check if we're on the front page
const isFrontPage = computed(() => {
  return route.path === '/' || route.path === '/index' || route.path === '/frontpage';
});

// Determine text color based on page and scroll state
const shouldUseWhiteText = computed(() => {
  // On front page: use white text until scrolled, then black
  // On other pages: always use black text
  return isFrontPage.value && !menuScrollActive.value;
});

const hideTop = ref(false);
const lastScroll = ref(0);
const menuScrollActive = ref(false);
const scrollThreshold = 75;
const isMenuOpen = ref(false);

function handleScroll() {
  let currentScroll = window.scrollY;

  if(currentScroll < 0) {
    currentScroll = 0;
  }

  menuScrollActive.value = currentScroll > scrollThreshold;
  lastScroll.value = currentScroll;
  
}

function toggleBurger() {
  isMenuOpen.value = !isMenuOpen.value;
}


watch(isMenuOpen, (newVal) => {
  if (newVal) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
  }
});

onMounted(() => {
 
  window.addEventListener('scroll', handleScroll, { passive: true });

  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
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
