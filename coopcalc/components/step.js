// Step component for wizard steps
class CoopStep {
    constructor(config) {
        this.config = config;
        this.element = null;
        this.components = [];
    }

    // Create the HTML structure
    render() {
        const wrapper = document.createElement('div');
        wrapper.id = `step-${this.config.stepId}`;
        wrapper.className = 'step';
        
        if (this.config.stepId === 1) {
            wrapper.classList.add('active');
        }

        // Add title
        const title = document.createElement('h1');
        title.textContent = this.config.title;
        wrapper.appendChild(title);

        // Add description
        if (this.config.description) {
            const description = document.createElement('p');
            description.textContent = this.config.description;
            wrapper.appendChild(description);
        }

        // Add content components
        if (this.config.content) {
            this.config.content.forEach(contentConfig => {
                let component;
                
                switch (contentConfig.type) {
                    case 'input-group':
                        component = new CoopInputGroup(contentConfig);
                        break;
                    case 'summary-box':
                        component = new CoopSummaryBox(contentConfig);
                        break;
                    case 'result-display':
                        component = new CoopResultDisplay(contentConfig);
                        break;
                    case 'financing-row':
                        component = new CoopFinancingRow(contentConfig);
                        break;
                    case 'units-manager':
                        component = new CoopUnitsManager(contentConfig);
                        break;
                    case 'shared-spaces-manager':
                        component = new CoopSharedSpacesManager(contentConfig);
                        break;
                        break;
                    default:
                        console.warn(`Unknown component type: ${contentConfig.type}`);
                        return;
                }
                
                this.components.push(component);
                wrapper.appendChild(component.getElement());
            });
        }

        // Add custom HTML content
        if (this.config.html) {
            const customContent = document.createElement('div');
            customContent.innerHTML = this.config.html;
            wrapper.appendChild(customContent);
        }

        // Add navigation buttons
        if (this.config.buttons) {
            const buttonRow = document.createElement('div');
            buttonRow.className = 'btn-row';

            this.config.buttons.forEach(buttonConfig => {
                const button = document.createElement('button');
                button.className = buttonConfig.secondary ? 'btn secondary' : 'btn';
                button.textContent = buttonConfig.label;
                button.onclick = () => {
                    if (buttonConfig.action === 'next' && buttonConfig.stepId) {
                        window.next(buttonConfig.stepId);
                    } else if (buttonConfig.onClick) {
                        buttonConfig.onClick();
                    }
                };
                buttonRow.appendChild(button);
            });

            wrapper.appendChild(buttonRow);
        }

        this.element = wrapper;
        return wrapper;
    }

    // Get the rendered element
    getElement() {
        return this.element || this.render();
    }

    // Add component to the step
    addComponent(component) {
        this.components.push(component);
        if (this.element) {
            // Insert before button row if it exists
            const buttonRow = this.element.querySelector('.btn-row');
            if (buttonRow) {
                this.element.insertBefore(component.getElement(), buttonRow);
            } else {
                this.element.appendChild(component.getElement());
            }
        }
    }

    // Show the step
    show() {
        if (this.element) {
            this.element.classList.add('active');
        }
    }

    // Hide the step
    hide() {
        if (this.element) {
            this.element.classList.remove('active');
        }
    }
}