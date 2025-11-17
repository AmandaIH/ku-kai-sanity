<template>
  <form 
    @submit.prevent="handleSubmit" 
    class="space-y-8"
    novalidate
    :aria-label="$t('form.ariaLabel')"
  >
    <!-- Kontaktinformation -->
    <div class="space-y-6 pb-8">
      <h3 class="text-lg font-medium text-black border-b border-black/10 pb-2">
        {{ $t('form.sections.contactInfo') }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="form-group">
        <label for="kontaktperson" class="form-label">
          {{ $t('form.fields.contactPerson') }}
          <span class="text-red-600" :aria-label="$t('form.required')">*</span>
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
          {{ $t('form.fields.email') }}
          <span class="text-red-600" :aria-label="$t('form.required')">*</span>
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
          {{ $t('form.fields.phone') }}
        </label>
        <input 
          type="tel" 
          id="telefon"
          name="telefon" 
          v-model="formData.telefon"
          aria-required="false"
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
        {{ $t('form.sections.transportDetails') }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="form-group">
        <label for="transport" class="form-label">
          {{ $t('form.fields.transportDirection') }}
          <span class="text-red-600" :aria-label="$t('form.required')">*</span>
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
            <option value="" disabled selected>{{ $t('form.placeholders.selectTransport') }}</option>
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
          {{ $t('form.fields.containerSize') }}
          <span class="text-red-600" :aria-label="$t('form.required')">*</span>
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
            <option value="" disabled selected>{{ $t('form.placeholders.selectContainer') }}</option>
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
          {{ $t('form.fields.transportType') }}
          <span class="text-red-600" :aria-label="$t('form.required')">*</span>
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
            <option value="" disabled selected>{{ $t('form.placeholders.selectTransportType') }}</option>
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
          {{ $t('form.fields.containerCount') }}
          <span class="text-red-600" :aria-label="$t('form.required')">*</span>
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
          {{ $t('form.fields.shippingLine') }}
          <span class="text-red-600" :aria-label="$t('form.required')">*</span>
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
            <option value="" disabled selected>{{ $t('form.placeholders.selectShippingLine') }}</option>
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
        <label for="livedrop" class="form-label">{{ $t('form.fields.liveOrDrop') }}</label>
        <div class="select-wrap relative">
          <select 
            id="livedrop"
            name="livedrop" 
            v-model="formData.livedrop"
            class="form-input form-select"
          >
            <option value="" disabled selected>{{ $t('form.placeholders.selectLiveDrop') }}</option>
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
        {{ $t('form.sections.addressInfo') }}
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="form-group">
        <label for="afhentning" class="form-label">
          {{ $t('form.fields.pickupLocation') }}
          <span class="text-red-600" :aria-label="$t('form.required')">*</span>
        </label>
        <input 
          type="text" 
          id="afhentning"
          name="afhentning" 
          v-model="formData.afhentning"
          :placeholder="$t('form.placeholders.pickupExample')" 
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
          {{ $t('form.fields.deliveryLocation') }}
          <span class="text-red-600" :aria-label="$t('form.required')">*</span>
        </label>
        <input 
          type="text" 
          id="levering"
          name="levering" 
          v-model="formData.levering"
          :placeholder="$t('form.placeholders.deliveryExample')" 
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
          {{ $t('form.fields.returnLocation') }}
          <span class="text-red-600" :aria-label="$t('form.required')">*</span>
        </label>
        <input 
          type="text" 
          id="indlevering"
          name="indlevering" 
          v-model="formData.indlevering"
          required
          aria-required="true"
          :aria-invalid="errors.indlevering ? 'true' : 'false'"
          :aria-describedby="errors.indlevering ? 'error-indlevering' : undefined"
          class="form-input"
          :class="{ 'form-input-error': errors.indlevering }"
          autocomplete="street-address"
        />
        <div v-if="errors.indlevering" id="error-indlevering" class="form-error" role="alert">
          {{ errors.indlevering }}
        </div>
      </div>
    </div>
    </div>

    <!-- Bemærkninger -->
    <div class="form-group">
      <label for="bemærkninger" class="form-label">
        {{ $t('form.fields.notes') }}
      </label>
      <textarea 
        id="bemærkninger"
        name="bemærkninger" 
        v-model="formData.bemærkninger"
        :placeholder="$t('form.placeholders.notesExample')" 
        rows="4"
        class="form-input form-textarea"
        aria-describedby="bemærkninger-help"
      ></textarea>
      <div id="bemærkninger-help" class="text-sm text-black/60 mt-1">
        {{ $t('form.fields.notesHelp') }}
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
            {{ $t('form.privacy.consent') }}
            <span class="text-red-600" :aria-label="$t('form.required')">*</span>
          </span>
          <span id="privacy-info" class="block mt-1 text-black/70">
            {{ $t('form.privacy.description') }} 
            <a href="/privatlivspolitik" target="_blank" class="!text-black underline hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-sm rounded">
              {{ $t('form.privacy.policy') }}
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
        {{ $t('form.submit.button') }}
      </span>
      <span v-else class="flex items-center gap-4">
        <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ $t('form.submit.sending') }}
      </span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
// @ts-ignore - vue-i18n types may not be fully resolved but works at runtime
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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

// Form options with translations
const transportOptions = computed(() => [
  { value: 'Import', label: t('form.options.transport.import'), id: 'import' },
  { value: 'Eksport', label: t('form.options.transport.export'), id: 'eksport' },
  { value: 'One-Way', label: t('form.options.transport.oneWay'), id: 'oneway' }
])

const containerOptions = computed(() => [
  { value: "20' DC", label: t('form.options.container.dc20'), id: 'c20dc' },
  { value: "20' HC", label: t('form.options.container.hc20'), id: 'c20hc' },
  { value: "40' DC", label: t('form.options.container.dc40'), id: 'c40dc' },
  { value: "40' HC", label: t('form.options.container.hc40'), id: 'c40hc' },
  { value: "40 Reefer", label: t('form.options.container.reefer40'), id: 'reefer' },
  { value: 'Andet', label: t('form.options.container.other'), id: 'andet' }
])

const transportTypeOptions = computed(() => [
  { value: 'Chassis', label: t('form.options.transportType.chassis'), id: 'chassis' },
  { value: 'Sidelaster', label: t('form.options.transportType.sideloader'), id: 'sidelaster' },
  { value: 'Genset', label: t('form.options.transportType.genset'), id: 'genset' },
  { value: 'TIP Chassis', label: t('form.options.transportType.tipChassis'), id: 'tip' }
])

const rederiOptions = [
  'MSC', 'Mærsk', 'Hapag', 'ONE', 'OOCL', 'Yang Ming',
  'Evergreen', 'CMA CGM', 'Cosco', 'Shippers Own', 'Andet'
]

const liveDropOptions = computed(() => [
  { value: 'Live', label: t('form.options.liveDrop.live'), id: 'live' },
  { value: 'Drop', label: t('form.options.liveDrop.drop'), id: 'drop' }
])

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
  indlevering: '',
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
    errors.kontaktperson = t('form.errors.contactPersonRequired')
    isValid = false
  }

  // Phone is optional, but if provided, validate format
  if (formData.telefon.trim() && !/^[\d\s\-\+\(\)]+$/.test(formData.telefon)) {
    errors.telefon = t('form.errors.phoneInvalid')
    isValid = false
  }

  if (!formData.email.trim()) {
    errors.email = t('form.errors.emailRequired')
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = t('form.errors.emailInvalid')
    isValid = false
  }

  if (!formData.transport) {
    errors.transport = t('form.errors.transportRequired')
    isValid = false
  }

  if (!formData.container) {
    errors.container = t('form.errors.containerRequired')
    isValid = false
  }

  if (!formData.transporttype) {
    errors.transporttype = t('form.errors.transportTypeRequired')
    isValid = false
  }

  if (!formData.antal || formData.antal < 1) {
    errors.antal = t('form.errors.containerCountRequired')
    isValid = false
  }

  if (!formData.rederi) {
    errors.rederi = t('form.errors.shippingLineRequired')
    isValid = false
  }

  if (!formData.afhentning.trim()) {
    errors.afhentning = t('form.errors.pickupRequired')
    isValid = false
  }

  if (!formData.levering.trim()) {
    errors.levering = t('form.errors.deliveryRequired')
    isValid = false
  }

  if (!formData.indlevering.trim()) {
    errors.indlevering = t('form.errors.returnRequired')
    isValid = false
  }

  if (!formData.privacyConsent) {
    errors.privacyConsent = t('form.errors.privacyRequired')
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
    
    alert(t('form.success'))
  } catch (error) {
    console.error('Form submission error:', error)
    alert(t('form.error'))
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