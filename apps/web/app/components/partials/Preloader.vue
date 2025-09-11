<template>
  <div v-if="showPreloader" ref="preloaderContainer" class="preloader-container">
    <div class="logo-container">
      <svg ref="completeLogo" id="complete-logo" width="259" height="29" viewBox="0 0 259 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="step1">
          <path d="M0 0H24.0209V5.67911H0V0Z" fill="#FAFAF7"/>
          <path d="M13.6569 7.02351L8.90234 6.36084L8.90274 28.3959H15.1196V8.71113C15.1196 7.86058 14.4953 7.14039 13.6569 7.02351Z" fill="#FAFAF7"/>
        </g>
        <g id="step2">
          <path d="M47.6719 0H53.889V28.3956H47.6719V0Z" fill="#FAFAF7"/>
          <path d="M44.734 11.3583H34.2211V0H28.0039V28.3956H34.2211V17.037L46.9945 17.0374L46.4135 12.8278C46.2971 11.9854 45.5804 11.3583 44.734 11.3583Z" fill="#FAFAF7"/>
        </g>
        <g id="step3">
          <path d="M64.0772 0H57.5508L67.7539 17.754L69.8215 12.613C70.2125 11.6405 70.1359 10.5411 69.6135 9.63267L64.0772 0Z" fill="#FAFAF7"/>
        </g>
        <g id="step4">
          <path d="M85.2211 0L68.9056 28.3956H62.3789L78.6948 0H85.2211Z" fill="#FF5D52"/>
        </g>
        <g id="step5">
          <path d="M95.3233 24.186L94.7422 28.3955L106.893 28.3951V22.7163H97.0033C96.156 22.7163 95.4395 23.3436 95.3233 24.186Z" fill="#FAFAF7"/>
          <path d="M87.8438 0H94.0604V28.3956H87.8438V0Z" fill="#FAFAF7"/>
        </g>
        <g id="step6">
          <path d="M125.409 17.037H118.98L121.862 9.23843C122.22 8.2687 122.293 7.21582 122.073 6.20534L120.719 0H118.979L108.488 28.3956H114.783L116.882 22.7162L128.012 22.7165L127.066 18.3759C126.894 17.5942 126.206 17.037 125.409 17.037Z" fill="#FAFAF7"/>
          <path d="M121.398 0L123.634 6.04995L125.521 11.1578L131.89 28.3956H138.185L127.694 0H121.398Z" fill="#FAFAF7"/>
        </g>
        <g id="step7">
          <path d="M162.574 15.9129C162.574 17.622 162.865 19.3184 163.435 20.9285L166.081 28.3956H168.791V0H162.574V15.9129Z" fill="#FAFAF7"/>
          <path d="M141.438 0V28.3955H147.655V6.43923C147.655 6.30862 147.637 6.11434 147.637 6.11434L147.672 6.10754C147.672 6.10754 147.715 6.226 147.732 6.25803C147.748 6.2894 159.024 28.3955 159.024 28.3955H165.405L150.85 0H141.438Z" fill="#FAFAF7"/>
        </g>
        <g id="step8">
          <path d="M185.172 0L176.113 0.000191528V5.67911H185.172C191.414 5.69741 194.539 6.07128 194.539 14.1978C194.539 22.3702 191.355 22.6984 185.172 22.7164H182.331V8.71087C182.331 7.8604 181.706 7.14021 180.867 7.02332L176.113 6.36059V28.3956H185.172C192.068 28.3956 200.756 27.5573 200.756 14.1978C200.756 0.829768 192.056 0 185.172 0Z" fill="#FAFAF7"/>
        </g>
        <g id="step9">
          <path d="M212.499 17.0376H224.65V11.3584H212.499V8.71113C212.499 7.86058 211.875 7.14039 211.036 7.02351L206.281 6.36084V28.3959H227.476V22.7167H212.499V17.0376Z" fill="#FAFAF7"/>
          <path d="M206.281 0H227.476V5.67911H206.281V0Z" fill="#FAFAF7"/>
        </g>
        <g id="step10">
          <path d="M253.4 18.4042C253.4 18.4042 253.438 18.3929 253.59 18.3332C253.6 18.329 253.611 18.3251 253.622 18.3205C256.476 17.1537 258.736 14.7233 258.736 9.69104C258.736 0.694797 251.348 0 246.417 0H234.32V5.67934L246.417 5.66259C249.316 5.66259 252.726 5.50074 252.736 9.68596C252.732 13.3471 250.132 13.7179 247.542 13.7179C247.183 13.7179 243.452 13.7173 240.538 13.7165V8.71087C240.538 7.8604 239.913 7.14021 239.075 7.02332L234.32 6.36059L234.321 28.3956H240.538V19.3818L246.417 19.3819C246.701 19.3819 246.994 19.3799 247.293 19.3746L252.005 28.3956H258.668C258.668 28.3956 253.606 18.704 253.546 18.5891C253.487 18.4743 253.4 18.4042 253.4 18.4042Z" fill="#FAFAF7"/>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'

const showPreloader = ref(false)
const preloaderContainer = ref<HTMLElement>()
const completeLogo = ref<SVGElement>()


const checkFirstVisit = () => {
  if (process.client) {
    const hasVisited = localStorage.getItem('thylander-visited')
    if (!hasVisited) {
      showPreloader.value = true
     
      localStorage.setItem('thylander-visited', 'true')
    }
  }
}

const animateStepsIn = () => {
  if (!completeLogo.value) {
    return
  }

  const allG = completeLogo.value.querySelectorAll("g")

 
  gsap.set(allG, {
    opacity: 0,
    y: 30
  });
  

  const step1 = completeLogo.value.querySelector("#step1")
  const step4 = completeLogo.value.querySelector("#step4")
  
  if (step1) {
    gsap.set(step1, {
      x: 117  
    });
  }
  
  if (step4) {
    gsap.set(step4, {
      x: 77  
    });
  }

 
  const step1El = completeLogo.value.querySelector("#step1")
  const step4El = completeLogo.value.querySelector("#step4")
  

  gsap.to(step1El, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out"
  });

  
  gsap.to(step4El, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "power2.out",
    delay: 0.2  
  });

  
  gsap.to(step1El, {
    x: 0,
    duration: 1.0,
    ease: "power2.inOut",
    delay: 0.4  
  });
  
  gsap.to(step4El, {
    x: 0,
    duration: 1.0,
    ease: "power2.inOut",
    delay: 0.4  
  });

  const otherSteps = ["#step2", "#step3", "#step5", "#step6", "#step7", "#step8", "#step9", "#step10"];
  const otherStepElements = otherSteps.map(step => completeLogo.value?.querySelector(step)).filter(Boolean)
  
  gsap.set(otherStepElements, {
    opacity: 0,
    y: 0,
    x: -5
  });


  otherStepElements.forEach((step, index) => {
    if (!step) return; 
    
    const baseDelay = index === 0 ? 1.05 : 1.05 + (index * 0.05)
    gsap.to(step, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: "power2.out",
      delay: baseDelay
    });
  });


  setTimeout(() => {
    if (preloaderContainer.value) {
      gsap.to(preloaderContainer.value, {
        y: "-100vh",
        duration: 0.8,
        ease: "power2.in",
        onComplete: () => {
          showPreloader.value = false
        }
      })
    } else {
      showPreloader.value = false
    }
  }, 3000); 
}

onMounted(() => {

  checkFirstVisit()
  

  setTimeout(() => {
    if (showPreloader.value) {
     
      setTimeout(() => {
        animateStepsIn()
      }, 500);
    }
  }, 100)
})
</script>

<style scoped>
.preloader-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1E1F22;
  font-family: Arial, sans-serif;
  z-index: 9999;
}

.logo-container {
  position: relative;
  width: 518px;
  height: 58px;
}

#complete-logo {
  width: 100%;
  height: 100%;
}


#complete-logo g {
  opacity: 0;
}
</style>
