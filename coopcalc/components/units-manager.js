// Units manager component for managing individual woonunits
class CoopUnitsManager {
    constructor(config) {
        this.config = config;
        this.element = null;
        this.units = [];
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'units-manager';
        
        // Header
        const header = document.createElement('div');
        header.className = 'units-header';
        
        const title = document.createElement('h3');
        title.textContent = 'Woonunits';
        
        const addButton = document.createElement('button');
        addButton.className = 'btn add-unit-btn';
        addButton.textContent = '+ Unit Toevoegen';
        addButton.onclick = () => this.addUnit();
        
        header.appendChild(title);
        header.appendChild(addButton);
        wrapper.appendChild(header);
        
        // Units container
        const unitsContainer = document.createElement('div');
        unitsContainer.className = 'units-container';
        unitsContainer.id = 'units-container';
        wrapper.appendChild(unitsContainer);
        
        this.element = wrapper;
        this.unitsContainer = unitsContainer;
        
        // Initialize with default units based on state
        this.initializeUnits();
        this.setupStateSubscription();
        
        return wrapper;
    }

    initializeUnits() {
        const unitCount = window.coopState.get('units') || 1;
        for (let i = 0; i < unitCount; i++) {
            this.addUnit(false); // Don't update state during initialization
        }
        this.updateState();
    }

    addUnit(updateState = true) {
        const unitIndex = this.units.length;
        const unit = {
            id: `unit-${unitIndex}`,
            squareMeters: 50,
            rentPerMonth: 0,
            isIndependent: true
        };
        
        const unitElement = this.createUnitElement(unit, unitIndex);
        this.unitsContainer.appendChild(unitElement);
        this.units.push(unit);
        
        if (updateState) {
            this.updateState();
        }
    }

    removeUnit(index) {
        if (this.units.length > 1) {
            this.units.splice(index, 1);
            this.renderUnits();
            this.updateState();
        }
    }

    createUnitElement(unit, index) {
        const wrapper = document.createElement('div');
        wrapper.className = 'unit-row';
        
        // Unit number
        const unitNumber = document.createElement('div');
        unitNumber.className = 'unit-number';
        unitNumber.textContent = `Unit ${index + 1}`;
        
        // Square meters input
        const sqmGroup = document.createElement('div');
        sqmGroup.className = 'unit-input-group';
        const sqmLabel = document.createElement('label');
        sqmLabel.textContent = 'm²';
        const sqmInput = document.createElement('input');
        sqmInput.type = 'number';
        sqmInput.value = unit.squareMeters;
        sqmInput.min = 1;
        sqmInput.onchange = () => {
            unit.squareMeters = parseInt(sqmInput.value) || 0;
            this.updateRentSuggestion(unit, rentInput);
            this.updateState();
        };
        sqmGroup.appendChild(sqmLabel);
        sqmGroup.appendChild(sqmInput);
        
        // Rent input
        const rentGroup = document.createElement('div');
        rentGroup.className = 'unit-input-group';
        const rentLabel = document.createElement('label');
        rentLabel.textContent = 'Huur €/maand';
        const rentInput = document.createElement('input');
        rentInput.type = 'number';
        rentInput.value = unit.rentPerMonth;
        rentInput.min = 0;
        rentInput.onchange = () => {
            unit.rentPerMonth = parseFloat(rentInput.value) || 0;
            this.updateState();
        };
        rentGroup.appendChild(rentLabel);
        rentGroup.appendChild(rentInput);
        
        // Independent checkbox
        const checkboxGroup = document.createElement('div');
        checkboxGroup.className = 'unit-checkbox-group';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = unit.isIndependent;
        checkbox.onchange = () => {
            unit.isIndependent = checkbox.checked;
            this.updateState();
        };
        const checkboxLabel = document.createElement('label');
        checkboxLabel.textContent = 'Zelfstandige woonruimte';
        checkboxGroup.appendChild(checkbox);
        checkboxGroup.appendChild(checkboxLabel);
        
        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn secondary remove-btn';
        removeBtn.textContent = '×';
        removeBtn.onclick = () => this.removeUnit(index);
        
        wrapper.appendChild(unitNumber);
        wrapper.appendChild(sqmGroup);
        wrapper.appendChild(rentGroup);
        wrapper.appendChild(checkboxGroup);
        wrapper.appendChild(removeBtn);
        
        // Update rent suggestion initially
        this.updateRentSuggestion(unit, rentInput);
        
        return wrapper;
    }

    updateRentSuggestion(unit, rentInput) {
        // Calculate suggested rent based on total monthly costs and square meters
        if (window.coopState) {
            const calculations = window.coopState.calculate();
            const totalSqm = this.getTotalSquareMeters();
            if (totalSqm > 0) {
                const rentPerSqm = calculations.totalMonthly / totalSqm;
                const suggestedRent = Math.round(rentPerSqm * unit.squareMeters);
                if (unit.rentPerMonth === 0) {
                    rentInput.value = suggestedRent;
                    unit.rentPerMonth = suggestedRent;
                }
            }
        }
    }

    renderUnits() {
        this.unitsContainer.innerHTML = '';
        this.units.forEach((unit, index) => {
            const unitElement = this.createUnitElement(unit, index);
            this.unitsContainer.appendChild(unitElement);
        });
    }

    getTotalSquareMeters() {
        return this.units.reduce((total, unit) => total + unit.squareMeters, 0);
    }

    getTotalRent() {
        return this.units.reduce((total, unit) => total + unit.rentPerMonth, 0);
    }

    updateState() {
        if (window.coopState) {
            window.coopState.setState('unitsDetails', this.units);
            window.coopState.setState('units', this.units.length);
        }
    }

    setupStateSubscription() {
        window.coopState.subscribe((data, calculations) => {
            // Update rent suggestions when costs change
            this.units.forEach((unit, index) => {
                const rentInput = this.unitsContainer.children[index]?.querySelector('input[type="number"]:nth-of-type(2)');
                if (rentInput && unit.rentPerMonth === 0) {
                    this.updateRentSuggestion(unit, rentInput);
                }
            });
        });
    }

    getElement() {
        return this.element || this.render();
    }
}