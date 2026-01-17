// Input group component for form inputs
class CoopInputGroup {
    constructor(config) {
        this.config = config;
        this.element = null;
    }

    // Create the HTML structure
    render() {
        const wrapper = document.createElement('div');
        wrapper.className = this.config.showResult ? 'input-group input-group-with-result' : 'input-group';
        
        const label = document.createElement('label');
        label.textContent = this.config.label;
        
        const input = document.createElement('input');
        input.type = this.config.inputType || this.config.type || 'text';
        input.id = this.config.id;
        
        if (this.config.inputmode) {
            input.setAttribute('inputmode', this.config.inputmode);
        }
        
        if (this.config.min !== undefined) {
            input.min = this.config.min;
        }
        
        if (this.config.value !== undefined) {
            input.value = this.config.value;
        }

        wrapper.appendChild(label);
        
        if (this.config.showResult) {
            const inputContainer = document.createElement('div');
            inputContainer.className = 'input-with-result';
            inputContainer.appendChild(input);
            
            const result = document.createElement('div');
            result.className = 'input-result';
            result.id = `result-${this.config.resultKey}`;
            result.textContent = '€ 0';
            inputContainer.appendChild(result);
            
            wrapper.appendChild(inputContainer);
        } else {
            wrapper.appendChild(input);
        }

        // Add details if provided
        if (this.config.details) {
            const details = document.createElement('div');
            details.className = 'details';
            details.textContent = this.config.details;
            wrapper.appendChild(details);
        }

        this.element = wrapper;
        this.input = input;

        // Set up event listeners
        this.setupEventListeners();

        return wrapper;
    }

    // Set up event listeners for state management
    setupEventListeners() {
        if (!this.input || !window.coopState) return;

        // Add debouncing to prevent excessive state updates
        let debounceTimer;
        
        // Update state on input change with debouncing
        this.input.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                let value = this.input.value;
                
                if (this.config.inputType === 'number') {
                    value = parseInt(value) || 0;
                } else if (this.config.inputmode === 'numeric') {
                    value = CoopUtils.parseVal(value);
                }
                
                window.coopState.setState(this.config.stateKey, value);
            }, 150);
        });

        // Format input on blur for numeric inputs and immediate update
        if (this.config.inputmode === 'numeric') {
            this.input.addEventListener('blur', () => {
                clearTimeout(debounceTimer);
                let value = CoopUtils.parseVal(this.input.value);
                window.coopState.setState(this.config.stateKey, value);
                CoopUtils.formatInput(this.input);
            });
        }

        // Subscribe to state changes to update input value
        window.coopState.subscribe((data, calculations) => {
            if (data[this.config.stateKey] !== undefined) {
                if (this.config.inputmode === 'numeric') {
                    this.input.value = data[this.config.stateKey].toLocaleString('nl-NL');
                } else {
                    this.input.value = data[this.config.stateKey];
                }
            }
            
            // Update result display if applicable
            if (this.config.showResult && this.config.resultKey && calculations[this.config.resultKey] !== undefined) {
                const resultElement = this.element.querySelector(`#result-${this.config.resultKey}`);
                if (resultElement) {
                    resultElement.textContent = CoopUtils.fmt(calculations[this.config.resultKey]);
                }
            }
        });
    }

    // Get the rendered element
    getElement() {
        return this.element || this.render();
    }

    // Update the input value
    setValue(value) {
        if (this.input) {
            this.input.value = value;
        }
    }

    // Get the current input value
    getValue() {
        if (!this.input) return null;
        
        if (this.config.inputType === 'number') {
            return parseInt(this.input.value) || 0;
        } else if (this.config.inputmode === 'numeric') {
            return CoopUtils.parseVal(this.input.value);
        }
        
        return this.input.value;
    }
}