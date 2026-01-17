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
            // Monthly costs
            coopFund: 50,
            reserveringOnderhoud: 90,
            servicekostenGWL: 90,
            belastingen: 40,
            verzekeringen: 30,
            service: 450 // Legacy compatibility
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
                obligatiesInterest, obligatiesYears, subsidies, eigenInlegPerPerson,
                coopFund, reserveringOnderhoud, servicekostenGWL, belastingen, verzekeringen } = this.data;
        
        // Basic calculations
        const tax = price * this.TAX_RATE;
        const totalCost = price + tax + reno;
        
        // Financing amounts
        const bankAmount = totalCost * (bankPercentage / 100);
        const woonleerAmount = totalCost * (woonleerPercentage / 100);
        const totalEigenInleg = eigenInlegPerPerson * units;
        
        // Calculate what's already covered (use actual input values, not adjusted)
        const coveredAmount = bankAmount + woonleerAmount + subsidies + totalEigenInleg;
        const obligatiesAmount = Math.max(0, totalCost - coveredAmount);
        
        // Total financing check (use actual input values for balance calculation)
        const totalFinancing = bankAmount + woonleerAmount + obligatiesAmount + subsidies + totalEigenInleg;
        const financingBalance = totalFinancing - totalCost;
        
        // Detailed monthly payments calculations with principal/interest breakdown
        const bankMonthly = this.calculateAnnuity(bankAmount, bankInterest, bankYears);
        const bankInterestMonthly = bankAmount * (bankInterest / 100 / 12);
        const bankPrincipal = bankMonthly - bankInterestMonthly;
        
        const woonleerMonthly = this.calculateAnnuity(woonleerAmount, woonleerInterest, woonleerYears);
        const woonleerInterestMonthly = woonleerAmount * (woonleerInterest / 100 / 12);
        const woonleerPrincipal = woonleerMonthly - woonleerInterestMonthly;
        
        const obligatiesMonthly = this.calculateAnnuity(obligatiesAmount, obligatiesInterest, obligatiesYears);
        const obligatiesInterestMonthly = obligatiesAmount * (obligatiesInterest / 100 / 12);
        const obligatiesPrincipal = obligatiesMonthly - obligatiesInterestMonthly;
        
        const totalMonthlyFinancing = bankMonthly + woonleerMonthly + obligatiesMonthly;
        
        // Service costs breakdown
        const totalServiceCosts = reserveringOnderhoud + servicekostenGWL + belastingen + verzekeringen;
        const service = totalServiceCosts; // Legacy compatibility
        
        const totalMonthly = totalMonthlyFinancing + coopFund + totalServiceCosts;
        const rentPerUnit = units > 0 ? totalMonthly / units : 0;

        return {
            price, tax, reno, totalCost, units, service,
            bankAmount, woonleerAmount, obligatiesAmount, subsidies, 
            totalEigenInleg, eigenInlegPerPerson,
            totalFinancing, financingBalance,
            // Detailed monthly financing breakdown
            bankMonthly, bankPrincipal, bankInterestMonthly,
            woonleerMonthly, woonleerPrincipal, woonleerInterestMonthly,
            obligatiesMonthly, obligatiesPrincipal, obligatiesInterestMonthly,
            totalMonthlyFinancing,
            // Cost categories
            coopFund, reserveringOnderhoud, servicekostenGWL, belastingen, verzekeringen,
            totalServiceCosts, totalMonthly, rentPerUnit,
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