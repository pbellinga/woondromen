// Step 2: Financiering - Financing configuration
const Step2Config = {
    stepId: 2,
    title: '2. Financiering',
    description: 'Hoe wordt het project gefinancierd?',
    content: [
        {
            type: 'summary-box',
            rows: [
                { label: 'Aanschaf', id: 'wiz-price', valueKey: 'price', format: 'currency' },
                { label: 'Belasting (10%)', id: 'wiz-tax', valueKey: 'tax', format: 'currency' },
                { label: 'Verbouwing', id: 'wiz-reno', valueKey: 'reno', format: 'currency' },
                { label: 'Totale Kosten', id: 'wiz-total-cost', valueKey: 'totalCost', format: 'currency', isTotal: true }
            ]
        },
        {
            type: 'input-group',
            label: 'Eigen Inleg (Ledeninbreng €)',
            id: 'equity',
            inputmode: 'numeric',
            stateKey: 'equity',
            value: '100.000'
        },
        {
            type: 'summary-box',
            rows: [
                { label: 'Benodigde Lening', id: 'wiz-loan', valueKey: 'loanAmount', format: 'currency' },
                { label: 'Indicatie Maandlast Bank', id: 'wiz-mortgage', valueKey: 'monthlyMortgage', format: 'currency', isTotal: true }
            ],
            details: 'Hypotheek: 4.5%, 30 jaar annuïteit.'
        }
    ],
    buttons: [
        {
            label: 'Vorige',
            action: 'next',
            stepId: 1,
            secondary: true
        },
        {
            label: 'Volgende',
            action: 'next',
            stepId: 3
        }
    ]
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Step2Config;
}
if (typeof window !== 'undefined') {
    window.Step2Config = Step2Config;
}