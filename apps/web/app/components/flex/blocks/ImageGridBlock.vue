<template>
  <div :class="containerClasses">
    <div class="px-8 md:px-16 py-8 md:py-16">
      <!-- Media Grid (Images & Videos) -->
      <div v-if="componentData.media && componentData.media.length > 0" class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div 
          v-for="(item, index) in componentData.media" 
          :key="index"
          class="w-full rounded-lg overflow-hidden aspect-square"
        >
          <!-- Image -->
          <CmPicture
            v-if="item.type === 'image' && item.image"
            :image-object="item.image"
            classes="w-full h-full object-cover rounded-lg"
            :lazy="true"
          />
          
          <!-- Video -->
          <cm-video
            v-else-if="item.type === 'video' && item.video"
            :src="item.video"
            :classes="'w-full h-full object-cover rounded-lg'"
            :autoplay="true"
            :muted="true"
            :loop="true"
            :controls="false"
          />
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
</script>

