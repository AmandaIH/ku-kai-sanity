<template>
  <footer class="bg-[#0A1172] text-white">
    <!-- Mobile layout (under md) -->
    <div class="md:hidden p-8">
      <div class="grid grid-cols-2 gap-8 min-h-[400px]">
        <!-- Column 1: Locations and Footer Menu -->
        <div class="flex flex-col justify-start">
          <!-- Location 1 -->
          <div v-if="companyInfo?.location1" class="flex flex-col text-left mb-16">
            <p class="mb-4 uppercase">{{ companyInfo.location1.companyName || 'Location 1' }}</p>
            <div>
              <div class="space-y-0.5">
                <a v-if="companyInfo.location1.phone" :href="'tel:' + companyInfo.location1.phone" class="text-xl block">{{ companyInfo.location1.phone }}</a>
                <a v-if="companyInfo.location1.email" :href="'mailto:' + companyInfo.location1.email" class="text-xl block">{{ companyInfo.location1.email }}</a>
              </div>
              <div class="space-y-0.5 mt-2">
                <p v-if="companyInfo.location1.address" class="text-lg">{{ companyInfo.location1.address }}</p>
                <p v-if="companyInfo.location1.zipCode && companyInfo.location1.city" class="text-lg">{{ companyInfo.location1.zipCode }} {{ companyInfo.location1.city }}</p>
              </div>
            </div>
          </div>

          <!-- Location 2 -->
          <div v-if="companyInfo?.location2" class="flex flex-col text-left mb-16">
            <p class="mb-4 uppercase">{{ companyInfo.location2.companyName || 'Location 2' }}</p>
            <div>
              <div class="space-y-0.5">
                <a v-if="companyInfo.location2.phone" :href="'tel:' + companyInfo.location2.phone" class="text-xl block">{{ companyInfo.location2.phone }}</a>
                <a v-if="companyInfo.location2.email" :href="'mailto:' + companyInfo.location2.email" class="text-xl block">{{ companyInfo.location2.email }}</a>
              </div>
              <div class="space-y-0.5 mt-2">
                <p v-if="companyInfo.location2.address" class="text-lg">{{ companyInfo.location2.address }}</p>
                <p v-if="companyInfo.location2.zipCode && companyInfo.location2.city" class="text-lg">{{ companyInfo.location2.zipCode }} {{ companyInfo.location2.city }}</p>
              </div>
            </div>
          </div>

          <!-- Footer Menu -->
          <div v-if="footerMenu" class="flex flex-col">
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

        <!-- Column 2: Social Media at bottom -->
        <div class="flex flex-col justify-end items-end text-left">
          <div class="flex flex-col gap-2">
            <a :href="socialMediaChannels.instagram" target="_blank" title="Instagram" class="text-lg text-white" v-if="socialMediaChannels.instagram">
              Instagram
            </a>
            <a :href="socialMediaChannels.linkedin" target="_blank" title="LinkedIn" class="text-lg text-white" v-if="socialMediaChannels.linkedin">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop layout (md and up) -->
    <div class="hidden md:block">
      <div class="grid grid-cols-5 p-16 gap-8 py-16 pt-32 px-20">
        <!-- Column 1: Location 1 -->
        <div v-if="companyInfo?.location1" class="flex flex-col justify-center text-left">
          <p class="mb-4 text-sm uppercase">{{ companyInfo.location1.companyName || 'Location 1' }}</p>
          <div>
            <div class="space-y-0.5">
              <a v-if="companyInfo.location1.phone" :href="'tel:' + companyInfo.location1.phone" class="text-xl block mb-0">{{ companyInfo.location1.phone }}</a>
              <a v-if="companyInfo.location1.email" :href="'mailto:' + companyInfo.location1.email" class="text-xl block mb-0">{{ companyInfo.location1.email }}</a>
            </div>
            <div class="space-y-0.5 mt-6">
              <p v-if="companyInfo.location1.address" class="text-base mb-0">{{ companyInfo.location1.address }}</p>
              <p v-if="companyInfo.location1.zipCode && companyInfo.location1.city" class="text-base">{{ companyInfo.location1.zipCode }} {{ companyInfo.location1.city }}</p>
            </div>
          </div>
        </div>

        <!-- Column 2: Location 2 -->
        <div v-if="companyInfo?.location2" class="flex flex-col justify-center text-left">
          <p class="mb-4 text-sm uppercase">{{ companyInfo.location2.companyName || 'Location 2' }}</p>
          <div>
            <div class="space-y-0.5">
              <a v-if="companyInfo.location2.phone" :href="'tel:' + companyInfo.location2.phone" class="text-xl block mb-0">{{ companyInfo.location2.phone }}</a>
              <a v-if="companyInfo.location2.email" :href="'mailto:' + companyInfo.location2.email" class="text-xl block mb-0">{{ companyInfo.location2.email }}</a>
            </div>
            <div class="space-y-0.5 mt-6">
              <p v-if="companyInfo.location2.address" class="text-base mb-0">{{ companyInfo.location2.address }}</p>
              <p v-if="companyInfo.location2.zipCode && companyInfo.location2.city" class="text-base">{{ companyInfo.location2.zipCode }} {{ companyInfo.location2.city }}</p>
            </div>
          </div>
        </div>

        <!-- Column 3: Logo -->
        <div class="flex flex-col justify-center items-center">
          <SmallLogo class="w-40 h-40" fill-color="white" :fill-opacity="0.2" />
        </div>

        <!-- Column 4: Footer Menu -->
        <div v-if="footerMenu" class="flex flex-col justify-start items-end text-left">
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

        <!-- Column 5: Social Media -->
        <div class="flex flex-col justify-start items-end text-left">
          <div class="flex flex-col gap-2">
            <a :href="socialMediaChannels.instagram" target="_blank" title="Instagram" class="text-base text-white" v-if="socialMediaChannels.instagram">
              Instagram
            </a>
            <a :href="socialMediaChannels.linkedin" target="_blank" title="LinkedIn" class="text-base text-white" v-if="socialMediaChannels.linkedin">
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
import Logo from '~/components/ui/Logo.vue';

const coreStore = useCoreStore();

const companyInfo = computed(() => {
  return coreStore.getSettings?.companyInfo;
})

const socialMediaChannels = computed(() => {
  return coreStore.getSettings?.socialMediaChannels;
})
const footerMenu = computed(() => {
  return coreStore.getMenu('footer-menu');
});

</script>