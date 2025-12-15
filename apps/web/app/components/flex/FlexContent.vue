<template>
  <div v-if="pageContent">
    <!-- <Breadcrumbs :menu-context="mainMenu" v-if="activateBreadbrumbs"></Breadcrumbs> -->
    <FlexSection
        v-for="(item, index) in pageContent"
        class="relative"
        :layout="item._type"
        :key="index"
        :data="item"
        :index="index"
    >
      <HeroBlock v-if="item._type === 'heroBlock'" :data="item" :index="index" />
      <BackgroundImageTextBlock v-if="item._type === 'backgroundImageTextBlock'" :data="item" :index="index" />
      <ImageBlock v-if="item._type === 'imageBlock'" :data="item" :index="index" />
      <TextBlock v-if="item._type === 'textBlock'" :data="item" :index="index" />
      <TextImageBlock v-if="item._type === 'textAndImageBlock'" :data="item" :index="index" />
      <AccordionBlock v-if="item._type === 'accordionBlock'" :data="item" :index="index" />
      <FoodSliderBlock v-if="item._type === 'foodSliderBlock'" :data="item" :index="index" />
      <MenuBlock v-if="item._type === 'menuBlock'" :data="item" :index="index" />
      <ImageGridBlock v-if="item._type === 'imageGridBlock'" :data="item" :index="index" />
    </FlexSection>
  </div>
</template>

<script setup>
import { useCoreStore } from '~/stores/core';

const props = defineProps({
  page: {
    type: Object,
    default: () => ({}),
  }
});

const pageContent = computed(() => {
  return props.page.content;
});

</script>


