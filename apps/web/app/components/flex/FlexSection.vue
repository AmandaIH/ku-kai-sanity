<template>
  <section class="flex-section" :data-index="index" :class="[sectionClasses]">
<!--  <section class="flex-section" :data-index="index">-->
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

</script>
