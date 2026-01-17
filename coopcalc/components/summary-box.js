// Summary box component for displaying calculation results
class CoopSummaryBox {
    constructor(config) {
        this.config = config;
        this.element = null;
        this.resultRows = [];
    }

    // Create the HTML structure
    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'summary-box';
        
        // Create result rows
        this.config.rows.forEach(rowConfig => {
            const row = this.createResultRow(rowConfig);
            this.resultRows.push({ config: rowConfig, element: row });
            wrapper.appendChild(row);
        });

        // Add details if provided
        if (this.config.details) {
            const details = document.createElement('div');
            details.className = 'details';
            details.textContent = this.config.details;
            wrapper.appendChild(details);
        }

        this.element = wrapper;

        // Subscribe to state changes
        if (window.coopState) {
            window.coopState.subscribe((data, calculations) => {
                this.updateValues(data, calculations);
            });
        }

        return wrapper;
    }

    // Create a single result row
    createResultRow(rowConfig) {
        const row = document.createElement('div');
        
        // Handle spacer rows
        if (rowConfig.format === 'spacer') {
            row.className = 'result-row spacer';
            row.innerHTML = '&nbsp;';
            return row;
        }
        
        row.className = rowConfig.isTotal ? 'result-row total' : 'result-row';
        
        const label = document.createElement('span');
        label.textContent = rowConfig.label;
        
        const value = document.createElement('span');
        value.id = rowConfig.id;
        value.textContent = '-';
        
        row.appendChild(label);
        row.appendChild(value);
        
        return row;
    }

    // Update values based on state/calculations
    updateValues(data, calculations) {
        this.resultRows.forEach(({ config, element }) => {
            const valueElement = element.querySelector('span:last-child');
            if (valueElement && config.valueKey) {
                let value;
                
                // Get value from calculations or data
                if (calculations && calculations[config.valueKey] !== undefined) {
                    value = calculations[config.valueKey];
                } else if (data && data[config.valueKey] !== undefined) {
                    value = data[config.valueKey];
                } else {
                    value = 0;
                }

                // Format the value
                if (config.format === 'currency') {
                    valueElement.textContent = CoopUtils.fmt(value);
                } else {
                    valueElement.textContent = value.toString();
                }
            }
        });
    }

    // Get the rendered element
    getElement() {
        return this.element || this.render();
    }

    // Update specific value by ID
    updateValue(id, value, format = 'currency') {
        const element = document.getElementById(id);
        if (element) {
            if (format === 'currency') {
                element.textContent = CoopUtils.fmt(value);
            } else {
                element.textContent = value.toString();
            }
        }
    }
}