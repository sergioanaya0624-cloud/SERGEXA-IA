class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
    }

    // Agregar ruta
    addRoute(path, moduleName) {
        this.routes.set(path, moduleName);
    }

    // Navegar a ruta
    navigate(path) {
        const moduleName = this.routes.get(path);
        if (moduleName && window.moduleManager) {
            window.moduleManager.loadModule(moduleName);
            this.currentRoute = path;
            window.history.pushState({}, '', path);
        }
    }

    // Inicializar router
    init() {
        // Manejar navegación con el botón atrás/adelante
        window.addEventListener('popstate', () => {
            const path = window.location.pathname || '/';
            this.navigate(path);
        });

        // Navegación inicial
        const initialPath = window.location.pathname || '/';
        this.navigate(initialPath);
    }
}

window.router = new Router();