class MensajesModule extends BaseModule {
    constructor() {
        super('mensajes', {
            navText: 'Mensajes 💬',
            showInNavigation: true
        });
    }

    async render() {
        return `
            <section class="module-section active">
                <div class="module-header">
                    <h2><span class="module-icon">💬</span> Mensajes WhatsApp con IA</h2>
                    <div class="api-status" id="api-status" style="font-size: 0.8em; padding: 0.3rem 0.8rem; background: #4CAF50; color: white; border-radius: 20px;">
                        ✅ IA Conectada
                    </div>
                </div>

                <p>Escribe tus ideas desordenadas y nuestra IA las convertirá en mensajes profesionales.</p>

                <div class="style-options">
                    <div class="style-option">
                        <input type="checkbox" id="emojis" checked>
                        <label for="emojis">Incluir emojis</label>
                    </div>
                    <div class="style-option">
                        <input type="checkbox" id="formato" checked>
                        <label for="formato">Aplicar formato profesional</label>
                    </div>
                    <div class="style-option">
                        <input type="checkbox" id="puntos" checked>
                        <label for="puntos">Usar puntos clave</label>
                    </div>
                    <div class="style-option">
                        <input type="radio" id="estilo-formal" name="estilo" value="formal" checked>
                        <label for="estilo-formal">Estilo formal</label>
                    </div>
                    <div class="style-option">
                        <input type="radio" id="estilo-informal" name="estilo" value="informal">
                        <label for="estilo-informal">Estilo informal</label>
                    </div>
                </div>

                <div class="message-container">
                    <div class="message-box">
                        <label for="texto-original">✏️ Escribe tus ideas:</label>
                        <textarea id="texto-original" placeholder="Escribe tus ideas aquí..."></textarea>
                        <div class="message-actions">
                            <button class="btn" id="procesar-texto">
                                <span id="procesar-texto-text">🚀 Procesar con IA</span>
                                <span id="procesar-texto-loading" class="loading" style="display: none;"></span>
                            </button>
                            <button class="btn btn-secondary" id="limpiar-texto">Limpiar</button>
                        </div>
                    </div>

                    <div class="message-box">
                        <label for="texto-procesado">✨ Mensaje procesado:</label>
                        <div class="message-preview">
                            <div class="preview-content" id="texto-procesado">
                                El mensaje procesado aparecerá aquí...
                            </div>
                        </div>
                        <div class="message-actions">
                            <button class="btn btn-whatsapp" id="enviar-whatsapp" disabled>📱 Abrir en WhatsApp</button>
                            <button class="btn btn-secondary" id="copiar-texto" disabled>📋 Copiar texto</button>
                        </div>
                    </div>
                </div>

                <div class="examples">
                    <h3>💡 Ejemplos de uso:</h3>
                    <div class="examples-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1rem; margin-top: 1rem;">
                        <div class="example-card" style="background: #f0f9ff; padding: 1rem; border-radius: var(--border-radius); border-left: 4px solid var(--accent-color); cursor: pointer;">
                            <h4>📅 Recordatorio de reunión</h4>
                            <p style="font-size: 0.9rem; margin-top: 0.5rem;">"reunion mañana 10am sala conferencias no olvidar llevar informe ventas"</p>
                        </div>
                        <div class="example-card" style="background: #f0f9ff; padding: 1rem; border-radius: var(--border-radius); border-left: 4px solid var(--accent-color); cursor: pointer;">
                            <h4>📦 Actualización de envío</h4>
                            <p style="font-size: 0.9rem; margin-top: 0.5rem;">"pedido 12345 llegará hoy entre 2-4pm necesitamos preparar almacén confirmar recepción"</p>
                        </div>
                        <div class="example-card" style="background: #f0f9ff; padding: 1rem; border-radius: var(--border-radius); border-left: 4px solid var(--accent-color); cursor: pointer;">
                            <h4>👥 Anuncio al equipo</h4>
                            <p style="font-size: 0.9rem; margin-top: 0.5rem;">"nuevo proyecto starting lunes todos deben revisar documentos preparar ideas primera reunion"</p>
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    async bindEvents() {
        document.getElementById('procesar-texto').addEventListener('click', () => this.procesarTexto());
        document.getElementById('limpiar-texto').addEventListener('click', () => this.limpiarTexto());
        document.getElementById('copiar-texto').addEventListener('click', () => this.copiarTexto());
        document.getElementById('enviar-whatsapp').addEventListener('click', () => this.abrirWhatsApp());

        // Ejemplos rápidos
        document.querySelectorAll('.example-card').forEach(card => {
            card.addEventListener('click', () => {
                const ejemploTexto = card.querySelector('p').textContent;
                document.getElementById('texto-original').value = ejemploTexto;
            });
        });

        // Verificar estado de la API
        this.verificarEstadoAPI();
    }

    async verificarEstadoAPI() {
        try {
            const statusElement = document.getElementById('api-status');
            const testResponse = await fetch('/api/ia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: "Responde 'OK' si estás funcionando." })
            });
            
            if (testResponse.ok) {
                statusElement.innerHTML = '✅ IA Conectada';
                statusElement.style.background = '#4CAF50';
            } else {
                statusElement.innerHTML = '⚠️ IA No Disponible';
                statusElement.style.background = '#ff9800';
            }
        } catch (error) {
            const statusElement = document.getElementById('api-status');
            statusElement.innerHTML = '❌ Error de Conexión';
            statusElement.style.background = '#f44336';
        }
    }

    async procesarTexto() {
        const texto = document.getElementById('texto-original').value.trim();
        const btnProcesar = document.getElementById('procesar-texto');
        const textoProcesado = document.getElementById('texto-procesado');
        
        if (!texto) {
            alert('Por favor, escribe algunas ideas para procesar');
            return;
        }

        // Mostrar loading
        btnProcesar.disabled = true;
        document.getElementById('procesar-texto-text').style.display = 'none';
        document.getElementById('procesar-texto-loading').style.display = 'inline-block';
        textoProcesado.textContent = '🔄 Procesando con IA...';

        try {
            const mensajeProcesado = await this.procesarConIA(texto);
            textoProcesado.textContent = mensajeProcesado;
            
            // Habilitar botones
            document.getElementById('enviar-whatsapp').disabled = false;
            document.getElementById('copiar-texto').disabled = false;

        } catch (error) {
            console.error('Error:', error);
            textoProcesado.textContent = '❌ Error al procesar con IA. Usando procesamiento local...';
            // Fallback a procesamiento local
            const mensajeLocal = this.procesarTextoSinIA(texto);
            setTimeout(() => {
                textoProcesado.textContent = mensajeLocal;
                document.getElementById('enviar-whatsapp').disabled = false;
                document.getElementById('copiar-texto').disabled = false;
            }, 1000);
        } finally {
            // Ocultar loading
            btnProcesar.disabled = false;
            document.getElementById('procesar-texto-text').style.display = 'inline-block';
            document.getElementById('procesar-texto-loading').style.display = 'none';
        }
    }

    async procesarConIA(texto) {
        const incluirEmojis = document.getElementById('emojis').checked;
        const aplicarFormato = document.getElementById('formato').checked;
        const usarPuntos = document.getElementById('puntos').checked;
        const estilo = document.querySelector('input[name="estilo"]:checked').value;

        // Crear el prompt para la IA
        let prompt = `Convierte estas ideas desordenadas en un mensaje profesional para WhatsApp:\n\n"${texto}"\n\n`;
        
        prompt += "Instrucciones específicas:\n";
        if (aplicarFormato) {
            prompt += "- Aplica formato profesional y estructura clara\n";
        }
        if (usarPuntos) {
            prompt += "- Organiza la información en puntos clave usando •\n";
        }
        if (incluirEmojis) {
            prompt += "- Incluye emojis relevantes y apropiados\n";
        }
        prompt += `- Estilo de lenguaje: ${estilo}\n`;
        prompt += "- Responde ÚNICAMENTE con el mensaje final listo para enviar, sin explicaciones adicionales";

        const response = await fetch('/api/ia', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error: ${response.status}`);
        }

        const data = await response.json();
        return data.resultado;
    }

    procesarTextoSinIA(texto) {
        const incluirEmojis = document.getElementById('emojis').checked;
        const aplicarFormato = document.getElementById('formato').checked;
        const usarPuntos = document.getElementById('puntos').checked;
        const estilo = document.querySelector('input[name="estilo"]:checked').value;
        
        let resultado = texto.charAt(0).toUpperCase() + texto.slice(1);
        
        if (aplicarFormato) {
            resultado = this.aplicarFormatoProfesional(resultado, estilo);
        }
        
        if (usarPuntos) {
            resultado = this.organizarEnPuntosClave(resultado);
        }
        
        if (incluirEmojis) {
            resultado = this.agregarEmojisApropiados(resultado);
        }
        
        return resultado;
    }

    aplicarFormatoProfesional(texto, estilo) {
        if (estilo === 'formal') {
            return texto + "\n\nQuedo atento a sus comentarios.\n\nSaludos cordiales.";
        } else {
            return texto + "\n\n¡Quedo atento a tus comentarios!\n\n¡Saludos!";
        }
    }

    organizarEnPuntosClave(texto) {
        const lineas = texto.split('\n').filter(linea => linea.trim() !== '');
        let resultado = '';
        
        lineas.forEach((linea) => {
            if (linea.trim() !== '') {
                resultado += `• ${linea.trim()}\n`;
            }
        });
        
        return resultado;
    }

    agregarEmojisApropiados(texto) {
        const emojiMap = {
            'reunión': '📅',
            'reunion': '📅',
            'mañana': '🌅',
            'tarde': '🌇',
            'informe': '📊',
            'ventas': '💰',
            'presupuesto': '💵',
            'equipo': '👥',
            'proyecto': '🚀',
            'importante': '⚠️',
            'urgente': '🚨',
            'recordar': '📌',
            'confirmar': '✅',
            'éxito': '🎯',
            'exito': '🎯',
            'gracias': '🙏',
            'hola': '👋',
            'buenos días': '☀️',
            'buenas tardes': '🌇',
            'buenas noches': '🌙'
        };
        
        let resultado = texto;
        Object.keys(emojiMap).forEach(palabra => {
            const regex = new RegExp(`\\b${palabra}\\b`, 'gi');
            resultado = resultado.replace(regex, `${palabra} ${emojiMap[palabra]}`);
        });
        
        return resultado;
    }

    limpiarTexto() {
        document.getElementById('texto-original').value = '';
        document.getElementById('texto-procesado').textContent = 'El mensaje procesado aparecerá aquí...';
        document.getElementById('enviar-whatsapp').disabled = true;
        document.getElementById('copiar-texto').disabled = true;
    }

    async copiarTexto() {
        const texto = document.getElementById('texto-procesado').textContent;
        try {
            await navigator.clipboard.writeText(texto);
            const btn = document.getElementById('copiar-texto');
            const originalText = btn.textContent;
            btn.textContent = '✅ Copiado!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        } catch (error) {
            alert('Error al copiar el texto');
        }
    }

    abrirWhatsApp() {
        const texto = document.getElementById('texto-procesado').textContent;
        const textoCodificado = encodeURIComponent(texto);
        window.open(`https://wa.me/?text=${textoCodificado}`, '_blank');
    }
}