<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0">
      <img 
        src="/images/blurred-forrest.png" 
        alt="Forest background"
        class="w-full h-full object-cover"
      />
      <!-- Overlay for better text readability -->
      <div class="absolute inset-0"></div>
    </div>

    <!-- Header -->
    <div class="relative z-10 pt-8 px-8">
      <div class="flex justify-center">
       
      </div>
    </div>

    <!-- Login Form -->
    <div class="relative z-10 flex items-center justify-center min-h-[calc(100vh-8rem)] px-8">
      <div class="w-full max-w-md">
        <!-- Login Form Container -->
        <div class="bg-white/10 backdrop-blur-md rounded-2xl p-16">
          <div class="text-center mb-8">
            <h1 class="text-base text-white mb-2">
              Velkommen til FIVE's booking system
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
                placeholder="Brugernavn"
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
                placeholder="Adgangskode"
              />
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full bg-black text-white py-3 px-6 rounded-lg uppercase tracking-wide hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Logo from '~/components/ui/Logo.vue'

// // SEO
// useSeoHead({
//   title: 'Booking System - FIVE Transport & Logistics',
//   description: 'Log ind til FIVE's booking system for transport og logistik services.',
//   noindex: true // Don't index login pages
// })

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