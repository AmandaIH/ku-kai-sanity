<template>
  <div class="section-container py-8 md:py-16" :class="containerClasses">
    <div class="absolute -top-16" ref="scrollTop"></div>
    <div class="col-span-full md:col-span-8 md:col-start-3 lg:col-start-4 lg:col-span-6">
      <div class="flex flex-col mb-8" v-if="componentData.eyebrow || componentData.header || componentData.subheader">
        <p ref="eyebrowRef" v-if="componentData.eyebrow" class="eyebrow opacity-0 text-sm font-medium uppercase" v-html="componentData.eyebrow"></p>
        <div ref="headerWrapperRef" class="opacity-0" v-if="componentData.header">
          <h1 v-if="index === 0" class="h1 !mb-0">
            <span v-html="componentData.header"></span>
          </h1>
          <h2 v-else class="h2 !mb-0">
            <span v-html="componentData.header"></span>
          </h2>
        </div>
        <h6 ref="subheaderRef" v-if="componentData.subheader" class="font-bold text-center opacity-0" v-html="componentData.subheader"></h6>
      </div>
    
      <!-- Loading State -->
      <div v-if="isLoading && componentData.showPagination" class="grid gap-6 mt-8" :class="gridColumnsClass">
        <div v-for="i in 4" :key="i" class="animate-pulse">
          <div class="relative overflow-hidden h-[600px] bg-gray-200">
            <!-- Loading skeleton with card structure -->
            <div class="absolute inset-0 p-6 flex flex-col justify-between">
              <div class="flex flex-col gap-3">
                <div class="h-4 bg-gray-300 w-1/3"></div>
                <div class="h-6 bg-gray-300 w-3/4"></div>
                <div class="h-4 bg-gray-300 w-full"></div>
              </div>
              <div class="h-10 bg-gray-300 w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Content -->
      <div v-else-if="items.length > 0" :class="layoutClass">
        <div 
          v-for="(item, itemIndex) in items" 
          :key="item._id" 
          class="opacity-0"
          :ref="(el) => setItemRef(el, itemIndex)"
        >
          <ArchiveCard 
            :item="item"
          />
        </div>
      </div>

      <div v-else class="text-center py-8">
        No items found
      </div>

      <!-- Pagination -->
      <div class="mt-8 w-full flex justify-center" v-if="componentData.showPagination && totalPages > 1">
        <Pagination :total-pages="totalPages" :current-page="currentPage" @update:currentPage="setCurrentPage"></Pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, computed, nextTick } from 'vue';
import { useGsapAnimations } from '../../../composables/useGsapAnimations';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useCheckmateFlexSettings } from '../../../composables/checkmateFlexSettings';
import { useRoute } from 'vue-router';

// Define the component data interface
interface ArchiveFilter {
  type: 'category' | 'tag' | 'author' | 'date';
  label: string;
}

interface ArchiveBlockData {
  eyebrow?: string;
  header?: string;
  subheader?: string;
  archiveType?: 'pages' | 'articles' | 'solutions' | 'employees' | 'portfolios';
  itemsPerPage?: number;
  showPagination?: boolean;
  layout?: 'grid' | 'list' | 'masonry';
  columns?: number;
  showFeaturedImage?: boolean;
  showDate?: boolean;
  showAuthor?: boolean;
  sortOrder?: 'newest' | 'oldest' | 'alphabetical' | 'alphabetical-reverse';
  filters?: ArchiveFilter[];
  spacing?: string;
  backgroundColor?: string;
  textColor?: string;
  customMargin?: any;
  customPadding?: any;
  container?: 'contained' | 'fullWidth';
}

const props = defineProps<{
  data: ArchiveBlockData;
  index?: number;
}>();

// Use the data directly without Zod validation
const componentData = computed(() => props.data);
const componentSettings = computed(() => props.data);

// Initialize the flex settings composable
const { getContainerClasses } = useCheckmateFlexSettings(componentSettings);

const route = useRoute();
const currentPage = ref(1);
const items = ref<any[]>([]);
const totalPages = ref(0);
const totalItems = ref(0);
const isLoading = ref(true);

// Animation refs
const eyebrowRef = ref<HTMLElement | null>(null);
const headerWrapperRef = ref<HTMLElement | null>(null);
const subheaderRef = ref<HTMLElement | null>(null);
const scrollTriggerInstance = ref<ScrollTrigger | null>(null);
const itemRefs = ref<(HTMLElement | null)[]>([]);

// Helper function to set item refs
const setItemRef = (el: any, index: number) => {
  if (el) {
    itemRefs.value[index] = el as HTMLElement;
  }
};

// Initialize GSAP animations
const { scrollTriggerAnimation, staggerAnimation } = useGsapAnimations();

// Setup all animations
const setupAnimations = () => {
  const headlineElements = [
    eyebrowRef.value,
    headerWrapperRef.value,
    subheaderRef.value
  ].filter((el): el is HTMLElement => el !== null);

  const itemElements = itemRefs.value.filter((el): el is HTMLElement => el !== null);
  const allElements = [...headlineElements, ...itemElements];

  if (allElements.length > 0 && allElements[0]) {
    const timeline = staggerAnimation(allElements, {
      duration: 0.6,
      ease: "power2.out"
    }, 0.15);

    scrollTriggerInstance.value = scrollTriggerAnimation(allElements[0], timeline, {
      trigger: allElements[0],
      start: "top 80%",
      end: "bottom 20%",
      toggleActions: "play none none none"
    });
  }
};

// Watch for items changes to trigger animations
watch(items, () => {
  // Kill existing scroll trigger and reset
  if (scrollTriggerInstance.value) {
    scrollTriggerInstance.value.kill();
    scrollTriggerInstance.value = null;
  }
  itemRefs.value = [];
  // Wait for next tick to ensure DOM is updated
  nextTick(() => {
    setupAnimations();
  });
}, { deep: true });

const scrollTop = ref<HTMLElement | null>(null);

const setCurrentPage = (page: number) => {
  if (scrollTop.value) {
    scrollTop.value.scrollIntoView({ behavior: 'smooth' });
  }
  currentPage.value = page;
  setUrlParams();
};

const setUrlParams = () => {
  const query = { ...route.query };
  
  if (currentPage.value > 1) {
    query.page = currentPage.value.toString();
  } else {
    delete query.page;
  }

  // Use Nuxt router to update the URL
  navigateTo({
    path: route.path,
    query: query
  }, { replace: true });
};

const checkInitParams = () => {
  const pageParam = route.query.page;
  if (pageParam) {
    const page = parseInt(pageParam as string);
    if (!isNaN(page) && page > 0) {
      currentPage.value = page;
    }
  }
};

/**
 * Fetches items from API based on the current page and settings.
 */
const fetchItems = async () => {
  isLoading.value = true;
  
  try {
    const itemsPerPage = 16;
    const offset = (currentPage.value - 1) * itemsPerPage;
    
    // Determine which endpoint to use
    const archiveType = componentData.value.archiveType || 'articles';
    let endpoint = '';
    
    switch (archiveType) {
      case 'articles':
        endpoint = '/api/documents/articles/';
        break;
      case 'portfolios':
        endpoint = '/api/documents/portfolios/';
        break;
      default:
        console.warn(`Unsupported archive type: ${archiveType}, defaulting to articles`);
        endpoint = '/api/documents/articles/';
    }
    
    // Build API query parameters
    const queryParams: Record<string, string | number> = {
      limit: itemsPerPage,
      offset: offset
    };
    
    // Fetch data from API
    const url = new URL(endpoint, window.location.origin);
    Object.keys(queryParams).forEach(key => {
      const value = queryParams[key];
      if (value !== undefined) {
        url.searchParams.append(key, value.toString());
      }
    });
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    if (data && data.data) {
      items.value = data.data || [];
      totalItems.value = data.meta?.total || data.data.length;
      totalPages.value = Math.ceil(totalItems.value / itemsPerPage);
    } else {
      items.value = [];
      totalItems.value = 0;
      totalPages.value = 0;
    }
    
  } catch (error) {
    console.error('Error fetching items:', error);
    items.value = [];
    totalItems.value = 0;
    totalPages.value = 0;
  } finally {
    isLoading.value = false;
  }
};

/**
 * Container classes
 */
const containerClasses = computed(() => {
  return getContainerClasses('background', 'text', 'padding', 'margin', 'width');
});

/**
 * Grid columns class
 */
const gridColumnsClass = computed(() => {
  const columns = componentData.value.columns || 4;
  switch (columns) {
    case 1:
      return 'grid-cols-1';
    case 2:
      return 'grid-cols-1 md:grid-cols-2';
    case 3:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    case 4:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    case 5:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5';
    case 6:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-6';
    default:
      return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
  }
});

/**
 * Layout class
 */
const layoutClass = computed(() => {
  switch (componentData.value.layout) {
    case 'list':
      return 'space-y-6';
    case 'masonry':
      return 'columns-1 md:columns-2 lg:columns-3 gap-6';
    default:
      return `grid gap-6 ${gridColumnsClass.value}`;
  }
});

onMounted(() => {
  checkInitParams();
  fetchItems();
  
  // Set up headline animations after mount
  nextTick(() => {
    setupAnimations();
  });
});

onBeforeUnmount(() => {
  // Kill the ScrollTrigger instance if it exists
  if (scrollTriggerInstance.value) {
    scrollTriggerInstance.value.kill();
  }
});

// Watch for page changes
watch(currentPage, () => {
  fetchItems();
});

// Watch for route changes (browser back/forward)
watch(() => route.query.page, (newPage) => {
  if (newPage) {
    const page = parseInt(newPage as string);
    if (!isNaN(page) && page > 0 && page !== currentPage.value) {
      currentPage.value = page;
    }
  } else if (currentPage.value > 1) {
    currentPage.value = 1;
  }
});
</script>

<style>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style> 