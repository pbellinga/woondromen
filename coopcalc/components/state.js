// Shared state management for the coopcalc application
class CoopState {
    constructor() {
        this.data = {
            price: 1600000,
            reno: 400000,
            units: 10,
            equity: 100000,
            service: 450
        };
        
        this.listeners = [];
        
        // Constants from specification
        this.TAX_RATE = 0.10; // 10% Transfer Tax
        this.INTEREST_RATE = 0.045; // 4.5% Bank Interest
        this.LOAN_YEARS = 30;
    }

    // Subscribe to state changes
    subscribe(callback) {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(listener => listener !== callback);
        };
    }

    // Update state and notify listeners
    setState(key, value) {
        this.data[key] = value;
        this.notifyListeners();
    }

    // Get current state
    getState() {
        return { ...this.data };
    }

    // Get specific state value
    get(key) {
        return this.data[key];
    }

    // Notify all listeners of state change
    notifyListeners() {
        const calculations = this.calculate();
        this.listeners.forEach(callback => callback(this.data, calculations));
    }

    // Perform all calculations based on current state
    calculate() {
        const { price, reno, units, equity, service } = this.data;
        
        // Calculations
        const tax = price * this.TAX_RATE;
        const totalCost = price + tax + reno;
        const loanAmount = Math.max(0, totalCost - equity);

        // Annuity: PMT = P * (r(1+r)^n) / ((1+r)^n - 1)
        const r = this.INTEREST_RATE / 12;
        const n = this.LOAN_YEARS * 12;
        const monthlyMortgage = loanAmount > 0 
            ? loanAmount * (r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1)
            : 0;
        
        const totalMonthly = monthlyMortgage + service;
        const rentPerUnit = units > 0 ? totalMonthly / units : 0;

        return {
            price,
            tax,
            reno,
            totalCost,
            loanAmount,
            monthlyMortgage,
            service,
            totalMonthly,
            rentPerUnit,
            units,
            equity
        };
    }

    // Initialize state and trigger initial calculation
    init() {
        this.notifyListeners();
    }
}

// Utility functions for formatting
const CoopUtils = {
    fmt(num) {
        return num.toLocaleString('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
    },

    parseVal(str) {
        if (typeof str !== 'string') return str;
        return parseFloat(str.replace(/\./g, '').replace(',', '.')) || 0;
    },

    formatInput(el) {
        const val = this.parseVal(el.value);
        if (!isNaN(val) && el.value.trim() !== '') {
           el.value = val.toLocaleString('nl-NL');
        }
    }
};

// Create global state instance
window.coopState = new CoopState();