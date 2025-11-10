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
      <HeroTextBlock v-if="item._type === 'heroTextBlock'" :data="item" :index="index" />
      <BackgroundImageTextBlock v-if="item._type === 'backgroundImageTextBlock'" :data="item" :index="index" />
      <ImageBlock v-if="item._type === 'imageBlock'" :data="item" :index="index" />
      <TextBlock v-if="item._type === 'textBlock'" :data="item" :index="index" />
      <TextImageBlock v-if="item._type === 'textAndImageBlock'" :data="item" :index="index" />
      <TextVideoBlock v-if="item._type === 'textAndVideoBlock'" :data="item" :index="index" />
      <AccordionBlock v-if="item._type === 'accordionBlock'" :data="item" :index="index" />
      <ArchiveBlock v-if="item._type === 'archiveBlock'" :data="item" :index="index" />
      <LogoSliderBlock v-if="item._type === 'sliderBlock'" :data="item" :index="index" />
      <NumbersBlock v-if="item._type === 'numbersBlock'" :data="item" :index="index" />
      <ServiceSliderBlock v-if="item._type === 'serviceSliderBlock'" :data="item" :index="index" />
      <DynamicServicesBlock v-if="item._type === 'dynamicServicesBlock'" :data="item" :index="index" />
      <DynamicMaterielBlock v-if="item._type === 'dynamicMaterielBlock'" :data="item" :index="index" />
      <EmployeeBlock v-if="item._type === 'employeesBlock'" :data="item" :index="index" />
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


