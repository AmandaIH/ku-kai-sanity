<template>
  <div
      ref="observerElement"
      :class="[
      fromAnimationClass,
      delayClass,
      isVisible ? animationClass : ''
    ]"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

// Props
const props = defineProps({
  /**
   * Tailwind animation class to apply when the element is visible.
   * Default: 'animate-fade-up'
   */
  animationClass: {
    type: String,
    default: "animate-fade-up",
  },
  /**
   * Initial classes to apply before animation starts
   * Default: "opacity-0 transition-opacity duration-700"
   */
  fromAnimationClass: {
    type: String,
    default: "opacity-0 transition-opacity duration-700",
  },
  /**
   * Delay in milliseconds before animation starts
   * Can be used for creating staggered animations
   * Default: 0
   */
  delay: {
    type: [Number, String],
    default: 0,
  },
  /**
   * Intersection Observer root margin.
   * Default: 0px 0px -15% 0px (15% from the top of the element must be in view)
   */
  rootMargin: {
    type: String,
    default: "0px 0px -15% 0px"
  },
});

// Computed delay class based on the delay prop
const delayClass = computed(() => {
  // If delay is already a Tailwind class (starts with "delay-"), return it as is
  if (typeof props.delay === 'string' && props.delay.startsWith('delay-')) {
    return props.delay;
  }
  
  // If it's a number or numeric string, convert to ms and create a style
  const delayMs = parseInt(props.delay);
  if (!isNaN(delayMs) && delayMs > 0) {
    return `delay-${delayMs}`;
  }
  
  return '';
});

const observerElement = ref(null); // Element to observe
const isVisible = ref(false); // Visibility state
let observer = null; // Intersection Observer instance

// Observer callback
const observeElement = ([entry]) => {
  if (entry.isIntersecting) {
    isVisible.value = true;
    observer.unobserve(entry.target); // Stop observing once visible
  }
};

// Lifecycle hooks
onMounted(() => {
  observer = new IntersectionObserver(observeElement, {
    threshold: 0,
    rootMargin: props.rootMargin
  });
  if (observerElement.value) observer.observe(observerElement.value);
});

onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>
