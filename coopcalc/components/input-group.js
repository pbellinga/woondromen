// Input group component for form inputs
class CoopInputGroup {
    constructor(config) {
        this.config = config;
        this.element = null;
    }

    // Create the HTML structure
    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'input-group';
        
        const label = document.createElement('label');
        label.textContent = this.config.label;
        
        const input = document.createElement('input');
        input.type = this.config.type || 'text';
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
        wrapper.appendChild(input);

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

        // Update state on input change
        this.input.addEventListener('input', () => {
            let value = this.input.value;
            
            if (this.config.type === 'number') {
                value = parseInt(value) || 0;
            } else if (this.config.inputmode === 'numeric') {
                value = CoopUtils.parseVal(value);
            }
            
            window.coopState.setState(this.config.stateKey, value);
        });

        // Format input on blur for numeric inputs
        if (this.config.inputmode === 'numeric') {
            this.input.addEventListener('blur', () => {
                CoopUtils.formatInput(this.input);
            });
        }

        // Subscribe to state changes to update input value
        window.coopState.subscribe((data) => {
            if (data[this.config.stateKey] !== undefined) {
                if (this.config.inputmode === 'numeric') {
                    this.input.value = data[this.config.stateKey].toLocaleString('nl-NL');
                } else {
                    this.input.value = data[this.config.stateKey];
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
        
        if (this.config.type === 'number') {
            return parseInt(this.input.value) || 0;
        } else if (this.config.inputmode === 'numeric') {
            return CoopUtils.parseVal(this.input.value);
        }
        
        return this.input.value;
    }
}