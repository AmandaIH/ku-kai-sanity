<template>
  <form 
    @submit.prevent="handleSubmit" 
    class="space-y-8"
    novalidate
    aria-label="Tilbudsforespørgsel formular"
  >
    <!-- Kontaktinformation -->
    <div class="space-y-6 pb-8">
      <h3 class="text-lg font-medium text-black border-b border-black/10 pb-2">
        Kontaktinformation
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="form-group">
        <label for="kontaktperson" class="form-label">
          Kontaktperson
          <span class="text-red-600" aria-label="påkrævet felt">*</span>
        </label>
        <input 
          type="text" 
          id="kontaktperson"
          name="kontaktperson" 
          v-model="formData.kontaktperson"
          required
          aria-required="true"
          :aria-invalid="errors.kontaktperson ? 'true' : 'false'"
          :aria-describedby="errors.kontaktperson ? 'error-kontaktperson' : undefined"
          class="form-input"
          :class="{ 'form-input-error': errors.kontaktperson }"
          autocomplete="name"
        />
        <div v-if="errors.kontaktperson" id="error-kontaktperson" class="form-error" role="alert">
          {{ errors.kontaktperson }}
        </div>
      </div>

      <div class="form-group">
        <label for="email" class="form-label">
          E-mail
          <span class="text-red-600" aria-label="påkrævet felt">*</span>
        </label>
        <input 
          type="email" 
          id="email"
          name="email" 
          v-model="formData.email"
          required
          aria-required="true"
          :aria-invalid="errors.email ? 'true' : 'false'"
          :aria-describedby="errors.email ? 'error-email' : undefined"
          class="form-input"
          :class="{ 'form-input-error': errors.email }"
          autocomplete="email"
        />
        <div v-if="errors.email" id="error-email" class="form-error" role="alert">
          {{ errors.email }}
        </div>
      </div>

      <div class="form-group">
        <label for="telefon" class="form-label">
          Telefonnummer
          <span class="text-red-600" aria-label="påkrævet felt">*</span>
        </label>
        <input 
          type="tel" 
          id="telefon"
          name="telefon" 
          v-model="formData.telefon"
          required
          aria-required="true"
          :aria-invalid="errors.telefon ? 'true' : 'false'"
          :aria-describedby="errors.telefon ? 'error-telefon' : undefined"
          class="form-input"
          :class="{ 'form-input-error': errors.telefon }"
          autocomplete="tel"
        />
        <div v-if="errors.telefon" id="error-telefon" class="form-error" role="alert">
          {{ errors.telefon }}
        </div>
      </div>
    </div>
    </div>

    <!-- Transportdetaljer -->
    <div class="space-y-6 pb-8">
      <h3 class="text-lg font-medium text-black border-b border-black/10 pb-2">
        Transportdetaljer
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="form-group">
        <label for="transport" class="form-label">
          Transportretning
          <span class="text-red-600" aria-label="påkrævet felt">*</span>
        </label>
        <div class="select-wrap relative">
          <select 
            id="transport"
            name="transport" 
            v-model="formData.transport"
            required
            aria-required="true"
            :aria-invalid="errors.transport ? 'true' : 'false'"
            :aria-describedby="errors.transport ? 'error-transport' : undefined"
            class="form-input form-select"
            :class="{ 'form-input-error': errors.transport }"
          >
            <option value="" disabled selected>Vælg transportretning</option>
            <option v-for="option in transportOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div v-if="errors.transport" id="error-transport" class="form-error" role="alert">
          {{ errors.transport }}
        </div>
      </div>

      <div class="form-group">
        <label for="container" class="form-label">
          Container størrelse/type
          <span class="text-red-600" aria-label="påkrævet felt">*</span>
        </label>
        <div class="select-wrap relative">
          <select 
            id="container"
            name="container" 
            v-model="formData.container"
            required
            aria-required="true"
            :aria-invalid="errors.container ? 'true' : 'false'"
            :aria-describedby="errors.container ? 'error-container' : undefined"
            class="form-input form-select"
            :class="{ 'form-input-error': errors.container }"
          >
            <option value="" disabled selected>Vælg container størrelse/type</option>
            <option v-for="option in containerOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div v-if="errors.container" id="error-container" class="form-error" role="alert">
          {{ errors.container }}
        </div>
      </div>

      <div class="form-group">
        <label for="transporttype" class="form-label">
          Transporttype
          <span class="text-red-600" aria-label="påkrævet felt">*</span>
        </label>
        <div class="select-wrap relative">
          <select 
            id="transporttype"
            name="transporttype" 
            v-model="formData.transporttype"
            required
            aria-required="true"
            :aria-invalid="errors.transporttype ? 'true' : 'false'"
            :aria-describedby="errors.transporttype ? 'error-transporttype' : undefined"
            class="form-input form-select"
            :class="{ 'form-input-error': errors.transporttype }"
          >
            <option value="" disabled selected>Vælg transporttype</option>
            <option v-for="option in transportTypeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div v-if="errors.transporttype" id="error-transporttype" class="form-error" role="alert">
          {{ errors.transporttype }}
        </div>
      </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="form-group">
        <label for="antal" class="form-label">
          Antal containere
          <span class="text-red-600" aria-label="påkrævet felt">*</span>
        </label>
        <input 
          type="number" 
          id="antal"
          name="antal" 
          v-model.number="formData.antal"
          min="1" 
          required
          aria-required="true"
          :aria-invalid="errors.antal ? 'true' : 'false'"
          :aria-describedby="errors.antal ? 'error-antal' : undefined"
          class="form-input"
          :class="{ 'form-input-error': errors.antal }"
        />
        <div v-if="errors.antal" id="error-antal" class="form-error" role="alert">
          {{ errors.antal }}
        </div>
      </div>

      <div class="form-group">
        <label for="rederi" class="form-label">
          Rederi
          <span class="text-red-600" aria-label="påkrævet felt">*</span>
        </label>
        <div class="select-wrap relative">
          <select 
            id="rederi"
            name="rederi" 
            v-model="formData.rederi"
            required
            aria-required="true"
            :aria-invalid="errors.rederi ? 'true' : 'false'"
            :aria-describedby="errors.rederi ? 'error-rederi' : undefined"
            class="form-input form-select"
            :class="{ 'form-input-error': errors.rederi }"
          >
            <option value="" disabled selected>Vælg rederi</option>
            <option v-for="rederi in rederiOptions" :key="rederi" :value="rederi">
              {{ rederi }}
            </option>
          </select>
        </div>
        <div v-if="errors.rederi" id="error-rederi" class="form-error" role="alert">
          {{ errors.rederi }}
        </div>
      </div>

      <div class="form-group">
        <label for="livedrop" class="form-label">Live eller Drop</label>
        <div class="select-wrap relative">
          <select 
            id="livedrop"
            name="livedrop" 
            v-model="formData.livedrop"
            class="form-input form-select"
          >
            <option value="" disabled selected>Vælg live eller drop</option>
            <option v-for="option in liveDropOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>
    </div>

    <!-- Adresseinformation -->
    <div class="space-y-6 pb-8">
      <h3 class="text-lg font-medium text-black border-b border-black/10 pb-2">
        Adresseinformation
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="form-group">
        <label for="afhentning" class="form-label">
          Afhentningssted (adresse + postnr/by)
          <span class="text-red-600" aria-label="påkrævet felt">*</span>
        </label>
        <input 
          type="text" 
          id="afhentning"
          name="afhentning" 
          v-model="formData.afhentning"
          placeholder="F.eks. Industrivej 23, 7000 Fredericia" 
          required
          aria-required="true"
          :aria-invalid="errors.afhentning ? 'true' : 'false'"
          :aria-describedby="errors.afhentning ? 'error-afhentning' : undefined"
          class="form-input"
          :class="{ 'form-input-error': errors.afhentning }"
          autocomplete="street-address"
        />
        <div v-if="errors.afhentning" id="error-afhentning" class="form-error" role="alert">
          {{ errors.afhentning }}
        </div>
      </div>

      <div class="form-group">
        <label for="levering" class="form-label">
          Leveringssted (adresse + postnr/by)
          <span class="text-red-600" aria-label="påkrævet felt">*</span>
        </label>
        <input 
          type="text" 
          id="levering"
          name="levering" 
          v-model="formData.levering"
          placeholder="F.eks. Havnevej 10, 8000 Aarhus C" 
          required
          aria-required="true"
          :aria-invalid="errors.levering ? 'true' : 'false'"
          :aria-describedby="errors.levering ? 'error-levering' : undefined"
          class="form-input"
          :class="{ 'form-input-error': errors.levering }"
          autocomplete="street-address"
        />
        <div v-if="errors.levering" id="error-levering" class="form-error" role="alert">
          {{ errors.levering }}
        </div>
      </div>

      <div class="form-group">
        <label for="indlevering" class="form-label">
          Indleveringssted (hvis forskelligt fra afhentning)
        </label>
        <input 
          type="text" 
          id="indlevering"
          name="indlevering" 
          v-model="formData.indlevering"
          class="form-input"
          autocomplete="street-address"
        />
      </div>
    </div>
    </div>

    <!-- Bemærkninger -->
    <div class="form-group">
      <label for="bemærkninger" class="form-label">
        Bemærkninger / specielle ønsker
      </label>
      <textarea 
        id="bemærkninger"
        name="bemærkninger" 
        v-model="formData.bemærkninger"
        placeholder="F.eks. farligt gods (ADR), tidskrav, overvægt, osv." 
        rows="4"
        class="form-input form-textarea"
        aria-describedby="bemærkninger-help"
      ></textarea>
      <div id="bemærkninger-help" class="text-sm text-black/60 mt-1">
        Valgfrit felt til yderligere information
      </div>
    </div>

    <!-- GDPR Compliance -->
    <div class="form-group">
      <div class="flex items-start gap-3 p-4 rounded-lg border border-black/10 bg-black/5">
        <input 
          type="checkbox" 
          id="privacy-consent"
          v-model="formData.privacyConsent"
          required
          aria-required="true"
          :aria-invalid="errors.privacyConsent ? 'true' : 'false'"
          :aria-describedby="errors.privacyConsent ? 'error-privacy' : 'privacy-info'"
          class="mt-1 w-4 h-4 text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
        />
        <label for="privacy-consent" class="text-sm leading-relaxed cursor-pointer flex-1">
          <span class="font-medium">
            Jeg accepterer behandling af mine personoplysninger
            <span class="text-red-600" aria-label="påkrævet felt">*</span>
          </span>
          <span id="privacy-info" class="block mt-1 text-black/70">
            Ved at indsende denne formular accepterer jeg, at mine personoplysninger behandles i henhold til 
            <a href="/privatlivspolitik" target="_blank" class="!text-black underline hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm rounded">
              privatlivspolitikken
            </a>.
          </span>
        </label>
      </div>
      <div v-if="errors.privacyConsent" id="error-privacy" class="form-error mt-2" role="alert">
        {{ errors.privacyConsent }}
      </div>
    </div>

    <!-- Submit Button -->
    <button 
      type="submit" 
      class="btn btn-primary w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="isSubmitting"
      :aria-busy="isSubmitting"
    >
      <span v-if="!isSubmitting" class="flex items-center gap-4">
        Send forespørgsel
      </span>
      <span v-else class="flex items-center gap-4">
        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Sender...
      </span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// Form data
const formData = reactive({
  kontaktperson: '',
  telefon: '',
  email: '',
  transport: '',
  container: '',
  transporttype: '',
  antal: 1,
  rederi: '',
  livedrop: '',
  afhentning: '',
  levering: '',
  indlevering: '',
  bemærkninger: '',
  privacyConsent: false
})

// Form options
const transportOptions = [
  { value: 'Import', label: 'Import', id: 'import' },
  { value: 'Eksport', label: 'Eksport', id: 'eksport' },
  { value: 'One-Way', label: 'One-Way', id: 'oneway' }
]

const containerOptions = [
  { value: "20' DC", label: "20' DC", id: 'c20dc' },
  { value: "20' HC", label: "20' HC", id: 'c20hc' },
  { value: "40' DC", label: "40' DC", id: 'c40dc' },
  { value: "40' HC", label: "40' HC", id: 'c40hc' },
  { value: "40 Reefer", label: "40' Reefer", id: 'reefer' },
  { value: 'Andet', label: 'Andet', id: 'andet' }
]

const transportTypeOptions = [
  { value: 'Chassis', label: 'Chassis', id: 'chassis' },
  { value: 'Sidelaster', label: 'Sidelaster', id: 'sidelaster' },
  { value: 'Genset', label: 'Genset', id: 'genset' },
  { value: 'TIP Chassis', label: 'TIP Chassis', id: 'tip' }
]

const rederiOptions = [
  'MSC', 'Mærsk', 'Hapag', 'ONE', 'OOCL', 'Yang Ming',
  'Evergreen', 'CMA CGM', 'Cosco', 'Shippers Own', 'Andet'
]

const liveDropOptions = [
  { value: 'Live', label: 'Live', id: 'live' },
  { value: 'Drop', label: 'Drop', id: 'drop' }
]

// Validation errors
const errors = reactive({
  kontaktperson: '',
  telefon: '',
  email: '',
  transport: '',
  container: '',
  transporttype: '',
  antal: '',
  rederi: '',
  afhentning: '',
  levering: '',
  privacyConsent: ''
})

const isSubmitting = ref(false)

// Validation function
const validateForm = (): boolean => {
  // Clear previous errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // Validate required fields
  if (!formData.kontaktperson.trim()) {
    errors.kontaktperson = 'Kontaktperson er påkrævet'
    isValid = false
  }

  if (!formData.telefon.trim()) {
    errors.telefon = 'Telefonnummer er påkrævet'
    isValid = false
  } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.telefon)) {
    errors.telefon = 'Indtast et gyldigt telefonnummer'
    isValid = false
  }

  if (!formData.email.trim()) {
    errors.email = 'E-mail er påkrævet'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Indtast en gyldig e-mail adresse'
    isValid = false
  }

  if (!formData.transport) {
    errors.transport = 'Vælg transportretning'
    isValid = false
  }

  if (!formData.container) {
    errors.container = 'Vælg container størrelse/type'
    isValid = false
  }

  if (!formData.transporttype) {
    errors.transporttype = 'Vælg transporttype'
    isValid = false
  }

  if (!formData.antal || formData.antal < 1) {
    errors.antal = 'Antal containere skal være mindst 1'
    isValid = false
  }

  if (!formData.rederi) {
    errors.rederi = 'Vælg rederi'
    isValid = false
  }

  if (!formData.afhentning.trim()) {
    errors.afhentning = 'Afhentningssted er påkrævet'
    isValid = false
  }

  if (!formData.levering.trim()) {
    errors.levering = 'Leveringssted er påkrævet'
    isValid = false
  }

  if (!formData.privacyConsent) {
    errors.privacyConsent = 'Du skal acceptere behandling af personoplysninger'
    isValid = false
  }

  return isValid
}

// Submit handler
const handleSubmit = async () => {
  if (!validateForm()) {
    // Focus first error field
    const firstErrorField = document.querySelector('[aria-invalid="true"]') as HTMLElement
    if (firstErrorField) {
      firstErrorField.focus()
    }
    return
  }

  isSubmitting.value = true

  try {
    // Here you would typically send to your API endpoint
    // For now, we'll just log the data
    const submissionData = {
      ...formData
    }

    // TODO: Replace with actual API call
    console.log('Form submission:', submissionData)
    
    // Example API call:
    // const response = await fetch('/api/contact-form', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(submissionData)
    // })
    
    // Reset form on success
    // Object.assign(formData, {
    //   kontaktperson: '',
    //   telefon: '',
    //   email: '',
    //   transport: '',
    //   container: '',
    //   transporttype: '',
    //   antal: 1,
    //   rederi: '',
    //   livedrop: '',
    //   afhentning: '',
    //   levering: '',
    //   indlevering: '',
    //   bemærkninger: '',
    //   privacyConsent: false
    // })
    
    alert('Tak for din forespørgsel! Vi vender tilbage inden for 24 timer.')
  } catch (error) {
    console.error('Form submission error:', error)
    alert('Der opstod en fejl. Prøv venligst igen.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.form-group {
  @apply space-y-2;
}

.form-label {
  @apply block text-sm font-medium text-black;
}

.form-input {
  @apply w-full px-4 py-3 bg-white border border-black/10 text-black rounded-lg 
         focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 
         focus:border-primary transition-colors
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.form-input-error {
  @apply border-red-500 focus:ring-red-500 focus:border-red-500;
}

.form-textarea {
  @apply resize-y min-h-[100px];
}

.form-select {
  @apply appearance-none pr-10 cursor-pointer;
}

.form-error {
  @apply text-sm text-red-600 mt-1;
}

.select-wrap::after {
  content: " ";
  @apply absolute h-2 w-2 border-r-2 border-b-2 border-current right-4 
         top-1/2 -translate-y-1/2 rotate-45 pointer-events-none z-10;
}

/* Radio and checkbox focus styles */
input[type="radio"]:focus,
input[type="checkbox"]:focus {
  @apply outline-none ring-2 ring-primary ring-offset-2;
}

/* Ensure proper spacing for fieldset */
fieldset {
  @apply border-0 p-0 m-0;
}

legend {
  @apply mb-4;
}

/* Screen reader only class */
.sr-only {
  @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0;
  clip: rect(0, 0, 0, 0);
  clip-path: inset(50%);
}
</style>