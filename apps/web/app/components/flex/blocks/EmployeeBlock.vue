<template>
  <div class="section-container py-8" :class="containerClasses">
    <div class="w-full px-4 md:px-8">
      <!-- Header section -->
      <div class="flex flex-col mb-8 mx-auto" v-if="componentData.eyebrow || componentData.header || componentData.subheader" :class="getTextAlignment()">
        <p ref="eyebrowRef" v-if="componentData.eyebrow" class="eyebrow text-sm font-medium uppercase" v-html="componentData.eyebrow"></p>
        <div ref="headerWrapperRef" v-if="componentData.header">
          <h1 v-if="index === 0" class="h1 !mb-0">
            <span v-html="componentData.header"></span>
          </h1>
          <h4 v-else class="font-semibold !mb-0">
            <span v-html="componentData.header"></span>
          </h4>
        </div>
        <h6 ref="subheaderRef" v-if="componentData.subheader" v-html="componentData.subheader"></h6>
      </div>

      <!-- Employee grid -->
      <div ref="employeesRef" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-12 gap-6 mx-auto" v-if="resolvedEmployees && resolvedEmployees.length > 0">
          <div 
            v-for="(employee, employeeIndex) in resolvedEmployees" 
            :key="employee._id || employeeIndex"
            class="flex flex-col items-start text-left md:col-span-3"
            :ref="el => setEmployeeRef(el, employeeIndex)"
          >
            <!-- Employee image -->
            <div class="mb-4 overflow-hidden rounded-lg">
              <cm-picture 
                v-if="employee.picture" 
                :image-object="employee.picture" 
                :crops="['default:300']" 
                classes="w-full h-full object-cover rounded-lg"
              />
              <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
                <span class="text-gray-500 text-sm">No image</span>
              </div>
            </div>
            
            <!-- Employee info -->
            <h3 class="text-xl font-semibold text-left mb-2">{{ employee.name }}</h3>
            <p class="text-sm text-gray-600 text-left mb-4">{{ employee.jobTitle }}</p>
            
            <!-- Contact info (optional) -->
            <div class="" v-if="employee.emailAddress || employee.phoneNumber">
              <p v-if="employee.phoneNumber">{{ employee.phoneNumber }}</p>
              <p v-if="employee.emailAddress">{{ employee.emailAddress }}</p>
            </div>
          </div>
        </div>

      <!-- Show when no employees are found -->
      <div v-else class="text-center py-8 text-gray-500">
        <p>No employees found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useGsapAnimations } from '~/composables/useGsapAnimations';
import { useCheckmateFlexSettings } from '~/composables/checkmateFlexSettings';


// Define the component data interface
interface EmployeeBlockData {
  eyebrow?: string;
  header?: string;
  subheader?: string;
  employeeCollection?: Array<{
    _id: string;
    name: string;
    jobTitle: string;
    picture?: any;
    emailAddress?: string;
    phoneNumber?: string;
  }>;
  layout?: 'single' | 'two-column' | 'left' | 'center' | 'right';
  backgroundColor?: string;
  textColor?: string;
  customMargin?: any;
  customPadding?: any;
  width?: string;
  container?: 'contained' | 'fullWidth';
  spacing?: string;
}

const props = defineProps<{
  data: EmployeeBlockData;
  index?: number;
  isInSbs?: boolean;
}>();

// Refs for animations
const eyebrowRef = ref<HTMLElement | null>(null);
const headerWrapperRef = ref<HTMLElement | null>(null);
const subheaderRef = ref<HTMLElement | null>(null);
const employeesRef = ref<HTMLElement | null>(null);
const employeeRefs = ref<HTMLElement[]>([]);
const scrollTriggerInstance = ref<any>(null);

// Initialize GSAP animations
const { scrollTriggerAnimation, staggerAnimation } = useGsapAnimations();

// Use the data directly
const componentData = computed(() => props.data);
const componentSettings = computed(() => props.data);

// Handle both resolved and unresolved employee references
const resolvedEmployees = computed(() => {
  if (!componentData.value.employeeCollection) {
    return [];
  }
  
  return componentData.value.employeeCollection.filter(emp => {
    // Filter out unresolved references (they would just be {_ref: "some-id"})
    return emp && emp._id && emp.name;
  });
});

// Initialize the flex settings composable
const { getContainerClasses } = useCheckmateFlexSettings(componentSettings);

// Function to set employee refs
const setEmployeeRef = (el: any, index: number) => {
  if (el && el.$el) {
    employeeRefs.value[index] = el.$el;
  } else if (el) {
    employeeRefs.value[index] = el;
  }
};

// Setup all animations
const setupAnimations = () => {
  // Collect all headline elements
  const headlineElements = [
    eyebrowRef.value,
    headerWrapperRef.value,
    subheaderRef.value
  ].filter(Boolean) as HTMLElement[];
  
  // Collect all elements for animation
  const elements = [
    ...headlineElements,
    employeesRef.value,
    ...employeeRefs.value
  ].filter(Boolean) as HTMLElement[];

  if (elements.length > 0 && elements[0]) {
    try {
      // Create staggered animation using the composable
      const timeline = staggerAnimation(elements, {
        duration: 0.8,
        ease: "power3.out"
      }, 0.15);

      // Add scroll trigger using the composable
      scrollTriggerInstance.value = scrollTriggerAnimation(elements[0], timeline, {
        trigger: elements[0],
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none"
      });
    } catch (error) {
      console.error('Error setting up animations:', error);
    }
  }
};

onMounted(() => {
  // Set up animations after component is mounted
  setupAnimations();
});

onBeforeUnmount(() => {
  // Kill the ScrollTrigger instance if it exists
  if (scrollTriggerInstance.value) {
    scrollTriggerInstance.value.kill();
  }
});

// Container classes
const containerClasses = computed(() => {
  return getContainerClasses('background', 'text', 'padding', 'margin', 'width');
});

// Get text alignment classes based on layout
const getTextAlignment = () => {
  const layout = componentSettings.value.layout;
  switch (layout) {
    case 'left':
      return 'text-left';
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right'; 
    default:
      return 'text-center';
  }
};

// Get layout positioning classes based on layout 
const getLayoutPosition = () => {
  const layout = componentSettings.value.layout;
  switch (layout) {
    case 'left':
      return 'md:col-start-1 md:col-span-7';
    case 'center':
      return 'md:col-start-4 md:col-span-6';
    case 'right':
      return 'md:col-start-7 md:col-span-7';
    default:
      return 'md:col-start-3 md:col-span-5';
  }
};
</script>