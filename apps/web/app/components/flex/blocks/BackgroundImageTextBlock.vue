<template>
  <div class="section-container" :id="'background-image-text-' + (index || 0)" :class="[containerClasses, componentData.size === 'half' && props.index !== 0 ? '!items-center' : '']">
    <!-- Container with padding -->
    <div class="px-8 md:px-16 py-8 md:py-16" :class="containerClasses">
      <!-- Container with background image and content -->
      <div class="relative overflow-hidden flex items-center min-h-[80vh] md:min-h-[70vh] rounded-lg">
        <!-- Background image - absolute positioned -->
        <div class="absolute inset-0">
          <cm-picture v-if="heroType === 'image' && componentData.backgroundImage" :image-object="componentData.backgroundImage" :crops="['default:800', 'md:1200', 'lg:1600']" 
            :classes="'w-full h-full object-cover'" :lazy="(index || 0) > 0"></cm-picture>
          
          <hero-cm-video v-if="heroType === 'video' && componentData.backgroundVideo" :index="index" :src="componentData.backgroundVideo" :classes="'w-full h-full object-cover'"></hero-cm-video>
        </div>
        
        <!-- Overlay only on background media -->
        <div class="inset-0 absolute bg-black z-[1]" :style="{ opacity: (componentData.opacity || 0) / 100 }"></div>
        
        <!-- Content - positioned on image for both mobile and desktop -->
        <div v-if="hasContent" class="relative z-10 w-full p-8 md:p-16">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8">
            <!-- Mobile: full width, Desktop: columns 1-4 -->
            <div class="md:col-span-4">
              <div class="w-full md:max-w-none bg-white/10 backdrop-blur-md rounded-lg p-6 md:p-10 max-w-full">
                <div class="flex flex-col justify-between h-full">
                  <!-- Top Section: Eyebrow and Header -->
                  <div class="flex flex-col">
                    <!-- Eyebrow -->
                    <p v-if="componentData.eyebrow" class="eyebrow text-sm uppercase text-white tracking-wider" v-html="componentData.eyebrow"></p>
                    
                    <!-- Header -->
                    <div v-if="componentData.header" class="mb-16 md:mb-16">
                      <h3 class="text-white leading-none break-words" style="letter-spacing: -0.01em;">
                        <span v-html="componentData.header"></span>
                      </h3>
                    </div>
                  </div>
                  
                  <!-- Bottom Section: Subheader, Body Text and Buttons -->
                  <div class="flex flex-col mt-auto">
                    <!-- Subheader -->
                    <div v-if="componentData.subheader" class="mb-8">
                      <h6 class="text-white break-words text-bas leading-normal" v-html="componentData.subheader"></h6>
                    </div>
                    
                    <!-- Body Text -->
                    <div v-if="componentData.paragraphText" class="text-white text-base mb-4 break-words" style="letter-spacing: -0.01em;" v-html="componentData.paragraphText">
                    </div>
                    
                    <!-- Buttons -->
                    <div v-if="componentData.ctas && componentData.ctas.length > 0" class="mt-0">
                      <Buttons :data="componentData.ctas" class="!justify-start !items-start md:!items-center !mt-0 !gap-4 flex-col md:flex-row"></Buttons>
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