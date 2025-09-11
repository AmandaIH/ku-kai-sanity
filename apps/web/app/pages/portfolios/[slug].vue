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
          <h1>Error loading page</h1>
          <p>{{ error.message }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="currentPage">
      <!-- Portfolio Hero -->
      <div class="w-full relative overflow-hidden flex items-center min-h-screen">
          <div class="inset-0 absolute bg-black z-[1]" :style="{ opacity: 30 / 100 }"></div>

          <CmPicture 
            v-if="currentPage.featuredImage" 
            :image-object="currentPage.featuredImage"
            :crops="['default:800', 'md:1200', 'lg:1600']"
            :alt="currentPage.title"
            :classes="['absolute inset-0 flex items-center z-0 w-full h-full object-cover absolute inset-0'].join(' ')"
          />

          <div class="w-full px-4 sm:px-15 relative z-10">
            <div class="flex flex-col justify-center md:flex-row md:justify-between md:items-center text-white">
              <div class="w-full md:w-7/12">
                <div class="flex flex-col gap-4">
                  <div>
                    <p class="text-sm">Portfolio/Case</p>
                    <h1 v-if="currentPage.title" class="h2 !mb-0">
                      <span>{{ currentPage.title }}</span>
                    </h1>
                    <p v-if="currentPage.heroText" class="!mb-0 text-lg tracking-wide">
                      {{ currentPage.heroText }}
                    </p>
                    <Buttons v-if="currentPage.heroCtas" :data="currentPage.heroCtas" />
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
   

      <FlexContent  :page="currentPage" />

      <!-- Related Portfolios -->
      <div class="section-container py-8 md:py-16">
        <div class="col-span-full md:col-span-8 md:col-start-3 lg:col-start-4 lg:col-span-6">
          <h4 class="text-center mb-8">Our cases</h4>
          
          <!-- Loading State -->
          <div v-if="isLoadingPortfolios" class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div v-for="i in 4" :key="i" class="animate-pulse">
              <div class="relative overflow-hidden h-[600px] bg-gray-200">
                <div class="absolute inset-0 p-6 flex flex-col justify-between">
                  <div class="flex flex-col gap-3">
                    <div class="h-4 bg-gray-300 w-1/3"></div>
                    <div class="h-6 bg-gray-300 w-3/4"></div>
                  </div>
                  <div class="h-10 bg-gray-300 w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Portfolios Grid -->
          <div v-else-if="relatedPortfolios.length > 0" class="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 p-8">
            <ArchiveCard 
              v-for="portfolio in relatedPortfolios" 
              :key="portfolio._id"
              :item="portfolio"
            />
          </div>
          
          <div v-else class="text-center py-8">
            No related portfolios found
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex p-20 h-[80vh]">
      <div class="m-auto">
        <div class="col-span-12">
          <h1>Page not found</h1>
          <p>The requested page could not be found.</p>
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

// Related portfolios state
const relatedPortfolios = ref([]);
const isLoadingPortfolios = ref(true);

// Get the slug from the route params
const slug = computed(() => {
  const slugParam = route.params.slug
  const baseSlug = Array.isArray(slugParam) ? slugParam.join('/') : slugParam
  // Portfolio slugs are stored as "portfolios/slug-name" in Sanity
  return `portfolios/${baseSlug}`
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

/**
 * Fetch related portfolios (4 latest portfolios, excluding current portfolio)
 */
const fetchRelatedPortfolios = async () => {
  isLoadingPortfolios.value = true;
  
  try {
    const response = await fetch('/api/documents/portfolios/?limit=4');
    const data = await response.json();
    
    if (data && data.data) {
      // Filter out the current portfolio
      relatedPortfolios.value = data.data.filter(portfolio => portfolio._id !== currentPage.value?._id);
    } else {
      relatedPortfolios.value = [];
    }
  } catch (error) {
    console.error('Error fetching related portfolios:', error);
    relatedPortfolios.value = [];
  } finally {
    isLoadingPortfolios.value = false;
  }
}

onMounted(() => {
  // Check if the route query contains fmcid and fmsid.
  if (flowmate.isEnabled()) {
    // Get the live session id from the route query.
    const liveSessionId = route.query.fmsid;
    $readSession(liveSessionId, flowmateContext, flowmateActiveBlockIndex);
  }
  
  // Fetch related portfolios
  fetchRelatedPortfolios();
}); 

</script>
