// Step 4: Resultaat - Results display configuration
const Step4Config = {
    stepId: 4,
    title: 'Resultaat',
    content: [
        {
            type: 'summary-box',
            rows: [
                { label: 'Hypotheeklasten', id: 'res-mortgage', valueKey: 'monthlyMortgage', format: 'currency' },
                { label: 'Service & Onderhoud', id: 'res-service', valueKey: 'service', format: 'currency' },
                { label: 'Totaal Benodigd Inkomen', id: 'res-total', valueKey: 'totalMonthly', format: 'currency', isTotal: true }
            ]
        },
        {
            type: 'result-display',
            label: 'Vereiste Huur per Unit',
            id: 'res-rent',
            valueKey: 'rentPerUnit',
            details: 'Exclusief individuele kosten zoals energie en water.'
        }
    ],
    buttons: [
        {
            label: 'Terug',
            action: 'next',
            stepId: 3,
            secondary: true
        },
        {
            label: 'Configureer Units',
            action: 'next',
            stepId: 5
        }
    ]
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Step4Config;
}
if (typeof window !== 'undefined') {
    window.Step4Config = Step4Config;
}