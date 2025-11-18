<template>
    <main id="main">
      <div v-if="pending" class="flex p-20 h-[80vh]">
        <div class="m-auto">
          <div class="col-span-12">
            <h1>Loading...</h1>
          </div>
        </div>
      </div>
  
      <div v-else-if="error" class="flex p-20 h-[80vh]">
        <div class="m-auto">
          <div class="col-span-12">
            <h1>Error loading article</h1>
            <p>{{ error.message }}</p>
          </div>
        </div>
      </div>
  
      <div v-else-if="currentPage">
        <!-- Article Hero -->
        <div class="w-full relative overflow-hidden flex items-center min-h-screen">
           <div class="inset-0 absolute bg-black z-[1]" :style="{ opacity: 30 / 100 }"></div>

           <CmPicture 
             v-if="currentPage.featuredImage" 
             :image-object="currentPage.featuredImage"
             :crops="['default:800', 'md:1200', 'lg:1600']"
             :alt="currentPage.title"
             :classes="'absolute inset-0 flex items-center z-0 w-full h-full object-cover'"
           />

           <div class="w-full px-4 sm:px-15 relative z-10">
             <div class="flex flex-col justify-left md:flex-row md:justify-between md:items-center text-white">
               <div class="w-full md:w-7/12">
                 <div class="flex flex-col gap-4">
                   <p v-if="currentPage.date" class="!mb-0 text-sm font-medium uppercase tracking-wide">
                     {{ formatDate(currentPage.date) }}
                   </p>
                   <div>
                     <h1 class="h2 !mb-0">
                       <span>{{ currentPage.title }}</span>
                     </h1>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </div>

        <!-- Article Content -->
        <div class="section-container grid grid-cols-1 p-8 md:grid-cols-12 gap-4 lg:gap-x-12 py-8 md:py-16">
          <div v-if="currentPage.headline" class="text-xl md:col-start-4 md:col-span-6">
            <span>{{ currentPage.headline }}</span>
          </div>
          
          <div v-if="currentPage.bodyText" class="md:col-start-4 md:col-span-6">
            <PortableText :value="currentPage.bodyText" />
          </div>
        </div>

        <!-- Related Articles -->
        <div class="px-8 md:px-16 py-8">
          <!-- White Background Container -->
          <div class="bg-[#F8F6F5] rounded-lg shadow-sm px-8 py-16 md:p-16">
            <h4 class="text-center mb-12">Other news</h4>
            
            <!-- Loading State -->
            <div v-if="isLoadingArticles" :class="[relatedArticlesGridClasses, 'mt-24']">
              <div v-for="i in 4" :key="i" class="animate-pulse">
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
            
            <!-- Articles Grid -->
            <div v-else-if="relatedArticles.length > 0" :class="[relatedArticlesGridClasses, 'mt-24']">
              <div 
                v-for="article in relatedArticles" 
                :key="article._id" 
                class="duration-300 overflow-hidden flex flex-col h-full px-4 py-4 md:px-0"
              >
                <!-- Image -->
                <div v-if="article.featuredImage" class="w-full h-64 md:h-56 lg:h-64 xl:h-72 relative mb-4 rounded-lg overflow-hidden">
                  <CmPicture
                    :image-object="article.featuredImage"
                    classes="w-full h-full object-cover rounded-lg"
                    :lazy="true"
                  />
                </div>
                
                <!-- Content -->
                <div class="text-center flex flex-col flex-grow">
                  <!-- Title -->
                  <h5 v-if="article.title" class="mb-2">
                    {{ article.title }}
                  </h5>
                  
                  <!-- Excerpt -->
                  <p v-if="article.excerpt || article.headline" class="mb-1 text-sm">
                    {{ article.excerpt || article.headline }}
                  </p>
                  
                  <!-- Date -->
                  <p v-if="article.date || article._createdAt" class="text-xs text-gray-600 mb-4">
                    {{ formatDate(article.date || article._createdAt) }}
                  </p>
                  
                  <!-- CTA Button -->
                  <div class="mt-auto flex justify-center">
                    <Buttons :data="[{ 
                      linkTitle: 'Læs mere', 
                      variant: 'secondary2', 
                      linkType: 'internal',
                      internalLink: {
                        slug: {
                          current: article.slug?.current || article.slug
                        }
                      }
                    }]" />
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="text-center py-8">
              No related articles found
            </div>
          </div>
        </div>
      </div>
  
      <div v-else class="flex p-20 h-[80vh]">
        <div class="m-auto">
          <div class="col-span-12">
            <h1>Article not found</h1>
            <p>The requested article could not be found.</p>
          </div>
        </div>
      </div>
    </main>
</template>
  
<script setup>
import { computed } from 'vue'
import { useCoreStore } from '~/stores/core'
import { useSeoHead } from "~/composables/useSeoHead"
import { usePageCacheHeaders } from "~/composables/pageCacheHeaders"
import { useFlowmate } from "~/composables/flowmate";
import { PortableText } from '@portabletext/vue';
  
// Get route composable
const route = useRoute()
const config = useRuntimeConfig()

const store = useCoreStore()
const { getSeoHead } = useSeoHead()
const { $readSession } = useNuxtApp()

const settings = computed(() => store.settings)
const flowmate = useFlowmate();

const flowmateContext = ref({});
const flowmateActiveBlockIndex = ref(-1);

// Related articles state
const relatedArticles = ref([]);
const isLoadingArticles = ref(true);

// Get the slug from the route params
const slug = computed(() => {
  const slugParam = route.params.slug
  const baseSlug = Array.isArray(slugParam) ? slugParam.join('/') : slugParam
  // Article slugs are stored as "articles/slug-name" in Sanity
  return `articles/${baseSlug}`
})

// Use the refactored composable to fetch page data
// The composable will automatically handle frontpage detection
const { page: pageData, pending, error } = await useCheckmateSingle({
  path: slug.value || undefined // Pass undefined for frontpage to let composable handle it
})

// Process page data if it exists
if (pageData.value) {
  const page = pageData.value
  
  // Set current page in store
  store.setCurrentPage(page)
  
  // Set meta data in store for SEO
  store.setMeta(page)
  
  // Handle header text color based on content
  if (page.content && page.content.length > 0) {
    if (page.content[0]._type === 'heroBlock') {
      store.setHeaderTextColor('white')
    } else {
      store.setHeaderTextColor('black')
    }
  } else {
    store.setHeaderTextColor('black')
  }

  // Set SEO headers
  useHead(getSeoHead(store.meta))
  usePageCacheHeaders({ value: pageData.value })
} else {
  // If not found, throw 404 error
  console.log('Page not found: ', route.fullPath)
  throw createError({
    statusCode: 404,
    statusMessage: "Page Not Found: " + route.fullPath,
    fatal: true,
  })
}
  
const currentPage = computed(() => {
  if (flowmate.isEnabled()) {
    return flowmateContext.value;
  } else {
    return pageData.value;
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('da-DK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Dynamic grid classes for related articles (matching ArchiveBlock)
// Always show 4 items, so grid is fixed for 4 columns
const relatedArticlesGridClasses = computed(() => {
  // Base classes - single column on mobile, responsive on md+
  // Always 4 items, so use fixed grid layout
  return 'grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-16';
});

/**
 * Fetch related articles (4 latest articles, excluding current article)
 */
const fetchRelatedArticles = async () => {
  isLoadingArticles.value = true;
  
  try {
    // Fetch 5 articles to ensure we have 4 after filtering out the current article
    const response = await fetch('/api/documents/articles/?limit=5');
    const data = await response.json();
    
    if (data && data.data) {
      // Filter out the current article and take only the first 4
      relatedArticles.value = data.data
        .filter(article => article._id !== currentPage.value?._id)
        .slice(0, 4);
    } else {
      relatedArticles.value = [];
    }
  } catch (error) {
    console.error('Error fetching related articles:', error);
    relatedArticles.value = [];
  } finally {
    isLoadingArticles.value = false;
  }
}

onMounted(() => {
  // Check if the route query contains fmcid and fmsid.
  if (flowmate.isEnabled()) {
    // Get the live session id from the route query.
    const liveSessionId = route.query.fmsid;
    $readSession(liveSessionId, flowmateContext, flowmateActiveBlockIndex);
  }
  
  // Fetch related articles
  fetchRelatedArticles();
}); 

</script>
  