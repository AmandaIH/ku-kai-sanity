<template>
  <section 
    class="flex-section" 
    :data-index="index" 
    :class="[sectionClasses]"
    :id="anchorId || null"
  >
    <slot></slot>
  </section>
</template>
<script setup>
import {useCheckmateFlexSettings} from "~/composables/checkmateFlexSettings";

const props = defineProps({
  layout: {
    type: String,
    default: '',
  },
  data: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: Number,
    default: 0,
  },
  spacing: {
    type: Boolean,
    default: true,
  },
  classes: {
    type: String,
    default: '',
  },
  bg: {
    type: String,
    default: 'white',
  },
  paddingSettings: {
    type: Array,
    default: () => [],
  },
});
const sectionClasses  = computed (() => {
  if (props.data.settings) {
    const { getContainerClasses } = useCheckmateFlexSettings(props.data.settings);
    return getContainerClasses('background');
  }
  return [];
});

// Get anchor ID from data (it's in the root of the block data, not in settings)
const anchorId = computed(() => {
  return props.data?.anchorId || null;
});

</script>
