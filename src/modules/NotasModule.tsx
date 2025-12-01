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
  const [apiKey, setApiKey] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervaloRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar grabaciones y API Key al iniciar
  useEffect(() => {
    const guardadas = localStorage.getItem('grabaciones-reuniones');
    if (guardadas) setGrabaciones(JSON.parse(guardadas));

    const keyGuardada = localStorage.getItem('openai-api-key');
    if (keyGuardada) setApiKey(keyGuardada);
  }, []);

  // Formatear tiempo en mm:ss
  const formatearTiempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const secs = segundos % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Transcripción con Whisper
  const transcribirAudioConWhisper = async (audioBlob: Blob): Promise<string> => {
    const formData = new FormData();
    const audioFile = new File([audioBlob], 'grabacion.wav', { type: 'audio/wav' });
    formData.append('file', audioFile);
    formData.append('model', 'whisper-1');
    formData.append('language', 'es');
    formData.append('response_format', 'text');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}` },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.text();
  };

  // Procesar grabación con IA
  const procesarAudio = async (grabacion: any) => {
    if (!apiKey || apiKey.includes('tu-api-key')) {
      setNotasProcesadas('❌ Error: Configura tu API Key de OpenAI primero');
      return;
    }

    setCargando(true);
    setNotasProcesadas('🎙️ Iniciando transcripción...\n⏳ Espere unos segundos...');

    try {
      // 1️⃣ Transcribir audio
      const textoTranscrito = await transcribirAudioConWhisper(grabacion.blob);
      if (!textoTranscrito || textoTranscrito.trim().length < 10) {
        throw new Error('La transcripción está vacía o muy corta.');
      }

      setNotasProcesadas(prev => prev + '\n✅ Transcripción completada\n🤖 Analizando con IA...');

      // 2️⃣ Enviar a Groq/LLama para análisis
      const groqApiKey = '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';
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${groqApiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          temperature: 0.3,
          max_tokens: 2000,
          messages: [
            {
              role: 'system',
              content: `Eres un asistente profesional de reuniones. Analiza la transcripción y genera un reporte con:
🎯 INFORMACIÓN BÁSICA (Duración, Participantes, Tema)
📋 RESUMEN EJECUTIVO
🎯 PUNTOS CLAVE DESTACADOS
🚀 ACCIONES Y TAREAS
📌 PRÓXIMOS PASOS
💡 OBSERVACIONES
Usa formato claro y profesional.`
            },
            { role: 'user', content: `Transcripción de ${formatearTiempo(grabacion.duracion)}:\n"${textoTranscrito}"` }
          ]
        })
      });

      if (!res.ok) throw new Error('Error en análisis de contenido');

      const data = await res.json();
      const analisisCompleto = `🎙️ REUNIÓN ANALIZADA\n📅 ${grabacion.fecha}\n⏱️ Duración: ${formatearTiempo(grabacion.duracion)}\n\n---\n📝 TRANSCRIPCIÓN ORIGINAL\n"${textoTranscrito}"\n\n---\n🤖 ANÁLISIS ESTRUCTURADO\n${data.choices[0].message.content}\n\n---\n✅ Proceso completado`;
      setNotasProcesadas(analisisCompleto);

    } catch (error: any) {
      setNotasProcesadas(`❌ Error:\n${error.message}`);
    }

    setCargando(false);
  };

  // Iniciar grabación
  const iniciarGrabacion = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 } });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const nuevaGrabacion = { id: Date.now().toString(), url, duracion: tiempoGrabacion, fecha: new Date().toLocaleString('es-CO'), blob };
        setGrabaciones(prev => { const arr = [nuevaGrabacion, ...prev]; localStorage.setItem('grabaciones-reuniones', JSON.stringify(arr)); return arr; });
        setTiempoGrabacion(0);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000);
      setGrabando(true);
      intervaloRef.current = setInterval(() => setTiempoGrabacion(prev => prev + 1), 1000);

    } catch (error) {
      alert('❌ Error al acceder al micrófono.');
    }
  };

  // Detener grabación
  const detenerGrabacion = () => {
    if (mediaRecorderRef.current && grabando) {
      mediaRecorderRef.current.stop();
      setGrabando(false);
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    }
  };

  // Reproducir audio
  const reproducirAudio = (url: string, id: string) => {
    if (audioRef.current) audioRef.current.pause();
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => setReproduciendo(null);
    audio.onerror = () => { setReproduciendo(null); alert('Error al reproducir audio'); };
    audio.play().catch(() => setReproduciendo(null));
    setReproduciendo(id);
  };

  // Detener reproducción
  const detenerReproduccion = () => { if (audioRef.current) audioRef.current.pause(); setReproduciendo(null); };

  // Eliminar grabación
  const eliminarGrabacion = (id: string) => {
    if (confirm('¿Eliminar esta grabación?')) {
      setGrabaciones(prev => { const arr = prev.filter(g => g.id !== id); localStorage.setItem('grabaciones-reuniones', JSON.stringify(arr)); return arr; });
      if (reproduciendo === id) detenerReproduccion();
    }
  };

  // Descargar notas
  const descargarNotas = () => {
    if (!notasProcesadas) return alert('No hay notas para descargar');
    const blob = new Blob([notasProcesadas], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `notas-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  // Guardar API Key
  const guardarApiKey = () => {
    if (apiKey && !apiKey.includes('tu-api-key')) { localStorage.setItem('openai-api-key', apiKey); setMostrarConfig(false); alert('✅ API Key guardada'); }
    else alert('❌ Ingresa una API Key válida');
  };

  // Interfaz
  return (
    <div style={{ padding: 20, maxWidth: 1400, margin: '0 auto', minHeight: '100vh', background: 'white' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '2px solid #f0f0f0', paddingBottom: 10 }}>
        <h2 style={{ fontSize: '2.2rem', color: '#166088', display: 'flex', alignItems: 'center', gap: 10 }}><Sparkles size={32} style={{ color: '#9b59b6' }} /> Asistente de Reuniones IA</h2>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setMostrarConfig(!mostrarConfig)} style={{ background: '#9b59b6', color: 'white', border: 'none', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 'bold' }}><Key size={18} /> Configurar API</button>
          <button onClick={() => setModule('inicio')} style={{ background: 'none', border: 'none', fontSize: 30, cursor: 'pointer', color: '#999' }}>×</button>
        </div>
      </div>

      {/* Config API */}
      {mostrarConfig && (
        <div style={{ background: '#fff3cd', padding: 20, borderRadius: 12, marginBottom: 20, border: '2px solid #ffeaa7' }}>
          <h3 style={{ color: '#856404', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}><Key size={24} /> Configuración API</h3>
          <input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Pega tu API Key" style={{ width: '100%', padding: 12, border: '2px solid #ddd', borderRadius: 8, marginBottom: 10 }} />
          <button onClick={guardarApiKey} style={{ background: '#28a745', color: 'white', border: 'none', padding: 10, borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>Guardar API Key</button>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Columna izquierda: grabaciones */}
        <div>
          {/* Controles */}
          <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 16, border: '2px solid #e9ecef', textAlign: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ background: grabando ? '#e74c3c' : '#2ecc71', color: 'white', padding: '10px 20px', borderRadius: 25, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={18} /> {formatearTiempo(tiempoGrabacion)}</div>
              {!grabando ? (
                <button onClick={iniciarGrabacion} style={{ background: '#2ecc71', color: 'white', border: 'none', padding: 12, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 'bold' }}><Mic size={18} /> Iniciar Grabación</button>
              ) : (
                <button onClick={detenerGrabacion} style={{ background: '#e74c3c', color: 'white', border: 'none', padding: 12, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 'bold' }}><Square size={18} /> Detener Grabación</button>
              )}
            </div>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>{grabando ? '🎙️ Grabando...' : '⏺️ Haz clic para grabar tu reunión'}</p>
          </div>

          {/* Historial */}
          <h3 style={{ color: '#166088', marginBottom: 10, display: 'flex', alignItems: 'center' }}><FileText size={24} style={{ marginRight: 10 }} /> Grabaciones Anteriores</h3>
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {grabaciones.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40, color: '#999', background: '#f8f9fa', borderRadius: 8, border: '2px dashed #ddd' }}><Mic size={48} style={{ opacity: 0.5 }} /><div>No hay grabaciones guardadas</div></div>
            ) : (
              grabaciones.map(g => (
                <div key={g.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: 10, borderRadius: 8, marginBottom: 5, border: '1px solid #e9ecef' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#333' }}>{g.fecha}</div>
                    <div style={{ color: '#666', fontSize: 12 }}>⏱️ {formatearTiempo(g.duracion)}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {reproduciendo === g.id ? <button onClick={detenerReproduccion} style={{ background: '#e74c3c', color: 'white', borderRadius: 4, padding: 6 }}><Square size={16} /></button> :
                      <button onClick={() => reproducirAudio(g.url, g.id)} style={{ background: '#3498db', color: 'white', borderRadius: 4, padding: 6 }}><Play size={16} /></button>}
                    <button onClick={() => procesarAudio(g)} disabled={cargando} style={{ background: '#9b59b6', color: 'white', borderRadius: 4, padding: 6 }}><Sparkles size={16} /></button>
                    <button onClick={() => eliminarGrabacion(g.id)} style={{ background: '#e74c3c', color: 'white', borderRadius: 4, padding: 6 }}><Trash2 size={16} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Columna derecha: notas procesadas */}
        <div>
          <h3 style={{ color: '#166088', marginBottom: 10, display: 'flex', alignItems: 'center' }}><Save size={24} style={{ marginRight: 10 }} /> Notas y Análisis</h3>
          <textarea value={notasProcesadas} readOnly style={{ width: '100%', height: 500, padding: 12, borderRadius: 12, border: '2px solid #ddd', fontSize: 14, fontFamily: 'monospace', resize: 'vertical', background: '#f9f9f9', color: '#333' }} />
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button onClick={descargarNotas} style={{ background: '#28a745', color: 'white', border: 'none', padding: 12, borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6 }}><Download size={20} /> Descargar</button>
            <button onClick={() => { navigator.clipboard.writeText(notasProcesadas); alert('✅ Copiado al portapapeles'); }} style={{ background: '#3498db', color: 'white', border: 'none', padding: 12, borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 6 }}><FileText size={20} /> Copiar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
