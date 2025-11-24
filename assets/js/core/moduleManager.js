class ModuleManager {
    constructor() {
        this.modules = new Map();
        this.currentModule = null;
        this.moduleContainer = document.getElementById('main-content');
        this.navContainer = document.getElementById('navMenu');
    }

    // Registrar un nuevo módulo
    registerModule(moduleClass) {
        const module = new moduleClass();
        this.modules.set(module.name, module);
        
        // Agregar a la navegación
        this.addToNavigation(module);
        
        console.log(`Módulo registrado: ${module.name}`);
    }

    // Agregar módulo a la navegación
    addToNavigation(module) {
        if (module.showInNavigation) {
            const navItem = document.createElement('li');
            navItem.innerHTML = `
                <a href="#" class="nav-link" data-module="${module.name}">
                    ${module.navText || module.name}
                </a>
            `;
            this.navContainer.appendChild(navItem);
            
            // Agregar event listener
            navItem.querySelector('a').addEventListener('click', (e) => {
                e.preventDefault();
                this.loadModule(module.name);
            });
        }
    }

    // Cargar un módulo
    async loadModule(moduleName) {
        if (this.currentModule) {
            await this.unloadModule(this.currentModule);
        }

        const module = this.modules.get(moduleName);
        if (module) {
            this.moduleContainer.innerHTML = '';
            await module.load();
            this.currentModule = moduleName;
            
            // Actualizar navegación activa
            this.updateActiveNavigation(moduleName);
        }
    }

    // Descargar módulo
    async unloadModule(moduleName) {
        const module = this.modules.get(moduleName);
        if (module && typeof module.unload === 'function') {
            await module.unload();
        }
    }

    // Actualizar navegación activa
    updateActiveNavigation(activeModule) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('data-module') === activeModule) {
                link.style.fontWeight = 'bold';
                link.style.color = 'var(--accent-color)';
            } else {
                link.style.fontWeight = 'normal';
                link.style.color = 'white';
            }
        });
    }

    // Obtener módulo por nombre
    getModule(moduleName) {
        return this.modules.get(moduleName);
    }

    // Listar todos los módulos
    listModules() {
        return Array.from(this.modules.keys());
    }
}

// Instancia global
window.moduleManager = new ModuleManager();