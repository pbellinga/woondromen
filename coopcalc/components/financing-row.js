// Financing row component for multiple input financing options
class CoopFinancingRow {
    constructor(config) {
        this.config = config;
        this.element = null;
        this.inputs = {};
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'financing-row';
        
        // Row label
        const label = document.createElement('div');
        label.className = 'financing-label';
        label.textContent = this.config.label;
        wrapper.appendChild(label);
        
        // Inputs container
        const inputsContainer = document.createElement('div');
        inputsContainer.className = 'financing-inputs';
        
        this.config.inputs.forEach(inputConfig => {
            const inputGroup = document.createElement('div');
            inputGroup.className = 'financing-input-group';
            
            const inputLabel = document.createElement('label');
            inputLabel.textContent = inputConfig.label;
            
            const input = document.createElement('input');
            input.type = inputConfig.type || 'number';
            input.id = inputConfig.id;
            input.value = inputConfig.value || '';
            if (inputConfig.min !== undefined) input.min = inputConfig.min;
            if (inputConfig.max !== undefined) input.max = inputConfig.max;
            if (inputConfig.step !== undefined) input.step = inputConfig.step;
            
            inputGroup.appendChild(inputLabel);
            inputGroup.appendChild(input);
            inputsContainer.appendChild(inputGroup);
            
            this.inputs[inputConfig.stateKey] = input;
            
            // Set up event listener
            input.addEventListener('input', () => {
                let value = inputConfig.type === 'number' ? 
                    (parseFloat(input.value) || 0) : input.value;
                window.coopState.setState(inputConfig.stateKey, value);
            });
        });
        
        wrapper.appendChild(inputsContainer);
        
        // Result display
        if (this.config.resultKey) {
            const result = document.createElement('div');
            result.className = 'financing-result';
            result.id = `result-${this.config.resultKey}`;
            result.textContent = '€ 0';
            wrapper.appendChild(result);
        }
        
        this.element = wrapper;
        this.setupStateSubscription();
        
        return wrapper;
    }

    setupStateSubscription() {
        window.coopState.subscribe((data, calculations) => {
            // Update result display
            if (this.config.resultKey && calculations[this.config.resultKey] !== undefined) {
                const resultElement = this.element.querySelector(`#result-${this.config.resultKey}`);
                if (resultElement) {
                    resultElement.textContent = CoopUtils.fmt(calculations[this.config.resultKey]);
                }
            }
            
            // Update input values from state
            Object.keys(this.inputs).forEach(stateKey => {
                if (data[stateKey] !== undefined) {
                    this.inputs[stateKey].value = data[stateKey];
                }
            });
        });
    }

    getElement() {
        return this.element || this.render();
    }
}