import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Animation configuration interface
 */
interface AnimationConfig {
  duration?: number;
  ease?: string;
  delay?: number;
  y?: number;
  opacity?: number;
  scale?: number;
  rotation?: number;
  stagger?: number;
  x?: number;
  skewX?: number;
  skewY?: number;
  transformOrigin?: string;
}

/**
 * ScrollTrigger configuration interface
 */
interface ScrollTriggerConfig {
  trigger: Element | string;
  start?: string;
  end?: string;
  toggleActions?: string;
  scrub?: boolean | number;
  markers?: boolean;
}

/**
 * Default animation configurations
 */
const defaultConfigs = {
  fadeUp: {
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
  },
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1, duration: 0.6, ease: "power2.out" }
  },
  scaleIn: {
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)" }
  },
  slideIn: {
    from: { opacity: 0, x: -20 },
    to: { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
  },
  slideInRight: {
    from: { opacity: 0, x: 20 },
    to: { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
  },
  slideInUp: {
    from: { opacity: 0, y: 50 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
  },
  slideInDown: {
    from: { opacity: 0, y: -50 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
  },
  rotateIn: {
    from: { opacity: 0, rotation: -180, scale: 0.3 },
    to: { opacity: 1, rotation: 0, scale: 1, duration: 0.8, ease: "back.out(1.7)" }
  },
  flipIn: {
    from: { opacity: 0, rotationY: 90, transformOrigin: "left center" },
    to: { opacity: 1, rotationY: 0, duration: 0.8, ease: "power2.out" }
  },
  bounceIn: {
    from: { opacity: 0, scale: 0.3, y: 50 },
    to: { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: "bounce.out" }
  },
  skewIn: {
    from: { opacity: 0, skewX: 30, transformOrigin: "center center" },
    to: { opacity: 1, skewX: 0, duration: 0.8, ease: "power2.out" }
  },
  splitText: {
    from: { opacity: 0, y: 20 },
    to: { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.05 }
  }
};

/**
 * Animation type enum
 */
type AnimationType = 
  | 'fadeUp'
  | 'fadeIn'
  | 'scaleIn'
  | 'slideIn'
  | 'slideInRight'
  | 'slideInUp'
  | 'slideInDown'
  | 'rotateIn'
  | 'flipIn'
  | 'bounceIn'
  | 'skewIn'
  | 'splitText';

/**
 * Sequence configuration interface
 */
interface SequenceConfig {
  staggerAmount?: number;
  duration?: number;
  ease?: string;
  delay?: number;
}

/**
 * Composable for GSAP animations
 */
export const useGsapAnimations = () => {
  // Get GSAP from Nuxt plugin
  const { $gsap, $ScrollTrigger } = useNuxtApp();
  const gsapInstance = ($gsap || gsap) as typeof gsap;
  const scrollTriggerInstance = ($ScrollTrigger || ScrollTrigger) as typeof ScrollTrigger;
  
  // Ensure ScrollTrigger is registered
  if (typeof window !== 'undefined' && scrollTriggerInstance) {
    gsapInstance.registerPlugin(scrollTriggerInstance);
  }

  /**
   * Create a staggered animation for multiple elements
   */
  const staggerAnimation = (
    elements: Element[] | string[],
    config: AnimationConfig = {},
    staggerAmount: number = 0.1
  ) => {
    return gsapInstance.fromTo(
      elements,
      {
        opacity: 0,
        y: 20,
        ...config
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: staggerAmount,
        ...config
      }
    );
  };

  /**
   * Create a scroll-triggered animation
   */
  const scrollTriggerAnimation = (
    element: Element | string,
    animation: gsap.core.Timeline | gsap.core.Tween,
    scrollConfig: ScrollTriggerConfig
  ) => {
    try {
      if (!scrollTriggerInstance || typeof scrollTriggerInstance.create !== 'function') {
        console.warn('ScrollTrigger not available, skipping animation');
        return null;
      }
      
      return scrollTriggerInstance.create({
        ...scrollConfig,
        animation
      });
    } catch (error) {
      console.warn('Error creating ScrollTrigger animation:', error);
      return null;
    }
  };

  /**
   * Create a fade-up animation
   */
  const fadeUp = (
    element: Element | string,
    config: AnimationConfig = {}
  ) => {
    return gsapInstance.fromTo(
      element,
      { ...defaultConfigs.fadeUp.from, ...config },
      { ...defaultConfigs.fadeUp.to, ...config }
    );
  };

  /**
   * Create a fade-in animation
   */
  const fadeIn = (
    element: Element | string,
    config: AnimationConfig = {}
  ) => {
    return gsapInstance.fromTo(
      element,
      { ...defaultConfigs.fadeIn.from, ...config },
      { ...defaultConfigs.fadeIn.to, ...config }
    );
  };

  /**
   * Create a scale-in animation
   */
  const scaleIn = (
    element: Element | string,
    config: AnimationConfig = {}
  ) => {
    return gsapInstance.fromTo(
      element,
      { ...defaultConfigs.scaleIn.from, ...config },
      { ...defaultConfigs.scaleIn.to, ...config }
    );
  };

  /**
   * Create a slide-in animation from left
   */
  const slideIn = (
    element: Element | string,
    config: AnimationConfig = {}
  ) => {
    return gsapInstance.fromTo(
      element,
      { ...defaultConfigs.slideIn.from, ...config },
      { ...defaultConfigs.slideIn.to, ...config }
    );
  };

  /**
   * Create a slide-in animation from right
   */
  const slideInRight = (
    element: Element | string,
    config: AnimationConfig = {}
  ) => {
    return gsapInstance.fromTo(
      element,
      { ...defaultConfigs.slideInRight.from, ...config },
      { ...defaultConfigs.slideInRight.to, ...config }
    );
  };

  /**
   * Create a slide-in animation from bottom
   */
  const slideInUp = (
    element: Element | string,
    config: AnimationConfig = {}
  ) => {
    return gsapInstance.fromTo(
      element,
      { ...defaultConfigs.slideInUp.from, ...config },
      { ...defaultConfigs.slideInUp.to, ...config }
    );
  };

  /**
   * Create a slide-in animation from top
   */
  const slideInDown = (
    element: Element | string,
    config: AnimationConfig = {}
  ) => {
    return gsapInstance.fromTo(
      element,
      { ...defaultConfigs.slideInDown.from, ...config },
      { ...defaultConfigs.slideInDown.to, ...config }
    );
  };

  /**
   * Create a rotate-in animation
   */
  const rotateIn = (
    element: Element | string,
    config: AnimationConfig = {}
  ) => {
    return gsapInstance.fromTo(
      element,
      { ...defaultConfigs.rotateIn.from, ...config },
      { ...defaultConfigs.rotateIn.to, ...config }
    );
  };

  /**
   * Create a flip-in animation
   */
  const flipIn = (
    element: Element | string,
    config: AnimationConfig = {}
  ) => {
    return gsapInstance.fromTo(
      element,
      { ...defaultConfigs.flipIn.from, ...config },
      { ...defaultConfigs.flipIn.to, ...config }
    );
  };

  /**
   * Create a bounce-in animation
   */
  const bounceIn = (
    element: Element | string,
    config: AnimationConfig = {}
  ) => {
    return gsapInstance.fromTo(
      element,
      { ...defaultConfigs.bounceIn.from, ...config },
      { ...defaultConfigs.bounceIn.to, ...config }
    );
  };

  /**
   * Create a skew-in animation
   */
  const skewIn = (
    element: Element | string,
    config: AnimationConfig = {}
  ) => {
    return gsapInstance.fromTo(
      element,
      { ...defaultConfigs.skewIn.from, ...config },
      { ...defaultConfigs.skewIn.to, ...config }
    );
  };

  /**
   * Create a split text animation
   */
  const splitText = (
    element: Element | string,
    config: AnimationConfig = {}
  ) => {
    return gsapInstance.fromTo(
      element,
      { ...defaultConfigs.splitText.from, ...config },
      { ...defaultConfigs.splitText.to, ...config }
    );
  };

  /**
   * Add animation to the global timeline
   */
  const addToGlobalTimeline = (
    animation: gsap.core.Timeline | gsap.core.Tween,
    position?: string | number
  ) => {
    return gsapInstance.timeline().add(animation, position);
  };

  /**
   * Create a sequence of animations
   */
  const sequence = (
    elements: Element[] | string[],
    animationType: AnimationType = 'fadeUp',
    config: SequenceConfig = {}
  ) => {
    const timeline = gsapInstance.timeline();
    
    // Get the default configuration for the animation type
    const defaultConfig = defaultConfigs[animationType];
    
    // Merge default config with custom config
    const mergedConfig = {
      duration: config.duration || defaultConfig.to.duration,
      ease: config.ease || defaultConfig.to.ease,
      stagger: config.staggerAmount || 0.15,
      delay: config.delay || 0
    };

    // Add animations to timeline
    timeline.fromTo(
      elements,
      { 
        ...defaultConfig.from,
        ...mergedConfig
      },
      { 
        ...defaultConfig.to,
        ...mergedConfig
      }
    );

    return timeline;
  };

  /**
   * Create a parallax effect
   */
  const parallax = (
    element: Element | string,
    speed: number = 1,
    config: Omit<ScrollTriggerConfig, 'trigger'> = {}
  ) => {
    const timeline = gsapInstance.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: speed,
        ...config
      }
    });

    timeline.to(element, {
      y: -50 * speed,
      ease: "none"
    });

    return timeline;
  };

  /**
   * Create a reveal animation with mask
   */
  const revealMask = (
    element: Element | string,
    direction: 'up' | 'down' | 'left' | 'right' = 'up',
    config: AnimationConfig = {}
  ) => {
    const mask = document.createElement('div');
    mask.style.position = 'absolute';
    mask.style.top = '0';
    mask.style.left = '0';
    mask.style.width = '100%';
    mask.style.height = '100%';
    mask.style.backgroundColor = 'white';
    mask.style.transformOrigin = direction === 'up' || direction === 'down' ? 'top' : 'left';

    const timeline = gsapInstance.timeline();
    
    timeline
      .set(element, { opacity: 1, ...config })
      .fromTo(mask, 
        { scaleY: direction === 'up' || direction === 'down' ? 1 : 0, scaleX: direction === 'left' || direction === 'right' ? 1 : 0 },
        { 
          scaleY: 0,
          scaleX: 0,
          duration: 0.8,
          ease: "power2.inOut",
          ...config
        }
      );

    return timeline;
  };

  return {
    staggerAnimation,
    scrollTriggerAnimation,
    fadeUp,
    fadeIn,
    scaleIn,
    slideIn,
    slideInRight,
    slideInUp,
    slideInDown,
    rotateIn,
    flipIn,
    bounceIn,
    skewIn,
    splitText,
    addToGlobalTimeline,
    sequence,
    parallax,
    revealMask,
    defaultConfigs
  };
}; 