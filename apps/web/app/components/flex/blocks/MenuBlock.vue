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
          class="md:col-span-1 md:row-start-2 md:col-start-2 flex items-center justify-center"
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
          <div class="mb-4">
            <h3 class="text-2xl md:text-3xl font-display uppercase tracking-wide">
              {{ section.title }}
            </h3>
          </div>

          <!-- Menu Items with Border -->
          <div class="border border-[#8B5E3C] rounded-lg pt-3 md:pt-4 px-4 md:px-6">
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
                  <span v-if="item.price" class="text-base md:text-lg font-medium">
                    {{ item.price }}
                  </span>
                </div>
                
                <!-- Ingredients -->
                <div v-if="item.ingredients && item.ingredients.length > 0" class="flex flex-wrap gap-2 mt-1">
                  <span 
                    v-for="(ingredient, ingIndex) in item.ingredients" 
                    :key="ingIndex"
                    class="text-sm text-black/70 flex items-center gap-1"
                  >
                    <span class="w-1 h-1 bg-black/40 rounded-full"></span>
                    {{ ingredient }}
                  </span>
                </div>
                
                <!-- Description -->
                <p v-if="item.description" class="text-sm text-black/70 mt-1">
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
              class="w-16 h-16 md:w-20 md:h-20"
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
import { useCheckmateFlexSettings } from '~/composables/checkmateFlexSettings';

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
    grid-auto-rows: minmax(auto, 1fr);
    grid-auto-flow: row dense;
    gap: 2rem;
  }
}

.menu-section:last-child {
  padding-bottom: 0;
}
</style>

