<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
    @click="closeModal"
  >
      <div 
        class="bg-white/10 backdrop-blur-md rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >

      <div class="flex flex-col items-center px-28 pt-16">
     
        <div class="mb-0 h-12 w-12">
          <SmallLogo class="w-6 h-6" fill-color="white" :fill-opacity="0.2" />
        </div>
        
        <h2 class="text-center text-white mb-4">
          Indhent et tilbud
        </h2>
        
        <p class="text-white text-center text-base leading-relaxed mb-0">
          Udfyld felterne nedenfor, så vi kan give dig et tilbud hurtigt. 
        </p>
        <p class="text-white text-center text-base leading-relaxed">
          Alle felter er påkrævede for at sikre præcision.
        </p>
        
        <!-- Close Button -->
        <button 
          @click="closeModal"
          class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Form Content -->
      <div class="px-28 pb-24">
        <form class="space-y-4">
 
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="sr-only" for="contactPerson">Kontaktperson*</label>
                <input 
                  type="text" 
                  id="contactPerson"
                  v-model="formValues.contactPerson"
                  class="w-full px-3 py-2 bg-white rounded-lg text-base focus:outline-none placeholder-black"
                  :class="errors.contactPerson ? 'border-2 border-red-500' : ''"
                  placeholder="Kontaktperson*"
                  required
                />
                <div v-if="errors.contactPerson" class="text-red-500 text-sm mt-1">{{ errors.contactPerson }}</div>
            </div>
            <div>
             <label class="sr-only" for="email">Email*</label>
              <input 
                id="email"
                type="email" 
                v-model="formValues.email"
                class="w-full px-3 py-2 bg-white rounded-lg text-base focus:outline-none placeholder-black"
                :class="errors.email ? 'border-2 border-red-500' : ''"
                placeholder="Email*"
                required
              />
              <div v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</div>
            </div>
          </div>

     
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="sr-only" for="containerSize">Containerstørrelse*</label>
                <div class="relative">
                  <select 
                    id="containerSize"
                    v-model="formValues.containerSize"
                    class="custom-select w-full px-3 py-2 bg-white rounded-lg text-base focus:outline-none text-black"
                    :class="errors.containerSize ? 'border-2 border-red-500' : ''"
                    required
                  >
                    <option value="" disabled>Containerstørrelse*</option>
                    <option value="20ft">20ft</option>
                    <option value="40ft">40ft</option>
                    <option value="45ft">45ft</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" class="dropdown-arrow">
                      <path d="M0.292786 0.292464C0.480314 0.104993 0.734622 -0.000322819 0.999786 -0.000322819C1.26495 -0.000322819 1.51926 0.104993 1.70679 0.292464L6.65679 5.24246L11.6068 0.292464C11.7954 0.110306 12.048 0.00951147 12.3102 0.0117898C12.5724 0.0140681 12.8232 0.119237 13.0086 0.304645C13.194 0.490053 13.2992 0.740866 13.3015 1.00306C13.3037 1.26526 13.2029 1.51786 13.0208 1.70646L7.36379 7.36346C7.17626 7.55093 6.92195 7.65625 6.65679 7.65625C6.39162 7.65625 6.13731 7.55093 5.94979 7.36346L0.292786 1.70646C0.105315 1.51894 0 1.26463 0 0.999464C0 0.734299 0.105315 0.479991 0.292786 0.292464Z" fill="black"/>
                    </svg>
                  </div>
                </div>
                <div v-if="errors.containerSize" class="text-red-500 text-sm mt-1">{{ errors.containerSize }}</div>
              </div>
              <div>
                <label class="sr-only" for="transportType">Transporttype*</label>
                <div class="relative">
                  <select 
                    id="transportType"
                    v-model="formValues.transportType"
                    class="custom-select w-full px-3 py-2 bg-white rounded-lg text-base focus:outline-none text-black"
                    :class="errors.transportType ? 'border-2 border-red-500' : ''"
                    required
                  >
                    <option value="" disabled>Transporttype*</option>
                    <option value="chassis">Chassis</option>
                    <option value="sideloader">Sideloader</option>
                    <option value="depot">Depot</option>
                    <option value="genset">Genset</option>
                  </select>
                  <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" class="dropdown-arrow">
                      <path d="M0.292786 0.292464C0.480314 0.104993 0.734622 -0.000322819 0.999786 -0.000322819C1.26495 -0.000322819 1.51926 0.104993 1.70679 0.292464L6.65679 5.24246L11.6068 0.292464C11.7954 0.110306 12.048 0.00951147 12.3102 0.0117898C12.5724 0.0140681 12.8232 0.119237 13.0086 0.304645C13.194 0.490053 13.2992 0.740866 13.3015 1.00306C13.3037 1.26526 13.2029 1.51786 13.0208 1.70646L7.36379 7.36346C7.17626 7.55093 6.92195 7.65625 6.65679 7.65625C6.39162 7.65625 6.13731 7.55093 5.94979 7.36346L0.292786 1.70646C0.105315 1.51894 0 1.26463 0 0.999464C0 0.734299 0.105315 0.479991 0.292786 0.292464Z" fill="black"/>
                    </svg>
                  </div>
                </div>
                <div v-if="errors.transportType" class="text-red-500 text-sm mt-1">{{ errors.transportType }}</div>
              </div>
            </div>


            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="sr-only" for="pickupLocation">Afhentningssted*</label>
              <input 
                type="text" 
                id="pickupLocation"
                v-model="formValues.pickupLocation"
                class="w-full px-3 py-2 bg-white rounded-lg text-base focus:outline-none placeholder-black"
                :class="errors.pickupLocation ? 'border-2 border-red-500' : ''"
                placeholder="Afhentningssted*"
                required
              />
              <div v-if="errors.pickupLocation" class="text-red-500 text-sm mt-1">{{ errors.pickupLocation }}</div>
            </div>
            <div>
             
              <input 
                type="text" 
                v-model="formValues.destination"
                class="w-full px-3 py-2 bg-white rounded-lg text-base focus:outline-none placeholder-black"
                :class="errors.destination ? 'border-2 border-red-500' : ''"
                placeholder="Destination*"
              />
              <div v-if="errors.destination" class="text-red-500 text-sm mt-1">{{ errors.destination }}</div>
            </div>
          </div>


          <div>
            
            <textarea 
              v-model="formValues.notes"
              class="w-full px-3 py-2 bg-white rounded-lg text-base focus:outline-none placeholder-black"
              rows="4"
              placeholder="Evt. notat eller kommentar"
            ></textarea>
          </div>

          <!-- Checkbox -->
          <div class="flex items-center gap-3 mt-4">
            <input 
              type="checkbox" 
              id="privacy-consent"
              v-model="privacyConsent"
              class="w-4 h-4 text-white bg-white rounded-full custom-checkbox"
            />
            <label for="privacy-consent" class="text-white text-sm leading-relaxed">
              Jeg har læst og accepterer Five's privatlivspolitik*
            </label>
          </div>

          <!-- Form Actions -->
          <div class="flex gap-3 mt-6">
            
            <button 
              @click="submitForm"
              :disabled="!privacyConsent"
              class="flex-1 px-4 py-2 text-white text-base rounded-lg transition-colors"
              :class="privacyConsent ? 'bg-black hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import DOMPurify from 'dompurify'
import Logo from '~/components/ui/Logo.vue'

interface FormData {
  id: string
  title?: string
  description?: string
}

const isOpen = ref(false)
const formData = ref<FormData | null>(null)
const privacyConsent = ref(false)

// Form data
const formValues = ref({
  contactPerson: '',
  email: '',
  containerSize: '',
  transportType: '',
  pickupLocation: '',
  destination: '',
  notes: ''
})

// Sanitization function
const sanitizeInput = (input: string): string => {
  if (!input) return ''
  // Remove HTML tags and dangerous characters
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [], 
    ALLOWED_ATTR: [] 
  }).trim()
}

// Validation errors
const errors = ref({
  contactPerson: '',
  email: '',
  containerSize: '',
  transportType: '',
  pickupLocation: '',
  destination: ''
})

const openForm = (data: FormData) => {
  formData.value = data
  isOpen.value = true
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isOpen.value = false
  formData.value = null
  // Restore body scroll
  document.body.style.overflow = ''
}

// Validation function
const validateForm = () => {
  // Clear previous errors
  errors.value = {
    contactPerson: '',
    email: '',
    containerSize: '',
    transportType: '',
    pickupLocation: '',
    destination: ''
  }

  let isValid = true

  // Validate required fields
  if (!formValues.value.contactPerson.trim()) {
    errors.value.contactPerson = 'Kontaktperson er påkrævet'
    isValid = false
  }

  if (!formValues.value.email.trim()) {
    errors.value.email = 'Email er påkrævet'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.value.email)) {
    errors.value.email = 'Indtast en gyldig email'
    isValid = false
  }

  if (!formValues.value.containerSize) {
    errors.value.containerSize = 'Containerstørrelse er påkrævet'
    isValid = false
  }

  if (!formValues.value.transportType) {
    errors.value.transportType = 'Transporttype er påkrævet'
    isValid = false
  }

  if (!formValues.value.pickupLocation.trim()) {
    errors.value.pickupLocation = 'Afhentningssted er påkrævet'
    isValid = false
  }

  if (!formValues.value.destination.trim()) {
    errors.value.destination = 'Destination er påkrævet'
    isValid = false
  }

  return isValid
}

const submitForm = () => {
  if (!validateForm()) {
    return // Don't submit if validation fails
  }

  // Sanitize and collect form data
  const submissionData = {
    contactPerson: sanitizeInput(formValues.value.contactPerson),
    email: sanitizeInput(formValues.value.email),
    containerSize: sanitizeInput(formValues.value.containerSize),
    transportType: sanitizeInput(formValues.value.transportType),
    pickupLocation: sanitizeInput(formValues.value.pickupLocation),
    destination: sanitizeInput(formValues.value.destination),
    notes: sanitizeInput(formValues.value.notes),
    privacyConsent: privacyConsent.value
  }

  
  // Here you would typically:
  // 1. Send to your API endpoint
  // 2. Show success/error message
  // 3. Reset form on success
  
  // For now, just close the modal
  closeModal()
}



// Listen for the custom event from LinkButton
const handleOpenFormEvent = (event: CustomEvent) => {
  openForm(event.detail)
}


onMounted(() => {
  window.addEventListener('openForm', handleOpenFormEvent as EventListener)
})

onUnmounted(() => {
  window.removeEventListener('openForm', handleOpenFormEvent as EventListener)
  // Ensure body scroll is restored
  document.body.style.overflow = ''
})

// Expose methods for parent components if needed
defineExpose({
  openForm,
  closeModal
})
</script>

<style scoped>
.custom-checkbox {
  accent-color: white !important;
}

.custom-checkbox:checked {
  background-color: white !important;
  border-color: white !important;
}

.custom-checkbox:checked::after {
  color: black !important;
}

/* Custom Select Styling */
.custom-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: none !important;
  cursor: pointer;
  padding-right: 40px; /* Make room for custom arrow */
}

.custom-select:focus {
  box-shadow: none;
  border-color: transparent;
  outline: none;
}

.custom-select:hover {
  background-color: #f9fafb;
}

/* Style the options */
.custom-select option {
  background-color: white;
  color: black;
  padding: 8px 12px;
  font-size: 16px;
}

.custom-select option:disabled {
  color: #6b7280;
  font-style: italic;
}

.custom-select option:hover {
  background-color: #f3f4f6;
}

/* Dropdown arrow styling */
.dropdown-arrow {
  transition: transform 0.2s ease;
  pointer-events: none;
}

/* Hide the default arrow on different browsers */
.custom-select::-ms-expand {
  display: none;
}

.custom-select::-webkit-calendar-picker-indicator {
  display: none;
}

/* Firefox specific */
@-moz-document url-prefix() {
  .custom-select {
    background-image: none !important;
  }
}

</style>

