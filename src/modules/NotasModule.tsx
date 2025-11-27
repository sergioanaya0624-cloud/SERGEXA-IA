import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Save, Download, Trash2, Play, Square, Sparkles, Clock, FileText, Key } from 'lucide-react';

export default function NotasModule({ setModule }: { setModule: (m: string) => void }) {
  const [grabando, setGrabando] = useState(false);
  const [tiempoGrabacion, setTiempoGrabacion] = useState(0);
  const [notasProcesadas, setNotasProcesadas] = useState('');
  const [cargando, setCargando] = useState(false);
  const [grabaciones, setGrabaciones] = useState<any[]>([]);
  const [reproduciendo, setReproduciendo] = useState<string | null>(null);
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [apiKey, setApiKey] = useState('sk-Q9NCAcxHjRbuTYoCCiakwMSz3pqgSNU4artgZ0yRwbT3BlbkFJehTMh0WdV-LNOz4bVtt8Zav7TtCeUulChsA_-b52EA');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervaloRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar grabaciones guardadas al iniciar
  useEffect(() => {
    const guardadas = localStorage.getItem('grabaciones-reuniones');
    if (guardadas) {
      setGrabaciones(JSON.parse(guardadas));
    }
  }, []);

  // Formatear tiempo
  const formatearTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Función para transcribir audio usando Whisper API
  const transcribirAudioConWhisper = async (audioBlob: Blob): Promise<string> => {
    try {
      console.log('Iniciando transcripción con Whisper API...');
      
      const formData = new FormData();
      
      // Crear archivo de audio para la API
      const audioFile = new File([audioBlob], 'grabacion.wav', { 
        type: 'audio/wav'
      });
      
      formData.append('file', audioFile);
      formData.append('model', 'whisper-1');
      formData.append('language', 'es');
      formData.append('response_format', 'text');

      console.log('Enviando solicitud a Whisper API...');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error de API:', errorData);
        throw new Error(errorData.error?.message || `Error ${response.status}: ${response.statusText}`);
      }

      const transcription = await response.text();
      console.log('Transcripción exitosa:', transcription.substring(0, 100) + '...');
      return transcription;

    } catch (error: any) {
      console.error('Error en transcripción:', error);
      throw new Error(`Error al transcribir audio: ${error.message}`);
    }
  };

  // Función mejorada para procesar audio con IA
  const procesarAudio = async (grabacion: any) => {
    if (!apiKey || apiKey.includes('tu-api-key')) {
      setNotasProcesadas('❌ Error: Configura tu API Key de OpenAI primero\n\n🔧 Ve a "Configurar API" e ingresa tu clave');
      return;
    }

    setCargando(true);
    setNotasProcesadas('🎙️ Iniciando proceso de transcripción...\n\n📊 Paso 1/2: Transcribiendo audio a texto\n⏳ Esto puede tomar unos segundos...');

    try {
      // Paso 1: Transcribir audio a texto usando Whisper
      const textoTranscrito = await transcribirAudioConWhisper(grabacion.blob);
      
      if (!textoTranscrito || textoTranscrito.trim().length < 10) {
        throw new Error('La transcripción está vacía o es muy corta. Intenta grabar nuevamente con audio más claro.');
      }

      setNotasProcesadas(prev => prev + '\n\n✅ Transcripción completada!\n\n🤖 Paso 2/2: Analizando contenido con IA...\n📝 Generando notas estructuradas...');

      // Paso 2: Enviar texto transcrito a Groq para análisis estructurado
      const groqApiKey = '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';
      
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          temperature: 0.3,
          max_tokens: 2000,
          messages: [
            {
              role: 'system',
              content: `Eres un asistente profesional de reuniones. Analiza el texto transcrito y genera un reporte estructurado con:

🎯 **INFORMACIÓN BÁSICA**
• Duración de la reunión
• Participantes identificados
• Tema principal

📋 **RESUMEN EJECUTIVO**
[2-3 párrafos con los puntos más importantes]

🎯 **PUNTOS CLAVE DESTACADOS**
• [Lista de puntos importantes con emojis]
• [Decisiones tomadas] 
• [Hallazgos relevantes]

🚀 **ACCIONES Y TAREAS**
[Persona/Responsable] → [Acción específica] → [Fecha/Plazo]

📌 **PRÓXIMOS PASOS**
• [Acciones inmediatas]
• [Seguimientos requeridos]

💡 **OBSERVACIONES**
- Aspectos importantes a recordar
- Contexto adicional relevante

Usa un formato claro, profesional y fácil de leer.`
            },
            {
              role: 'user',
              content: `Por favor analiza esta transcripción de reunión de ${formatearTiempo(grabacion.duracion)} de duración:\n\n"${textoTranscrito}"`
            }
          ]
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Error en el análisis de contenido');
      }

      const data = await res.json();
      
      const analisisCompleto = `🎙️ **REUNIÓN ANALIZADA**\n📅 ${grabacion.fecha}\n⏱️ Duración: ${formatearTiempo(grabacion.duracion)}\n\n---\n\n📝 **TRANSCRIPCIÓN ORIGINAL**\n"${textoTranscrito}"\n\n---\n\n🤖 **ANÁLISIS ESTRUCTURADO**\n${data.choices[0].message.content}\n\n---\n\n✅ **Proceso completado exitosamente**`;
      
      setNotasProcesadas(analisisCompleto);

    } catch (error: any) {
      console.error('Error completo:', error);
      setNotasProcesadas(`❌ Error en el proceso:\n\n${error.message}\n\n🔧 **Solución de problemas:**\n• Verifica tu conexión a internet\n• Asegúrate de que el audio sea claro y audible\n• La grabación debe tener al menos 10 segundos\n• Verifica que tu API Key sea válida\n• Intenta grabar nuevamente en un ambiente silencioso`);
    }
    setCargando(false);
  };

  // Iniciar grabación
  const iniciarGrabacion = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        const nuevaGrabacion = {
          id: Date.now().toString(),
          url,
          duracion: tiempoGrabacion,
          fecha: new Date().toLocaleString('es-CO'),
          blob: blob
        };

        setGrabaciones(prev => {
          const actualizadas = [nuevaGrabacion, ...prev];
          localStorage.setItem('grabaciones-reuniones', JSON.stringify(actualizadas));
          return actualizadas;
        });

        setTiempoGrabacion(0);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // Colectar datos cada segundo
      setGrabando(true);

      intervaloRef.current = setInterval(() => {
        setTiempoGrabacion(prev => prev + 1);
      }, 1000);

    } catch (error) {
      alert('❌ Error al acceder al micrófono. Por favor:\n• Asegúrate de permitir el acceso al micrófono\n• Verifica que tu micrófono funcione correctamente\n• Intenta en un navegador diferente');
    }
  };

  // Detener grabación
  const detenerGrabacion = () => {
    if (mediaRecorderRef.current && grabando) {
      mediaRecorderRef.current.stop();
      setGrabando(false);
      if (intervaloRef.current) {
        clearInterval(intervaloRef.current);
      }
    }
  };

  // Reproducir audio
  const reproducirAudio = (url: string, id: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const audio = new Audio(url);
    audioRef.current = audio;
    
    audio.onended = () => setReproduciendo(null);
    audio.onerror = () => {
      setReproduciendo(null);
      alert('Error al reproducir el audio');
    };
    
    audio.play().catch(error => {
      console.error('Error reproduciendo audio:', error);
      setReproduciendo(null);
    });
    
    setReproduciendo(id);
  };

  // Detener reproducción
  const detenerReproduccion = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setReproduciendo(null);
  };

  // Eliminar grabación
  const eliminarGrabacion = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar esta grabación?')) {
      setGrabaciones(prev => {
        const actualizadas = prev.filter(g => g.id !== id);
        localStorage.setItem('grabaciones-reuniones', JSON.stringify(actualizadas));
        return actualizadas;
      });
      
      if (reproduciendo === id) {
        detenerReproduccion();
      }
    }
  };

  // Descargar notas
  const descargarNotas = () => {
    if (!notasProcesadas || notasProcesadas.includes('Las notas procesadas aparecerán aquí...')) {
      alert('No hay notas para descargar');
      return;
    }

    const blob = new Blob([notasProcesadas], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notas-reunion-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Guardar API Key
  const guardarApiKey = () => {
    if (apiKey && !apiKey.includes('tu-api-key')) {
      localStorage.setItem('openai-api-key', apiKey);
      setMostrarConfig(false);
      alert('✅ API Key guardada correctamente');
    } else {
      alert('❌ Por favor ingresa una API Key válida');
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1400px', 
      margin: '0 auto',
      minHeight: '100vh',
      background: 'white'
    }}>
      {/* HEADER */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '2rem',
        borderBottom: '2px solid #f0f0f0',
        paddingBottom: '1rem'
      }}>
        <h2 style={{ 
          fontSize: '2.4rem', 
          color: '#166088', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '15px',
          margin: 0
        }}>
          <Sparkles size={40} style={{ color: '#9b59b6' }} />
          Asistente de Reuniones con IA
        </h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => setMostrarConfig(!mostrarConfig)}
            style={{
              background: '#9b59b6',
              color: 'white',
              border: 'none',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}
          >
            <Key size={18} />
            Configurar API
          </button>
          
          <button 
            onClick={() => setModule('inicio')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '2.5rem', 
              cursor: 'pointer', 
              color: '#999' 
            }}
          >
            ×
          </button>
        </div>
      </div>

      {/* CONFIGURACIÓN DE API */}
      {mostrarConfig && (
        <div style={{
          background: '#fff3cd',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          border: '2px solid #ffeaa7'
        }}>
          <h3 style={{ color: '#856404', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Key size={24} />
            Configuración de API Key
          </h3>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Pega tu API Key de OpenAI aquí"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '1rem',
                marginBottom: '1rem'
              }}
            />
            <div style={{ fontSize: '0.9rem', color: '#666' }}>
              🔒 Tu API Key se guarda localmente en tu navegador
            </div>
          </div>
          <button
            onClick={guardarApiKey}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Guardar API Key
          </button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* COLUMNA IZQUIERDA - GRABACIÓN Y HISTORIAL */}
        <div>
          {/* CONTROLES DE GRABACIÓN */}
          <div style={{ 
            background: '#f8f9fa', 
            padding: '2rem', 
            borderRadius: '16px', 
            marginBottom: '2rem',
            border: '2px solid #e9ecef',
            textAlign: 'center'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div style={{
                background: grabando ? '#e74c3c' : '#2ecc71',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Clock size={20} />
                {formatearTiempo(tiempoGrabacion)}
              </div>
              
              {!grabando ? (
                <button
                  onClick={iniciarGrabacion}
                  style={{
                    background: '#2ecc71',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 'bold'
                  }}
                >
                  <Mic size={20} />
                  Iniciar Grabación
                </button>
              ) : (
                <button
                  onClick={detenerGrabacion}
                  style={{
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: 'bold'
                  }}
                >
                  <Square size={20} />
                  Detener Grabación
                </button>
              )}
            </div>
            <p style={{ color: '#666', margin: 0, fontSize: '0.9rem' }}>
              {grabando ? '🎙️ Grabando... Habla claro y cerca del micrófono' : '⏺️ Haz clic para empezar a grabar tu reunión'}
            </p>
          </div>

          {/* HISTORIAL DE GRABACIONES */}
          <h3 style={{ color: '#166088', marginBottom: '1rem', display: 'flex', alignItems: 'center' }}>
            <FileText size={24} style={{ marginRight: '10px' }} />
            Grabaciones Anteriores
          </h3>
          
          <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
            {grabaciones.length === 0 ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem', 
                color: '#999',
                background: '#f8f9fa',
                borderRadius: '8px',
                border: '2px dashed #ddd'
              }}>
                <Mic size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                <div>No hay grabaciones guardadas</div>
                <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Inicia una grabación para comenzar</div>
              </div>
            ) : (
              grabaciones.map(grabacion => (
                <div key={grabacion.id} style={{
                  background: 'white',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '0.5rem',
                  border: '1px solid #e9ecef',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', color: '#333', fontSize: '0.9rem' }}>
                      {grabacion.fecha}
                    </div>
                    <div style={{ color: '#666', fontSize: '0.8rem' }}>
                      ⏱️ {formatearTiempo(grabacion.duracion)}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {reproduciendo === grabacion.id ? (
                      <button
                        onClick={detenerReproduccion}
                        style={{
                          background: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Square size={14} />
                      </button>
                    ) : (
                      <button
                        onClick={() => reproducirAudio(grabacion.url, grabacion.id)}
                        style={{
                          background: '#3498db',
                          color: 'white',
                          border: 'none',
                          padding: '6px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Play size={14} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => procesarAudio(grabacion)}
                      disabled={cargando}
                      style={{
                        background: cargando ? '#95a5a6' : '#9b59b6',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: cargando ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Sparkles size={14} />
                    </button>
                    
                    <button
                      onClick={() => eliminarGrabacion(grabacion.id)}
                      style={{
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA - NOTAS PROCESADAS */}
        <div>
          <h3 style={{ color: '#166088', marginBottom: '1rem' }}>
            Notas Procesadas {cargando && '⏳'}
          </h3>
          
          <div style={{
            background: '#f8f9fa',
            padding: '2rem',
            borderRadius: '16px',
            minHeight: '500px',
            border: '2px dashed #ddd',
            whiteSpace: 'pre-wrap',
            lineHeight: '1.6',
            fontSize: '1rem',
            overflowY: 'auto',
            maxHeight: '500px'
          }}>
            {notasProcesadas || 'Las notas procesadas aparecerán aquí...\n\n💡 Para comenzar:\n1. Graba una reunión con el botón "Iniciar Grabación"\n2. Selecciona una grabación y haz clic en el botón ✨\n3. Obtén notas estructuradas automáticamente'}
          </div>
          
          {notasProcesadas && !notasProcesadas.includes('Las notas procesadas aparecerán aquí...') && (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <button
                onClick={descargarNotas}
                style={{
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 'bold'
                }}
              >
                <Download size={20} />
                Descargar Notas
              </button>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(notasProcesadas);
                  alert('✅ Notas copiadas al portapapeles');
                }}
                style={{
                  background: '#9b59b6',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 'bold'
                }}
              >
                <Save size={20} />
                Copiar Texto
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}