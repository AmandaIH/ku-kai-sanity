<template>
  <div class="flex items-center justify-start gap-1 mt-10" v-if="buttons.length > 0">
    <link-button v-for="(button, bIndex) in buttons" :key="'text-btn-'+bIndex" :button="button"></link-button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  data: {
    type: Array as PropType<any[]>,
    default: () => ([]),
  },
});

const buttons = computed(() => props.data || []);
</script>
