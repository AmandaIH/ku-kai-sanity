<template>
  <div class="archive-card relative overflow-hidden group h-[600px]">
    <!-- Background Image -->
    <div class="absolute inset-0">
      <CmPicture 
        v-if="item.featuredImage"
        :image-object="item.featuredImage" 
        :crops="['default:600', 'md:800']" 
        :lazy="true"
        :classes="['w-full h-full object-cover'].join(' ')"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
    </div>

    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/25"></div>

    <!-- Content -->
    <div class="relative z-10 h-full flex flex-col justify-between p-8 text-white">
      <div class="flex flex-col gap-2">
        <!-- Show date only for articles, not portfolios -->
        <div v-if="(item.date || item._createdAt) && item._type === 'article'" class="text-sm font-medium uppercase tracking-wide opacity-90">
          {{ formatDate(item.date || item._createdAt || '') }}
        </div>
        <div v-if="item.title" class="text-xl font-bold leading-tight line-clamp-3">
          {{ item.title }}
        </div>
       
      </div>

      <div class="flex justify-start items-center gap-1">
        <ButtonIcon/>
        <NuxtLink :to="itemPath" class="!text-white btn btn-primary uppercase">
          Read More
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ArchiveItem {
  _id: string
  _type?: string
  title: string
  slug: {
    current: string
  }
  featuredImage?: any
  date?: string
  _createdAt?: string
  headline?: string
}

interface Props {
  item: ArchiveItem
}

const props = defineProps<Props>()

// Computed item path
const itemPath = computed(() => {
  if (props.item.slug) {
    return `/${props.item.slug.current}`
  }
  return '#'
})

// Format date utility
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
