/**
 * English translation for the i18n module.
 */
export default {
    home: 'Home',
    about: 'About',
    contact: 'Contact',
    services: 'Services',
    projects: 'Projects',
    blog: 'Blog',
    
    // Offer Form
    form: {
        ariaLabel: 'Quote request form',
        sections: {
            contactInfo: 'Contact Information',
            transportDetails: 'Transport Details',
            addressInfo: 'Address Information'
        },
        fields: {
            contactPerson: 'Contact Person',
            email: 'E-mail',
            phone: 'Phone Number',
            transportDirection: 'Transport Direction',
            containerSize: 'Container Size/Type',
            transportType: 'Transport Type',
            containerCount: 'Number of Containers',
            shippingLine: 'Shipping Line',
            liveOrDrop: 'Live or Drop',
            pickupLocation: 'Pickup Location (address + postal code/city)',
            deliveryLocation: 'Delivery Location (address + postal code/city)',
            returnLocation: 'Return Location (if different from pickup)',
            notes: 'Notes / Special Requests',
            notesHelp: 'Optional field for additional information'
        },
        placeholders: {
            selectTransport: 'Select transport direction',
            selectContainer: 'Select container size/type',
            selectTransportType: 'Select transport type',
            selectShippingLine: 'Select shipping line',
            selectLiveDrop: 'Select live or drop',
            pickupExample: 'E.g. Industry Road 23, 7000 Fredericia',
            deliveryExample: 'E.g. Harbor Road 10, 8000 Aarhus C',
            notesExample: 'E.g. dangerous goods (ADR), time requirements, overweight, etc.'
        },
        options: {
            transport: {
                import: 'Import',
                export: 'Export',
                oneWay: 'One-Way'
            },
            container: {
                dc20: "20' DC",
                hc20: "20' HC",
                dc40: "40' DC",
                hc40: "40' HC",
                reefer40: "40' Reefer",
                other: 'Other'
            },
            transportType: {
                chassis: 'Chassis',
                sideloader: 'Sideloader',
                genset: 'Genset',
                tipChassis: 'TIP Chassis'
            },
            liveDrop: {
                live: 'Live',
                drop: 'Drop'
            }
        },
        required: 'required field',
        privacy: {
            consent: 'I accept the processing of my personal data',
            description: 'By submitting this form, I accept that my personal data will be processed in accordance with',
            policy: 'the privacy policy'
        },
        submit: {
            button: 'Send Request',
            sending: 'Sending...'
        },
        errors: {
            contactPersonRequired: 'Contact person is required',
            phoneInvalid: 'Enter a valid phone number',
            emailRequired: 'E-mail is required',
            emailInvalid: 'Enter a valid e-mail address',
            transportRequired: 'Select transport direction',
            containerRequired: 'Select container size/type',
            transportTypeRequired: 'Select transport type',
            containerCountRequired: 'Number of containers must be at least 1',
            shippingLineRequired: 'Select shipping line',
            pickupRequired: 'Pickup location is required',
            deliveryRequired: 'Delivery location is required',
            returnRequired: 'Return location is required',
            privacyRequired: 'You must accept the processing of personal data'
        },
        success: 'Thank you for your request! We will get back to you within 24 hours.',
        error: 'An error occurred. Please try again.'
    }
};

