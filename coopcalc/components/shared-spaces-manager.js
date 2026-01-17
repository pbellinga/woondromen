// Shared spaces manager component for managing gemeenschappelijke ruimtes
class CoopSharedSpacesManager {
    constructor(config) {
        this.config = config;
        this.element = null;
        this.sharedSpaces = [];
    }

    render() {
        const wrapper = document.createElement('div');
        wrapper.className = 'shared-spaces-manager';
        
        // Header
        const header = document.createElement('div');
        header.className = 'shared-spaces-header';
        
        const title = document.createElement('h3');
        title.textContent = 'Gemeenschappelijke Ruimtes';
        
        const addButton = document.createElement('button');
        addButton.className = 'btn add-space-btn';
        addButton.textContent = '+ Ruimte Toevoegen';
        addButton.onclick = () => this.addSharedSpace();
        
        header.appendChild(title);
        header.appendChild(addButton);
        wrapper.appendChild(header);
        
        // Shared spaces container
        const spacesContainer = document.createElement('div');
        spacesContainer.className = 'shared-spaces-container';
        spacesContainer.id = 'shared-spaces-container';
        wrapper.appendChild(spacesContainer);
        
        this.element = wrapper;
        this.spacesContainer = spacesContainer;
        
        // Initialize with default shared spaces
        this.initializeSharedSpaces();
        
        return wrapper;
    }

    initializeSharedSpaces() {
        // Add some default shared spaces
        const defaultSpaces = [
            { name: 'Keuken', squareMeters: 20 },
            { name: 'Woonkamer', squareMeters: 30 }
        ];
        
        defaultSpaces.forEach(space => {
            this.sharedSpaces.push(space);
            const spaceElement = this.createSharedSpaceElement(space, this.sharedSpaces.length - 1);
            this.spacesContainer.appendChild(spaceElement);
        });
        
        this.updateState();
    }

    addSharedSpace() {
        const space = {
            name: '',
            squareMeters: 10
        };
        
        const spaceElement = this.createSharedSpaceElement(space, this.sharedSpaces.length);
        this.spacesContainer.appendChild(spaceElement);
        this.sharedSpaces.push(space);
        this.updateState();
    }

    removeSharedSpace(index) {
        this.sharedSpaces.splice(index, 1);
        this.renderSharedSpaces();
        this.updateState();
    }

    createSharedSpaceElement(space, index) {
        const wrapper = document.createElement('div');
        wrapper.className = 'shared-space-row';
        
        // Name input
        const nameGroup = document.createElement('div');
        nameGroup.className = 'shared-space-input-group';
        const nameLabel = document.createElement('label');
        nameLabel.textContent = 'Naam';
        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.value = space.name;
        nameInput.placeholder = 'bijv. Keuken, Woonkamer';
        nameInput.onchange = () => {
            space.name = nameInput.value;
            this.updateState();
        };
        nameGroup.appendChild(nameLabel);
        nameGroup.appendChild(nameInput);
        
        // Square meters input
        const sqmGroup = document.createElement('div');
        sqmGroup.className = 'shared-space-input-group';
        const sqmLabel = document.createElement('label');
        sqmLabel.textContent = 'Vierkante meters';
        const sqmInput = document.createElement('input');
        sqmInput.type = 'number';
        sqmInput.value = space.squareMeters;
        sqmInput.min = 1;
        sqmInput.onchange = () => {
            space.squareMeters = parseInt(sqmInput.value) || 0;
            this.updateState();
        };
        sqmGroup.appendChild(sqmLabel);
        sqmGroup.appendChild(sqmInput);
        
        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn secondary remove-btn';
        removeBtn.textContent = '×';
        removeBtn.onclick = () => this.removeSharedSpace(index);
        
        wrapper.appendChild(nameGroup);
        wrapper.appendChild(sqmGroup);
        wrapper.appendChild(removeBtn);
        
        return wrapper;
    }

    renderSharedSpaces() {
        this.spacesContainer.innerHTML = '';
        this.sharedSpaces.forEach((space, index) => {
            const spaceElement = this.createSharedSpaceElement(space, index);
            this.spacesContainer.appendChild(spaceElement);
        });
    }

    getTotalSharedSquareMeters() {
        return this.sharedSpaces.reduce((total, space) => total + space.squareMeters, 0);
    }

    updateState() {
        if (window.coopState) {
            window.coopState.setState('sharedSpaces', this.sharedSpaces);
        }
    }

    getElement() {
        return this.element || this.render();
    }
}