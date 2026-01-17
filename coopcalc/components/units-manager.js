// Units manager component for managing individual woonunits
class CoopUnitsManager {
    constructor(config) {
        this.config = config;
        this.element = null;
        this.units = [];
        
        // Setup state subscription when state is available
        if (window.coopState) {
            this.setupStateSubscription();
        } else {
            // Wait for state to be available
            setTimeout(() => {
                if (window.coopState) {
                    this.setupStateSubscription();
                }
            }, 100);
        }
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'units-manager';
        
        // Header
        const header = document.createElement('div');
        header.className = 'units-header';
        
        const title = document.createElement('h3');
        title.textContent = 'Woonunits';
        
        // Rent per m² display
        const rentPerSqmDisplay = document.createElement('div');
        rentPerSqmDisplay.className = 'rent-per-sqm-display';
        rentPerSqmDisplay.innerHTML = '<strong>Huur per m²: €<span id="rent-per-sqm">0</span>/maand</strong>';
        
        const addButton = document.createElement('button');
        addButton.className = 'btn add-unit-btn';
        addButton.textContent = '+ Unit Toevoegen';
        addButton.onclick = () => this.addUnit();
        
        header.appendChild(title);
        header.appendChild(rentPerSqmDisplay);
        header.appendChild(addButton);
        wrapper.appendChild(header);
        
        // Units container
        const unitsContainer = document.createElement('div');
        unitsContainer.className = 'units-container';
        unitsContainer.id = 'units-container';
        wrapper.appendChild(unitsContainer);
        
        // Total rent summary
        const totalSummary = document.createElement('div');
        totalSummary.className = 'total-rent-summary';
        totalSummary.innerHTML = `
            <div class="summary-row">
                <strong>Totaal vierkante meters: <span id="total-sqm">0</span> m²</strong>
            </div>
            <div class="summary-row">
                <strong>Totale huur opbrengst: €<span id="total-rent">0</span>/maand</strong>
            </div>
        `;
        wrapper.appendChild(totalSummary);
        
        this.element = wrapper;
        this.unitsContainer = unitsContainer;
        
        // Initialize with default units based on state
        this.initializeUnits();
        this.setupStateSubscription();
        
        // Also trigger calculation when the component becomes visible
        setTimeout(() => {
            if (this.units.length > 0) {
                this.recalculateAllRents(true);
            }
        }, 200);
        
        return wrapper;
    }

    initializeUnits() {
        const unitCount = window.coopState.get('units') || 1;
        for (let i = 0; i < unitCount; i++) {
            this.addUnit(false); // Don't update state during initialization
        }
        // After all units are created, calculate proper rents
        // Use a longer timeout to ensure state calculations are ready
        setTimeout(() => {
            this.recalculateAllRents(true);
        }, 100);
    }

    addUnit(updateState = true) {
        const unitIndex = this.units.length;
        // Vary square meters from 20 to 70
        const squareMetersOptions = [45, 32, 60, 38, 55, 28, 65, 42, 50, 35];
        const defaultSqm = squareMetersOptions[unitIndex % squareMetersOptions.length] || 50;
        
        const unit = {
            id: `unit-${unitIndex}`,
            squareMeters: defaultSqm,
            rentPerMonth: 0, // Will be calculated by recalculateAllRents
            isIndependent: true
        };
        
        const unitElement = this.createUnitElement(unit, unitIndex);
        this.unitsContainer.appendChild(unitElement);
        this.units.push(unit);
        
        // Always recalculate rents immediately when adding a unit
        this.recalculateAllRents(updateState);
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
            // Recalculate ALL unit rents to maintain consistent price per sqm
            this.recalculateAllRents();
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
        rentInput.className = 'rent-input'; // Add specific class
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
        
        return wrapper;
    }

    calculateRentForSquareMeters(squareMeters) {
        if (window.coopState && squareMeters > 0) {
            const calculations = window.coopState.calculate();
            
            if (calculations && calculations.totalMonthly > 0) {
                // Get total square meters from ALL current units
                const totalUnitsSqm = this.getTotalSquareMeters();
                
                if (totalUnitsSqm > 0) {
                    // Calculate price per square meter: total monthly costs / total square meters
                    const pricePerSqm = calculations.totalMonthly / totalUnitsSqm;
                    return Math.round(pricePerSqm * squareMeters);
                }
            }
        }
        // Fallback: €25 per square meter if calculation fails
        return Math.round(squareMeters * 25);
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

    recalculateAllRents(shouldUpdateState = true) {
        console.log('recalculateAllRents called', { 
            hasState: !!window.coopState, 
            unitsLength: this.units.length,
            shouldUpdateState 
        });
        
        if (!window.coopState || this.units.length === 0) return;
        
        // Calculate total units square meters from current units
        const totalUnitsSqm = this.units.reduce((total, unit) => total + (unit.squareMeters || 0), 0);
        if (totalUnitsSqm <= 0) return;
        
        let pricePerSqm = 25; // Default fallback
        let totalRent = 0;
        
        // Try to get calculations from state
        const calculations = window.coopState.calculate();
        console.log('State calculations:', { calculations, totalUnitsSqm });
        
        if (calculations && calculations.totalMonthly > 0) {
            // Use real calculation
            pricePerSqm = calculations.totalMonthly / totalUnitsSqm;
            console.log('Using real calculation:', { totalMonthly: calculations.totalMonthly, pricePerSqm });
        } else {
            // Force a manual calculation if state calculation isn't ready
            const price = window.coopState.get('price') || 1600000;
            const reno = window.coopState.get('reno') || 400000;
            const estimatedMonthly = (price + reno) * 0.004; // Rough estimate: 0.4% per month
            pricePerSqm = estimatedMonthly / totalUnitsSqm;
            console.log('Using fallback calculation:', { price, reno, estimatedMonthly, pricePerSqm });
        }
        
        // Update the price per m² display
        const priceDisplay = document.getElementById('rent-per-sqm');
        if (priceDisplay) {
            priceDisplay.textContent = Math.round(pricePerSqm);
        }
        
        // Apply same price per sqm to all units
        this.units.forEach((unit, index) => {
            const newRent = Math.round(pricePerSqm * unit.squareMeters);
            unit.rentPerMonth = newRent;
            totalRent += newRent;
            
            // Update the input field display using specific class
            const unitElement = this.unitsContainer?.children[index];
            if (unitElement) {
                const rentInput = unitElement.querySelector('.rent-input');
                if (rentInput) {
                    rentInput.value = newRent;
                }
            }
        });
        
        // Update total displays
        const totalSqmDisplay = document.getElementById('total-sqm');
        if (totalSqmDisplay) {
            totalSqmDisplay.textContent = totalUnitsSqm;
        }
        
        const totalRentDisplay = document.getElementById('total-rent');
        if (totalRentDisplay) {
            totalRentDisplay.textContent = totalRent;
        }
        
        if (shouldUpdateState) {
            this.updateState();
        }
    }

    updateState() {
        if (window.coopState) {
            window.coopState.setState('unitsDetails', this.units);
            window.coopState.setState('units', this.units.length);
        }
    }

    setupStateSubscription() {
        if (!window.coopState) return;
        
        let debounceTimeout;
        window.coopState.subscribe((data, calculations) => {
            // Debounce to prevent excessive recalculations
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                if (this.units.length > 0 && calculations && calculations.totalMonthly > 0) {
                    this.recalculateAllRents(false); // Don't update state to avoid loops
                }
            }, 50);
        });
    }

    getElement() {
        return this.element || this.render();
    }
}