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
          <div v-if="pending" :class="[gridClasses, 'mt-16']">
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
  
          <!-- Materiel Items Grid -->
          <div v-else-if="materielItems.length > 0" :class="[gridClasses]">
          <div 
            v-for="(item, index) in materielItems" 
            :key="item._id || index"
            class="duration-300 overflow-hidden flex flex-col h-full px-4 py-4 md:px-0 w-full max-w-sm mx-auto"
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
              <p v-if="item.description" class="mb-1 max-w-xs mx-auto">
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
            <p>No materiel found</p>
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
  
  // Fetch materiel from API
  // Note: Service filter removed - showing all materiel items regardless of service
  // This allows materiel items with different services to be displayed together
  const { data: materielData, pending } = await useFetch('/api/documents/teasers/materiel/', {
    query: {
      language: locale.value || 'da'
      // Service filter removed - show all materiel items
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
  const materielItems = computed(() => {
    if (!materielData.value?.data || !Array.isArray(materielData.value.data)) {
      return [];
    }
  
    const currentPath = getCurrentPagePath();
    
    // API already returns items sorted by order field, so we just use all items
    const filtered = materielData.value.data
      .filter((item) => {
        // Filter out the current materiel item if we're on its page
        if (!item.slug || !currentPath) return true;
        
        // Materiel slugs are stored as "materiel/..." format
        // Current path could be "..." or "materiel/..."
        const materielSlug = item.slug;
        const materielSlugWithoutPrefix = materielSlug.replace(/^materiel\//, '');
        
        // Normalize paths for comparison (remove trailing slashes)
        const normalizedCurrentPath = currentPath.replace(/\/+$/, '');
        const normalizedMaterielSlug = materielSlug.replace(/\/+$/, '');
        const normalizedMaterielSlugWithoutPrefix = materielSlugWithoutPrefix.replace(/\/+$/, '');
        
        // Check if current path matches the materiel slug (with or without "materiel/" prefix)
        // Handle both exact matches and path segments
        const isMatch = 
          normalizedCurrentPath === normalizedMaterielSlug ||
          normalizedCurrentPath === normalizedMaterielSlugWithoutPrefix ||
          normalizedCurrentPath.endsWith(`/${normalizedMaterielSlug}`) ||
          normalizedCurrentPath.endsWith(`/${normalizedMaterielSlugWithoutPrefix}`) ||
          normalizedMaterielSlugWithoutPrefix === normalizedCurrentPath.split('/').pop();
        
        return !isMatch;
      });
    
    return filtered
      .map((item) => {
        // Build CTA button from slug
        const ctaButton = item.slug ? {
          linkTitle: componentData.value.buttonText || 'Læs mere',
          variant: componentData.value.buttonStyle || 'secondary2',
          linkType: 'internal',
          internalLink: {
            slug: {
              current: item.slug
            }
          }
        } : null;
  
        return {
          _id: item._id,
          header: item.title,
          description: item.short_description,
          image: item.featuredImage,
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
  const itemCount = materielItems.value.length;
  
  // Base classes - single column on mobile, responsive on md+
  let classes = 'grid grid-cols-1 gap-4 md:gap-12 lg:gap-16';
  
  // Add responsive classes based on item count for md and up
  if (itemCount >= 2) {
    classes += ' md:grid-cols-2';
  }
  
  if (itemCount >= 3) {
    // For 3 items, use 3 columns on large screens, but ensure items are evenly distributed
    classes += ' lg:grid-cols-3 lg:justify-items-center';
  }
  
  if (itemCount >= 4) {
    classes += ' xl:grid-cols-4';
  }
  
  if (itemCount >= 5) {
    classes += ' 2xl:grid-cols-5';
  }
  
  return classes;
});
  </script>

