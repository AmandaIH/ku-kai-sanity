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
      <!-- Logo -->
      <nuxt-link to="/" @click="coreStore.toggleShowMenu()">
        <Logo class="w-auto h-9" fill-color="white" :fill-opacity="0.8" />
      </nuxt-link>
    </div>

    <!-- Navigation content -->
    <div class="h-full flex items-center justify-start">
      <nav v-if="mainMenu" class="pl-4">
        <ul class="flex flex-col">
          <li class="mb-0 relative group nav-item" v-for="link in mainMenu" :key="'burger-' + link.ID" >
            <nuxt-link class="text-2xl font-medium text-white relative after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100" :to="link.url" v-if="link.url">
              <span v-html="link.title"></span>
            </nuxt-link>
          </li>
        </ul>
      </nav>    
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

// Close menu when route changes
const route = useRoute();
watch(() => route.path, () => {
  if(coreStore.getShowMenu) {
    coreStore.toggleShowMenu();
  }
})

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
