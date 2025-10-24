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
      <FlexContent  :page="currentPage" />
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

// Get the slug from the route params
const slug = computed(() => {
  const slugArray = route.params.slug
  return Array.isArray(slugArray) ? slugArray.join('/') : slugArray
})

// Use the refactored composable to fetch page data
// The composable will automatically handle frontpage detection
const { page: pageData, pending, error } = await useCheckmateSingle({
  path: slug.value || '' // Pass empty string for frontpage to let composable handle it
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


onMounted(() => {
  // Check if the route query contains fmcid and fmsid.
  if (flowmate.isEnabled()) {
    // Get the live session id from the route query.
    const liveSessionId = route.query.fmsid;
    $readSession(liveSessionId, flowmateContext, flowmateActiveBlockIndex);
  }
}); 

</script>
