<template>
  <footer class="text-white" style="background-color: #111111;">
    <!-- Footer CTA Section -->
    <div class="flex flex-col items-center justify-center py-8 md:py-16 px-8 md:pt-24">
      <p class="text-sm uppercase mb-8">Klar til at komme i mål?</p>
      <h2 class="text-2xl md:text-3xl font-medium mb-8 text-center">Lad os finde den bedste løsning sammen</h2>
      <nuxt-link 
        :to="offerFormPath"
        class="btn btn-primary"
      >
        Indhent tilbud i dag
      </nuxt-link>
    </div>

    <!-- Main Footer Content -->
    <div class="px-8 md:px-20 pt-12 md:pt-8 py-8 md:pb-16">
      <div class="border-t border-white/10 pt-8 md:pt-24">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-8 min-h-[400px] md:min-h-0 items-start content-start">
        <!-- Column 1: Location 1 -->
        <div v-if="companyInfo?.location1" class="flex flex-col justify-start text-left m-0 p-0 footer-col">
          <p class="text-sm uppercase footer-first-text">{{ companyInfo.location1.companyName || 'Location 1' }}</p>
          <div class="mt-2">
            <div class="space-y-0.5">
              <a v-if="companyInfo.location1.phone" :href="'tel:' + companyInfo.location1.phone" class="text-xl block mb-0 relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100">{{ companyInfo.location1.phone }}</a>
              <a v-if="companyInfo.location1.email" :href="'mailto:' + companyInfo.location1.email" class="text-xl block mb-0 relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100">{{ companyInfo.location1.email }}</a>
            </div>
            <div class="space-y-0.5 mt-2 md:mt-6">
              <p v-if="companyInfo.location1.address" class="text-lg md:text-base mb-0">{{ companyInfo.location1.address }}</p>
              <p v-if="companyInfo.location1.zipCode && companyInfo.location1.city" class="text-lg md:text-base">{{ companyInfo.location1.zipCode }} {{ companyInfo.location1.city }}</p>
            </div>
            <p v-if="companyInfo.companyCvr" class="text-lg md:text-base mb-0 mt-4 md:mt-6">CVR: {{ companyInfo.companyCvr }}</p>
          </div>
        </div>

        <!-- Column 2: Location 2 and Location 3 -->
        <div v-if="companyInfo?.location2 || companyInfo?.location3" class="flex flex-col justify-start text-left m-0 p-0 footer-col">
          <!-- Location 2 -->
          <div v-if="companyInfo?.location2" class="mb-6 md:mb-1 m-0 p-0 mt-0 pt-0">
            <p class="text-sm uppercase footer-first-text">{{ companyInfo.location2.companyName || 'Location 2' }}</p>
            <div class="mt-2">
              <div class="space-y-0.5">
                <a v-if="companyInfo.location2.phone" :href="'tel:' + companyInfo.location2.phone" class="text-xl block mb-0 relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100">{{ companyInfo.location2.phone }}</a>
                <a v-if="companyInfo.location2.email" :href="'mailto:' + companyInfo.location2.email" class="text-xl block mb-0 relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100">{{ companyInfo.location2.email }}</a>
              </div>
              <div class="space-y-0.5 mt-2 md:mt-6">
                <p v-if="companyInfo.location2.address" class="text-lg md:text-base mb-0">{{ companyInfo.location2.address }}</p>
                <p v-if="companyInfo.location2.zipCode && companyInfo.location2.city" class="text-lg md:text-base">{{ companyInfo.location2.zipCode }} {{ companyInfo.location2.city }}</p>
              </div>
            </div>
          </div>
          
          <!-- Location 3 -->
          <div v-if="companyInfo?.location3" class="mb-16 md:mb-0 md:mt-0">
            <p class="mb-2 text-sm uppercase">{{ companyInfo.location3.companyName || 'Location 3' }}</p>
            <div>
              <div class="space-y-0.5">
                <a v-if="companyInfo.location3.phone" :href="'tel:' + companyInfo.location3.phone" class="text-xl block mb-0 relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100">{{ companyInfo.location3.phone }}</a>
                <a v-if="companyInfo.location3.email" :href="'mailto:' + companyInfo.location3.email" class="text-xl block mb-0 relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100">{{ companyInfo.location3.email }}</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Mobile: Footer Menus aligned horizontally -->
        <div class="col-span-2 md:hidden pt-0 mt-0 grid grid-cols-2 gap-8">
          <!-- Footer Menu 1 (Mobile: in column 1) -->
          <div v-if="footerMenuMobile && footerMenuMobile.length > 0" class="flex flex-col">
            <template v-for="(item, index) in footerMenuMobile" :key="index">
              <div :class="index === 0 ? '' : 'mt-2'">
                <a v-if="item.openInNewTab" class="text-base inline-block relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100" :href="item.url" target="_blank" rel="noopener noreferrer">
                  <span v-html="item.title"></span>
                </a>
                <nuxt-link v-else class="text-base inline-block relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100" :to="item.url">
                  <span v-html="item.title"></span>
                </nuxt-link>
              </div>
            </template>
          </div>

          <!-- Footer Menu 2 and Social Media (Mobile: in column 2) -->
          <div class="flex flex-col">
            <!-- Footer Menu 2 (filter out Tilladelser on mobile) -->
            <template v-if="footerMenu2Mobile && footerMenu2Mobile.length > 0">
              <template v-for="(item, index) in footerMenu2Mobile" :key="index">
                <div :class="index === 0 ? '' : 'mt-2'">
                  <a v-if="item.openInNewTab" class="text-base inline-block relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100" :href="item.url" target="_blank" rel="noopener noreferrer">
                    <span v-html="item.title"></span>
                  </a>
                  <nuxt-link v-else class="text-base inline-block relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100" :to="item.url">
                    <span v-html="item.title"></span>
                  </nuxt-link>
                </div>
              </template>
            </template>

            <!-- Social Media -->
            <template v-if="footerMenu2Mobile && footerMenu2Mobile.length > 0">
              <a v-if="socialMediaChannels.instagram" :href="socialMediaChannels.instagram" target="_blank" title="Instagram" class="text-base inline-block relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 mt-2">
                Instagram
              </a>
              <a v-if="socialMediaChannels.linkedin" :href="socialMediaChannels.linkedin" target="_blank" title="LinkedIn" class="text-base inline-block relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 mt-2">
                LinkedIn
              </a>
            </template>
            <template v-else>
              <a v-if="socialMediaChannels.instagram" :href="socialMediaChannels.instagram" target="_blank" title="Instagram" class="text-base inline-block relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100">
                Instagram
              </a>
              <a v-if="socialMediaChannels.linkedin" :href="socialMediaChannels.linkedin" target="_blank" title="LinkedIn" class="text-base inline-block relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100 mt-2">
                LinkedIn
              </a>
            </template>
          </div>
        </div>

        <!-- Column 3: Logo -->
        <div class="hidden md:flex flex-col justify-center items-center">
          <SmallLogo class="w-40 h-40" fill-color="white" :fill-opacity="0.2" />
        </div>

        <!-- Column 4: Footer Menu (Desktop) -->
        <div v-if="footerMenu" class="hidden md:flex flex-col justify-center items-center md:ml-16 text-left m-0 p-0 footer-col md:-mt-1">
          <template v-for="(item, index) in footerMenu" :key="index">
            <a v-if="item.openInNewTab && index === 0" class="text-base footer-first-text relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100" :href="item.url" target="_blank" rel="noopener noreferrer">
              <span v-html="item.title"></span>
            </a>
            <nuxt-link v-else-if="index === 0" class="text-base footer-first-text relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100" :to="item.url">
              <span v-html="item.title"></span>
            </nuxt-link>
            <div v-else class="mt-2">
              <a v-if="item.openInNewTab" class="text-base relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100" :href="item.url" target="_blank" rel="noopener noreferrer">
                <span v-html="item.title"></span>
              </a>
              <nuxt-link v-else class="text-base relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100" :to="item.url">
                <span v-html="item.title"></span>
              </nuxt-link>
            </div>
          </template>
        </div>

        <!-- Column 5: Footer Menu 2 and Social Media (Desktop only) -->
        <div class="hidden md:flex flex-col justify-start items-start text-left md:ml-12 m-0 p-0 footer-col md:-mt-1">
          <!-- Footer Menu 2 (Desktop only) -->
          <template v-if="footerMenu2 && footerMenu2.length > 0">
            <template v-for="(item, index) in footerMenu2" :key="index">
              <a v-if="item.openInNewTab && index === 0" class="text-base footer-first-text hidden md:block relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100" :href="item.url" target="_blank" rel="noopener noreferrer">
                <span v-html="item.title"></span>
              </a>
              <nuxt-link v-else-if="index === 0" class="text-base footer-first-text hidden md:block relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100" :to="item.url">
                <span v-html="item.title"></span>
              </nuxt-link>
              <div v-else class="hidden md:block mt-2">
                <a v-if="item.openInNewTab" class="text-base relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100" :href="item.url" target="_blank" rel="noopener noreferrer">
                  <span v-html="item.title"></span>
                </a>
                <nuxt-link v-else class="text-base relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100" :to="item.url">
                  <span v-html="item.title"></span>
                </nuxt-link>
              </div>
            </template>
          </template>
          <!-- Social Media -->
          <a :href="socialMediaChannels.instagram" target="_blank" title="Instagram" class="text-lg md:text-base text-white footer-first-text relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100" v-if="socialMediaChannels.instagram && (!footerMenu2 || footerMenu2.length === 0)">
            Instagram
          </a>
          <a :href="socialMediaChannels.linkedin" target="_blank" title="LinkedIn" class="text-lg md:text-base text-white mt-2 relative after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[1px] after:bg-current after:scale-x-0 after:origin-left after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100" v-if="socialMediaChannels.linkedin">
            LinkedIn
          </a>
        </div>
        </div>
      </div>
    </div>

    <!-- Copyright - always at bottom -->
    <div class="flex items-center justify-center py-8">
      <p class="text-sm uppercase">© Waystar transport & logistics {{ new Date().getFullYear() }}</p>
    </div>
  </footer>
</template>

<script setup>
import {useCoreStore} from "~/stores/core";
import SmallLogo from '~/components/ui/SmallLogo.vue';

const coreStore = useCoreStore();
const { locale } = useI18n();

// Construct locale-aware path for the offer form page
const offerFormPath = computed(() => {
  // For Danish (default locale), use /faa-tilbud
  // For other locales, use /{locale}/faa-tilbud
  if (locale.value === 'da') {
    return '/faa-tilbud';
  }
  return `/${locale.value}/faa-tilbud`;
});

const companyInfo = computed(() => {
  return coreStore.getSettings?.companyInfo;
})

const socialMediaChannels = computed(() => {
  return coreStore.getSettings?.socialMediaChannels || {};
})

const footerMenu = computed(() => {
  return coreStore.getMenu('footer-menu', locale.value) || [];
});

const footerMenu2 = computed(() => {
  return coreStore.getMenu('footer-menu-2', locale.value) || [];
});

// Helper function to check if an item is "Tilladelser"
const isTilladelserItem = (item) => {
  if (!item) return false;
  
  // Normalize a string for comparison
  const normalize = (str) => String(str || '').toLowerCase().trim();
  
  // Check URL (most reliable) - could be /tilladelser or /da/tilladelser or just tilladelser
  if (item.url) {
    const urlStr = normalize(item.url);
    // Check for exact match or ends with /tilladelser
    if (urlStr === '/tilladelser' || 
        urlStr === 'tilladelser' ||
        urlStr === '/tilladelser/' ||
        urlStr.endsWith('/tilladelser') ||
        urlStr.endsWith('/tilladelser/') ||
        urlStr.includes('/tilladelser')) {
      return true;
    }
  }
  
  // Check internal link slug (slug is just "tilladelser" without leading slash)
  if (item.internalLink?.slug?.current) {
    const slugStr = normalize(item.internalLink.slug.current);
    if (slugStr === 'tilladelser') {
      return true;
    }
  }
  
  // Check title as fallback
  if (item.title) {
    const titleStr = normalize(item.title);
    // Strip HTML if present
    const cleanTitle = titleStr.replace(/<[^>]*>/g, '').replace(/&[#\w]+;/g, ' ').trim();
    if (cleanTitle === 'tilladelser' || cleanTitle.includes('tilladelser')) {
      return true;
    }
  }
  
  return false;
};

// Helper function to get the visible index (excluding Tilladelser) for spacing
const getVisibleItemIndex = (menu, currentIndex) => {
  if (!menu || !Array.isArray(menu)) return 0;
  let visibleIndex = 0;
  for (let i = 0; i <= currentIndex; i++) {
    if (!isTilladelserItem(menu[i])) {
      if (i === currentIndex) return visibleIndex;
      visibleIndex++;
    }
  }
  return visibleIndex;
};


// Filter out "Tilladelser" from Footer Menu 1 for mobile (left column)
const footerMenuMobile = computed(() => {
  if (!footerMenu.value || !Array.isArray(footerMenu.value)) return [];
  
  return footerMenu.value.filter(item => !isTilladelserItem(item));
});

// Footer Menu 2 for mobile - show as-is (keep Tilladelser in right column)
const footerMenu2Mobile = computed(() => {
  if (!footerMenu2.value || !Array.isArray(footerMenu2.value)) return [];
  
  return footerMenu2.value;
});


</script>

<style scoped>
footer {
  background-color: #111111 !important;
}

/* Force perfect alignment of first text in columns 1, 2, 4, and 5 */
.footer-col {
  margin-top: 0 !important;
  padding-top: 0 !important;
  align-items: flex-start !important;
}

/* Remove any spacing from wrapper divs in column 2 */
.footer-col > div:first-child {
  margin-top: 0 !important;
  padding-top: 0 !important;
}

/* Target the first direct child text element in each footer column */
.footer-col > .footer-first-text,
.footer-col > p.footer-first-text {
  margin: 0 !important;
  padding: 0 !important;
  line-height: 1 !important;
  display: block;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  align-self: flex-start !important;
}

/* Target links that are first children */
.footer-col > a.footer-first-text,
.footer-col > nuxt-link.footer-first-text {
  margin: 0 !important;
  padding: 0 !important;
  line-height: 1 !important;
  display: block;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  align-self: flex-start !important;
}

/* Ensure column 2's wrapper doesn't add spacing and the p tag aligns */
.footer-col > div:first-child > p.footer-first-text {
  margin: 0 !important;
  padding: 0 !important;
  line-height: 1 !important;
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  align-self: flex-start !important;
}
</style>
