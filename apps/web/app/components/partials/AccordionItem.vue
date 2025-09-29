<template>
  <div class="border-b border-b-2 border-[#111111] border-opacity-10 py-6" ref="accordionItem">
  
    <div class="hidden sm:grid grid-cols-12 gap-4">
      <!-- First 4 columns: Number, Question, Answer, and Buttons -->
      <div class="col-span-4 flex items-start gap-4">
        <!-- Number display -->
        <div class="flex-shrink-0 w-12 text-left">
          <span class="text-xl">{{ String(index + 1).padStart(2, '0') }}</span>
        </div>
        
        <!-- Question, Answer, and Buttons -->
        <div class="flex-1 min-w-0">
          <button class="w-full text-left" @click="toggleAccordion">
            <span class="text-xl font-medium !mb-0 line-clamp-3" v-html="item.title"></span>
          </button>
          
          <!-- Answer content and buttons -->
          <div ref="contentRef" :style="'max-height:'+maxHeight+';'" class="overflow-hidden duration-500">
            <div class="text-sm">
              <!-- Answer content -->
              <PortableText :value="item.content" />
              <!-- Desktop: Buttons after content -->
              <div class="hidden md:block">
                <Buttons :data="item.ctas"></Buttons>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Next 4 columns: Image -->
      <div class="col-span-4 hidden md:block">
        <div v-if="item.image && isActive" class="my-4">
          <cm-picture 
            :image-object="item.image" 
            :crops="['default:400', 'md:600', 'lg:800']" 
            :classes="['w-full h-auto object-cover rounded-lg']"
            :lazy="true"
          />
        </div>
      </div>
      
      <!-- Last 4 columns: +/- Toggle button -->
      <div class="col-span-4 flex justify-end">
        <button @click="toggleAccordion" class="w-12 h-12 flex items-center justify-center text-xl bg-[#111111] bg-opacity-10 duration-300 rounded-md">
          <span class="text-2xl" v-if="!isActive">+</span>
          <span class="text-2xl" v-else>−</span>
        </button>
      </div>
    </div>


    <div class="md:hidden py-4">
      <!-- Mobile number display -->
      <div class="flex items-center mb-3">
        <div class="flex-shrink-0 w-8 text-left mr-6">
          <span class="text-xl font-medium">{{ String(index + 1).padStart(2, '0') }}</span>
        </div>
        <div class="flex-1 flex items-center justify-between">
          <button class="flex-1 text-left" @click="toggleAccordion">
            <span class="text-xl font-medium !mb-0" v-html="item.title"></span>
          </button>
          <button @click="toggleAccordion" class="w-8 h-8 flex items-center justify-center text-xl bg-[#111111] bg-opacity-10 duration-300 rounded-md ml-8">
            <span class="text-2xl" v-if="!isActive">+</span>
            <span class="text-2xl" v-else>−</span>
          </button>
        </div>
      </div>
      
      <!-- Mobile content: question, text, button, then image -->
      <div ref="contentRefMobile" :style="'max-height:'+maxHeightMobile+';'" class="overflow-hidden duration-500">
        <div class="text-sm ml-14 mr-20">
          <!-- Answer content -->
          <PortableText :value="item.content" />
        </div>
      </div>
      
      <!-- Mobile: Button always visible -->
      <div v-if="item.ctas" class="ml-14 mr-20 my-4 md:hidden">
        <Buttons :data="item.ctas"></Buttons>
      </div>
      
      <!-- Mobile: Image always visible -->
      <div v-if="item.image" class="my-4 ml-14 mr-20 md:hidden">
        <cm-picture 
          :image-object="item.image" 
          :crops="['default:400', 'md:600', 'lg:800']" 
          :classes="['w-full h-auto object-cover rounded-lg']"
          :lazy="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { PortableText } from '@portabletext/vue';
import { computed, ref, watch, onMounted } from 'vue';
import Buttons from '~/components/ui/Buttons.vue';
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
