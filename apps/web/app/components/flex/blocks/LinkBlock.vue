<template>
  <div :class="containerClasses">
    <!-- Header Section -->
    <div v-if="componentData.header || componentData.eyebrow || componentData.subheader" class="text-center mb-8">
      <p v-if="componentData.eyebrow" class="text-sm mb-2">
        {{ componentData.eyebrow }}
      </p>
      <h2 v-if="componentData.header" class="text-2xl text-gray-900 mb-4">
        {{ componentData.header }}
      </h2>
      <p v-if="componentData.subheader" class="text-lg text-gray-600 max-w-2xl mx-auto">
        {{ componentData.subheader }}
      </p>
    </div>

    <!-- Link Items Grid -->
    <div :class="gridClasses">
      <div 
        v-for="(item, index) in componentData.linkItems" 
        :key="index"
        class="group relative transition-shadow duration-300 overflow-hidden"
      >
        <!-- Image taking full space -->
        <div v-if="item.image" class="w-full h-full min-h-[400px] relative">
          <CmPicture
            :image-object="item.image"
            classes="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            :lazy="true"
          />
        </div>
        
        <!-- Text overlay in top left corner -->
        <div class="absolute top-4 left-4">
          <h3 v-if="item.header" class="text-lg text-white drop-shadow-lg">
            {{ item.header }}
          </h3>
        </div>
        
        <!-- CTA Button in bottom left corner -->
        <div v-if="item.ctaButton" class="absolute bottom-4 left-4">
          <Buttons :data="[item.ctaButton]" />
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
});

const componentData = computed(() => props.data);
const { getContainerClasses } = useCheckmateFlexSettings(componentData);

// Container classes
const containerClasses = computed(() => {
  const itemCount = componentData.value.linkItems?.length || 0;
  let classes = getContainerClasses('background', 'text', 'padding', 'margin', 'width');
  
  // Add extra padding when there are exactly 4 items
  if (itemCount === 4) {
    classes += ' md:p-8 lg:p-16 xl:p-24';
  }
  
  return classes;
});

// Dynamic grid classes based on number of items
const gridClasses = computed(() => {
  const itemCount = componentData.value.linkItems?.length || 0;
  
  // Base classes that are always applied
  let classes = 'grid grid-cols-1 gap-8';
  
  // Add responsive classes based on item count
  if (itemCount >= 2) {
    classes += ' xs:grid-cols-2';
  }
  
  if (itemCount >= 3) {
    classes += ' sm:grid-cols-3';
  }
  
  if (itemCount >= 4) {
    classes += ' md:grid-cols-4';
  }
  
  if (itemCount >= 5) {
    classes += ' lg:grid-cols-5';
  }
  
  // For 6+ items, cap at 5 columns on large screens
  if (itemCount >= 6) {
    classes += ' xl:grid-cols-5';
  }
  
  return classes;
});
</script>