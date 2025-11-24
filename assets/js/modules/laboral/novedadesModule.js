class NovedadesModule {
    constructor() {
        this.name = 'novedades';
        this.novedades = storage.get('novedades', []);
    }

    async render() {
        return `
            <div class="submodule" style="margin-top: 2rem;">
                <h3>Novedades de Personal</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="fecha-novedad">Fecha de Novedad</label>
                        <input type="date" id="fecha-novedad">
                    </div>
                    <div class="form-group">
                        <label for="empleado">Empleado</label>
                        <select id="empleado">
                            <option value="">Seleccionar empleado</option>
                            <option value="empleado1">Juan Pérez</option>
                            <option value="empleado2">María García</option>
                            <option value="empleado3">Carlos López</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="tipo-novedad">Tipo de Novedad</label>
                        <select id="tipo-novedad">
                            <option value="incapacidad">Incapacidad</option>
                            <option value="vacaciones">Vacaciones</option>
                            <option value="permiso">Permiso</option>
                            <option value="licencia">Licencia</option>
                            <option value="otro">Otro</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="descripcion-novedad">Descripción</label>
                        <textarea id="descripcion-novedad" placeholder="Detalles de la novedad..."></textarea>
                    </div>
                </div>

                <div class="form-actions">
                    <button class="btn" id="agregar-novedad">Agregar Novedad</button>
                    <button class="btn btn-secondary" id="limpiar-novedad">Limpiar</button>
                </div>

                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Empleado</th>
                            <th>Tipo</th>
                            <th>Descripción</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody id="tabla-novedades">
                        ${this.renderNovedadesTable()}
                    </tbody>
                </table>
            </div>
        `;
    }

    renderNovedadesTable() {
        return this.novedades.map((novedad, index) => `
            <tr>
                <td>${novedad.fecha}</td>
                <td>${novedad.empleado}</td>
                <td>${novedad.tipo}</td>
                <td>${novedad.descripcion}</td>
                <td>
                    <button class="btn btn-warning" onclick="novedadesModule.editarNovedad(${index})">Editar</button>
                    <button class="btn btn-danger" onclick="novedadesModule.eliminarNovedad(${index})">Eliminar</button>
                </td>
            </tr>
        `).join('');
    }

    async bindEvents() {
        document.getElementById('agregar-novedad').addEventListener('click', () => this.agregarNovedad());
        document.getElementById('limpiar-novedad').addEventListener('click', () => this.limpiarFormulario());
    }

    agregarNovedad() {
        const fecha = document.getElementById('fecha-novedad').value;
        const empleadoSelect = document.getElementById('empleado');
        const empleado = empleadoSelect.options[empleadoSelect.selectedIndex].text;
        const tipo = document.getElementById('tipo-novedad').value;
        const descripcion = document.getElementById('descripcion-novedad').value;

        if (fecha && empleado && tipo && descripcion) {
            const nuevaNovedad = {
                fecha,
                empleado,
                tipo,
                descripcion
            };

            this.novedades.push(nuevaNovedad);
            storage.set('novedades', this.novedades);
            this.actualizarTabla();
            this.limpiarFormulario();
        } else {
            alert('Por favor, complete todos los campos');
        }
    }

    eliminarNovedad(index) {
        if (confirm('¿Está seguro de eliminar esta novedad?')) {
            this.novedades.splice(index, 1);
            storage.set('novedades', this.novedades);
            this.actualizarTabla();
        }
    }

    editarNovedad(index) {
        const novedad = this.novedades[index];
        
        // Llenar formulario con datos existentes
        document.getElementById('fecha-novedad').value = novedad.fecha;
        document.getElementById('empleado').value = this.getEmpleadoValue(novedad.empleado);
        document.getElementById('tipo-novedad').value = novedad.tipo;
        document.getElementById('descripcion-novedad').value = novedad.descripcion;

        // Cambiar el botón a "Actualizar"
        const btnAgregar = document.getElementById('agregar-novedad');
        btnAgregar.textContent = 'Actualizar Novedad';
        btnAgregar.onclick = () => this.actualizarNovedad(index);
    }

    actualizarNovedad(index) {
        const fecha = document.getElementById('fecha-novedad').value;
        const empleadoSelect = document.getElementById('empleado');
        const empleado = empleadoSelect.options[empleadoSelect.selectedIndex].text;
        const tipo = document.getElementById('tipo-novedad').value;
        const descripcion = document.getElementById('descripcion-novedad').value;

        if (fecha && empleado && tipo && descripcion) {
            this.novedades[index] = { fecha, empleado, tipo, descripcion };
            storage.set('novedades', this.novedades);
            this.actualizarTabla();
            this.limpiarFormulario();

            // Restaurar botón
            const btnAgregar = document.getElementById('agregar-novedad');
            btnAgregar.textContent = 'Agregar Novedad';
            btnAgregar.onclick = () => this.agregarNovedad();
        }
    }

    getEmpleadoValue(empleadoNombre) {
        const empleados = {
            'Darwing Barroteran': 'empleado1',
            'Eudy Sanchez': 'empleado2',
            'Edilson Garrido': 'empleado3',
            'Jhon vargas': 'empleado4',
            'Maicon Marin': 'empleado5',
            'Maihyn Cruz': 'empleado6'
        };
        return empleados[empleadoNombre] || '';
    }

    actualizarTabla() {
        document.getElementById('tabla-novedades').innerHTML = this.renderNovedadesTable();
    }

    limpiarFormulario() {
        document.getElementById('fecha-novedad').value = '';
        document.getElementById('empleado').value = '';
        document.getElementById('tipo-novedad').value = 'incapacidad';
        document.getElementById('descripcion-novedad').value = '';
    }
}

window.novedadesModule = new NovedadesModule();