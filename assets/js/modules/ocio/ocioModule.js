class OcioModule extends BaseModule {
    constructor() {
        super('ocio', {
            navText: 'Ocio 🎰',
            showInNavigation: true
        });
        this.submodules = new Map();
    }

    async initialize() {
        this.submodules.set('loteria', new LoteriaSubmodule());
        this.submodules.set('juegos', new JuegosSubmodule());
        this.submodules.set('consejos', new ConsejosSubmodule());
    }

    async render() {
        return `
            <section class="module-section active">
                <div class="module-header">
                    <h2><span class="module-icon">🎰</span> Módulo de Ocio</h2>
                    <div class="api-status" style="font-size: 0.8em; padding: 0.3rem 0.8rem; background: #4CAF50; color: white; border-radius: 20px;">
                        ✅ IA Conectada
                    </div>
                </div>

                <div class="modules-grid">
                    <div class="module-card" data-submodule="loteria">
                        <div class="module-icon">🎲</div>
                        <h3>Predicción de Loterías</h3>
                        <p>Analiza patrones con IA para sugerir números.</p>
                        <button class="btn">Analizar</button>
                    </div>
                    
                    <div class="module-card" data-submodule="consejos">
                        <div class="module-icon">💡</div>
                        <h3>Consejos Diarios</h3>
                        <p>Consejos personalizados generados por IA.</p>
                        <button class="btn">Ver Consejos</button>
                    </div>
                    
                    <div class="module-card" data-submodule="juegos">
                        <div class="module-icon">🎮</div>
                        <h3>Juegos con IA</h3>
                        <p>Juegos interactivos con asistencia de IA.</p>
                        <button class="btn">Jugar</button>
                    </div>
                </div>

                <div id="ocio-submodule-container"></div>
            </section>
        `;
    }

    async bindEvents() {
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
            const container = document.getElementById('ocio-submodule-container');
            container.innerHTML = await submodule.render();
            await submodule.bindEvents();
        }
    }
}

// Submódulo de Lotería con IA
class LoteriaSubmodule {
    constructor() {
        this.name = 'loteria';
        this.historial = storage.get('historial_loteria', []);
    }

    async render() {
        return `
            <div class="submodule" style="margin-top: 2rem;">
                <h3>🎲 Predicción de Loterías con IA</h3>
                <p>La IA analiza patrones estadísticos para sugerir números con mayor probabilidad.</p>
                
                <form class="form-grid">
                    <div class="form-group">
                        <label for="loteria">Selecciona la lotería:</label>
                        <select id="loteria">
                            <option value="powerball">Powerball</option>
                            <option value="megamillons">Mega Millions</option>
                            <option value="eurojackpot">EuroJackpot</option>
                            <option value="nacional">Lotería Nacional</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="tipo-analisis">Tipo de análisis:</label>
                        <select id="tipo-analisis">
                            <option value="estadistico">Análisis Estadístico</option>
                            <option value="patrones">Detección de Patrones</option>
                            <option value="probabilistico">Análisis Probabilístico</option>
                        </select>
                    </div>
                </form>
                
                <div class="form-actions">
                    <button class="btn" id="analizar-loteria-ia">
                        <span id="analizar-text">🤖 Analizar con IA</span>
                        <span id="analizar-loading" class="loading" style="display: none;"></span>
                    </button>
                </div>
                
                <div class="prediction-result" id="prediction-result" style="display: none; margin-top: 1.5rem;">
                    <div id="resultado-ia"></div>
                </div>

                <div class="historial-loteria" style="margin-top: 2rem;">
                    <h4>📊 Historial de Análisis</h4>
                    <div id="lista-historial" style="max-height: 200px; overflow-y: auto;">
                        ${this.renderHistorial()}
                    </div>
                </div>
            </div>
        `;
    }

    renderHistorial() {
        if (this.historial.length === 0) {
            return '<p style="color: #666; font-style: italic;">Aún no hay análisis realizados.</p>';
        }
        
        return this.historial.slice(-5).reverse().map(item => `
            <div style="background: #f8f9fa; padding: 0.8rem; margin: 0.5rem 0; border-radius: 5px; border-left: 4px solid #4a6fa5;">
                <strong>${item.loteria}</strong> - ${item.fecha}<br>
                <small>${item.prediccion}</small>
            </div>
        `).join('');
    }

    async bindEvents() {
        document.getElementById('analizar-loteria-ia').addEventListener('click', () => this.analizarConIA());
    }

    async analizarConIA() {
        const lotterySelect = document.getElementById('loteria');
        const selectedLottery = lotterySelect.options[lotterySelect.selectedIndex].text;
        const tipoAnalisis = document.getElementById('tipo-analisis').value;
        
        const btn = document.getElementById('analizar-loteria-ia');
        const resultDiv = document.getElementById('prediction-result');
        const resultadoDiv = document.getElementById('resultado-ia');
        
        // Mostrar loading
        btn.disabled = true;
        document.getElementById('analizar-text').style.display = 'none';
        document.getElementById('analizar-loading').style.display = 'inline-block';
        resultDiv.style.display = 'block';
        resultadoDiv.innerHTML = '<div style="text-align: center;">🔄 La IA está analizando patrones estadísticos...</div>';

        try {
            const prompt = `Como experto en análisis estadístico de juegos de lotería, analiza la ${selectedLottery} considerando ${tipoAnalisis}.

            Proporciona:
            1. 3 números principales sugeridos (entre 1 y 100)
            2. Breve explicación del análisis
            3. Probabilidad estimada
            4. Recomendación basada en datos históricos

            Formato de respuesta claro y directo.`;

            const response = await fetch('/api/ia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta de la IA');
            }

            const data = await response.json();
            
            // Guardar en historial
            const analisis = {
                loteria: selectedLottery,
                fecha: new Date().toLocaleString('es-ES'),
                prediccion: data.resultado.substring(0, 100) + '...',
                completo: data.resultado
            };
            
            this.historial.push(analisis);
            storage.set('historial_loteria', this.historial);
            
            resultadoDiv.innerHTML = `
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 1.5rem; border-radius: 10px;">
                    <h4 style="margin-top: 0;">🎯 Análisis IA - ${selectedLottery}</h4>
                    <div style="white-space: pre-wrap; font-size: 0.95em;">${data.resultado}</div>
                </div>
                <p style="margin-top: 1rem; font-size: 0.8em; color: #666;">
                    ⚠️ Análisis con fines educativos. Juega responsablemente.
                </p>
            `;

            // Actualizar historial
            document.getElementById('lista-historial').innerHTML = this.renderHistorial();

        } catch (error) {
            console.error('Error:', error);
            resultadoDiv.innerHTML = `
                <div style="background: #ffebee; color: #c62828; padding: 1rem; border-radius: 5px;">
                    <strong>❌ Error de conexión con IA</strong>
                    <p>Usando análisis local...</p>
                </div>
            `;
            
            // Fallback local
            setTimeout(() => {
                this.analisisLocal(selectedLottery, resultadoDiv);
            }, 1000);
        } finally {
            // Restaurar botón
            btn.disabled = false;
            document.getElementById('analizar-text').style.display = 'inline-block';
            document.getElementById('analizar-loading').style.display = 'none';
        }
    }

    analisisLocal(loteria, resultadoDiv) {
        const numeros = [
            Math.floor(Math.random() * 50) + 1,
            Math.floor(Math.random() * 50) + 51,
            Math.floor(Math.random() * 50) + 1
        ];
        
        const analisis = {
            loteria: loteria,
            fecha: new Date().toLocaleString('es-ES'),
            prediccion: `Números: ${numeros.join(', ')}...`,
            completo: `Números sugeridos: ${numeros.join(', ')} (Análisis local)`
        };
        
        this.historial.push(analisis);
        storage.set('historial_loteria', this.historial);
        
        resultadoDiv.innerHTML = `
            <div style="background: #e3f2fd; color: #1565c0; padding: 1.5rem; border-radius: 10px;">
                <h4 style="margin-top: 0;">🔍 Análisis Local - ${loteria}</h4>
                <div class="prediction-number" style="font-size: 2rem; font-weight: bold; text-align: center; margin: 1rem 0;">
                    ${numeros.join(' - ')}
                </div>
                <p>Números generados aleatoriamente (modo offline).</p>
            </div>
        `;
        
        document.getElementById('lista-historial').innerHTML = this.renderHistorial();
    }
}

// Submódulo de Consejos con IA
class ConsejosSubmodule {
    constructor() {
        this.name = 'consejos';
        this.consejosGuardados = storage.get('consejos_guardados', []);
    }

    async render() {
        return `
            <div class="submodule" style="margin-top: 2rem;">
                <h3>💡 Consejos Diarios con IA</h3>
                <p>Recibe consejos personalizados generados por inteligencia artificial.</p>
                
                <div class="form-grid">
                    <div class="form-group">
                        <label for="tema-consejo">Tema del consejo:</label>
                        <select id="tema-consejo">
                            <option value="productividad">Productividad</option>
                            <option value="salud">Salud y Bienestar</option>
                            <option value="motivacion">Motivación</option>
                            <option value="trabajo">Trabajo y Carrera</option>
                            <option value="tecnologia">Tecnología</option>
                            <option value="personalizado">Personalizado</option>
                        </select>
                    </div>
                    <div class="form-group" id="consejo-personalizado-group" style="display: none;">
                        <label for="consejo-personalizado">Describe lo que necesitas:</label>
                        <input type="text" id="consejo-personalizado" placeholder="Ej: cómo organizar mi tiempo...">
                    </div>
                </div>

                <div class="form-actions">
                    <button class="btn" id="generar-consejo">
                        <span id="consejo-text">✨ Generar Consejo IA</span>
                        <span id="consejo-loading" class="loading" style="display: none;"></span>
                    </button>
                </div>
                
                <div id="consejo-actual" style="
                    background: linear-gradient(135deg, #4fc3a1 0%, #4a6fa5 100%);
                    color: white;
                    padding: 2rem;
                    border-radius: 10px;
                    margin: 1.5rem 0;
                    text-align: center;
                    font-size: 1.1em;
                    min-height: 150px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    display: none;
                ">
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-secondary" id="guardar-consejo" style="display: none;">💾 Guardar Consejo</button>
                    <button class="btn" id="nuevo-consejo" style="display: none;">🔄 Nuevo Consejo</button>
                </div>
                
                <div id="consejos-guardados" style="margin-top: 2rem;">
                    <h4>📋 Tus Consejos Guardados</h4>
                    <div id="lista-consejos" style="margin-top: 1rem; max-height: 300px; overflow-y: auto;">
                        ${this.renderConsejosGuardados()}
                    </div>
                </div>
            </div>
        `;
    }

    renderConsejosGuardados() {
        if (this.consejosGuardados.length === 0) {
            return '<p style="color: #666; font-style: italic;">Aún no has guardado ningún consejo.</p>';
        }
        
        return this.consejosGuardados.map((consejo, index) => `
            <div style="
                background: #f8f9fa;
                padding: 1rem;
                margin: 0.5rem 0;
                border-radius: 5px;
                border-left: 4px solid #4fc3a1;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <span>${consejo}</span>
                <button class="btn btn-danger" onclick="consejosModule.eliminarConsejo(${index})" style="padding: 0.3rem 0.6rem; font-size: 0.8em;">🗑️ Eliminar</button>
            </div>
        `).join('');
    }

    async bindEvents() {
        document.getElementById('generar-consejo').addEventListener('click', () => this.generarConsejoIA());
        document.getElementById('guardar-consejo').addEventListener('click', () => this.guardarConsejo());
        document.getElementById('nuevo-consejo').addEventListener('click', () => this.mostrarFormulario());
        
        // Mostrar/ocultar campo personalizado
        document.getElementById('tema-consejo').addEventListener('change', (e) => {
            const grupoPersonalizado = document.getElementById('consejo-personalizado-group');
            grupoPersonalizado.style.display = e.target.value === 'personalizado' ? 'block' : 'none';
        });

        this.mostrarFormulario();
    }

    mostrarFormulario() {
        document.getElementById('consejo-actual').style.display = 'none';
        document.getElementById('guardar-consejo').style.display = 'none';
        document.getElementById('nuevo-consejo').style.display = 'none';
        document.getElementById('generar-consejo').style.display = 'block';
    }

    async generarConsejoIA() {
        const tema = document.getElementById('tema-consejo').value;
        const personalizado = document.getElementById('consejo-personalizado').value;
        
        const btn = document.getElementById('generar-consejo');
        const consejoActual = document.getElementById('consejo-actual');
        
        // Mostrar loading
        btn.disabled = true;
        document.getElementById('consejo-text').style.display = 'none';
        document.getElementById('consejo-loading').style.display = 'inline-block';
        
        try {
            let prompt = "Genera un consejo práctico y motivador ";
            
            if (tema === 'personalizado' && personalizado) {
                prompt += `sobre: "${personalizado}". `;
            } else {
                const temas = {
                    'productividad': 'sobre productividad y gestión del tiempo',
                    'salud': 'sobre salud y bienestar en el trabajo',
                    'motivacion': 'motivacional para mantener el enfoque',
                    'trabajo': 'sobre desarrollo profesional y trabajo',
                    'tecnologia': 'sobre el uso efectivo de la tecnología'
                };
                prompt += temas[tema] + '. ';
            }
            
            prompt += "El consejo debe ser:\n- Práctico y aplicable inmediatamente\n- Breve (máximo 2 párrafos)\n- Incluir un emoji relevante\n- Lenguaje motivador pero realista\n- Responde solo con el consejo, sin explicaciones adicionales";

            const response = await fetch('/api/ia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta de la IA');
            }

            const data = await response.json();
            
            // Mostrar consejo
            consejoActual.innerHTML = data.resultado;
            consejoActual.style.display = 'flex';
            document.getElementById('guardar-consejo').style.display = 'inline-block';
            document.getElementById('nuevo-consejo').style.display = 'inline-block';
            document.getElementById('generar-consejo').style.display = 'none';

        } catch (error) {
            console.error('Error:', error);
            // Fallback a consejos locales
            this.generarConsejoLocal();
        } finally {
            // Restaurar botón
            btn.disabled = false;
            document.getElementById('consejo-text').style.display = 'inline-block';
            document.getElementById('consejo-loading').style.display = 'none';
        }
    }

    generarConsejoLocal() {
        const consejosLocales = [
            "💡 Tómate 5 minutos para estirarte cada hora de trabajo. Tu cuerpo y mente te lo agradecerán.",
            "🌿 Sal a caminar 10 minutos al aire libre. El cambio de ambiente recarga tu creatividad.",
            "📚 Lee algo no relacionado con tu trabajo por 15 minutos al día. Amplía tus perspectivas.",
            "💧 Mantente hidratado - toma un vaso de agua ahora mismo. La hidratación mejora la concentración.",
            "🎵 Escucha música instrumental mientras trabajas. Puede mejorar tu enfoque y productividad.",
            "📝 Prioriza: haz una lista de solo 3 cosas importantes para hoy y cúmplelas antes que nada.",
            "🌅 Comienza tu día con 5 minutos de silencio y planificación. Un buen inicio define el día.",
            "🔄 Toma descansos cortos cada 45-50 minutos. Tu cerebro necesita pausas para mantener el rendimiento."
        ];
        
        const consejoActual = document.getElementById('consejo-actual');
        const consejoAleatorio = consejosLocales[Math.floor(Math.random() * consejosLocales.length)];
        
        consejoActual.innerHTML = consejoAleatorio;
        consejoActual.style.display = 'flex';
        document.getElementById('guardar-consejo').style.display = 'inline-block';
        document.getElementById('nuevo-consejo').style.display = 'inline-block';
        document.getElementById('generar-consejo').style.display = 'none';
    }

    guardarConsejo() {
        const consejoActual = document.getElementById('consejo-actual').textContent;
        
        if (!this.consejosGuardados.includes(consejoActual)) {
            this.consejosGuardados.push(consejoActual);
            storage.set('consejos_guardados', this.consejosGuardados);
            
            // Actualizar lista
            document.getElementById('lista-consejos').innerHTML = this.renderConsejosGuardados();
            
            // Feedback visual
            const btn = document.getElementById('guardar-consejo');
            const originalText = btn.textContent;
            btn.textContent = '✅ Guardado!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }
    }

    eliminarConsejo(index) {
        this.consejosGuardados.splice(index, 1);
        storage.set('consejos_guardados', this.consejosGuardados);
        document.getElementById('lista-consejos').innerHTML = this.renderConsejosGuardados();
    }
}

// Submódulo de Juegos con IA
class JuegosSubmodule {
    constructor() {
        this.name = 'juegos';
    }

    async render() {
        return `
            <div class="submodule" style="margin-top: 2rem;">
                <h3>🎮 Juegos con Asistencia de IA</h3>
                <p>Juegos interactivos donde la IA participa o asiste.</p>
                
                <div class="modules-grid" style="margin-top: 1.5rem;">
                    <div class="module-card" data-juego="trivia">
                        <div class="module-icon">❓</div>
                        <h3>Trivia con IA</h3>
                        <p>Preguntas y respuestas generadas por IA.</p>
                        <button class="btn">Jugar</button>
                    </div>
                    
                    <div class="module-card" data-juego="adivina">
                        <div class="module-icon">🎯</div>
                        <h3>Adivina con IA</h3>
                        <p>La IA adivina lo que estás pensando.</p>
                        <button class="btn">Jugar</button>
                    </div>
                </div>
                
                <div id="juego-container" style="margin-top: 2rem;"></div>
            </div>
        `;
    }

    async bindEvents() {
        document.querySelectorAll('[data-juego]').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const juego = card.getAttribute('data-juego');
                this.cargarJuego(juego);
            });
        });
    }

    async cargarJuego(juego) {
        const container = document.getElementById('juego-container');
        
        switch(juego) {
            case 'trivia':
                container.innerHTML = this.renderTrivia();
                await this.iniciarTrivia();
                break;
            case 'adivina':
                container.innerHTML = this.renderAdivina();
                await this.iniciarAdivina();
                break;
        }
    }

    renderTrivia() {
        return `
            <div class="juego-trivia">
                <h4>❓ Trivia con IA</h4>
                <p>Responde preguntas generadas por inteligencia artificial.</p>
                
                <div class="form-actions">
                    <button class="btn" id="generar-pregunta">🎲 Generar Pregunta</button>
                </div>
                
                <div id="pregunta-trivia" style="
                    background: #e3f2fd;
                    padding: 1.5rem;
                    border-radius: 10px;
                    margin: 1rem 0;
                    display: none;
                "></div>
                
                <div id="opciones-trivia" style="display: none;"></div>
                
                <div id="resultado-trivia" style="margin-top: 1rem;"></div>
            </div>
        `;
    }

    async iniciarTrivia() {
        document.getElementById('generar-pregunta').addEventListener('click', () => this.generarPreguntaIA());
    }

    async generarPreguntaIA() {
        const btn = document.getElementById('generar-pregunta');
        const preguntaDiv = document.getElementById('pregunta-trivia');
        const opcionesDiv = document.getElementById('opciones-trivia');
        const resultadoDiv = document.getElementById('resultado-trivia');
        
        btn.disabled = true;
        btn.textContent = '🔄 Generando...';
        preguntaDiv.style.display = 'block';
        preguntaDiv.innerHTML = '<div style="text-align: center;">La IA está creando una pregunta...</div>';
        opcionesDiv.innerHTML = '';
        resultadoDiv.innerHTML = '';

        try {
            const prompt = `Genera una pregunta de trivia interesante sobre cualquier tema (ciencia, historia, cultura, etc.) con 4 opciones de respuesta y marca la correcta.

Formato exacto:
PREGUNTA: [la pregunta aquí]
A) [opción A]
B) [opción B]
C) [opción C]
D) [opción D]
RESPUESTA: [letra de la respuesta correcta]`;

            const response = await fetch('/api/ia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta de la IA');
            }

            const data = await response.json();
            this.mostrarPreguntaTrivia(data.resultado);

        } catch (error) {
            console.error('Error:', error);
            preguntaDiv.innerHTML = '<div style="color: red;">Error generando pregunta. Intenta nuevamente.</div>';
        } finally {
            btn.disabled = false;
            btn.textContent = '🎲 Generar Pregunta';
        }
    }

    mostrarPreguntaTrivia(texto) {
        const lineas = texto.split('\n');
        let pregunta = '';
        const opciones = {};
        let respuestaCorrecta = '';

        lineas.forEach(linea => {
            if (linea.startsWith('PREGUNTA:')) {
                pregunta = linea.replace('PREGUNTA:', '').trim();
            } else if (linea.match(/^[A-D]\)/)) {
                const letra = linea[0];
                opciones[letra] = linea.substring(3).trim();
            } else if (linea.startsWith('RESPUESTA:')) {
                respuestaCorrecta = linea.replace('RESPUESTA:', '').trim();
            }
        });

        const preguntaDiv = document.getElementById('pregunta-trivia');
        const opcionesDiv = document.getElementById('opciones-trivia');
        
        preguntaDiv.innerHTML = `<strong>${pregunta}</strong>`;
        opcionesDiv.style.display = 'block';
        opcionesDiv.innerHTML = Object.keys(opciones).map(letra => `
            <button class="btn btn-secondary" style="display: block; width: 100%; margin: 0.5rem 0; text-align: left;" 
                    onclick="juegosModule.verificarRespuesta('${letra}', '${respuestaCorrecta}')">
                ${letra}) ${opciones[letra]}
            </button>
        `).join('');

        // Guardar respuesta correcta
        window.respuestaCorrecta = respuestaCorrecta;
    }

    verificarRespuesta(respuestaUsuario, respuestaCorrecta) {
        const resultadoDiv = document.getElementById('resultado-trivia');
        
        if (respuestaUsuario === respuestaCorrecta) {
            resultadoDiv.innerHTML = '<div style="color: green; font-weight: bold;">✅ ¡Correcto! Bien hecho.</div>';
        } else {
            resultadoDiv.innerHTML = `<div style="color: red;">❌ Incorrecto. La respuesta correcta era: ${respuestaCorrecta}</div>`;
        }
    }

    renderAdivina() {
        return `
            <div class="juego-adivina">
                <h4>🎯 Adivina con IA</h4>
                <p>Piensa en algo y la IA intentará adivinarlo haciendo preguntas.</p>
                
                <div class="form-actions">
                    <button class="btn" id="iniciar-adivina">🎮 Iniciar Juego</button>
                </div>
                
                <div id="chat-adivina" style="
                    background: #f5f5f5;
                    padding: 1rem;
                    border-radius: 10px;
                    margin: 1rem 0;
                    min-height: 200px;
                    max-height: 400px;
                    overflow-y: auto;
                    display: none;
                "></div>
                
                <div id="input-adivina" style="display: none;">
                    <input type="text" id="respuesta-usuario" placeholder="Tu respuesta..." style="width: 70%; padding: 0.5rem;">
                    <button class="btn" id="enviar-respuesta">Enviar</button>
                </div>
            </div>
        `;
    }

    async iniciarAdivina() {
        document.getElementById('iniciar-adivina').addEventListener('click', () => this.iniciarJuegoAdivina());
    }

    async iniciarJuegoAdivina() {
        const chatDiv = document.getElementById('chat-adivina');
        const inputDiv = document.getElementById('input-adivina');
        const btnIniciar = document.getElementById('iniciar-adivina');
        
        btnIniciar.disabled = true;
        btnIniciar.textContent = '🎮 Iniciando...';
        chatDiv.style.display = 'block';
        chatDiv.innerHTML = '<div>🔄 La IA se está preparando...</div>';

        try {
            const prompt = `Inicia un juego de "Adivina lo que estoy pensando". Comienza haciendo una pregunta sí/no para adivinar en qué estoy pensando. Responde solo con tu primera pregunta.`;

            const response = await fetch('/api/ia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta de la IA');
            }

            const data = await response.json();
            
            chatDiv.innerHTML = `
                <div style="background: #e3f2fd; padding: 0.8rem; margin: 0.5rem 0; border-radius: 10px; border-bottom-right-radius: 0;">
                    <strong>IA:</strong> ${data.resultado}
                </div>
            `;
            
            inputDiv.style.display = 'block';
            document.getElementById('enviar-respuesta').addEventListener('click', () => this.procesarRespuestaAdivina());

        } catch (error) {
            console.error('Error:', error);
            chatDiv.innerHTML += '<div style="color: red;">Error iniciando el juego.</div>';
        } finally {
            btnIniciar.disabled = false;
            btnIniciar.textContent = '🎮 Reiniciar Juego';
        }
    }

    async procesarRespuestaAdivina() {
        const respuestaInput = document.getElementById('respuesta-usuario');
        const respuesta = respuestaInput.value.trim();
        const chatDiv = document.getElementById('chat-adivina');
        
        if (!respuesta) return;

        // Agregar respuesta del usuario al chat
        chatDiv.innerHTML += `
            <div style="background: #4fc3a1; color: white; padding: 0.8rem; margin: 0.5rem 0; border-radius: 10px; border-bottom-left-radius: 0; margin-left: 20%;">
                <strong>Tú:</strong> ${respuesta}
            </div>
        `;

        respuestaInput.value = '';

        try {
            const prompt = `En el juego de adivinar, el usuario respondió: "${respuesta}". Continúa el juego haciendo otra pregunta sí/no para acercarte a adivinar lo que está pensando. Responde solo con tu siguiente pregunta.`;

            const response = await fetch('/api/ia', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });

            if (!response.ok) {
                throw new Error('Error en la respuesta de la IA');
            }

            const data = await response.json();
            
            chatDiv.innerHTML += `
                <div style="background: #e3f2fd; padding: 0.8rem; margin: 0.5rem 0; border-radius: 10px; border-bottom-right-radius: 0;">
                    <strong>IA:</strong> ${data.resultado}
                </div>
            `;

            chatDiv.scrollTop = chatDiv.scrollHeight;

        } catch (error) {
            console.error('Error:', error);
            chatDiv.innerHTML += '<div style="color: red;">Error en la conversación con IA.</div>';
        }
    }
}

// Instancias globales para los event handlers
window.consejosModule = new ConsejosSubmodule();
window.juegosModule = new JuegosSubmodule();