<template>
  <div class=" py-16">
    <!-- White Container -->
    <div class="px-8 md:px-16 py-8">
      <!-- White Background Container -->
      <div class="bg-[#F8F6F5] rounded-lg shadow-sm px-8 py-16 md:p-16">
        <!-- Header Section -->
        <div v-if="componentData.header || componentData.eyebrow || componentData.subheader" class="text-center mb-12">
          <p v-if="componentData.eyebrow" class="eyebrow text-sm uppercase">
            {{ componentData.eyebrow }}
          </p>
          <h2 v-if="componentData.header" class="text-3xl font-bold mb-4">
            {{ componentData.header }}
          </h2>
          <h3 v-if="componentData.subheader" class="md:mb-8">
            {{ componentData.subheader }}
          </h3>
        </div>

        <!-- Service Items Grid -->
        <div :class="[gridClasses, 'mt-24']">
        <div 
          v-for="(item, index) in componentData.linkItems" 
          :key="index"
          class="duration-300 overflow-hidden flex flex-col h-full px-4 py-4 md:px-0"
        >
          <!-- Image -->
          <div v-if="item.image" class="w-full h-32 relative mb-4">
            <CmPicture
              :image-object="item.image"
              classes="w-full h-full object-contain"
              :lazy="true"
            />
          </div>
          
          <!-- Content -->
          <div class="text-center flex flex-col flex-grow">
            <!-- Header -->
            <h5 v-if="item.header" class="">
              {{ item.header }}
            </h5>
            
            <!-- Description -->
            <p v-if="item.description" class="mb-1">
              {{ item.description }}
            </p>
            
            <!-- CTA Button -->
            <div v-if="item.ctaButton" class="mt-auto flex justify-center">
              <Buttons :data="[item.ctaButton]" />
            </div>
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
  
  // Base classes - single column on mobile, responsive on md+
  let classes = 'grid grid-cols-1 gap-8 mt-16';
  
  // Add responsive classes based on item count for md and up
  if (itemCount >= 2) {
    classes += ' md:grid-cols-2';
  }
  
  if (itemCount >= 3) {
    classes += ' lg:grid-cols-3';
  }
  
  if (itemCount >= 4) {
    classes += ' xl:grid-cols-4';
  }
  
  if (itemCount >= 5) {
    classes += ' 2xl:grid-cols-5';
  }
  
  return classes;
});
</script>
