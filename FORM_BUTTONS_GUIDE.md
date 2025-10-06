# Form Button Integration Guide

This guide explains how to use the new form button functionality in your Sanity Studio and frontend.

## Overview

You can now create buttons that open forms directly from your Sanity Studio. This is integrated into your existing CTA button system, so you can use form buttons anywhere you currently use regular CTA buttons.

## How to Use in Sanity Studio

### For Content Blocks (Hero, Text, etc.)

1. **Create a CTA Button**: When adding a CTA button to any content block (Hero, Text, etc.)

2. **Select "Open Form" as Link Type**: In the button configuration, choose "Open Form" from the Link Type dropdown

3. **Configure the Form**:
   - **Form ID**: Enter a unique identifier (e.g., `contact-form`, `newsletter-signup`)
   - **Form Title**: The title displayed in the form modal
   - **Form Description**: Optional description text

4. **Set Button Text**: Enter the text that will appear on the button

### For Main Navigation Menu

1. **Edit Menu**: Go to your main menu in Sanity Studio

2. **Add Menu Item**: Create a new menu item

3. **Select "Open Form" as Link Type**: Choose "Open Form" from the Link Type dropdown

4. **Configure the Form**:
   - **Form ID**: Enter a unique identifier (e.g., `contact-form`, `newsletter-signup`)
   - **Form Title**: The title displayed in the form modal
   - **Form Description**: Optional description text

5. **Set Menu Title**: Enter the text that will appear in the navigation menu

## Supported Form Types

The system currently includes basic templates for:

- **Contact Form** (`contact-form`): Name, email, and message fields
- **Newsletter Signup** (`newsletter-signup`): Email field with consent checkbox
- **Custom Forms**: Any form ID will show a generic template

## Frontend Integration

### Form Modal Component

The `FormModal.vue` component is automatically included in your default layout and listens for form trigger events.

### Custom Form Implementation

To implement custom forms, modify the `FormModal.vue` component:

```vue
<!-- Add your custom form logic in the template -->
<div v-else-if="formData?.id === 'your-custom-form'" class="space-y-4">
  <!-- Your custom form fields here -->
</div>
```

### Form Submission

Currently, the form submission is handled in the `submitForm()` method of `FormModal.vue`. You'll need to:

1. Add form validation
2. Integrate with your API/backend
3. Handle success/error states
4. Add proper form field handling

## Example Usage

### In Sanity Studio:
1. Add a Hero block
2. Add a CTA button
3. Set Link Type to "Open Form"
4. Set Form ID to "contact-form"
5. Set Form Title to "Get in Touch"
6. Set Button Text to "Contact Us"

### Result:
- A button labeled "Contact Us" will appear
- Clicking it opens a modal with a contact form
- The modal has the title "Get in Touch"

## Technical Details

### Event System
The system uses a custom DOM event (`openForm`) to communicate between the button and modal:

```javascript
// Triggered by LinkButton.vue
window.dispatchEvent(new CustomEvent('openForm', { 
  detail: { id: 'contact-form', title: 'Contact Us' }
}));

// Listened to by FormModal.vue
window.addEventListener('openForm', handleOpenFormEvent);
```

### Button Component Updates
The `LinkButton.vue` component now supports three link types:
- `internal`: Links to internal pages
- `external`: Links to external URLs  
- `form`: Opens a form modal

### Navigation Component Updates
The new `NavigationLink.vue` component handles all navigation link types:
- `internal`: Links to internal pages
- `external`: Links to external URLs  
- `form`: Opens a form modal

This component is used in both desktop and mobile navigation menus.

### Schema Updates
The `ctaButton` schema in `common.ts` has been extended with:
- New "Open Form" link type option
- Form configuration fields (formId, formTitle, formDescription)
- Updated preview logic to show form information

## Next Steps

1. **Customize Forms**: Modify `FormModal.vue` to match your design system
2. **Add Form Validation**: Implement client-side validation
3. **Backend Integration**: Connect forms to your API/email service
4. **Analytics**: Add tracking for form interactions
5. **Accessibility**: Ensure proper ARIA labels and keyboard navigation

## Troubleshooting

- **Form not opening**: Check that the FormModal component is included in your layout
- **Button not showing**: Verify the button configuration in Sanity Studio
- **Form ID issues**: Ensure the form ID matches what's expected in FormModal.vue
