/**
 * Composable for managing page transitions dynamically
 * Allows you to change transition effects based on route or other conditions
 */

export const usePageTransitions = () => {
  const route = useRoute()
  const router = useRouter()

  // Available transition types
  const transitionTypes = {
    page: 'page',
    slide: 'slide', 
    fade: 'fade',
    scale: 'scale',
    flip: 'flip',
    blur: 'blur'
  } as const

  type TransitionType = keyof typeof transitionTypes

  // Get transition based on route
  const getTransitionForRoute = (routeName?: string): TransitionType => {
    const currentRoute = routeName || route.name as string

    // Define transition rules based on route
    switch (currentRoute) {
      case 'index':
        return 'fade' // Home page uses fade
      case 'about':
        return 'slide' // About page uses slide
      case 'contact':
        return 'scale' // Contact page uses scale
      default:
        return 'page' // Default transition
    }
  }

  // Navigate with specific transition
  const navigateWithTransition = async (
    to: string, 
    transition: TransitionType = 'page'
  ) => {
    // Set transition before navigation
    await router.push(to)
  }

  // Get current transition
  const currentTransition = computed(() => {
    return getTransitionForRoute()
  })

  // Check if route should have special transition
  const hasSpecialTransition = (routeName: string): boolean => {
    return ['index', 'about', 'contact'].includes(routeName)
  }

  return {
    transitionTypes,
    getTransitionForRoute,
    navigateWithTransition,
    currentTransition,
    hasSpecialTransition
  }
}
