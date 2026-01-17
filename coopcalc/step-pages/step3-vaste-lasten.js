// Step 3: Vaste Lasten - Fixed costs configuration
const Step3Config = {
    stepId: 3,
    title: '3. Vaste Lasten',
    description: 'Wat zijn de lopende kosten voor de vereniging?',
    content: [
        {
            type: 'summary-box',
            title: 'Maandlasten Financiering',
            rows: [
                { label: 'Bank Hypotheek - Aflossing', id: 'bank-principal', valueKey: 'bankPrincipal', format: 'currency' },
                { label: 'Bank Hypotheek - Rente', id: 'bank-interest-monthly', valueKey: 'bankInterestMonthly', format: 'currency' },
                { label: 'Bank Hypotheek Totaal', id: 'bank-total', valueKey: 'bankMonthly', format: 'currency', isTotal: true },
                { label: '', id: 'spacer-1', valueKey: '', format: 'spacer' },
                { label: 'Woonleenfonds - Aflossing', id: 'woonleer-principal', valueKey: 'woonleerPrincipal', format: 'currency' },
                { label: 'Woonleenfonds - Rente', id: 'woonleer-interest-monthly', valueKey: 'woonleerInterestMonthly', format: 'currency' },
                { label: 'Woonleenfonds Totaal', id: 'woonleer-total', valueKey: 'woonleerMonthly', format: 'currency', isTotal: true },
                { label: '', id: 'spacer-2', valueKey: '', format: 'spacer' },
                { label: 'Obligaties - Aflossing', id: 'obligaties-principal', valueKey: 'obligatiesPrincipal', format: 'currency' },
                { label: 'Obligaties - Rente', id: 'obligaties-interest-monthly', valueKey: 'obligatiesInterestMonthly', format: 'currency' },
                { label: 'Obligaties Totaal', id: 'obligaties-total', valueKey: 'obligatiesMonthly', format: 'currency', isTotal: true }
            ]
        },
        {
            type: 'input-group',
            label: 'Wooncoöperatie Fonds Bijdrage (€ per maand)',
            id: 'coopFund',
            inputmode: 'numeric',
            stateKey: 'coopFund',
            value: '50'
        },
        {
            type: 'summary-box',
            title: 'Service, Onderhoud & Beheer',
            rows: []
        },
        {
            type: 'input-group',
            label: 'Reserveringen Onderhoud (€ per maand)',
            id: 'reserveringOnderhoud',
            inputmode: 'numeric',
            stateKey: 'reserveringOnderhoud',
            value: '90'
        },
        {
            type: 'input-group',
            label: 'Servicekosten GWL (€ per maand)',
            id: 'servicekostenGWL',
            inputmode: 'numeric',
            stateKey: 'servicekostenGWL',
            value: '90'
        },
        {
            type: 'input-group',
            label: 'Belastingen (€ per maand)',
            id: 'belastingen',
            inputmode: 'numeric',
            stateKey: 'belastingen',
            value: '40'
        },
        {
            type: 'input-group',
            label: 'Verzekeringen (€ per maand)',
            id: 'verzekeringen',
            inputmode: 'numeric',
            stateKey: 'verzekeringen',
            value: '30'
        },
        {
            type: 'summary-box',
            rows: [
                { label: 'Totale Maandlasten Financiering', id: 'total-financing', valueKey: 'totalMonthlyFinancing', format: 'currency' },
                { label: 'Wooncoöperatie Fonds', id: 'total-coop-fund', valueKey: 'coopFund', format: 'currency' },
                { label: 'Service & Onderhoud Totaal', id: 'total-service', valueKey: 'totalServiceCosts', format: 'currency' },
                { label: 'Totale Maandlasten', id: 'grand-total', valueKey: 'totalMonthly', format: 'currency', isTotal: true }
            ]
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