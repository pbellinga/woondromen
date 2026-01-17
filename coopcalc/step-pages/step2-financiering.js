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
            type: 'financing-row',
            label: 'Bank Hypotheek',
            resultKey: 'bankAmount',
            inputs: [
                { label: '% van totaal', stateKey: 'bankPercentage', value: 70, min: 0, max: 100 },
                { label: 'Rente %', stateKey: 'bankInterest', value: 4.5, step: 0.1 },
                { label: 'Looptijd (jaar)', stateKey: 'bankYears', value: 30, min: 1 }
            ]
        },
        {
            type: 'financing-row',
            label: 'Woonleenfonds',
            resultKey: 'woonleerAmount',
            inputs: [
                { label: '% van totaal', stateKey: 'woonleerPercentage', value: 15, min: 0, max: 100 },
                { label: 'Rente %', stateKey: 'woonleerInterest', value: 2, step: 0.1 },
                { label: 'Looptijd (jaar)', stateKey: 'woonleerYears', value: 30, min: 1 }
            ]
        },
        {
            type: 'financing-row',
            label: 'Obligaties',
            resultKey: 'obligatiesAmount',
            inputs: [
                { label: 'Rente %', stateKey: 'obligatiesInterest', value: 2, step: 0.1 },
                { label: 'Looptijd (jaar)', stateKey: 'obligatiesYears', value: 15, min: 1 }
            ]
        },
        {
            type: 'input-group',
            label: 'Subsidies (€)',
            id: 'subsidies',
            inputmode: 'numeric',
            stateKey: 'subsidies',
            value: '0',
            showResult: true,
            resultKey: 'subsidies'
        },
        {
            type: 'input-group',
            label: 'Eigen Inleg per Persoon (€)',
            id: 'eigenInlegPerPersoon',
            inputmode: 'numeric',
            stateKey: 'eigenInlegPerPerson',
            value: '10.000',
            details: 'Totale eigen inleg wordt berekend: bedrag × aantal inwoners',
            showResult: true,
            resultKey: 'totalEigenInleg'
        },
        {
            type: 'summary-box',
            rows: [
                { label: 'Totale Financiering', id: 'check-financing', valueKey: 'totalFinancing', format: 'currency' },
                { label: 'Totale Kosten', id: 'check-costs', valueKey: 'totalCost', format: 'currency' },
                { label: 'Financiering Balans', id: 'check-balance', valueKey: 'financingBalance', format: 'currency', isTotal: true }
            ],
            details: 'Balans moet 0 zijn voor volledige dekking'
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