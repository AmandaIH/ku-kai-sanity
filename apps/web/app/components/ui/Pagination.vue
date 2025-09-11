<template>
    <nav class="pagination">
      <ul class="inline-flex gap-2 items-center -space-x-px !list-none" v-if="totalPages > 0">
        <li @click.stop="setCurrentPage(props.currentPage - 1)"
            :class="props.currentPage > 1 ? '' : 'disabled opacity-30 pointer-events-none'">
          <button
              class="pagination-button">
            <span class="sr-only">Previous</span>
            <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.56 8L5.5 7.06L2.44667 4L5.5 0.94L4.56 8.21774e-08L0.56 4L4.56 8Z" fill="black"/>
            </svg>
          </button>
        </li>
        <template v-if="totalPages > 6">
          <li :key="'page-'+1" @click.stop="setCurrentPage(1)" :class="1 === props.currentPage ? 'pointer-events-none' : ''">
            <button class="pagination-button" :class="1 === props.currentPage ? 'active' : ''">1</button>
          </li>

          <li v-if="props.currentPage > 4" class="disabled pointer-events-none">
            <button class="pagination-button dots">...</button>
          </li>

          <li v-for="n in middlePages" :key="'page-'+n" @click.stop="setCurrentPage(n)" :class="n === props.currentPage ? 'pointer-events-none' : ''">
            <button class="pagination-button" :class="n === props.currentPage ? 'active' : ''">{{n}}</button>
          </li>

          <li v-if="totalPages - props.currentPage > 3" class="disabled pointer-events-none">
            <button class="pagination-button dots">...</button>
          </li>

          <li v-if="!middlePages.includes(totalPages)" :key="'page-'+totalPages" @click.stop="setCurrentPage(totalPages)" :class="totalPages === props.currentPage ? 'pointer-events-none' : ''">
            <button class="pagination-button" :class="totalPages === props.currentPage ? 'active' : ''">{{totalPages}}</button>
          </li>
        </template>
        <template v-else>
          <li v-for="n in totalPages" :key="'page-'+n" @click.stop="setCurrentPage(n)" :class="n === props.currentPage ? 'pointer-events-none' : ''">
            <button class="pagination-button" :class="n === props.currentPage ? 'active' : ''">{{n}}</button>
          </li>
        </template>
        <li @click.stop="setCurrentPage(props.currentPage + 1)"
            :class="props.currentPage < totalPages ? '' : 'disabled opacity-30 pointer-events-none'">
          <button
              class="pagination-button">
            <span class="sr-only">Next</span>
            <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.44 0L0.5 0.94L3.55333 4L0.5 7.06L1.44 8L5.44 4L1.44 0Z" fill="black"/>
            </svg>
          </button>
        </li>
      </ul>
    </nav>
</template>
<script setup>
const emit = defineEmits(['update:currentPage']);
const props = defineProps({
  totalPages: {
    type: Number,
    default: 0
  },
  currentPage: {
    type: Number,
    default: 0
  },
  background: {
    type: String,
    default: 'bg-white'
  }
});

const middlePages = computed(() => {
  let pages = [];
  if(props.currentPage > 4 && props.currentPage < props.totalPages - 2) {
    pages.push(props.currentPage - 1);
    pages.push(props.currentPage);
    pages.push(props.currentPage + 1);
    if(props.currentPage < 4 || props.currentPage >= props.totalPages - 3) {
      pages.push(props.currentPage + 2);
    }
  } else if(props.currentPage > 4 && props.currentPage >= props.totalPages - 2) {
    pages.push(props.totalPages -4);
    pages.push(props.totalPages -3);
    pages.push(props.totalPages - 2);
    pages.push(props.totalPages - 1);
    pages.push(props.totalPages);
  } else {
    pages.push(2);
    pages.push(3);
    pages.push(4);
    pages.push(5);
  }
  return pages;
});

const setCurrentPage = (page) => {
  emit('update:currentPage', page);
}
</script>
