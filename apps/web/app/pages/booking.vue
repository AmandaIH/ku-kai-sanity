<template>
  <div class="min-h-screen relative overflow-hidden" :style="backgroundStyle">
    <!-- Background Image -->
    <div v-if="bookingData?.backgroundImage?.asset?.url" class="absolute inset-0">
      <img 
        :src="bookingData.backgroundImage.asset.url" 
        :alt="bookingData.backgroundImage.alt || 'Background'"
        class="w-full h-full object-cover"
      />
      <!-- Overlay -->
      <div 
        class="absolute inset-0" 
        :style="overlayStyle"
      ></div>
    </div>
    
    <!-- Fallback gradient background -->
    <div v-else class="absolute inset-0 bg-gradient-to-br from-green-900 via-green-800 to-green-700"></div>

    <!-- Header -->
    <div class="relative z-10 pt-8 px-8">
      <div class="flex justify-center">
       
      </div>
    </div>

    <!-- Login Form -->
    <div class="relative z-10 flex items-center justify-center min-h-[calc(100vh-8rem)] px-8">
      <div class="w-full max-w-md">
        <!-- Login Form Container -->
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-16 shadow-2xl border border-white/20">
          <div class="text-center mb-8">
            <h1 class="text-base text-white mb-2">
             
            </h1>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-2">
            <!-- Username Field -->
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2 sr-only">
                Brugernavn
              </label>
              <input
                id="username"
                v-model="loginForm.username"
                type="text"
                required
                class="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                :placeholder="bookingData?.formSettings?.usernamePlaceholder || 'Brugernavn'"
              />
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2 sr-only">
                Adgangskode
              </label>
              <input
                id="password"
                v-model="loginForm.password"
                type="password"
                required
                class="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-black"
                :placeholder="bookingData?.formSettings?.passwordPlaceholder || 'Adgangskode'"
              />
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-black text-white py-3 px-6 rounded-lg uppercase tracking-wide hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isLoading">{{ bookingData?.formSettings?.loginButtonText || 'LOGIN' }}</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ bookingData?.formSettings?.loadingText || 'Logger ind...' }}
              </span>
            </button>
          </form>

          <!-- Additional Links -->
          <!-- <div class="mt-6 text-center">
            <a href="#" class="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
              Glemt adgangskode?
            </a>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from '~/components/ui/Logo.vue'
import { useSeoHead } from "~/composables/useSeoHead"

// Type definitions
interface BookingData {
  _id?: string
  title?: string
  metaDescription?: string
  welcomeTitle?: string
  backgroundImage?: {
    asset?: {
      _id: string
      url: string
    }
    alt?: string
  }
  backgroundOverlay?: {
    opacity?: number
    color?: string
  }
  formSettings?: {
    usernamePlaceholder?: string
    passwordPlaceholder?: string
    loginButtonText?: string
    loadingText?: string
  }
}

// Fetch booking page data
const bookingResponse = await $fetch<{ success: boolean; data: BookingData | null; error?: string }>('/api/booking')
const bookingData = ref<BookingData | null>(bookingResponse.data || null)

// SEO
const { getSeoHead } = useSeoHead()
getSeoHead({
  title: bookingData.value?.title || 'Booking System - WayStar Transport & Logistics',
  description: bookingData.value?.metaDescription || 'Log ind til WayStars booking system for transport og logistik services.',
  noindex: true // Don't index login pages
})

// Computed styles for background
const backgroundStyle = computed(() => {
  if (!bookingData.value?.backgroundImage?.asset?.url) {
    return {}
  }
  return {
    backgroundImage: `url(${bookingData.value.backgroundImage.asset.url})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }
})

const overlayStyle = computed(() => {
  const overlay = bookingData.value?.backgroundOverlay
  if (!overlay) {
    return {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    }
  }
  
  const opacity = (overlay.opacity || 50) / 100
  const color = overlay.color || '#000000'
  
  // Convert hex to rgba
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  
  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`
  }
})

// Login form data
const loginForm = ref({
  username: '',
  password: ''
})

const isLoading = ref(false)

// Handle login
const handleLogin = async () => {
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Here you would typically make an API call to authenticate
    console.log('Login attempt:', loginForm.value)
    
    // For demo purposes, just show success
    alert('Login successful! (This is a demo)')
    
  } catch (error) {
    console.error('Login error:', error)
    alert('Login failed. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Custom animations for the background */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Ensure the page takes full height */
html, body {
  height: 100%;
}
</style>
