<template>
  <footer class="bg-black text-white py-16 md:pt-[100px] md:pb-10 mx-2 md:mx-4 lg:mx-8 xl:mx-12 mb-2 md:mb-4 lg:mb-8 xl:mb-12">
    <div class="container">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
      
        
        <div class="md:row-start-1"></div>
      
  
        <div class="flex justify-center md:justify-center md:col-start-6 md:col-span-2 md:row-start-2 mb-8">
          <cm-picture v-if="footerLogo" classes="w-32 h-auto max-w-full" :image-object="footerLogo"></cm-picture>
          <SmallLogo class="w-32 h-auto max-w-full" v-else></SmallLogo>
        </div>

    
        <div class="text-center md:text-left md:col-start-2 md:col-span-2 md:row-start-3 mb-8">
          <div v-if="footerMenu1" class="flex flex-col gap-2">
            <div v-for="item in footerMenu1">
              <a v-if="item.openInNewTab" class="uppercase text-sm" :href="item.url" target="_blank" rel="noopener noreferrer">
                <span v-html="item.title"></span>
              </a>
              <nuxt-link v-else class="uppercase text-sm" :to="item.url">
                <span v-html="item.title"></span>
              </nuxt-link>
            </div>
          </div>
        </div>

      
        <div v-if="companyInfo" class="text-center md:col-start-5 md:col-span-4 md:row-start-3 mb-8 flex flex-col items-center md:items-center">
          <a :href="'tel:' + companyInfo.companyPhone" v-if="companyInfo.companyPhone" class="h6 block w-fit mb-0 uppercase">{{companyInfo.companyPhone}}</a>
          <a :href="'mailto:' + companyInfo.companyEmail" v-if="companyInfo.companyEmail" class="h6 block w-fit">{{companyInfo.companyEmail}}</a>
        </div>

        
        <div v-if="companyInfo" class="text-center md:col-start-5 md:col-span-4 md:row-start-4 mb-8 flex flex-col items-center md:items-center">
          <p class="mb-0 uppercase text-sm" v-if="companyInfo.companyAddress">{{ companyInfo.companyAddress }}</p>
          <p class="uppercase text-sm" v-if="companyInfo.companyZipCode && companyInfo.companyCity">{{ companyInfo.companyZipCode }} {{ companyInfo.companyCity }}</p>
        </div>

        
        <div v-if="companyInfo" class="text-center md:col-start-5 md:col-span-4 md:row-start-5 mb-8 flex flex-col items-center md:items-center">
          <p class="mb-0 uppercase text-sm" v-if="companyInfo.companyName">{{ companyInfo.companyName }}</p>
          <p class="uppercase text-sm" v-if="companyInfo.companyCvr">{{ companyInfo.companyCvr }}</p>
        </div>

    
        <div class="text-center md:text-left md:col-start-10 md:col-span-2 md:row-start-3">
          <div v-if="footerMenu2" class="flex flex-col gap-2">
            <div v-for="item in footerMenu2">
              <a v-if="item.openInNewTab" class="uppercase text-sm" :href="item.url" target="_blank" rel="noopener noreferrer">
                <span v-html="item.title"></span>
              </a>
              <nuxt-link v-else class="uppercase text-sm" :to="item.url">
                <span v-html="item.title"></span>
              </nuxt-link>
            </div>
          </div>
        </div>

    
        <div class="md:col-start-1 md:col-span-12 md:row-start-6 h-16"></div>

      
        <div class="text-center md:col-start-11 md:col-span-2 md:row-start-7">
          <div class="flex gap-10 justify-center">
            <a :href="socialMediaChannels.instagram" target="_blank" title="Instagram" class="text-sm uppercase text-white" v-if="socialMediaChannels.instagram">
              Instagram
            </a>
            <a :href="socialMediaChannels.linkedin" target="_blank" title="LinkedIn" class="text-sm uppercase text-white" v-if="socialMediaChannels.linkedin">
              LinkedIn
            </a>
          </div>
        </div>

  
        <div class="text-center md:text-left md:col-start-1 md:col-span-5 md:row-start-7">
          <p class="mb-0 text-sm uppercase">© {{ new Date().getFullYear() }} Thylander. All rights reserved.</p>
        </div>

       
        <div v-if="companyInfo && companyInfo.footer_cta" class="hidden md:block md:col-span-4">
          <link-button :button="{internal_link: false, link: companyInfo.footer_cta, size: 'small'}"></link-button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import {useCoreStore} from "~/stores/core";
const coreStore = useCoreStore();

const companyInfo = computed(() => {
  return coreStore.getSettings?.companyInfo;
})

const socialMediaChannels = computed(() => {
  return coreStore.getSettings?.socialMediaChannels;
})
const footerMenu1 = computed(() => {
  return coreStore.getMenu('footer-menu-1');
});
const footerMenu2 = computed(() => {
  return coreStore.getMenu('footer-menu-2');
});

const footerLogo = computed(() => {
  return coreStore.getSettings.logos?.logo_on_transparent;
})
</script>
