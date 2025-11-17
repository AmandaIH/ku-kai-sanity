/**
 * Danish translation for the i18n module.
 */
export default {
    home: 'Forside',
    about: 'Om os',
    contact: 'Kontakt',
    services: 'Tjenester',
    projects: 'Projekter',
    blog: 'Blog',
    
    // Offer Form
    form: {
        ariaLabel: 'Tilbudsforespørgsel formular',
        sections: {
            contactInfo: 'Kontaktinformation',
            transportDetails: 'Transportdetaljer',
            addressInfo: 'Adresseinformation'
        },
        fields: {
            contactPerson: 'Kontaktperson',
            email: 'E-mail',
            phone: 'Telefonnummer',
            transportDirection: 'Transportretning',
            containerSize: 'Container størrelse/type',
            transportType: 'Transporttype',
            containerCount: 'Antal containere',
            shippingLine: 'Rederi',
            liveOrDrop: 'Live eller Drop',
            pickupLocation: 'Afhentningssted (adresse + postnr/by)',
            deliveryLocation: 'Leveringssted (adresse + postnr/by)',
            returnLocation: 'Indleveringssted (hvis forskelligt fra afhentning)',
            notes: 'Bemærkninger / specielle ønsker',
            notesHelp: 'Valgfrit felt til yderligere information'
        },
        placeholders: {
            selectTransport: 'Vælg transportretning',
            selectContainer: 'Vælg container størrelse/type',
            selectTransportType: 'Vælg transporttype',
            selectShippingLine: 'Vælg rederi',
            selectLiveDrop: 'Vælg live eller drop',
            pickupExample: 'F.eks. Industrivej 23, 7000 Fredericia',
            deliveryExample: 'F.eks. Havnevej 10, 8000 Aarhus C',
            notesExample: 'F.eks. farligt gods (ADR), tidskrav, overvægt, osv.'
        },
        options: {
            transport: {
                import: 'Import',
                export: 'Eksport',
                oneWay: 'One-Way'
            },
            container: {
                dc20: "20' DC",
                hc20: "20' HC",
                dc40: "40' DC",
                hc40: "40' HC",
                reefer40: "40' Reefer",
                other: 'Andet'
            },
            transportType: {
                chassis: 'Chassis',
                sideloader: 'Sidelaster',
                genset: 'Genset',
                tipChassis: 'TIP Chassis'
            },
            liveDrop: {
                live: 'Live',
                drop: 'Drop'
            }
        },
        required: 'påkrævet felt',
        privacy: {
            consent: 'Jeg accepterer behandling af mine personoplysninger',
            description: 'Ved at indsende denne formular accepterer jeg, at mine personoplysninger behandles i henhold til',
            policy: 'privatlivspolitikken'
        },
        submit: {
            button: 'Send forespørgsel',
            sending: 'Sender...'
        },
        errors: {
            contactPersonRequired: 'Kontaktperson er påkrævet',
            phoneInvalid: 'Indtast et gyldigt telefonnummer',
            emailRequired: 'E-mail er påkrævet',
            emailInvalid: 'Indtast en gyldig e-mail adresse',
            transportRequired: 'Vælg transportretning',
            containerRequired: 'Vælg container størrelse/type',
            transportTypeRequired: 'Vælg transporttype',
            containerCountRequired: 'Antal containere skal være mindst 1',
            shippingLineRequired: 'Vælg rederi',
            pickupRequired: 'Afhentningssted er påkrævet',
            deliveryRequired: 'Leveringssted er påkrævet',
            returnRequired: 'Indleveringssted er påkrævet',
            privacyRequired: 'Du skal acceptere behandling af personoplysninger'
        },
        success: 'Tak for din forespørgsel! Vi vender tilbage inden for 24 timer.',
        error: 'Der opstod en fejl. Prøv venligst igen.'
    }
};

