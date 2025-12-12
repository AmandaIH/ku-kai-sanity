<template>
  <div :class="containerClasses">
    <div class="px-8 py-8 md:py-16 max-w-[1480px] md:mx-16 mt-16">
      <!-- Header Section -->
      <div v-if="componentData.header || componentData.eyebrow || componentData.subheader" class="mb-12 md:mb-16 text-center">
        <p v-if="componentData.eyebrow" class="eyebrow text-sm uppercase mb-4">
          {{ componentData.eyebrow }}
        </p>
        <h2 v-if="componentData.header" class="text-3xl md:text-4xl font-semibold mb-4">
          {{ componentData.header }}
        </h2>
        <div v-if="componentData.subheader" class="text-lg" v-html="componentData.subheader"></div>
      </div>

      <!-- Menu Sections - Bento Grid -->
      <div v-if="componentData.menuSections && componentData.menuSections.length > 0" class="bento-grid px-4 md:px-32">
        <!-- Logo - positioned between sections (row 2, col 2) -->
        <div 
          v-if="componentData.logo" 
          ref="logoRef"
          class="md:col-span-1 md:row-start-2 md:col-start-2 flex items-center justify-center self-center logo-parallax"
        >
          <CmPicture
            :image-object="componentData.logo"
            classes="w-full h-full max-w-[200px] object-contain"
            :lazy="true"
          />
        </div>
        
        <div 
          v-for="(section, sectionIndex) in componentData.menuSections" 
          :key="sectionIndex"
          :class="getBentoGridClass(sectionIndex)"
          class="menu-section flex flex-col"
        >
          <!-- Section Header -->
          <div class="mb-3">
            <h3 class="text-2xl md:text-3xl font-display uppercase tracking-wide">
              {{ section.title }}
            </h3>
          </div>

          <!-- Menu Items with Border -->
          <div class="border border-[#8B5E3C] rounded-lg pt-3 md:pt-4 px-4 md:px-6 pb-3 md:pb-4 text-[#8B5E3C]">
            <div 
              v-for="(item, itemIndex) in section.items" 
              :key="itemIndex"
              class="flex items-start justify-between gap-4"
              :class="itemIndex < section.items.length - 1 ? 'pb-2' : 'pb-2'"
            >
              <div class="flex-1">
                <div class="flex items-center justify-between mb-0.5">
                  <h4 class="font-medium text-base md:text-lg">
                    {{ item.name }}
                  </h4>
                  <span v-if="item.price" class="text-base md:text-base font-medium">
                    {{ item.price }}
                  </span>
                </div>
                
                <!-- Ingredients -->
                <div v-if="item.ingredients && item.ingredients.length > 0" class="flex flex-wrap gap-2 mt-1">
                  <span 
                    v-for="(ingredient, ingIndex) in item.ingredients" 
                    :key="ingIndex"
                    class="text-sm text-[#8B5E3C]/70 flex items-center gap-1"
                  >
                    <span class="w-1 h-1 bg-black/40 rounded-full"></span>
                    {{ ingredient }}
                  </span>
                </div>
                
                <!-- Description -->
                <p v-if="item.description" class="text-sm text-[#8B5E3C]/70 mt-1">
                  {{ item.description }}
                </p>
              </div>
            </div>
          </div>
          
          <!-- Illustrations under the border (for sections like TOPPING - up to 2 SVGs side by side) -->
          <div v-if="section.illustrations && section.illustrations.length > 0" class="flex flex-row gap-4 mt-4 justify-center">
            <div 
              v-for="(illustration, illIndex) in section.illustrations" 
              :key="illIndex"
              :ref="el => { if (el && sectionIndex === 1) { const key = `svg-${sectionIndex}-${illIndex}`; svgRefs[key] = el } }"
              class="w-24 h-24 md:w-32 md:h-32 svg-illustration"
            >
              <CmPicture
                :image-object="illustration"
                classes="w-full h-full object-contain"
                :lazy="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { useCheckmateFlexSettings } from '~/composables/checkmateFlexSettings';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (process.client) {
  gsap.registerPlugin(ScrollTrigger);
}

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: Number,
    default: 0
  }
});

const componentData = computed(() => props.data);
const { getContainerClasses } = useCheckmateFlexSettings(componentData);

// Refs for animations
const svgRefs = ref({});
const logoRef = ref(null);
const scrollTriggers = ref([]);

// Container classes
const containerClasses = computed(() => {
  let classes = getContainerClasses('background', 'text', 'padding', 'margin');
  
  if (componentData.value.container === 'contained') {
    classes.push(...getContainerClasses('width'));
  }
  
  if (!componentData.value.customPadding) {
    classes.push('py-16');
  }
  
  return classes.join(' ');
});

// Bento grid classes - creates an asymmetric grid layout
const getBentoGridClass = (index) => {
  const sectionCount = componentData.value.menuSections?.length || 0;
  
  // For 3 sections: first spans 2 cols and 2 rows, others span 1 col each
  if (sectionCount === 3) {
    if (index === 0) return 'md:col-span-2 md:row-span-2';
    return 'md:col-span-1';
  }
  
  // For 2 sections: each spans 1 col
  if (sectionCount === 2) {
    return 'md:col-span-1';
  }
  
  // For 4+ sections layout:
  // RAMEN: row 1, cols 1-2 (top left, 2 columns, first row only)
  // TOPPING: row 1, col 3 (third column, first row only - SVGs can be displayed within)
  // DRINKS: row 2, col 1 (second row, first column, under RAMEN)
  // Logo: row 2, col 2 (second row, second column - reserved for logo)
  // SIDES: row 2, col 3 (second row, third column)
  if (index === 0) return 'md:col-span-2 md:row-span-1 md:row-start-1 md:col-start-1'; // RAMEN - row 1, cols 1-2
  if (index === 1) return 'md:col-span-1 md:row-span-1 md:row-start-1 md:col-start-3'; // TOPPING - row 1, col 3
  if (index === 2) return 'md:col-span-1 md:row-span-1 md:row-start-2 md:col-start-3'; // SIDES - row 2, col 3
  if (index === 3) return 'md:col-span-1 md:row-span-1 md:row-start-2 md:col-start-1'; // DRINKS - row 2, col 1
  return 'md:col-span-1';
};

// Setup GSAP animations
const setupAnimations = async () => {
  if (typeof window === 'undefined' || !gsap) return;
  
  await nextTick();
  
  // Rotate SVGs on scroll (for TOPPING section illustrations)
  Object.keys(svgRefs.value).forEach((key) => {
    const svgElement = svgRefs.value[key];
    if (!svgElement) return;
    
    // Extract section index and illustration index from key (format: "svg-1-0" or "svg-1-1")
    const parts = key.split('-');
    const sectionIndex = parseInt(parts[1]);
    const illIndex = parseInt(parts[2]);
    
    // Find the TOPPING section (index 1)
    if (sectionIndex === 1) {
      // Explicitly set initial rotation to 0 and clear any transforms
      gsap.set(svgElement, { 
        rotation: 0,
        clearProps: 'transform'
      });
      
      // Use illIndex to determine rotation direction (0 = clockwise, 1 = counterclockwise)
      const rotationDirection = illIndex % 2 === 0 ? 360 : -360;
      
      // Create ScrollTrigger with proper initialization
      const scrollTrigger = ScrollTrigger.create({
        trigger: svgElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          // Calculate rotation based on scroll progress (0 to 1)
          const rotation = self.progress * rotationDirection;
          gsap.set(svgElement, { rotation: rotation });
        },
        onRefresh: () => {
          // Reset to 0 when refreshed
          gsap.set(svgElement, { rotation: 0 });
        }
      });
      
      // Force initial update to set rotation to 0
      scrollTrigger.refresh();
      
      scrollTriggers.value.push(scrollTrigger);
    }
  });
  
  // Parallax effect for logo
  if (logoRef.value) {
    const parallaxTrigger = ScrollTrigger.create({
      trigger: logoRef.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const yOffset = (progress - 0.5) * 100; // Move up/down based on scroll
        gsap.set(logoRef.value, {
          y: yOffset
        });
      }
    });
    
    scrollTriggers.value.push(parallaxTrigger);
  }
};

onMounted(() => {
  setupAnimations();
});

onBeforeUnmount(() => {
  // Clean up ScrollTriggers
  scrollTriggers.value.forEach(trigger => {
    if (trigger && trigger.kill) {
      trigger.kill();
    }
  });
  scrollTriggers.value = [];
});
</script>

<style scoped>
.bento-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 960px) {
  .bento-grid {
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: auto;
    grid-auto-flow: row dense;
    gap: 1rem;
    align-items: start;
  }
}

.menu-section:last-child {
  padding-bottom: 0;
}

/* Reduce space under RAMEN section on specific screen sizes */
@media (min-width: 960px) and (max-width: 1280px) {
  .menu-section:first-child {
    margin-bottom: 0;
  }
  
  .menu-section:first-child .border {
    margin-bottom: 0;
  }
}
</style>

