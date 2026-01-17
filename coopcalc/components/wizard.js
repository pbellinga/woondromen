// Wizard component for step navigation
class CoopWizard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentStep = 1;
        this.steps = [];
        
        // Subscribe to state changes
        if (window.coopState) {
            window.coopState.subscribe((data, calculations) => {
                this.updateStepData(data, calculations);
            });
        }
    }

    // Register a step
    addStep(stepConfig) {
        this.steps.push(stepConfig);
    }

    // Navigate to specific step
    goToStep(stepId) {
        // Hide all steps
        this.container.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });

        // Show target step
        const targetStep = document.getElementById(`step-${stepId}`);
        if (targetStep) {
            targetStep.classList.add('active');
            this.currentStep = stepId;
        }

        // Trigger state update
        if (window.coopState) {
            window.coopState.notifyListeners();
        }
    }

    // Update step data when state changes
    updateStepData(data, calculations) {
        // Update step 2 (financing) summary
        this.updateElement('wiz-price', CoopUtils.fmt(calculations.price));
        this.updateElement('wiz-tax', CoopUtils.fmt(calculations.tax));
        this.updateElement('wiz-reno', CoopUtils.fmt(calculations.reno));
        this.updateElement('wiz-total-cost', CoopUtils.fmt(calculations.totalCost));
        
        // Update financing breakdown
        this.updateElement('fin-bank', CoopUtils.fmt(calculations.bankAmount));
        this.updateElement('fin-woonleer', CoopUtils.fmt(calculations.woonleerAmount));
        this.updateElement('fin-obligaties', CoopUtils.fmt(calculations.obligatiesAmount));
        this.updateElement('fin-subsidies', CoopUtils.fmt(calculations.subsidies));
        this.updateElement('fin-eigen', CoopUtils.fmt(calculations.totalEigenInleg));
        this.updateElement('fin-total', CoopUtils.fmt(calculations.totalFinancing));
        
        // Update financing balance check
        this.updateElement('check-financing', CoopUtils.fmt(calculations.totalFinancing));
        this.updateElement('check-costs', CoopUtils.fmt(calculations.totalCost));
        this.updateElement('check-balance', CoopUtils.fmt(calculations.financingBalance));
        
        // Legacy elements
        this.updateElement('wiz-loan', CoopUtils.fmt(calculations.loanAmount));
        this.updateElement('wiz-mortgage', CoopUtils.fmt(calculations.monthlyMortgage));
        this.updateElement('wiz-financing', CoopUtils.fmt(calculations.totalMonthlyFinancing));
        
        // Step 3 detailed financing breakdown
        this.updateElement('bank-principal', CoopUtils.fmt(calculations.bankPrincipal));
        this.updateElement('bank-interest-monthly', CoopUtils.fmt(calculations.bankInterestMonthly));
        this.updateElement('bank-total', CoopUtils.fmt(calculations.bankMonthly));
        
        this.updateElement('woonleer-principal', CoopUtils.fmt(calculations.woonleerPrincipal));
        this.updateElement('woonleer-interest-monthly', CoopUtils.fmt(calculations.woonleerInterestMonthly));
        this.updateElement('woonleer-total', CoopUtils.fmt(calculations.woonleerMonthly));
        
        this.updateElement('obligaties-principal', CoopUtils.fmt(calculations.obligatiesPrincipal));
        this.updateElement('obligaties-interest-monthly', CoopUtils.fmt(calculations.obligatiesInterestMonthly));
        this.updateElement('obligaties-total', CoopUtils.fmt(calculations.obligatiesMonthly));
        
        // Step 3 cost totals
        this.updateElement('total-financing', CoopUtils.fmt(calculations.totalMonthlyFinancing));
        this.updateElement('total-coop-fund', CoopUtils.fmt(calculations.coopFund));
        this.updateElement('total-service', CoopUtils.fmt(calculations.totalServiceCosts));
        this.updateElement('grand-total', CoopUtils.fmt(calculations.totalMonthly));

        // Update step 4 (results)
        this.updateElement('res-mortgage', CoopUtils.fmt(calculations.monthlyMortgage));
        this.updateElement('res-service', CoopUtils.fmt(calculations.service));
        this.updateElement('res-total', CoopUtils.fmt(calculations.totalMonthly));
        this.updateElement('res-rent', CoopUtils.fmt(calculations.rentPerUnit));
    }

    // Helper to update element text content
    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    }

    // Initialize wizard
    init() {
        // Set up global navigation function
        window.next = (stepId) => {
            this.goToStep(stepId);
        };

        // Show first step
        this.goToStep(1);
    }
}