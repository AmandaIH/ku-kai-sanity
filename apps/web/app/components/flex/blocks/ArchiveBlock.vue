<template>
  <div :class="containerClasses">
    <!-- White Container -->
    <div class="px-8 md:px-16 py-8">
      <!-- White Background Container -->
      <div class="bg-[#F8F6F5] rounded-lg shadow-sm px-8 py-16 md:p-16">
        <!-- Header Section -->
        <div v-if="componentData.header || componentData.eyebrow || componentData.subheader" class="text-center mb-12">
          <p v-if="componentData.eyebrow" class="eyebrow text-sm uppercase">
            {{ componentData.eyebrow }}
          </p>
          <h2 v-if="componentData.header" class="text-3xl font-bold mb-4">
            {{ componentData.header }}
          </h2>
          <h3 v-if="componentData.subheader" class="md:mb-8">
            {{ componentData.subheader }}
          </h3>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" :class="[gridClasses, 'mt-24']">
          <div v-for="i in (componentData.archiveMode === 'latest' ? 4 : 8)" :key="i" class="animate-pulse">
            <div class="duration-300 overflow-hidden flex flex-col h-full px-4 py-4 md:px-0">
              <!-- Image skeleton -->
              <div class="w-full h-64 md:h-56 lg:h-64 xl:h-72 relative mb-4 rounded-lg overflow-hidden bg-gray-200"></div>
              <!-- Content skeleton -->
              <div class="text-center flex flex-col flex-grow">
                <div class="h-6 bg-gray-200 w-3/4 mx-auto mb-2"></div>
                <div class="h-4 bg-gray-200 w-full mb-1"></div>
                <div class="h-4 bg-gray-200 w-1/3 mx-auto mt-auto"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div v-else-if="items.length > 0" :class="[gridClasses, 'mt-24']">
          <div 
            v-for="(item, index) in items" 
            :key="item._id" 
            class="duration-300 overflow-hidden flex flex-col h-full px-4 py-4 md:px-0"
          >
            <!-- Image -->
            <div v-if="item.featuredImage" class="w-full h-64 md:h-56 lg:h-64 xl:h-72 relative mb-4 rounded-lg overflow-hidden">
              <CmPicture
                :image-object="item.featuredImage"
                classes="w-full h-full object-cover rounded-lg"
                :lazy="true"
              />
            </div>
            
            <!-- Content -->
            <div class="text-center flex flex-col flex-grow">
              <!-- Title -->
              <h5 v-if="item.title" class="mb-2">
                {{ item.title }}
              </h5>
              
              <!-- Excerpt -->
              <p v-if="item.excerpt" class="mb-1 text-sm">
                {{ item.excerpt }}
              </p>
              
              <!-- Date -->
              <p v-if="item.publishedAt" class="text-xs text-gray-600 mb-4">
                {{ formatDate(item.publishedAt) }}
              </p>
              
              <!-- CTA Button -->
              <div class="mt-auto flex justify-center">
                <NuxtLink :to="getItemUrl(item)" class="inline-block hover:opacity-80 transition-opacity">
                  <Buttons :data="[{ 
                    linkTitle: 'Læs mere', 
                    variant: componentData.buttonStyle || 'primary', 
                    linkType: 'internal',
                    internalLink: {
                      slug: {
                        current: item.slug?.current || item.slug
                      }
                    }
                  }]" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          No items found
        </div>

        <!-- Pagination (only for full archive mode) -->
        <div class="mt-8 w-full flex justify-center" v-if="componentData.archiveMode === 'full' && componentData.showPagination && totalPages > 1">
          <Pagination :total-pages="totalPages" :current-page="currentPage" @update:currentPage="setCurrentPage"></Pagination>
        </div>
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
  archiveMode?: 'full' | 'latest' | 'manual';
  manualItems?: any[];
  itemsPerPage?: number;
  showPagination?: boolean;
  buttonStyle?: 'primary' | 'secondary' | 'text';
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
 * Fetches items from API based on the archive mode and settings.
 */
const fetchItems = async () => {
  isLoading.value = true;
  
  try {
    const archiveMode = componentData.value.archiveMode || 'full';
    const archiveType = componentData.value.archiveType || 'articles';
    
    if (archiveMode === 'manual') {
      // For manual selection, we need to fetch the referenced items
      if (componentData.value.manualItems && componentData.value.manualItems.length > 0) {
        // Extract the reference IDs
        const itemIds = componentData.value.manualItems
          .map((item: any) => item._ref || item._id)
          .filter(Boolean);
        
        if (itemIds.length > 0) {
          // Build a GROQ query to fetch the referenced items
          const query = `*[_type in ["article", "portfolio"] && _id in [${itemIds.map(id => `"${id}"`).join(',')}] | order(publishedAt desc)`;
          
          // Use the appropriate endpoint based on archive type
          let endpoint = '/api/documents/articles/';
          if (archiveType === 'portfolios') {
            endpoint = '/api/documents/portfolios/';
          }
          
          const response = await fetch(`${endpoint}?query=${encodeURIComponent(query)}`);
          const data = await response.json();
          
          items.value = data.data || data || [];
        } else {
          items.value = [];
        }
      } else {
        items.value = [];
      }
      totalItems.value = items.value.length;
      totalPages.value = 1;
    } else {
      // Fetch from API
      const itemsPerPage = archiveMode === 'latest' ? 4 : 16;
      const offset = archiveMode === 'latest' ? 0 : (currentPage.value - 1) * itemsPerPage;
      
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
        totalPages.value = archiveMode === 'latest' ? 1 : Math.ceil(totalItems.value / itemsPerPage);
      } else {
        items.value = [];
        totalItems.value = 0;
        totalPages.value = 0;
      }
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

// Dynamic grid classes based on number of items (matching ServiceSliderBlock)
const gridClasses = computed(() => {
  const itemCount = items.value.length;
  
  // Base classes - single column on mobile, responsive on md+
  let classes = 'grid grid-cols-1 gap-16 mt-16';
  
  // Add responsive classes based on item count for md and up
  if (itemCount >= 2) {
    classes += ' md:grid-cols-2';
  }
  
  if (itemCount >= 3) {
    classes += ' lg:grid-cols-3';
  }
  
  if (itemCount >= 4) {
    classes += ' xl:grid-cols-4';
  }
  
  if (itemCount >= 5) {
    classes += ' 2xl:grid-cols-5';
  }
  
  return classes;
});

// Helper function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('da-DK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper function to get item URL
const getItemUrl = (item: any) => {
  const archiveType = componentData.value.archiveType || 'articles';
  
  // Extract slug from the path (articles/slug-name or portfolios/slug-name)
  let slug = item.slug?.current || item.slug;
  
  // If slug is an object with current property, use that
  if (typeof slug === 'object' && slug.current) {
    slug = slug.current;
  }
  
  // If slug contains a slash, extract the last part
  if (slug && slug.includes('/')) {
    slug = slug.split('/').pop(); // Get the last part after the slash
  }
  
  return `/${archiveType}/${slug}`;
};

onMounted(() => {
  checkInitParams();
  fetchItems();
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
// Container classes
const containerClasses = computed(() => {
  let classes = getContainerClasses('background', 'text', 'padding', 'margin', 'width');
  
  // Add default padding if no custom padding is set
  if (!componentData.value.customPadding) {
    classes.push('py-16');
  }
  
  return classes.join(' ');
});

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