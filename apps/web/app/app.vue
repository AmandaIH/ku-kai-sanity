<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useCoreStore } from '~/stores/core';

// Initialize core store data when app starts
const store = useCoreStore();

// Fetch initial data
await store.fetchProjectInitData();

// Fetch menus
await store.fetchMenus();
</script>
