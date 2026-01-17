// Step 5: Woonunits Details - Unit configuration
const Step5Config = {
    stepId: 5,
    title: '5. Woonunits Details',
    description: 'Configureer de individuele woonunits en gemeenschappelijke ruimtes',
    content: [
        {
            type: 'units-manager',
            label: 'Woonunits',
            id: 'units-manager'
        },
        {
            type: 'shared-spaces-manager',
            label: 'Gemeenschappelijke Ruimtes',
            id: 'shared-spaces-manager'
        },
        {
            type: 'summary-box',
            rows: [
                { label: 'Totale Huur Units', id: 'total-rent-units', valueKey: 'totalRentUnits', format: 'currency' },
                { label: 'Totale Woonlasten per Maand', id: 'total-housing-costs', valueKey: 'totalMonthly', format: 'currency' },
                { label: 'Totale Vierkante Meters', id: 'total-square-meters', valueKey: 'totalSquareMeters', format: 'number' },
                { label: 'Gedeelde Vierkante Meters', id: 'shared-square-meters', valueKey: 'sharedSquareMeters', format: 'number' }
            ]
        }
    ],
    buttons: [
        {
            label: 'Vorige',
            action: 'next',
            stepId: 4,
            secondary: true
        },
        {
            label: 'Voltooien',
            action: 'complete'
        }
    ]
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Step5Config;
}
if (typeof window !== 'undefined') {
    window.Step5Config = Step5Config;
}