import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export default defineNuxtPlugin(() => {
  // Make sure ScrollTrigger is properly registered
  if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
  }
  
  return {
    provide: {
      gsap,
      ScrollTrigger
    }
  }
}) 