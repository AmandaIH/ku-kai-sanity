<template>
  <div class="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 relative overflow-hidden">
    <!-- Background Image with Motion Blur Effect -->
    <div class="absolute inset-0">
      <div class="w-full h-full bg-gradient-to-br from-green-900 via-green-800 to-green-700 opacity-80"></div>
      <!-- Add some animated elements for motion effect -->
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-1/4 left-1/4 w-32 h-32 bg-green-300 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/3 right-1/3 w-48 h-48 bg-green-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div class="absolute top-1/2 right-1/4 w-24 h-24 bg-green-200 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>
    </div>

    <!-- Header -->
    <div class="relative z-10 pt-8 px-8">
      <div class="flex justify-center">
        <div class="text-center">
          <!-- Logo -->
          <div class="mb-4">
            <Logo 
              class="w-auto mx-auto" 
              style="height: 3rem;"
              fill-color="white"
              :hide-text="false"
            />
          </div>
          <!-- Tagline -->
          <p class="text-white text-sm uppercase tracking-wider font-medium">
            TRANSPORT & LOGISTICS
          </p>
        </div>
      </div>
    </div>

    <!-- Login Form -->
    <div class="relative z-10 flex items-center justify-center min-h-[calc(100vh-8rem)] px-8">
      <div class="w-full max-w-md">
        <!-- Login Form Container -->
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
          <div class="text-center mb-8">
            <h1 class="text-2xl font-bold text-gray-800 mb-2">
              Velkommen til WayStars booking system
            </h1>
            <p class="text-gray-600 text-sm">
              Log ind for at få adgang til dit booking system
            </p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-6">
            <!-- Username Field -->
            <div>
              <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
                Brugernavn
              </label>
              <input
                id="username"
                v-model="loginForm.username"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Indtast dit brugernavn"
              />
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                Adgangskode
              </label>
              <input
                id="password"
                v-model="loginForm.password"
                type="password"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Indtast din adgangskode"
              />
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold uppercase tracking-wide hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!isLoading">LOGIN</span>
              <span v-else class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logger ind...
              </span>
            </button>
          </form>

          <!-- Additional Links -->
          <div class="mt-6 text-center">
            <a href="#" class="text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
              Glemt adgangskode?
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from '~/components/ui/Logo.vue'

// SEO
useSeoHead({
  title: 'Booking System - WayStar Transport & Logistics',
  description: 'Log ind til WayStars booking system for transport og logistik services.',
  noindex: true // Don't index login pages
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
