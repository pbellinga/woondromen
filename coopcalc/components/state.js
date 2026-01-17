// Shared state management for the coopcalc application
class CoopState {
    constructor() {
        this.data = {
            price: 1600000,
            reno: 400000,
            units: 10,
            // Financing options
            bankPercentage: 70,
            bankInterest: 4.5,
            bankYears: 30,
            woonleerPercentage: 15,
            woonleerInterest: 2,
            woonleerYears: 30,
            obligatiesInterest: 2,
            obligatiesYears: 15,
            subsidies: 0,
            eigenInlegPerPerson: 10000,
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
        const { price, reno, units, bankPercentage, bankInterest, bankYears, 
                woonleerPercentage, woonleerInterest, woonleerYears,
                obligatiesInterest, obligatiesYears, subsidies, eigenInlegPerPerson, service } = this.data;
        
        // Basic calculations
        const tax = price * this.TAX_RATE;
        const totalCost = price + tax + reno;
        
        // Financing amounts
        const bankAmount = totalCost * (bankPercentage / 100);
        const woonleerAmount = totalCost * (woonleerPercentage / 100);
        const totalEigenInleg = eigenInlegPerPerson * units;
        const financedAmount = bankAmount + woonleerAmount + subsidies + totalEigenInleg;
        const obligatiesAmount = Math.max(0, totalCost - financedAmount);
        
        // Monthly payments calculations
        const bankMonthly = this.calculateAnnuity(bankAmount, bankInterest, bankYears);
        const woonleerMonthly = this.calculateAnnuity(woonleerAmount, woonleerInterest, woonleerYears);
        const obligatiesMonthly = this.calculateAnnuity(obligatiesAmount, obligatiesInterest, obligatiesYears);
        
        const totalMonthlyFinancing = bankMonthly + woonleerMonthly + obligatiesMonthly;
        const totalMonthly = totalMonthlyFinancing + service;
        const rentPerUnit = units > 0 ? totalMonthly / units : 0;

        return {
            price, tax, reno, totalCost, units, service,
            bankAmount, woonleerAmount, obligatiesAmount, subsidies, totalEigenInleg,
            bankMonthly, woonleerMonthly, obligatiesMonthly,
            totalMonthlyFinancing, totalMonthly, rentPerUnit,
            // Legacy compatibility
            equity: totalEigenInleg,
            loanAmount: bankAmount + woonleerAmount + obligatiesAmount,
            monthlyMortgage: totalMonthlyFinancing
        };
    }

    // Calculate annuity payment: PMT = P * (r(1+r)^n) / ((1+r)^n - 1)
    calculateAnnuity(principal, annualRate, years) {
        if (principal <= 0 || annualRate <= 0) return 0;
        const r = annualRate / 100 / 12;
        const n = years * 12;
        return principal * (r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
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