<template>
  <footer class="text-white" style="background-color: #111111;">
    <!-- Footer CTA Section -->
    <div class="flex flex-col items-center justify-center py-8 md:py-16 px-8 md:pt-24">
      <p class="text-sm uppercase mb-8">Klar til at komme i mål?</p>
      <h2 class="text-2xl md:text-3xl font-medium mb-8 text-center">Lad os finde den bedste løsning sammen</h2>
      <button 
        @click="openFooterForm"
        class="btn btn-primary"
      >
        Indhent tilbud i dag
      </button>
    </div>

    <!-- Main Footer Content -->
    <div class="px-8 md:px-20 pt-12 md:pt-8 py-8 md:pb-16">
      <div class="border-t border-white/10 pt-8 md:pt-24">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-8 min-h-[400px] md:min-h-0">
        <!-- Column 1: Location 1 -->
        <div v-if="companyInfo?.location1" class="flex flex-col justify-start md:justify-center text-left">
          <p class="mb-4 text-sm md:text-sm uppercase">{{ companyInfo.location1.companyName || 'Location 1' }}</p>
          <div>
            <div class="space-y-0.5">
              <a v-if="companyInfo.location1.phone" :href="'tel:' + companyInfo.location1.phone" class="text-xl block mb-0">{{ companyInfo.location1.phone }}</a>
              <a v-if="companyInfo.location1.email" :href="'mailto:' + companyInfo.location1.email" class="text-xl block mb-0">{{ companyInfo.location1.email }}</a>
            </div>
            <div class="space-y-0.5 mt-2 md:mt-6">
              <p v-if="companyInfo.location1.address" class="text-lg md:text-base mb-0">{{ companyInfo.location1.address }}</p>
              <p v-if="companyInfo.location1.zipCode && companyInfo.location1.city" class="text-lg md:text-base">{{ companyInfo.location1.zipCode }} {{ companyInfo.location1.city }}</p>
            </div>
            <p v-if="companyInfo.companyCvr" class="text-lg md:text-base mb-0 mt-4 md:mt-6">CVR: {{ companyInfo.companyCvr }}</p>
          </div>
        </div>

        <!-- Column 2: Location 2 and Location 3 -->
        <div v-if="companyInfo?.location2 || companyInfo?.location3" class="flex flex-col justify-start md:justify-center text-left">
          <!-- Location 2 -->
          <div v-if="companyInfo?.location2" class="mb-16 md:mb-4">
            <p class="mb-4 text-sm uppercase">{{ companyInfo.location2.companyName || 'Location 2' }}</p>
            <div>
              <div class="space-y-0.5">
                <a v-if="companyInfo.location2.phone" :href="'tel:' + companyInfo.location2.phone" class="text-xl block mb-0">{{ companyInfo.location2.phone }}</a>
                <a v-if="companyInfo.location2.email" :href="'mailto:' + companyInfo.location2.email" class="text-xl block mb-0">{{ companyInfo.location2.email }}</a>
              </div>
              <div class="space-y-0.5 mt-2 md:mt-0">
                <p v-if="companyInfo.location2.address" class="text-lg md:text-base mb-0">{{ companyInfo.location2.address }}</p>
                <p v-if="companyInfo.location2.zipCode && companyInfo.location2.city" class="text-lg md:text-base">{{ companyInfo.location2.zipCode }} {{ companyInfo.location2.city }}</p>
              </div>
            </div>
          </div>
          
          <!-- Location 3 -->
          <div v-if="companyInfo?.location3" class="mb-16 md:mb-0 md:mt-4">
            <p class="mb-4 text-sm uppercase">{{ companyInfo.location3.companyName || 'Location 3' }}</p>
            <div>
              <div class="space-y-0.5">
                <a v-if="companyInfo.location3.phone" :href="'tel:' + companyInfo.location3.phone" class="text-xl block mb-0">{{ companyInfo.location3.phone }}</a>
                <a v-if="companyInfo.location3.email" :href="'mailto:' + companyInfo.location3.email" class="text-xl block mb-0">{{ companyInfo.location3.email }}</a>
              </div>
            </div>
          </div>

          <!-- Footer Menu (Mobile only) -->
          <div v-if="footerMenu" class="flex flex-col md:hidden">
            <div class="flex flex-col gap-2">
              <div v-for="item in footerMenu">
                <a v-if="item.openInNewTab" class="text-lg" :href="item.url" target="_blank" rel="noopener noreferrer">
                  <span v-html="item.title"></span>
                </a>
                <nuxt-link v-else class="text-lg" :to="item.url">
                  <span v-html="item.title"></span>
                </nuxt-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Column 3: Logo -->
        <div class="flex flex-col justify-center items-center">
          <SmallLogo class="w-40 h-40" fill-color="white" :fill-opacity="0.2" />
        </div>

        <!-- Column 4: Footer Menu (Desktop only) -->
        <div v-if="footerMenu" class="hidden md:flex flex-col justify-center items-center md:ml-8 text-left">
          <div class="flex flex-col gap-2">
            <div v-for="item in footerMenu">
              <a v-if="item.openInNewTab" class="text-base" :href="item.url" target="_blank" rel="noopener noreferrer">
                <span v-html="item.title"></span>
              </a>
              <nuxt-link v-else class="text-base" :to="item.url">
                <span v-html="item.title"></span>
              </nuxt-link>
            </div>
          </div>
        </div>

        <!-- Column 5: Footer Menu 2 and Social Media -->
        <div class="flex flex-col justify-end md:justify-center items-start text-left md:ml-12">
          <div class="flex flex-col gap-2">
            <!-- Footer Menu 2 (Desktop only) -->
            <template v-if="footerMenu2">
              <div v-for="item in footerMenu2" class="hidden md:block">
                <a v-if="item.openInNewTab" class="text-base" :href="item.url" target="_blank" rel="noopener noreferrer">
                  <span v-html="item.title"></span>
                </a>
                <nuxt-link v-else class="text-base" :to="item.url">
                  <span v-html="item.title"></span>
                </nuxt-link>
              </div>
            </template>
            <!-- Social Media -->
            <a :href="socialMediaChannels.instagram" target="_blank" title="Instagram" class="text-lg md:text-base text-white mb-0" v-if="socialMediaChannels.instagram">
              Instagram
            </a>
            <a :href="socialMediaChannels.linkedin" target="_blank" title="LinkedIn" class="text-lg md:text-base text-white mb-0" v-if="socialMediaChannels.linkedin">
              LinkedIn
            </a>
          </div>
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

// Open footer form
const openFooterForm = () => {
  const formData = {
    id: 'contact-form',
    title: 'Indhent et tilbud',
    description: 'Udfyld felterne nedenfor, så vi kan give dig et tilbud hurtigt.'
  };
  
  if (process.client) {
    window.dispatchEvent(new CustomEvent('openForm', { 
      detail: formData 
    }));
  }
};

</script>

<style scoped>
footer {
  background-color: #111111 !important;
}
</style>
