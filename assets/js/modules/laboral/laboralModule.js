class LaboralModule extends BaseModule {
    constructor() {
        super('laboral', {
            navText: 'Laboral 📊',
            showInNavigation: true
        });
        this.submodules = new Map();
    }

    async initialize() {
        // Registrar submódulos
        this.submodules.set('inventario', new InventarioModule());
        this.submodules.set('novedades', new NovedadesModule());
        this.submodules.set('informes', new InformesModule());
    }

    async render() {
        const container = document.getElementById('main-content');
        
        container.innerHTML = `
            <section class="module-section active">
                <div class="module-header">
                    <h2><span class="module-icon">📊</span> Módulo Laboral</h2>
                </div>

                <div class="modules-grid">
                    <div class="module-card" data-submodule="inventario">
                        <div class="module-icon">📦</div>
                        <h3>Control de Inventario</h3>
                        <p>Registra y controla el inventario de productos en tiempo real.</p>
                        <button class="btn">Administrar</button>
                    </div>
                    
                    <div class="module-card" data-submodule="novedades">
                        <div class="module-icon">👥</div>
                        <h3>Novedades de Personal</h3>
                        <p>Gestiona novedades del personal y genera reportes automatizados.</p>
                        <button class="btn">Gestionar</button>
                    </div>
                    
                    <div class="module-card" data-submodule="informes">
                        <div class="module-icon">📋</div>
                        <h3>Generar Informes</h3>
                        <p>Crea informes profesionales combinando datos de inventario y personal.</p>
                        <button class="btn">Crear</button>
                    </div>
                </div>

                <div id="submodule-container"></div>
            </section>
        `;
    }

    async bindEvents() {
        // Eventos para submódulos
        document.querySelectorAll('[data-submodule]').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const submoduleName = card.getAttribute('data-submodule');
                this.loadSubmodule(submoduleName);
            });
        });
    }

    async loadSubmodule(submoduleName) {
        const submodule = this.submodules.get(submoduleName);
        if (submodule) {
            const container = document.getElementById('submodule-container');
            container.innerHTML = await submodule.render();
            await submodule.bindEvents();
        }
    }
}