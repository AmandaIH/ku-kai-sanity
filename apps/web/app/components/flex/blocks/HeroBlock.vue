<template>
  <div class="w-full relative overflow-hidden" :id="'hero-' + (index || 0)" :class="[containerClasses, componentData.size === 'half' && props.index !== 0 ? '!items-center' : '']">
    <cm-picture v-if="heroType === 'image' && componentData.backgroundImage" :image-object="componentData.backgroundImage" :crops="['default:800', 'md:1200', 'lg:1600']" 
      :classes="['absolute inset-0 flex items-center z-0 w-full h-full object-cover'].join(' ')" :lazy="(index || 0) > 0"></cm-picture>
    
    <hero-cm-video v-if="heroType === 'video' && componentData.backgroundVideo" :index="index" :src="componentData.backgroundVideo" :classes="['w-full h-full absolute inset-0 z-0 h-full w-full object-cover'].join(' ')"></hero-cm-video>
    
    <!-- Overlay only on background media -->
    <div class="inset-0 absolute bg-black z-[1]" :style="{ opacity: (componentData.overlayOpacity || 0) / 100 }"></div>

    <!-- Mobile layout - single column, text box in lower half -->
    <div class="flex flex-col justify-end md:hidden text-white z-20 min-h-screen w-full px-8 pb-16">
      
      <div class="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8">
        <div class="flex flex-col">
          <!-- Eyebrow -->
          <p v-if="componentData.eyebrow" class="text-sm uppercase text-white/80 tracking-wider mb-0" v-html="componentData.eyebrow"></p>
          
            <!-- Header -->
            <div v-if="componentData.header" class="mb-16">
              <h2 class="text-white leading-tight" style="letter-spacing: -0.01em;">
                <span v-html="componentData.header"></span>
              </h2>
            </div>
            
            
            <!-- Body Text and Buttons Container -->
            <div class="flex flex-col">
            <!-- Body Text -->
            <div v-if="componentData.paragraphText" class="text-white leading-relaxed mb-4" style="letter-spacing: -0.01em;" v-html="componentData.paragraphText">
            </div>
            
            <!-- Buttons -->
            <div v-if="componentData.ctas && componentData.ctas.length > 0" class="mt-0">
              <Buttons :data="componentData.ctas" class="!justify-start !mt-0 !gap-8"></Buttons>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop layout - 12 column grid, text box starts column 1, spans 4 columns -->
    <div class="hidden md:grid md:grid-cols-12 md:gap-6 lg:gap-8 md:min-h-screen md:px-8 lg:px-16">
      <!-- Text box - columns 1-4 (spans 4 columns) -->
      <div class="md:col-span-4 md:col-start-1 text-white z-20 flex items-end pb-16">
        
        <div class="w-full bg-white/10 backdrop-blur-md rounded-2xl p-8">
          <div class="flex flex-col">
            <!-- Eyebrow -->
            <p v-if="componentData.eyebrow" class="text-sm uppercase text-white tracking-wider mb-0" v-html="componentData.eyebrow"></p>
            
            <!-- Header -->
            <div v-if="componentData.header" class="mb-32">
              <h1 class="text-4xl lg:text-5xl font-bold text-white leading-tight" style="letter-spacing: -0.01em;">
                <span v-html="componentData.header"></span>
              </h1>
            </div>
            
            
            <!-- Body Text and Buttons Container -->
            <div class="flex flex-col">
              <!-- Body Text -->
              <div v-if="componentData.paragraphText" class="text-white text-lg mb-4" style="letter-spacing: -0.01em;" v-html="componentData.paragraphText">
              </div>
              
              <!-- Buttons -->
              <div v-if="componentData.ctas && componentData.ctas.length > 0" class="mt-0">
                <Buttons :data="componentData.ctas" class="!justify-start !mt-0 !gap-8"></Buttons>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Spacer columns 5-12 (empty) -->
      <div class="md:col-span-8"></div>
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
  overlayOpacity?: number;
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



