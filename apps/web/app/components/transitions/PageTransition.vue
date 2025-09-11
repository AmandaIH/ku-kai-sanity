<template>
  <Transition
    :name="transitionName"
    :mode="mode"
    :appear="appear"
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
  >
    <slot />
  </Transition>
</template>

<script setup lang="ts">
interface Props {
  name?: 'page' | 'slide' | 'fade' | 'scale' | 'flip' | 'blur' | 'custom'
  mode?: 'default' | 'out-in' | 'in-out'
  appear?: boolean
  duration?: number
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  name: 'page',
  mode: 'out-in',
  appear: true,
  duration: 400,
  customClass: ''
})

// Computed transition name
const transitionName = computed(() => {
  if (props.name === 'custom' && props.customClass) {
    return props.customClass
  }
  return props.name
})

// Transition hooks for advanced control
const onBeforeEnter = (el: Element) => {
  // Add any custom logic before enter
}

const onEnter = (el: Element, done: () => void) => {
  // Add any custom logic during enter
  done()
}

const onAfterEnter = (el: Element) => {
  // Add any custom logic after enter
}

const onBeforeLeave = (el: Element) => {
  // Add any custom logic before leave
}

const onLeave = (el: Element, done: () => void) => {
  // Add any custom logic during leave
  done()
}

const onAfterLeave = (el: Element) => {
  // Add any custom logic after leave
}
</script>

<style scoped>
/* Custom transition styles can be added here if needed */
</style>
