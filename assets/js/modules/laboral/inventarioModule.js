class InventarioModule {
    constructor() {
        this.name = 'inventario';
        this.inventario = storage.get('inventario', []);
    }

    async render() {
        return `
            <div class="submodule" style="margin-top: 2rem;">
                <h3>Control de Inventario</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="fecha-inventario">Fecha</label>
                        <input type="date" id="fecha-inventario">
                    </div>
                    <div class="form-group">
                        <label for="codigo-producto">Código</label>
                        <input type="text" id="codigo-producto" placeholder="Código del producto">
                    </div>
                    <div class="form-group">
                        <label for="v-blancas">V-Blancas</label>
                        <input type="number" id="v-blancas" placeholder="Cantidad">
                    </div>
                    <div class="form-group">
                        <label for="v-rojas">V-Rojas</label>
                        <input type="number" id="v-rojas" placeholder="Cantidad">
                    </div>
                </div>

                <div class="form-actions">
                    <button class="btn" id="agregar-inventario">Agregar al Inventario</button>
                    <button class="btn btn-secondary" id="limpiar-inventario">Limpiar</button>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Código</th>
                            <th>V-Blancas</th>
                            <th>V-Rojas</th>
                            <th>Estado %</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-inventario">
                        ${this.renderInventarioTable()}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderInventarioTable() {
        return this.inventario.map((item, index) => `
            <tr>
                <td>${item.fecha}</td>
                <td>${item.codigo}</td>
                <td>${item.vBlancas}</td>
                <td>${item.vRojas}</td>
                <td>${item.estado}%</td>
                <td>
                    <button class="btn btn-warning" onclick="inventarioModule.editarRegistro(${index})">Editar</button>
                    <button class="btn btn-danger" onclick="inventarioModule.eliminarRegistro(${index})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    }

    async bindEvents() {
        document.getElementById('agregar-inventario').addEventListener('click', () => this.agregarRegistro());
        document.getElementById('limpiar-inventario').addEventListener('click', () => this.limpiarFormulario());
    }

    agregarRegistro() {
        const fecha = document.getElementById('fecha-inventario').value;
        const codigo = document.getElementById('codigo-producto').value;
        const vBlancas = parseInt(document.getElementById('v-blancas').value) || 0;
        const vRojas = parseInt(document.getElementById('v-rojas').value) || 0;

        if (fecha && codigo) {
            const estado = ((vBlancas > 0 ? 1 : 0) + (vRojas > 0 ? 1 : 0)) / 2 * 100;
            
            const nuevoRegistro = {
                fecha,
                codigo,
                vBlancas,
                vRojas,
                estado: estado.toFixed(0)
            };

            this.inventario.push(nuevoRegistro);
            storage.set('inventario', this.inventario);
            this.actualizarTabla();
            this.limpiarFormulario();
        }
    }

    eliminarRegistro(index) {
        if (confirm('¿Está seguro de eliminar este registro?')) {
            this.inventario.splice(index, 1);
            storage.set('inventario', this.inventario);
            this.actualizarTabla();
        }
    }

    actualizarTabla() {
        document.getElementById('tabla-inventario').innerHTML = this.renderInventarioTable();
    }

    limpiarFormulario() {
        document.getElementById('fecha-inventario').value = '';
        document.getElementById('codigo-producto').value = '';
        document.getElementById('v-blancas').value = '';
        document.getElementById('v-rojas').value = '';
    }
}

// Instancia global para los event handlers
window.inventarioModule = new InventarioModule();