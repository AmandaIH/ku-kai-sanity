<template>
  <div :class="containerClasses">
    <!-- Dark Container -->
    <div class="px-8 md:px-16 py-8">
      <!-- Dark Background Container -->
      <div class="bg-[#302C26] rounded-lg shadow-sm p-8 md:p-16">
        <!-- Header Section -->
        <div v-if="componentData.header || componentData.eyebrow || componentData.subheader" class="text-center mb-12">
          <p v-if="componentData.eyebrow" class="eyebrow text-sm uppercase text-white">
            {{ componentData.eyebrow }}
          </p>
          <h2 v-if="componentData.header" class="text-3xl font-bold mb-4 text-white">
            {{ componentData.header }}
          </h2>
          <h3 v-if="componentData.subheader" class="md:mb-8 text-white">
            {{ componentData.subheader }}
          </h3>
        </div>

        <!-- Food Items Grid -->
        <div :class="[gridClasses, 'mt-12']">
        <div 
          v-for="(item, index) in componentData.linkItems" 
          :key="index"
          class="duration-300 overflow-hidden flex flex-col h-full px-4 py-4 md:px-0 group"
        >
          <!-- Image - Square -->
          <div v-if="item.image" class="w-full mb-4 rounded-lg overflow-hidden aspect-square">
            <CmPicture
              :image-object="item.image"
              classes="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
              :lazy="true"
            />
          </div>
          
          <!-- Content -->
          <div class="text-center flex flex-col flex-grow">
            <!-- Header - White text -->
            <h5 v-if="item.header" class="text-white">
              {{ item.header }}
            </h5>
            
            <!-- Description -->
            <p v-if="item.description" class="mb-1 text-white">
              {{ item.description }}
            </p>
          </div>
        </div>
        </div>

        <!-- Single CTA Button at Bottom -->
        <div v-if="componentData.ctas && componentData.ctas.length > 0" class="flex justify-center">
          <Buttons :data="componentData.ctas" />
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
  // Only apply width if explicitly set to 'contained', otherwise use full width
  let classes = getContainerClasses('background', 'text', 'padding', 'margin');
  
  // Only add width constraint if container is explicitly set to 'contained'
  if (componentData.value.container === 'contained') {
    classes.push(...getContainerClasses('width'));
  }
  
  // Add default padding if no custom padding is set
  if (!componentData.value.customPadding) {
    classes.push('py-16');
  }
  
  return classes.join(' ');
});

// Dynamic grid classes based on number of items
const gridClasses = computed(() => {
  const itemCount = componentData.value.linkItems?.length || 0;
  
  // Base classes - single column on mobile, 3 columns at md breakpoint
  let classes = 'grid grid-cols-1 gap-8 md:grid-cols-3';
  
  return classes;
});
</script>

