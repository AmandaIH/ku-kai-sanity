# Adding Form Buttons to Main Menu - Example

This guide shows you exactly how to add a form button to your main navigation menu.

## Step-by-Step Instructions

### 1. Open Sanity Studio
- Go to your Sanity Studio
- Navigate to "Menu" in the sidebar
- Select your main menu (usually called "Main Navigation" or similar)

### 2. Add a New Menu Item
- Click "Add item" to create a new menu item
- You'll see the menu item configuration form

### 3. Configure the Menu Item
- **Link Type**: Select "Open Form" from the dropdown
- **Form Configuration** section will appear:
  - **Form ID**: Enter `contact-form` (or any unique identifier)
  - **Form Title**: Enter "Contact Us" (this appears in the form modal)
  - **Form Description**: Enter "Get in touch with our team" (optional)

### 4. Set the Menu Title
- The menu item will automatically use the form title, but you can customize it
- The text "Contact Us" will appear in your navigation menu

### 5. Save and Publish
- Click "Publish" to make the changes live
- The form button will now appear in your main navigation

## Example Configuration

```
Menu Item Settings:
├── Link Type: "Open Form"
├── Form Configuration:
│   ├── Form ID: "contact-form"
│   ├── Form Title: "Contact Us"
│   └── Form Description: "Get in touch with our team"
└── Menu Title: "Contact Us"
```

## Result

When users visit your website:
1. They'll see "Contact Us" in the main navigation menu
2. Clicking it opens a modal with a contact form
3. The modal has the title "Contact Us" and description "Get in touch with our team"
4. The form includes fields for name, email, and message

## Common Form IDs

You can use these pre-configured form IDs:

- `contact-form`: Contact form with name, email, message
- `newsletter-signup`: Newsletter signup with email and consent
- `quote-request`: Custom form for quote requests
- `demo-request`: Custom form for demo requests

## Custom Forms

To add your own custom form:
1. Use a unique form ID (e.g., `custom-form`)
2. Modify the `FormModal.vue` component to handle your custom form ID
3. Add your custom form fields and validation logic

## Troubleshooting

- **Form not opening**: Check that the FormModal component is included in your layout
- **Menu item not showing**: Verify the menu is published and the form ID is set
- **Wrong form appearing**: Ensure the form ID matches what's configured in FormModal.vue






