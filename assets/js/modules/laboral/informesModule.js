class InformesModule {
    constructor() {
        this.name = 'informes';
    }

    async render() {
        return `
            <div class="submodule" style="margin-top: 2rem;">
                <h3>Generar Informes</h3>
                <div class="form-grid">
                    <div class="form-group">
                        <label for="fecha-informe">Fecha del Informe</label>
                        <input type="date" id="fecha-informe" value="${this.getTodayDate()}">
                    </div>
                    <div class="form-group">
                        <label for="tipo-informe">Tipo de Informe</label>
                        <select id="tipo-informe">
                            <option value="inventario">Inventario</option>
                            <option value="novedades">Novedades de Personal</option>
                            <option value="combinado">Informe Combinado</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="destinatarios">Destinatarios</label>
                        <input type="text" id="destinatarios" placeholder="email1, email2, ..." value="sergio.anaya0624@gmail.com, coordinacion.logistico@colbeef.com">
                    </div>
                </div>

                <div class="form-actions">
                    <button class="btn" id="generar-informe">Generar Informe</button>
                    <button class="btn btn-secondary" id="vista-previa">Vista Previa</button>
                    <button class="btn btn-warning" id="enviar-informe">Enviar por Email</button>
                </div>

                <div class="preview-container" id="preview-container" style="display: none;">
                    <div class="preview-header">
                        <h3>Vista Previa del Informe</h3>
                        <button class="btn btn-secondary" id="cerrar-preview">Cerrar</button>
                    </div>
                    <div id="informe-preview"></div>
                </div>
            </div>
        `;
    }

    async bindEvents() {
        document.getElementById('generar-informe').addEventListener('click', () => this.generarInforme());
        document.getElementById('vista-previa').addEventListener('click', () => this.mostrarVistaPrevia());
        document.getElementById('enviar-informe').addEventListener('click', () => this.enviarInforme());
        document.getElementById('cerrar-preview').addEventListener('click', () => this.cerrarVistaPrevia());
    }

    getTodayDate() {
        return new Date().toISOString().split('T')[0];
    }

    generarInforme() {
        const informeHTML = this.generarHTMLInforme();
        this.descargarInforme(informeHTML);
    }

    mostrarVistaPrevia() {
        const informeHTML = this.generarHTMLInforme();
        document.getElementById('informe-preview').innerHTML = informeHTML;
        document.getElementById('preview-container').style.display = 'block';
    }

    cerrarVistaPrevia() {
        document.getElementById('preview-container').style.display = 'none';
    }

    enviarInforme() {
        const destinatarios = document.getElementById('destinatarios').value;
        alert(`Informe enviado a: ${destinatarios}\n\n(En una implementación real, esto enviaría el email)`);
    }

    generarHTMLInforme() {
        const tipoInforme = document.getElementById('tipo-informe').value;
        const fechaInforme = document.getElementById('fecha-informe').value;
        const inventario = storage.get('inventario', []);
        const novedades = storage.get('novedades', []);

        let contenido = '';

        if (tipoInforme === 'inventario' || tipoInforme === 'combinado') {
            contenido += this.generarSeccionInventario(inventario, fechaInforme);
        }

        if (tipoInforme === 'novedades' || tipoInforme === 'combinado') {
            if (contenido) contenido += '<hr style="margin: 20px 0;">';
            contenido += this.generarSeccionNovedades(novedades, fechaInforme);
        }

        return `
            <div class="informe-body">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h1 style="color: #4CAF50;">ColBeef S.A.S.</h1>
                    <p><strong>Informe ${this.getTipoInformeTexto(tipoInforme)}</strong></p>
                    <p>Fecha: ${this.formatearFecha(fechaInforme)}</p>
                </div>
                ${contenido}
                <div style="margin-top: 30px; text-align: center; font-size: 0.9em; color: #666;">
                    <p>Generado automáticamente por el Sistema de Asistente Diario IA</p>
                </div>
            </div>
        `;
    }

    generarSeccionInventario(inventario, fecha) {
        const inventarioFiltrado = inventario.filter(item => item.fecha === fecha);
        let completos = 0;
        let incompletos = 0;

        const filas = inventarioFiltrado.map(item => {
            if (parseInt(item.estado) === 100) {
                completos++;
            } else {
                incompletos++;
            }

            return `
                <tr>
                    <td>${this.formatearFecha(item.fecha)}</td>
                    <td>${item.codigo}</td>
                    <td>${item.vBlancas}</td>
                    <td>${item.vRojas}</td>
                    <td>${item.patasManos || 0}</td>
                    <td>${item.cabezas || 0}</td>
                    <td>${item.estado}%</td>
                </tr>
            `;
        }).join('');

        return `
            <div class="seccion-inventario">
                <h2 style="color: #4CAF50; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">Inventario</h2>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                    <div style="background: #e8f5e8; padding: 15px; border-radius: 5px; text-align: center;">
                        <h3 style="margin: 0; color: #4CAF50;">Completos</h3>
                        <p style="font-size: 2em; margin: 10px 0; font-weight: bold;">${completos}</p>
                    </div>
                    <div style="background: #ffebee; padding: 15px; border-radius: 5px; text-align: center;">
                        <h3 style="margin: 0; color: #f44336;">Incompletos</h3>
                        <p style="font-size: 2em; margin: 10px 0; font-weight: bold;">${incompletos}</p>
                    </div>
                </div>

                <table class="informe-table" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <thead>
                        <tr style="background-color: #4CAF50; color: white;">
                            <th style="padding: 12px; border: 1px solid #ddd;">Fecha</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Código</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">V-Blancas</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">V-Rojas</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Patas y Manos</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Cabezas</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Estado %</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filas}
                    </tbody>
                </table>
            </div>
        `;
    }

    generarSeccionNovedades(novedades, fecha) {
        const novedadesFiltradas = novedades.filter(novedad => novedad.fecha === fecha);

        const filas = novedadesFiltradas.map(novedad => `
            <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${this.formatearFecha(novedad.fecha)}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${novedad.empleado}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${this.capitalizeFirstLetter(novedad.tipo)}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${novedad.descripcion}</td>
            </tr>
        `).join('');

        return `
            <div class="seccion-novedades">
                <h2 style="color: #2196F3; border-bottom: 2px solid #2196F3; padding-bottom: 10px;">Novedades de Personal</h2>
                
                <div style="background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
                    <h3 style="margin: 0; color: #2196F3;">Total Novedades</h3>
                    <p style="font-size: 2em; margin: 10px 0; font-weight: bold;">${novedadesFiltradas.length}</p>
                </div>

                <table class="informe-table" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <thead>
                        <tr style="background-color: #2196F3; color: white;">
                            <th style="padding: 12px; border: 1px solid #ddd;">Fecha</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Empleado</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Tipo</th>
                            <th style="padding: 12px; border: 1px solid #ddd;">Descripción</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${filas}
                    </tbody>
                </table>
            </div>
        `;
    }

    descargarInforme(contenidoHTML) {
        const blob = new Blob([contenidoHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `informe-${this.getTodayDate()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    getTipoInformeTexto(tipo) {
        const tipos = {
            'inventario': 'de Inventario',
            'novedades': 'de Novedades de Personal',
            'combinado': 'Combinado'
        };
        return tipos[tipo] || tipo;
    }

    formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-ES');
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

window.informesModule = new InformesModule();