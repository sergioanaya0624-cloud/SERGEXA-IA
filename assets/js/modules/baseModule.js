class BaseModule {
    constructor(name, config = {}) {
        this.name = name;
        this.config = {
            showInNavigation: true,
            navText: name,
            ...config
        };
        this.initialized = false;
    }

    // Propiedades getter
    get showInNavigation() {
        return this.config.showInNavigation;
    }

    get navText() {
        return this.config.navText;
    }

    // Método para cargar el módulo
    async load() {
        if (!this.initialized) {
            await this.initialize();
            this.initialized = true;
        }
        
        await this.render();
        await this.bindEvents();
        
        console.log(`Módulo ${this.name} cargado`);
    }

    // Inicializar módulo (sobrescribir en clases hijas)
    async initialize() {
        // Inicialización base
    }

    // Renderizar interfaz (sobrescribir en clases hijas)
    async render() {
        throw new Error('Método render debe ser implementado');
    }

    // Vincular eventos (sobrescribir en clases hijas)
    async bindEvents() {
        // Binding de eventos base
    }

    // Descargar módulo (sobrescribir si es necesario)
    async unload() {
        console.log(`Módulo ${this.name} descargado`);
    }

    // Método helper para crear elementos HTML
    createElement(tag, attributes = {}, content = '') {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            if (key === 'className') {
                element.className = attributes[key];
            } else {
                element.setAttribute(key, attributes[key]);
            }
        });
        
        if (typeof content === 'string') {
            element.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            element.appendChild(content);
        }
        
        return element;
    }

    // Método helper para hacer peticiones HTTP
    async fetchAPI(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error en petición API:', error);
            throw error;
        }
    }
}