<template>
  <div class="section-container bg-primary" :id="'background-image-text-' + (index || 0)" :class="[containerClasses, componentData.size === 'half' && props.index !== 0 ? '!items-center' : '']">
    <!-- Container with padding - this shows the background color -->
    <div class="px-8 md:px-16 py-8 md:py-16 md:mt-8" :class="containerClasses">
      <!-- Container with background image and content -->
      <div class="relative overflow-visible flex flex-col sm:flex-row sm:items-end min-h-[80vh] md:min-h-[70vh] rounded-lg bg-primary">
        <!-- Background image - absolute positioned on desktop, relative on mobile -->
        <div class="relative sm:absolute w-full sm:inset-0 rounded-lg overflow-hidden min-h-[40vh] sm:min-h-0 mt-8">
          <cm-picture v-if="heroType === 'image' && componentData.backgroundImage" :image-object="componentData.backgroundImage" :crops="['default:800', 'md:1200', 'lg:1600']" 
            :classes="'w-full h-full object-cover rounded-lg'" :lazy="(index || 0) > 0"></cm-picture>
          
          <hero-cm-video v-if="heroType === 'video' && componentData.backgroundVideo" :index="index" :src="componentData.backgroundVideo" :classes="'w-full h-full object-cover rounded-lg'"></hero-cm-video>
          
          <!-- Overlay only on background media -->
          <div class="absolute inset-0 bg-black z-[1] rounded-lg" :style="{ opacity: (componentData.opacity || 0) / 100 }"></div>
        </div>
        
        <!-- Text box - below image on mobile, positioned at bottom on desktop -->
        <div v-if="hasContent" class="relative z-10 w-full sm:absolute sm:inset-0 sm:flex sm:items-end -mt-4 sm:-mt-0 sm:-mb-8 md:-mb-16">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 px-0 sm:px-16 pb-0 w-full">
            <!-- Text overlay - spans more columns, positioned at bottom -->
            <div class="md:col-span-10 md:col-start-2 lg:col-span-8 lg:col-start-3 text-white">
              <div class="w-full bg-black/80 backdrop-blur-md rounded-lg p-8 md:p-12">
                <div class="flex flex-col">
                  <!-- Eyebrow -->
                  <p v-if="componentData.eyebrow" class="eyebrow text-sm uppercase text-white/80 md:text-white tracking-wider mb-4" v-html="componentData.eyebrow"></p>
                  
                  <!-- Header -->
                  <div v-if="componentData.header" class="mb-6 md:mb-8">
                    <h3 class="text-white leading-none break-words" style="letter-spacing: -0.01em;">
                      <span v-html="componentData.header"></span>
                    </h3>
                  </div>
                  
                  <!-- Body Text and Buttons Container -->
                  <div class="flex flex-col">
                    <!-- Subheader -->
                    <div v-if="componentData.subheader" class="mb-6">
                      <h6 class="text-white break-words leading-normal" v-html="componentData.subheader"></h6>
                    </div>
                    
                    <!-- Body Text -->
                    <div v-if="componentData.paragraphText" class="text-white text-base break-words mb-6" style="letter-spacing: -0.01em;" v-html="componentData.paragraphText">
                    </div>
                    
                    <!-- Buttons -->
                    <div v-if="componentData.ctas && componentData.ctas.length > 0" class="mt-4">
                      <Buttons :data="componentData.ctas" class="!justify-start !mt-0"></Buttons>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Buttons from '../../ui/Buttons.vue';

// Define the component data interface
interface BackgroundImageTextBlockData {
  eyebrow?: string;
  header?: string;
  subheader?: string;
  paragraphText?: string;
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
  data: BackgroundImageTextBlockData;
  index?: number;
}>();

const componentData = computed(() => props.data);

const heroType = computed(() => {
  return componentData.value.backgroundType || 'image';
});

const containerClasses = computed(() => {
  return componentData.value.size === 'half' ? 'min-h-[80svh] md:min-h-[70svh]' : 'min-h-[80vh] md:min-h-[70vh]';
});

// Check if there's any content to display
const hasContent = computed(() => {
  return !!(
    componentData.value.eyebrow ||
    componentData.value.header ||
    componentData.value.subheader ||
    componentData.value.paragraphText ||
    (componentData.value.ctas && componentData.value.ctas.length > 0)
  );
});
</script>