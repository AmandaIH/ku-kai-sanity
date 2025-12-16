<template>
  <div 
    v-if="coreStore.getShowMenu"
    class="fixed inset-0 bg-black/30 backdrop-blur-md z-[20] duration-300"
    @click="coreStore.toggleShowMenu()"
  ></div>
  
  <!-- Burger menu -->
  <div class="fixed w-full h-svh right-0 top-0 z-[22] overflow-scroll burger-menu backdrop-blur-md bg-black/80 transition-transform duration-300" :class="coreStore.getShowMenu ? '' : 'translate-x-full'">
    <!-- Close Button (X) - aligned with logo -->
    <button 
      @click="coreStore.toggleShowMenu()" 
      class="absolute top-[0.95rem] right-8 md:top-[1.45rem] md:right-16 z-[30] w-8 h-8 flex items-center justify-center"
      style="color: #F3EC26;"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
    
    <!-- Navigation content - Centered -->
    <div class="h-full flex items-center justify-center pb-32">
      <nav v-if="filteredMainMenu.length > 0 || mainMenu2.length > 0" class="flex flex-col items-center gap-6">
        <!-- Main Menu Links (same as header) -->
        <template v-for="menuItem in filteredMainMenu" :key="'burger-main-' + menuItem.ID">
          <NavigationLink 
            :link="menuItem"
            class="nav-item text-base md:text-lg uppercase font-medium whitespace-nowrap relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
            :style="{ color: '#F3EC26' }"
            :class="[
              isActivePage(menuItem.url) ? 'after:scale-x-100' : ''
            ]"
          >
            {{ menuItem.title }}
          </NavigationLink>
        </template>

        <!-- Language Switcher -->
        <div class="nav-item">
          <LanguageSwitcher />
        </div>
        
        <!-- Menu Items from main-menu-2 (same as header) -->
        <template v-for="(menuItem, index) in mainMenu2" :key="'burger-menu2-' + menuItem.ID + '-' + index">
          <!-- Text Link Style (all items except last) -->
          <NavigationLink 
            v-if="index !== mainMenu2.length - 1"
            :link="menuItem"
            class="nav-item text-base md:text-lg uppercase font-medium cursor-pointer relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
            :style="{ color: '#F3EC26' }"
          >
            {{ menuItem.title }}
          </NavigationLink>
          
          <!-- Button Style (last item) -->
          <NavigationLink 
            v-else
            :link="menuItem"
            class="nav-item flex gap-4 items-center btn btn-primary text-base md:text-lg"
          >
            {{ menuItem.title }}
          </NavigationLink>
        </template>
      </nav>    
    </div>
  </div>
</template>
<script setup>
import { useCoreStore } from '~/stores/core';
import NavigationLink from '~/components/ui/NavigationLink.vue';
import LanguageSwitcher from '~/components/partials/LanguageSwitcher.vue';
import { gsap } from 'gsap';

const coreStore = useCoreStore();
const store = coreStore; // Use same store instance
const route = useRoute();
const { locale } = useI18n();

const props = defineProps({
  mainMenu: {
    type: Array,
    default: () => [],
  },
  mainMenu2: {
    type: Array,
    default: () => [],
  },
  isScrolled: {
    type: Boolean,
    default: false
  }
})

// Get menus - use prop if available, otherwise get from store (same as header)
const mainMenu = computed(() => {
  // First try to use the prop passed from header
  if (props.mainMenu && props.mainMenu.length > 0) {
    return props.mainMenu;
  }
  // Fallback to store
  let menu = store.getMenu('main-menu', locale.value) || [];
  if (menu.length === 0) {
    menu = store.getMenu('main-navigation', locale.value) || [];
  }
  return menu;
});

const mainMenu2 = computed(() => {
  // First try to use the prop passed from header
  if (props.mainMenu2 && props.mainMenu2.length > 0) {
    return props.mainMenu2;
  }
  // Fallback to store
  let menu = store.getMenu('main-menu-2', locale.value) || [];
  if (menu.length === 0) {
    menu = store.getMenu('main-navigation-2', locale.value) || [];
  }
  return menu;
});

// Filter main menu (same logic as header)
const filteredMainMenu = computed(() => {
  return mainMenu.value.filter(item => {
    const linkType = item.linkType || (item.isExternal === true ? 'external' : item.isExternal === false ? 'internal' : 'form')
    return linkType !== 'form' && item.url !== '/' && item.url !== '/index' && item.url !== '/frontpage'
  });
});

// Close menu when route changes
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


// Watch for menu state changes and animate nav items
watch(() => coreStore.getShowMenu, (isOpen) => {
  if (isOpen) {
    // Wait for the menu to be visible, then animate nav items
    nextTick(() => {
      setTimeout(() => {
        const navItems = document.querySelectorAll('.burger-menu .nav-item');
        if (navItems.length > 0) {
          // Set initial state first, then animate
          gsap.set(navItems, { opacity: 0, y: 30 });
          gsap.to(navItems, { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            ease: "power2.out", 
            stagger: 0.2 
          });
        } else {
          console.log('No nav items found in burger menu. Menu items:', {
            filteredMainMenu: filteredMainMenu.value,
            mainMenu2: mainMenu2.value
          });
        }
      }, 150); // Small delay to ensure menu is visible
    });
  } else {
    // When menu closes, hide the nav items
    nextTick(() => {
      const navItems = document.querySelectorAll('.burger-menu .nav-item');
      if (navItems.length > 0) {
        gsap.set(navItems, { opacity: 0, y: 30 });
      }
    });
  }
}, { immediate: true });
</script>
