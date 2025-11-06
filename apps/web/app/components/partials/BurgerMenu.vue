<template>
  <div 
    v-if="coreStore.getShowMenu"
    class="fixed inset-0 bg-black/30 backdrop-blur-md z-[20] duration-300"
    @click="coreStore.toggleShowMenu()"
  ></div>
  
  <!-- Burger menu -->
  <div class="fixed w-full h-svh right-0 top-0 z-[22] overflow-scroll burger-menu" :class="coreStore.getShowMenu ? '' : 'translate-x-full'">
    <!-- Header with logo -->
    <div class="absolute top-0 left-0 p-6 z-30">
      <!-- Logo is handled by the main header -->
    </div>

    <!-- Navigation content -->
    <div class="h-full flex items-center justify-start pb-32">
      <nav v-if="mainMenu" class="p-6">
        <ul class="flex flex-col">
          <li class="mb-0 relative group nav-item" v-for="link in mainMenu" :key="'burger-' + link.ID" >
            <nuxt-link 
              class="text-2xl font-medium text-white relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100" 
              :class="isActivePage(link.url) ? 'after:scale-x-100' : ''"
              :to="link.url" 
              v-if="link.url"
            >
              <span v-html="link.title"></span>
            </nuxt-link>
          </li>
        </ul>
      </nav>    
    </div>

    <!-- Footer with Language Switcher and Buttons -->
    <div class="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between z-30">
      <!-- Language Switcher - Left Bottom -->
      <div class="flex items-center">
        <LanguageSwitcher />
      </div>

      <!-- Log ind and Booking Buttons - Right Bottom -->
      <div class="flex items-center gap-4">
        <!-- Log ind Button -->
        <button 
          class="uppercase font-medium text-sm text-white cursor-pointer relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
          @click="navigateToLogin"
        >
          Få tilbud
        </button>
        
        <!-- Booking Button -->
        <button 
          class="flex gap-4 items-center btn btn-primary"
          @click="navigateToBooking"
        >
          Booking
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useCoreStore } from '~/stores/core';
import Logo from '~/components/ui/Logo.vue';
import { gsap } from 'gsap';

const coreStore = useCoreStore();

const props = defineProps({
  mainMenu: {
    type: Array,
    default: () => [],
  },
  isScrolled: {
    type: Boolean,
    default: false
  }
})

// Navigate to booking page
function navigateToBooking() {
  navigateTo('/booking');
  if(coreStore.getShowMenu) {
    coreStore.toggleShowMenu();
  }
}

// Navigate to login page
function navigateToLogin() {
  navigateTo('/booking'); // Assuming login is on booking page, adjust if needed
  if(coreStore.getShowMenu) {
    coreStore.toggleShowMenu();
  }
}

// Close menu when route changes
const route = useRoute();
watch(() => route.path, () => {
  if(coreStore.getShowMenu) {
    coreStore.toggleShowMenu();
  }
})

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

const companyInfo = computed(() => {
  return coreStore.getSettings?.companyInfo;
})

// Hide nav items immediately when component mounts
onMounted(() => {
  nextTick(() => {
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems.length > 0) {
      gsap.set(navItems, { opacity: 0, y: 30 });
    }
  });
});

// Watch for menu state changes and animate nav items
watch(() => coreStore.getShowMenu, (isOpen) => {
  if (isOpen) {
    // Wait for the backdrop blur to complete, then animate nav items
    nextTick(() => {
      setTimeout(() => {
        const navItems = document.querySelectorAll('.nav-item');
        if (navItems.length > 0) {
          // Always set initial state first, then animate
          gsap.set(navItems, { opacity: 0, y: 30 });
          gsap.to(navItems, { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            ease: "power2.out", 
            stagger: 0.2 
          });
        }
      }, 100); // Small delay to ensure backdrop blur is visible
    });
  } else {
    // When menu closes, hide the nav items
    nextTick(() => {
      const navItems = document.querySelectorAll('.nav-item');
      if (navItems.length > 0) {
        gsap.set(navItems, { opacity: 0, y: 30 });
      }
    });
  }
});
</script>
