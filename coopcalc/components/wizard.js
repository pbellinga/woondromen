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
        this.updateElement('wiz-loan', CoopUtils.fmt(calculations.loanAmount));
        this.updateElement('wiz-mortgage', CoopUtils.fmt(calculations.monthlyMortgage));

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