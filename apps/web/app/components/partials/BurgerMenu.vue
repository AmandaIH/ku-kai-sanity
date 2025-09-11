<template>
  <div 
    v-if="coreStore.getShowMenu"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[20] duration-300"
    @click="coreStore.toggleShowMenu()"
  ></div>
  
  <!-- Burger menu -->
  <div class="bg-dark fixed w-full sm:w-1/2 h-svh right-0 top-0 z-[22] duration-500 overflow-scroll burger-menu" :class="coreStore.getShowMenu ? '' : 'translate-x-full'">
    <div class="overflow-hidden relative min-h-full pt-2 pb-12 flex flex-col">
      <nav v-if="mainMenu" class="flex-1">
        <ul class="flex flex-col p-5 h-full overflow-scroll">
          <li class="mb-0 relative group" v-for="link in mainMenu" :key="'burger-' + link.ID"  >
            <nuxt-link class="text-2xl font-medium text-white group-hover:text-[#FF5D52] transition-all duration-300 flex items-center group-hover:translate-x-0" :to="link.url" v-if="link.url">
              <MiniLogo class="w-6 h-8 text-white group-hover:text-[#FF5D52] transition-all duration-300 transform group-hover:scale-110 opacity-0 group-hover:opacity-100 absolute" />
              <span class="group-hover:ml-8 transition-all duration-300" v-html="link.title"></span>
            </nuxt-link>
          </li>
        </ul>
     
      </nav>    
      
      
  
      <div class="flex flex-col h-full">
        <div class="flex-1"></div>
        <div class="p-5">
          <ul class="flex flex-col gap-6">
            <div class="mb-4">
              <li class="mb-0">{{ companyInfo.companyPhone }}</li>
              <li>{{ companyInfo.companyEmail }}</li>
            </div>
            <div class="mb-4 sm:flex sm:justify-between">
              <div>
                <li class="mb-0">{{ companyInfo.companyAddress }}</li>
                <li>{{ companyInfo.companyZipCode }} {{ companyInfo.companyCity }}</li>
              </div>
              <div class="sm:mt-0 mt-6">
                <li class="mb-0">{{ companyInfo.companyName }}</li>
                <li>{{ companyInfo.companyCvr }}</li>
              </div>
            </div>
          </ul>
        </div>
      </div>
  
    </div>
  </div>
</template>
<script setup>
import { useCoreStore } from '~/stores/core';
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
</script>
