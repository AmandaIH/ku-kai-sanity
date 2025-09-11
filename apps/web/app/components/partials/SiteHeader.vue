<template>
  <header class="site-header fixed top-0 w-full z-50 duration-300 transition-all" :class="[menuScrollActive ? 'bg-[#FFFFFF] text-[#181D2D]' : 'bg-transparent ' + (textIsWhite ? 'text-white' : 'text-black')]">
    <div class="w-full px-4 md:px-6 flex items-center justify-between" :class="menuScrollActive ? 'py-2 md:py-3' : 'py-4 md:py-6'">

      <div class="z-[26]">
        <nuxt-link to="/">
          <LogoAnimation 
            class="w-full max-w-[180px] h-auto" 
            :class="[store.getShowMenu ? 'hidden sm:block' : '']"
            :text-color="currentTextColor"
          ></LogoAnimation>
        </nuxt-link>
      </div>
      <div class="flex items-center gap-8 z-[22]">
        <div class="flex">
          <BurgerIcon />
          <BurgerMenu :main-menu="mainMenu" :is-scrolled="menuScrollActive" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useCoreStore } from '~/stores/core';
import LogoAnimation from '~/components/ui/LogoAnimation.vue';

const props = defineProps({
  textIsWhite: {
    type: Boolean,
    default: true
  },
});

const store = useCoreStore();

const mainMenu = computed(() => {
  return store.getMenu('main-menu') || [];
});

const logoOnTransparent = computed(() => {
  return store.getSettings.logos?.logo_on_transparent;
});

const logoOnScroll = computed(() => {
  return store.getSettings.logos?.logo_on_scroll;
});

const hideTop = ref(false);
const lastScroll = ref(0);
const menuScrollActive = ref(false);
const scrollThreshold = 75;
const isMenuOpen = ref(false);

const scrollLogoActive = computed(() => {
  return menuScrollActive.value || (!menuScrollActive.value && !props.textIsWhite);
})

const currentTextColor = computed(() => {
  if (menuScrollActive.value) {
    return '#181D2D' 
  } else if (props.textIsWhite) {
    return 'white'
  } else {
    return 'black' 
  }
})

function handleScroll() {
  let currentScroll = window.scrollY;

  if(currentScroll < 0) {
    currentScroll = 0;
  }

  menuScrollActive.value = currentScroll > scrollThreshold;
  lastScroll.value = currentScroll;
  
}

function toggleBurger() {
  isMenuOpen.value = !isMenuOpen.value;
}


watch(isMenuOpen, (newVal) => {
  if (newVal) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
  }
});

onMounted(() => {
 
  window.addEventListener('scroll', handleScroll, { passive: true });

  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>
