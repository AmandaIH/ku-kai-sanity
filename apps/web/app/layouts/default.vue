<template>
    <div @click="handleOutsideClick" class="bg-primary min-h-screen">
      
        
        <SiteHeader/>
        <div id="slot" :class="[coreStore.getShowMenu ? 'sm:blur-sm' : '']">
            <slot></slot>
        </div>
        <SiteFooter />
        
        <!-- Form Modal -->
        <FormModal />
      
        <button v-if="coreStore.getShowMenu" @click="coreStore.toggleShowMenu()" class="fixed top-5 right-5 w-10 h-10 z-[50] flex items-center justify-center">
            <span class="h-0.5 w-5 absolute -rotate-45 bg-white"></span>
            <span class="h-0.5 w-5 absolute rotate-45 bg-white"></span>
        </button>
    </div>
</template>

<script setup>
import { useCoreStore } from '~/stores/core';
import FormModal from '~/components/ui/FormModal.vue';

const coreStore = useCoreStore();

// Get the current route to fetch page data for header styling
const route = useRoute();

// Get the slug from the route params
const slug = computed(() => {
  const slugArray = route.params.slug
  return Array.isArray(slugArray) ? slugArray.join('/') : slugArray
})

// Fetch page data to get darkHeader value for header styling
const { page: pageData } = await useCheckmateSingle({
  path: slug.value || '' // Pass empty string for frontpage to let composable handle it
})

// Set current page in store if data exists
if (pageData.value) {
  coreStore.setCurrentPage(pageData.value)
}

function handleOutsideClick(event) {

  if (coreStore.getShowMenu && window.innerWidth >= 640) {
    const burgerMenu = document.querySelector('.burger-menu');
    const burgerIcon = document.querySelector('button[class*="z-\\[26\\]"]');
    
    if (burgerMenu && burgerIcon && 
        !burgerMenu.contains(event.target) && 
        !burgerIcon.contains(event.target)) {
      coreStore.toggleShowMenu();
    }
  }
}
</script>
