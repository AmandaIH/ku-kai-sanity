<template>
  <footer class="bg-primary text-black">
    <!-- Main Footer Content -->
    <div class="px-8 md:px-16 py-8 md:py-12 max-w-[1480px] mx-auto">
      <div class="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
        <!-- Left: Address -->
        <div v-if="companyInfo?.location1" class="flex flex-col text-center md:text-left">
          <p v-if="companyInfo.location1.address" class="text-base font-body">{{ companyInfo.location1.address }}</p>
          <p v-if="companyInfo.location1.zipCode && companyInfo.location1.city" class="text-base font-body">{{ companyInfo.location1.zipCode }} {{ companyInfo.location1.city }}</p>
        </div>
        <div v-else class="flex flex-col text-center md:text-left">
          <p class="text-base font-body">Amagerbrogade 14</p>
          <p class="text-base font-body">2300 Amager</p>
        </div>

        <!-- Center: Ramen Bowl Logo -->
        <div class="flex flex-col justify-center items-center">
          <RamenBowlLogo />
        </div>

        <!-- Right: Footer Menu -->
        <div v-if="footerMenu && footerMenu.length > 0" class="flex flex-col text-center md:text-right">
          <template v-for="(item, index) in footerMenu" :key="index">
            <div :class="index === 0 ? '' : 'mt-2'">
              <a v-if="item.openInNewTab" class="text-sm uppercase font-medium text-black whitespace-nowrap relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100" :class="[isActivePage(item.url) ? 'after:scale-x-100' : '']" :href="item.url" target="_blank" rel="noopener noreferrer">
                <span v-html="item.title"></span>
              </a>
              <nuxt-link v-else class="text-sm uppercase font-medium text-black whitespace-nowrap relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100" :class="[isActivePage(item.url) ? 'after:scale-x-100' : '']" :to="item.url">
                <span v-html="item.title"></span>
              </nuxt-link>
            </div>
          </template>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import {useCoreStore} from "~/stores/core";
import RamenBowlLogo from '~/components/ui/RamenBowlLogo.vue';

const coreStore = useCoreStore();
const { locale } = useI18n();
const route = useRoute();

// Get frontpage route
const frontpageRoute = computed(() => {
  const settings = coreStore.getSettings;
  if (settings?.frontpage?.slug?.current) {
    return `/${settings.frontpage.slug.current}`;
  }
  return '/';
});

const companyInfo = computed(() => {
  return coreStore.getSettings?.companyInfo;
})

const footerMenu = computed(() => {
  return coreStore.getMenu('footer-menu', locale.value) || [];
});

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

</script>

