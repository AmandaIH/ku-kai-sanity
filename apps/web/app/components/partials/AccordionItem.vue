<template>
  <div class="border-b border-current pb-4" ref="accordionItem">
  
    <div class="hidden sm:flex items-center pt-4 gap-4">
   
      <div class="flex-1 min-w-0 flex items-center">
        <button class="w-full text-left" @click="toggleAccordion">
          <span class="text-xl font-medium !mb-0 line-clamp-3" v-html="item.title"></span>
        </button>
      </div>
       

      <div class="flex-1 min-w-0">
        <div ref="contentRef" :style="'max-height:'+maxHeight+';'" class="overflow-hidden duration-500">
          <div class="text-sm">
            <PortableText :value="item.content" />
            <Buttons :data="item.ctas"></Buttons>
          </div>
        </div>
      </div>
      
   
      <div class="flex-shrink-0">
        <button @click="toggleAccordion" class="w-32 h-32 flex items-center justify-center text-xl font-extralight duration-300">
          <span class="text-2xl" v-if="!isActive">+</span>
          <span class="text-2xl" v-else>−</span>
        </button>
      </div>
    </div>


    <div class="sm:hidden pt-4">
  
      <div class="flex items-center justify-between mb-3">
        <button class="flex-1 text-left" @click="toggleAccordion">
          <span class="text-xl font-medium !mb-0" v-html="item.title"></span>
        </button>
        <button @click="toggleAccordion" class="w-16 h-16 flex items-center justify-center text-xl font-thin duration-300 ml-4">
          <span class="text-2xl" v-if="!isActive">+</span>
          <span class="text-2xl" v-else>−</span>
        </button>
      </div>
      
  
      <div ref="contentRefMobile" :style="'max-height:'+maxHeightMobile+';'" class="overflow-hidden duration-500">
        <div class="text-sm">
          <PortableText :value="item.content" />
          <Buttons :data="item.ctas"></Buttons>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PortableText } from '@portabletext/vue';
const props = defineProps({
  item: {
    type: Object,
    default: () => ({}),
  },
  index: {
    type: Number,
    default: null,
  },
  activeIndexes: {
    type: Array,
    default: () => [],
  },
  activeHover: {
    type: Number,
    default: null,
  },
  toggleActiveIndex: {
    type: Function,
    default: () => {},
  },
});

const isActive = computed(() => props.activeIndexes.includes(props.index));
const toggleAccordion = () => {
  props.toggleActiveIndex(props.index);
};

const accordionItem = ref();
const showContent = ref(false);
const maxHeight = ref('0px');
const maxHeightMobile = ref('0px');
const contentRef = ref(null);
const contentRefMobile = ref(null);
const scroll = ref(true);
watch(() => isActive.value, (newVal, oldVal) => {
  if (isActive.value) {
  
    if (contentRef.value) {
      maxHeight.value = contentRef.value.scrollHeight + 'px';
    }
    
  
    if (contentRefMobile.value) {
      maxHeightMobile.value = contentRefMobile.value.scrollHeight + 'px';
    }

    setTimeout(() => {
      if(scroll.value) {
        const {top} = accordionItem.value.getBoundingClientRect();
        let scrollTop = window.scrollY + top - 90;
        if (top < 0) {
          if (window.innerWidth > 960) {
            scrollTop = window.scrollY + top - 115;
          }
          window.scrollTo({
            top: scrollTop,
            behavior: 'smooth',
          });
        }
      }
    }, 500);

    setTimeout(() => {
      showContent.value = true;
    }, 300);
  } else {
    showContent.value = false;
    maxHeight.value = '0px';
    maxHeightMobile.value = '0px';
  }
});

onMounted(() => {

});

</script>
