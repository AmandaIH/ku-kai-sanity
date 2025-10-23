<template>
  <header class="site-header fixed top-0 w-full z-50 duration-300 transition-all" :class="[menuScrollActive ? 'bg-[#FFFFFF] text-[#181D2D]' : 'bg-transparent ' + (shouldUseWhiteText ? 'text-white' : 'text-black')]">
    <div class="w-full px-8 md:px-8 lg:px-16 flex items-center justify-between" :class="menuScrollActive ? 'py-1 md:py-2' : 'py-4 md:py-6'">

      <!-- Logo -->
      <div class="z-[26] flex-shrink-0">
      <nuxt-link to="/">
        <!-- Regular logo when not scrolled -->
        <Logo 
        v-if="!menuScrollActive"
        class="w-auto" 
        style="height: 3.5rem;"
        :class="[store.getShowMenu ? 'hidden sm:block' : '']"
        :fill-color="shouldUseWhiteText ? 'white' : 'black'"
        :fill-opacity="0.8"
        :hide-text="false"
         ></Logo>
        <!-- Simple logo when scrolled -->
        <SimpleLogo 
        v-else
        class="w-auto" 
        style="height: 1.9rem;"
        :class="[store.getShowMenu ? 'hidden sm:block' : '']"
         ></SimpleLogo>
      </nuxt-link>
      </div>

      <!-- Desktop Navigation - Centered -->
      <nav class="hidden md:flex items-center justify-center flex-1 z-[22]">
        <div class="flex items-center gap-8">
          <NavigationLink 
            v-for="menuItem in mainMenu.filter(item => item.linkType !== 'form')" 
            :key="menuItem.ID" 
            :link="menuItem"
            class="nav-link font-medium whitespace-nowrap relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
            :class="menuScrollActive ? 'text-[#181D2D]' : (shouldUseWhiteText ? 'text-white' : 'text-black')"
          >
            {{ menuItem.title }}
          </NavigationLink>
        </div>
      </nav>

      <!-- Desktop Form Button - Right Side -->
      <div class="hidden md:flex items-center z-[22]">
        <NavigationLink 
          v-for="menuItem in mainMenu.filter(item => item.linkType === 'form')" 
          :key="'desktop-form-' + menuItem.ID" 
          :link="menuItem"
          :class="menuScrollActive ? 'btn btn-scrolled' : 'btn btn-primary'"
        >
          Booking
        </NavigationLink>
        <!-- Fallback booking button if no menu data -->
        <button 
          v-if="mainMenu.filter(item => item.linkType === 'form').length === 0"
          @click="openFallbackForm"
          :class="menuScrollActive ? 'btn btn-scrolled' : 'btn btn-primary'"
        >
          Booking
        </button>
      </div>

      <!-- Mobile Burger Menu -->
      <div class="md:hidden flex items-center gap-4 z-[22]">
        <!-- Form button on mobile - positioned left of burger icon -->
        <NavigationLink 
          v-for="menuItem in mainMenu.filter(item => item.linkType === 'form')" 
          :key="'mobile-form-' + menuItem.ID" 
          :link="menuItem"
          :class="menuScrollActive ? 'btn btn-scrolled' : 'btn btn-primary'"
        >
          Booking
        </NavigationLink>
        <!-- Fallback booking button for mobile if no menu data -->
        <button 
          v-if="mainMenu.filter(item => item.linkType === 'form').length === 0"
          @click="openFallbackForm"
          :class="menuScrollActive ? 'btn btn-scrolled' : 'btn btn-primary'"
        >
          Booking
        </button>
        
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
import SimpleLogo from '~/components/ui/SimpleLogo.vue';
import NavigationLink from '~/components/ui/NavigationLink.vue';

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
  console.log('Main menu data:', menu);
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
