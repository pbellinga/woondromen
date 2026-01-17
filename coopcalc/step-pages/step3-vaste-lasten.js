// Step 3: Vaste Lasten - Fixed costs configuration
const Step3Config = {
    stepId: 3,
    title: '3. Vaste Lasten',
    description: 'Wat zijn de lopende kosten voor de vereniging?',
    content: [
        {
            type: 'summary-box',
            rows: [
                { label: 'Maandlast Financiering', id: 'wiz-financing', valueKey: 'totalMonthlyFinancing', format: 'currency', isTotal: true }
            ]
        },
        {
            type: 'input-group',
            label: 'Service, Onderhoud & Beheer (Totaal per maand €)',
            id: 'service',
            inputmode: 'numeric',
            stateKey: 'service',
            value: '450',
            details: 'Denk aan: VvE-bijdrage (indien appartement), opstalverzekering, gemeentelijke belastingen, reservering onderhoud.'
        }
    ],
    buttons: [
        {
            label: 'Vorige',
            action: 'next',
            stepId: 2,
            secondary: true
        },
        {
            label: 'Bereken Huur',
            action: 'next',
            stepId: 4
        }
    ]
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Step3Config;
}
if (typeof window !== 'undefined') {
    window.Step3Config = Step3Config;
}