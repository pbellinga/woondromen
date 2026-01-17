// Result display component for showing main calculation results
class CoopResultDisplay {
    constructor(config) {
        this.config = config;
        this.element = null;
    }

    // Create the HTML structure
    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'main-output';
        
        // Add label
        const label = document.createElement('div');
        label.className = 'label';
        label.textContent = this.config.label;
        
        // Add amount display
        const amount = document.createElement('div');
        amount.className = 'amount';
        amount.id = this.config.id;
        amount.textContent = '€0';
        
        wrapper.appendChild(label);
        wrapper.appendChild(amount);

        // Add details if provided
        if (this.config.details) {
            const details = document.createElement('div');
            details.className = 'details';
            details.style.textAlign = 'center';
            details.textContent = this.config.details;
            wrapper.appendChild(details);
        }

        this.element = wrapper;

        // Subscribe to state changes
        if (window.coopState) {
            window.coopState.subscribe((data, calculations) => {
                this.updateValue(data, calculations);
            });
        }

        return wrapper;
    }

    // Update the displayed value
    updateValue(data, calculations) {
        const amountElement = this.element?.querySelector('.amount');
        if (amountElement && this.config.valueKey) {
            let value;
            
            // Get value from calculations or data
            if (calculations && calculations[this.config.valueKey] !== undefined) {
                value = calculations[this.config.valueKey];
            } else if (data && data[this.config.valueKey] !== undefined) {
                value = data[this.config.valueKey];
            } else {
                value = 0;
            }

            // Format and display the value
            amountElement.textContent = CoopUtils.fmt(value);
        }
    }

    // Get the rendered element
    getElement() {
        return this.element || this.render();
    }

    // Manually set a value
    setValue(value) {
        const amountElement = this.element?.querySelector('.amount');
        if (amountElement) {
            amountElement.textContent = CoopUtils.fmt(value);
        }
    }

    // Get the current value
    getValue() {
        const amountElement = this.element?.querySelector('.amount');
        if (amountElement) {
            return CoopUtils.parseVal(amountElement.textContent);
        }
        return 0;
    }
}