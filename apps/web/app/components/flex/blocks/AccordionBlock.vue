<template>
  <div class="section-container">
    <div class="px-8 md:px-16 py-8 md:py-16">
      <div class="default-grid !gap-y-0">
      <div class="col-span-full" v-if="componentData.eyebrow || componentData.header || componentData.subheader">
        <div class="flex flex-col py-6 border-b border-b-2 border-[#111111] border-opacity-10">
          <p ref="eyebrowRef" class="eyebrow" v-if="componentData.eyebrow" v-html="componentData.eyebrow"></p>
          <div ref="headerWrapperRef" v-if="componentData.header">
            <h1 v-if="index == 0" class="h1 !mb-0">
              <span v-html="componentData.header"></span>
            </h1>
            <h2 v-else class="h2 !mb-0">
              <span v-html="componentData.header"></span>
            </h2>
          </div>
          <h6 ref="subheaderRef" v-if="componentData.subheader" v-html="componentData.subheader"></h6>
        </div>
      </div>

      <div class="col-span-full">
        <AccordionItem
            v-for="(item, itemIndex) in componentData.items"
            :key="itemIndex"
            :index="itemIndex"
            :item="item"
            :activeIndexes="activeIndexes"
            :toggleActiveIndex="toggleActiveIndex"
        />
      </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useGsapAnimations } from '~/composables/useGsapAnimations';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCheckmateFlexSettings } from '~/composables/checkmateFlexSettings';


interface AccordionItem {
  title?: string;
  content?: any[];
  ctas?: any[];
}

interface AccordionBlockData {
  eyebrow?: string;
  header?: string;
  subheader?: string;
  items?: AccordionItem[];
  behavior?: 'single' | 'multiple';
  defaultOpen?: number[];
  spacing?: string;
  backgroundColor?: string;
  textColor?: string;
  customMargin?: any;
  customPadding?: any;
  container?: 'contained' | 'fullWidth';
}

const props = defineProps<{
  data: AccordionBlockData;
  index?: number;
  isInSbs?: boolean;
}>();


const componentData = computed(() => props.data);
const componentSettings = computed(() => props.data);


const { getContainerClasses } = useCheckmateFlexSettings(componentSettings);

const activeIndexes = ref<number[]>([]);

// Refs for GSAP animations
const eyebrowRef = ref<HTMLElement | null>(null);
const headerWrapperRef = ref<HTMLElement | null>(null);
const subheaderRef = ref<HTMLElement | null>(null);
const scrollTriggerInstance = ref<ScrollTrigger | null>(null);

// Initialize GSAP animations
const { scrollTriggerAnimation, staggerAnimation } = useGsapAnimations();

const toggleActiveIndex = (index: number) => {
  if (componentData.value.behavior === 'single') {
  
    activeIndexes.value = activeIndexes.value.includes(index) ? [] : [index];
  } else {

    if (activeIndexes.value.includes(index)) {
      activeIndexes.value = activeIndexes.value.filter((i) => i !== index);
    } else {
      activeIndexes.value = [...activeIndexes.value, index];
    }
  }
};

onMounted(() => {
 
  if (componentData.value.defaultOpen && componentData.value.defaultOpen.length > 0) {
    activeIndexes.value = [...componentData.value.defaultOpen];
  }

  // Set up GSAP animations for headline elements
  const elements = [
    eyebrowRef.value,
    headerWrapperRef.value,
    subheaderRef.value
  ].filter((el): el is HTMLElement => el !== null); 

  if (elements.length > 0 && elements[0]) {
    const timeline = staggerAnimation(elements, {
      duration: 0.6,
      ease: "power2.out"
    }, 0.2);

    
    scrollTriggerInstance.value = scrollTriggerAnimation(elements[0], timeline, {
      trigger: elements[0],
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none none"
    });
  }
});

onBeforeUnmount(() => {

  if (scrollTriggerInstance.value) {
    scrollTriggerInstance.value.kill();
  }
});

/**
 * Container classes
 */
const containerClasses = computed(() => {
  return getContainerClasses('background', 'text', 'padding', 'margin', 'width');
});
</script>


