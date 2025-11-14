<template>
    <div :class="containerClasses">
      <!-- White Container -->
      <div class="px-8 md:px-16 py-8">
        <!-- White Background Container -->
        <div class="bg-[#F8F6F5] rounded-lg shadow-sm p-8 md:p-16">
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
          <div v-if="pending" :class="[gridClasses, 'mt-24']">
            <div v-for="i in 3" :key="i" class="animate-pulse">
              <div class="duration-300 overflow-hidden flex flex-col h-full px-4 py-4 md:px-0">
                <!-- Image skeleton -->
                <div class="w-full h-48 mb-4 rounded-lg overflow-hidden bg-gray-200"></div>
                <!-- Content skeleton -->
                <div class="text-center flex flex-col flex-grow">
                  <div class="h-6 bg-gray-200 w-3/4 mx-auto mb-2"></div>
                  <div class="h-4 bg-gray-200 w-full mb-1"></div>
                  <div class="h-10 bg-gray-200 w-1/3 mx-auto mt-auto"></div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Service Items Grid -->
          <div v-else-if="services.length > 0" :class="[gridClasses, 'mt-24']">
          <div 
            v-for="(item, index) in services" 
            :key="item._id || index"
            class="duration-300 overflow-hidden flex flex-col h-full px-4 py-4 md:px-8"
          >
            <!-- Image -->
            <div v-if="item.image" class="w-full mb-4 rounded-lg overflow-hidden">
              <CmPicture
                :image-object="item.image"
                classes="w-full h-48 object-contain rounded-lg"
                :lazy="true"
              />
            </div>
            
            <!-- Content -->
            <div class="text-center flex flex-col flex-grow">
              <!-- Header -->
              <h5 v-if="item.header" class="">
                {{ item.header }}
              </h5>
              
              <!-- Description -->
              <p v-if="item.description" class="mb-1">
                {{ item.description }}
              </p>
              
              <!-- CTA Button -->
              <div v-if="item.ctaButton" class="mt-auto flex justify-center">
                <Buttons :data="[item.ctaButton]" />
              </div>
            </div>
          </div>
          </div>
  
          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <p>No services found</p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useCheckmateFlexSettings } from '~/composables/checkmateFlexSettings';
  import { useI18n } from 'vue-i18n';
  
  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });
  
  const componentData = computed(() => props.data);
  const { getContainerClasses } = useCheckmateFlexSettings(componentData);
  const { locale } = useI18n();
  const route = useRoute();
  
  // Fetch services from API
  const { data: servicesData, pending } = await useFetch('/api/documents/teasers/services/', {
    query: {
      language: locale.value || 'da'
    }
  });
  
  // Get current page path for filtering
  const getCurrentPagePath = () => {
    // Try to get slug from route params first
    let path = null;
    
    if (route.params.slug) {
      const slugArray = route.params.slug;
      path = Array.isArray(slugArray) ? slugArray.join('/') : slugArray;
    } else if (route.path) {
      // Fallback to route.path if params.slug is not available
      path = route.path;
    }
    
    if (!path) return null;
    
    // Remove language prefix if present (e.g., "en/containertransport" -> "containertransport")
    const languagePrefixPattern = /^[a-z]{2}\//;
    let cleanPath = languagePrefixPattern.test(path) ? path.replace(languagePrefixPattern, '') : path;
    
    // Remove leading slash if present
    cleanPath = cleanPath.startsWith('/') ? cleanPath.slice(1) : cleanPath;
    
    return cleanPath;
  };
  
  // Transform API response to match component structure
  const services = computed(() => {
    if (!servicesData.value?.data || !Array.isArray(servicesData.value.data)) {
      return [];
    }
  
    const currentPath = getCurrentPagePath();
    
    // API already returns items sorted by order field, so we just use all items
    return servicesData.value.data
      .filter((service) => {
        // Filter out the current service if we're on its page
        if (!service.slug || !currentPath) return true;
        
        // Service slugs are stored as "services/containertransport" format
        // Current path could be "containertransport" or "services/containertransport"
        const serviceSlug = service.slug;
        const serviceSlugWithoutPrefix = serviceSlug.replace(/^services\//, '');
        
        // Normalize paths for comparison (remove trailing slashes)
        const normalizedCurrentPath = currentPath.replace(/\/+$/, '');
        const normalizedServiceSlug = serviceSlug.replace(/\/+$/, '');
        const normalizedServiceSlugWithoutPrefix = serviceSlugWithoutPrefix.replace(/\/+$/, '');
        
        // Check if current path matches the service slug (with or without "services/" prefix)
        // Handle both exact matches and path segments
        const isMatch = 
          normalizedCurrentPath === normalizedServiceSlug ||
          normalizedCurrentPath === normalizedServiceSlugWithoutPrefix ||
          normalizedCurrentPath.endsWith(`/${normalizedServiceSlug}`) ||
          normalizedCurrentPath.endsWith(`/${normalizedServiceSlugWithoutPrefix}`) ||
          normalizedServiceSlugWithoutPrefix === normalizedCurrentPath.split('/').pop();
        
        return !isMatch;
      })
      .map((service) => {
        // Build CTA button from slug
        const ctaButton = service.slug ? {
          linkTitle: componentData.value.buttonText || 'Læs mere',
          variant: componentData.value.buttonStyle || 'secondary2',
          linkType: 'internal',
          internalLink: {
            slug: {
              current: service.slug
            }
          }
        } : null;
  
        return {
          _id: service._id,
          header: service.title,
          description: service.short_description,
          image: service.featuredImage,
          ctaButton
        };
      });
  });
  
// Container classes
const containerClasses = computed(() => {
  // Only apply width if explicitly set to 'contained', otherwise use full width
  let classes = getContainerClasses('background', 'text', 'padding', 'margin');
  
  // Only add width constraint if container is explicitly set to 'contained'
  if (componentData.value.container === 'contained') {
    classes.push(...getContainerClasses('width'));
  }
  
  // Add default padding if no custom padding is set
  if (!componentData.value.customPadding) {
    classes.push('py-16');
  }
  
  return classes.join(' ');
});

// Dynamic grid classes based on number of items
const gridClasses = computed(() => {
  const itemCount = services.value.length;
  
  // Base classes - single column on mobile, responsive on md+
  let classes = 'grid grid-cols-1 gap-16 mt-16';
  
  // Add responsive classes based on item count
  // Pattern: 4 → 2 → 1 (or 3 → 2 → 1 if only 3 items)
  if (itemCount >= 2) {
    classes += ' md:grid-cols-2 lg:grid-cols-2';
  }
  
  // At xl: 4 columns if 4+ items, or 3 columns if exactly 3 items
  if (itemCount >= 4) {
    classes += ' xl:grid-cols-4';
  } else if (itemCount === 3) {
    classes += ' xl:grid-cols-3';
  }
  
  if (itemCount >= 5) {
    classes += ' 2xl:grid-cols-5';
  }
  
  return classes;
});
  </script>
  