<template>
  <!-- Regular burger icon -->
  <button @click="coreStore.toggleShowMenu()" class="flex gap-1 flex-col w-7 h-4 relative z-[26] items-center justify-center" :class="[coreStore.showMenu ? 'sm:hidden' : '']">
    <span class="h-[1px] w-7 absolute top-[30%] left-[50%] translate-x-[-50%] block duration-300 bg-current" :class="[coreStore.showMenu ? 'opacity-0' : '']"></span>
    <span class="h-[1px] w-7 absolute top-[70%] left-[50%] translate-x-[-50%] block duration-300 bg-current" :class="[coreStore.showMenu ? 'opacity-0' : '']"></span>
  </button>
</template>

<script setup>
import { useCoreStore } from '~/stores/core';
const coreStore = useCoreStore();
</script>
