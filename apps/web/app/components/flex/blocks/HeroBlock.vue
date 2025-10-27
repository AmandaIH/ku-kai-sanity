<template>
  <div class="w-full relative overflow-hidden" :id="'hero-' + (index || 0)" :class="[containerClasses, componentData.size === 'half' && props.index !== 0 ? '!items-center' : '']">
    <cm-picture v-if="heroType === 'image' && componentData.backgroundImage" :image-object="componentData.backgroundImage" :crops="['default:800', 'md:1200', 'lg:1600', '2xl:2560']" 
      :classes="'absolute inset-0 flex items-center z-0 w-full h-full object-cover'" :lazy="(index || 0) > 0"></cm-picture>
    
    <hero-cm-video v-if="heroType === 'video' && componentData.backgroundVideo" :index="index" :src="componentData.backgroundVideo" :classes="'w-full h-full absolute inset-0 z-0 h-full w-full object-cover'"></hero-cm-video>
    
    <!-- Overlay only on background media -->
    <div class="inset-0 absolute bg-black z-[1]" :style="{ opacity: (componentData.opacity || 0) / 100 }"></div>

    <!-- Single responsive layout -->
    <div class="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8 min-h-screen w-full px-8 lg:px-16 pb-16">
      <!-- Text box - same layout for mobile and desktop -->
      <div class="lg:col-span-5 lg:col-start-1 text-white z-20 flex items-end justify-center lg:justify-start mt-auto lg:mt-0">
        <div class="w-full bg-white/10 backdrop-blur-md rounded-2xl p-8">
          <div class="flex flex-col">
            <!-- Eyebrow -->
            <p v-if="componentData.eyebrow" class="eyebrow text-sm uppercase text-white/80 md:text-white tracking-wider" v-html="componentData.eyebrow"></p>
            
            <!-- Header -->
            <div v-if="componentData.header" class="mb-32">
              <h1 class="font-bold text-white leading-none" style="letter-spacing: -0.02em; font-size: clamp(2.25rem, 4vw, 8rem);">
                <span v-html="componentData.header"></span>
              </h1>
            </div>
            
            <!-- Body Text and Buttons Container -->
            <div class="flex flex-col">
              <!-- Body Text -->
              <div v-if="componentData.paragraphText" class="text-white text-base md:text-md leading-normal mb-8" style="letter-spacing: -0.01em;" v-html="componentData.paragraphText">
              </div>
              
              <!-- Buttons -->
              <div v-if="componentData.ctas && componentData.ctas.length > 0" class="mt-0">
                <Buttons :data="componentData.ctas" class="!justify-start !mt-0"></Buttons>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Spacer columns 6-12 (empty) - hidden on mobile -->
      <div class="hidden md:block md:col-span-7"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PortableText } from '@portabletext/vue';
import Buttons from '../../ui/Buttons.vue';

// Define the component data interface
interface HeroBlockData {
  eyebrow?: string;
  header?: string;
  subheader?: string;
  paragraphText?: any[];
  backgroundType?: 'image' | 'video';
  backgroundImage?: any;
  backgroundVideo?: any;
  opacity?: number;
  size?: 'full' | 'half';
  ctas?: any[];
  spacing?: string;
  backgroundColor?: string;
  textColor?: string;
}

const props = defineProps<{
  data: HeroBlockData;
  index?: number;
}>();

const componentData = computed(() => props.data);

const heroType = computed(() => {
  return componentData.value.backgroundType || 'image';
});

const containerClasses = computed(() => {
  return componentData.value.size === 'half' ? 'min-h-[50svh]' : 'min-h-svh';
});
</script>



