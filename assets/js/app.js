class AsistenteApp {
    constructor() {
        this.modulesLoaded = false;
    }

    async initialize() {
        try {
            // Ocultar loading
            document.getElementById('loading').style.display = 'none';
            
            // Registrar módulos
            await this.registerModules();
            
            // Configurar router
            this.setupRouter();
            
            // Configurar eventos globales
            this.setupGlobalEvents();
            
            console.log('Aplicación inicializada correctamente');
        } catch (error) {
            console.error('Error inicializando aplicación:', error);
        }
    }

    async registerModules() {
        // Registrar módulos principales
        moduleManager.registerModule(LaboralModule);
        moduleManager.registerModule(MensajesModule);
        moduleManager.registerModule(OcioModule);
        
        // Cargar módulo inicial
        await moduleManager.loadModule('inicio');
    }

    setupRouter() {
        // Configurar rutas
        router.addRoute('/', 'inicio');
        router.addRoute('/laboral', 'laboral');
        router.addRoute('/mensajes', 'mensajes');
        router.addRoute('/ocio', 'ocio');
        
        // Inicializar router
        router.init();
    }

    setupGlobalEvents() {
        // Menú móvil
        document.getElementById('menuToggle').addEventListener('click', () => {
            document.getElementById('navMenu').classList.toggle('show');
        });

        // Cerrar menú al hacer clic en un enlace (móvil)
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                document.getElementById('navMenu').classList.remove('show');
            });
        });
    }
}

// Módulo de inicio (built-in)
class InicioModule extends BaseModule {
    constructor() {
        super('inicio', {
            showInNavigation: true,
            navText: 'Inicio 🏠'
        });
    }

    async render() {
        return `
            <section class="module-section active">
                <div class="welcome-section">
                    <h2>Bienvenido a tu Asistente Diario con IA</h2>
                    <p>Esta aplicación PWA modular utiliza inteligencia artificial para ayudarte con tus tareas diarias.</p>
                </div>

                <div class="modules-grid">
                    ${this.renderModuleCards()}
                </div>
            </section>
        `;
    }

    renderModuleCards() {
        const modules = moduleManager.listModules();
        return modules.map(moduleName => {
            const module = moduleManager.getModule(moduleName);
            if (module && module.showInNavigation && moduleName !== 'inicio') {
                return `
                    <div class="module-card" data-module="${moduleName}">
                        <div class="module-icon">${this.getModuleIcon(moduleName)}</div>
                        <h3>${module.navText}</h3>
                        <p>${this.getModuleDescription(moduleName)}</p>
                        <button class="btn">Explorar</button>
                    </div>
                `;
            }
            return '';
        }).join('');
    }

    getModuleIcon(moduleName) {
        const icons = {
            'laboral': '📊',
            'mensajes': '💬',
            'ocio': '🎰'
        };
        return icons[moduleName] || '🔧';
    }

    getModuleDescription(moduleName) {
        const descriptions = {
            'laboral': 'Gestión de inventarios, novedades de personal y generación de informes.',
            'mensajes': 'Convierte ideas en mensajes profesionales para WhatsApp.',
            'ocio': 'Herramientas de entretenimiento y análisis predictivo.'
        };
        return descriptions[moduleName] || 'Módulo de funcionalidades especializadas.';
    }

    async bindEvents() {
        document.querySelectorAll('[data-module]').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const moduleName = card.getAttribute('data-module');
                moduleManager.loadModule(moduleName);
            });
        });
    }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', async () => {
    window.app = new AsistenteApp();
    await app.initialize();
    
    // Registrar módulo de inicio después de que la app esté lista
    moduleManager.registerModule(InicioModule);
});