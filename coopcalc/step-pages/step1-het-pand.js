// Step 1: Het Pand - Property details configuration
const Step1Config = {
    stepId: 1,
    title: '1. Het Pand',
    description: 'Wat zijn de eigenschappen van het beoogde pand?',
    content: [
        {
            type: 'input-group',
            label: 'Inkoopwaarde Pand (€)',
            id: 'price',
            inputmode: 'numeric',
            stateKey: 'price',
            value: '1.600.000'
        },
        {
            type: 'input-group',
            label: 'Inschatting Verbouwing (€)',
            id: 'reno',
            inputmode: 'numeric',
            stateKey: 'reno',
            value: '400.000'
        },
        {
            type: 'input-group',
            label: 'Aantal Woonunits/Huishoudens',
            id: 'units',
            inputType: 'number',
            min: 1,
            stateKey: 'units',
            value: 10
        }
    ],
    buttons: [
        {
            label: 'Volgende',
            action: 'next',
            stepId: 2
        }
    ]
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Step1Config;
}
if (typeof window !== 'undefined') {
    window.Step1Config = Step1Config;
}