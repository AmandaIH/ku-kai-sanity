<template>
    <div @click="handleOutsideClick" class="bg-primary min-h-screen">
      
        <ClientOnly>
            <Preloader />
        </ClientOnly>
        
        <SiteHeader/>
        <div id="slot" :class="[coreStore.getShowMenu ? 'sm:blur-sm' : '']">
            <slot></slot>
        </div>
        <SiteFooter />
        
      
        <button v-if="coreStore.getShowMenu" @click="coreStore.toggleShowMenu()" class="fixed top-5 right-5 w-10 h-10 z-[50] flex items-center justify-center">
            <span class="h-0.5 w-5 absolute -rotate-45 bg-white"></span>
            <span class="h-0.5 w-5 absolute rotate-45 bg-white"></span>
        </button>
    </div>
</template>

<script setup>
import { useCoreStore } from '~/stores/core';
import Preloader from '~/components/partials/Preloader.vue';

const coreStore = useCoreStore();

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
