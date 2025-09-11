<template>
  <div>
    <span class="flex gap-4 items-center btn cursor-pointer " :class="buttonClasses" v-if="props.isClickButton">
      <slot></slot>
    </span>
    <!-- Internal Link -->
    <NuxtLink 
      v-else-if="props.button.linkType === 'internal' && hasValidPath" 
      class="flex gap-4 items-center btn" 
      :class="buttonClasses" 
      :to="buttonPath"
    >
      {{buttonText}}
    </NuxtLink>
    <!-- EXTERNAL LINKS -->
    <a 
      v-else-if="props.button.linkType === 'external' && hasValidPath" 
      class="flex gap-4 items-center btn" 
      :class="buttonClasses" 
      :target="props.button.externalLink?.openInNewTab ? '_blank' : ''" 
      :href="buttonPath"
    >
      {{buttonText}}
    </a>
    <!-- Fallback for invalid links -->
    <span 
      v-else 
      class="flex gap-4 items-center btn opacity-50 cursor-not-allowed" 
      :class="buttonClasses"
    >
      {{buttonText || 'Invalid Link'}}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  button: {
    type: Object,
    default: function() {
      return {}
    }
  },
  icon: {
    type: Boolean,
    default: true
  },
  isClickButton: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'primary'
  },
  type: {
    type: String,
    default: 'solid'
  },
  size: {
    type: String,
    default: 'large'
  }
});

const buttonClasses = computed(() => {
  const classes = [
    'btn'
  ];
  if(props.button.variant) {
    classes.push(`btn-${props.button.variant}`);
  } else {
    classes.push(`btn-${props.variant}`);
  }
  // if(props.button.buttonType) {
  //   classes.push(`btn-${props.button.buttonType}`);
  // } else {
  //   classes.push(`btn-${props.buttonType}`);
  // }
  // if(props.button.size) {
  //   classes.push(`btn-${props.button.size}`);
  // } else {
  //   classes.push(`btn-${props.size}`);
  // }
  return classes.join(' ');
})

const buttonText = computed(() => {
  if (props.button.linkTitle) {
    return props.button.linkTitle;
  }
  if (props.button.linkType === 'internal') {
    return props.button.internalLink?.title || '';
  } else if (props.button.linkType === 'external') {
    return props.button.externalLink?.url || '';
  }
  return '';
})

const buttonPath = computed(() => {
  if (props.button.linkType === 'internal') {
    const slug = props.button.internalLink?.slug?.current;
    if (!slug) return '';
    return `/${slug}`;
  } else if (props.button.linkType === 'external') {
    return props.button.externalLink?.url || '';
  }
  return '';
})

// Check if the button has a valid path
const hasValidPath = computed(() => {
  return buttonPath.value && buttonPath.value !== '';
})

</script>
