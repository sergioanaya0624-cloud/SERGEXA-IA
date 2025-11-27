import { useState, useEffect } from 'react';
import { Mic, MicOff, Copy, Send, Sparkles } from 'lucide-react';

export default function MensajesModule({ setModule }: { setModule: (m: string) => void }) {
  const [textoOriginal, setTextoOriginal] = useState('');
  const [textoProcesado, setTextoProcesado] = useState('El mensaje aparecerá aquí...');
  const [cargando, setCargando] = useState(false);
  const [grabando, setGrabando] = useState(false);
  const [contexto, setContexto] = useState<'tecnico' | 'formal' | 'informal'>('tecnico');
  const [conFirma, setConFirma] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const API_KEY = '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';

  const iniciarGrabacion = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert('Navegador no soporta voz');

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.onresult = (e: any) => setTextoOriginal(prev => prev + ' ' + e.results[0][0].transcript);
    recognition.onerror = () => setGrabando(false);
    recognition.onend = () => setGrabando(false);
    recognition.start();
    setGrabando(true);
  };

  const procesarConIA = async () => {
    if (!textoOriginal.trim()) return alert('Escribe algo primero');
    if (API_KEY.includes('tu_clave')) return alert('¡Pega tu clave Groq en la línea 12!');

    setCargando(true);
    setTextoProcesado('Generando...');

    const firma = conFirma ? '\n\nSergio Anaya\nGestor de Vísceras' : '';

    let systemPrompt = '';
    if (contexto === 'tecnico') {
      systemPrompt = `Eres Sergio Anaya, Gestor de Vísceras. Usa SIEMPRE este formato exacto:

Buenos días

Se recibe devolución de juego visceral:
🔢 Código: [código]
🌡️ Temperaturas: [rojas]° rojas / [blancas]° blancas
⚠️ Novedad: [descripción]
* [acción]
📌 Observación: [motivo]

Queda a la espera de revisión por el personal idóneo del área.${firma}`;
    } else if (contexto === 'formal') {
      systemPrompt = `Mensaje formal y profesional en español para WhatsApp empresarial. Educado y claro.${firma}`;
    } else {
      systemPrompt = `Mensaje informal, cercano y con muchos emojis para compañeros. Divertido y relajado.${conFirma ? ' Firma como Sergio 😎' : ''}`;
    }

    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          temperature: 0.7,
          max_tokens: 600,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: textoOriginal }
          ]
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message || 'Error 400');
      }

      const data = await res.json();
      setTextoProcesado(data.choices[0].message.content.trim());

    } catch (err: any) {
      setTextoProcesado(`Error: ${err.message}\n\n¿Pegaste bien tu clave Groq arriba?`);
    }
    setCargando(false);
  };

  // Estilos responsivos
  const styles = {
    container: {
      padding: isMobile ? '15px' : '30px',
      maxWidth: '1400px',
      margin: '0 auto',
      minHeight: '100vh'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: isMobile ? '1.5rem' : '2rem',
      flexDirection: isMobile ? 'column' : 'row' as const,
      gap: isMobile ? '1rem' : '0'
    },
    title: {
      fontSize: isMobile ? '1.8rem' : '2.4rem',
      color: '#166088',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      margin: 0
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: isMobile ? '2.5rem' : '3rem',
      cursor: 'pointer',
      color: '#999',
      alignSelf: isMobile ? 'flex-end' : 'center'
    },
    configPanel: {
      background: '#f0f7ff',
      padding: isMobile ? '1rem' : '1.5rem',
      borderRadius: '16px',
      marginBottom: isMobile ? '1.5rem' : '2rem',
      border: '2px solid #4a6fa5'
    },
    configOptions: {
      display: 'flex',
      gap: isMobile ? '1rem' : '2rem',
      flexWrap: 'wrap' as const,
      alignItems: 'center',
      justifyContent: isMobile ? 'center' : 'flex-start'
    },
    configLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: isMobile ? '0.9rem' : '1rem',
      cursor: 'pointer'
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? '2rem' : '3rem'
    },
    section: {
      display: 'flex',
      flexDirection: 'column' as const
    },
    sectionTitle: {
      color: '#166088',
      marginBottom: '1rem',
      fontSize: isMobile ? '1.1rem' : '1.3rem'
    },
    textarea: {
      width: '100%',
      height: isMobile ? '300px' : '460px',
      padding: isMobile ? '1rem' : '1.5rem',
      borderRadius: '16px',
      border: '2px solid #ddd',
      fontSize: isMobile ? '1rem' : '1.1rem',
      resize: 'none' as const,
      fontFamily: 'inherit'
    },
    resultBox: {
      background: '#e8f5e8',
      padding: isMobile ? '1.5rem' : '2rem',
      borderRadius: '16px',
      minHeight: isMobile ? '300px' : '460px',
      whiteSpace: 'pre-wrap' as const,
      fontSize: isMobile ? '1rem' : '1.15rem',
      lineHeight: '1.6',
      border: '3px solid #4fc3a1',
      overflow: 'auto'
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1rem',
      flexWrap: 'wrap' as const
    },
    button: {
      padding: isMobile ? '10px 16px' : '12px 24px',
      border: 'none',
      borderRadius: '8px',
      fontSize: isMobile ? '0.9rem' : '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      flex: isMobile ? '1' : 'none'
    },
    primaryButton: {
      background: '#4fc3a1',
      color: 'white'
    },
    secondaryButton: {
      background: '#9b59b6',
      color: 'white'
    },
    whatsappButton: {
      background: '#25D366',
      color: 'white'
    },
    copyButton: {
      background: '#3498db',
      color: 'white'
    },
    recordingButton: {
      background: '#e74c3c',
      color: 'white'
    }
  };

  return (
    <div style={styles.container}>
      {/* CABECERA */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          <Sparkles size={isMobile ? 30 : 40} style={{ color: '#4fc3a1' }} />
          Mensajes Inteligentes
        </h2>
        <button 
          onClick={() => setModule('inicio')} 
          style={styles.closeButton}
        >
          ×
        </button>
      </div>

      {/* PANEL DE CONFIGURACIÓN */}
      <div style={styles.configPanel}>
        <div style={styles.configOptions}>
          <label style={styles.configLabel}>
            <input 
              type="radio" 
              checked={contexto === 'tecnico'} 
              onChange={() => setContexto('tecnico')} 
            /> 
            Técnico (Vísceras)
          </label>
          <label style={styles.configLabel}>
            <input 
              type="radio" 
              checked={contexto === 'formal'} 
              onChange={() => setContexto('formal')} 
            /> 
            Formal
          </label>
          <label style={styles.configLabel}>
            <input 
              type="radio" 
              checked={contexto === 'informal'} 
              onChange={() => setContexto('informal')} 
            /> 
            Informal
          </label>
          <label style={styles.configLabel}>
            <input 
              type="checkbox" 
              checked={conFirma} 
              onChange={() => setConFirma(!conFirma)} 
            /> 
            Firmar como Sergio Anaya
          </label>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div style={styles.mainGrid}>
        {/* COLUMNA IZQUIERDA - ENTRADA */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Tu texto o voz:</h3>
          <textarea
            value={textoOriginal}
            onChange={(e) => setTextoOriginal(e.target.value)}
            placeholder="Ej: código 2511-4881 completa, 16.4 rojas, 14.7 blancas, olor fuerte..."
            style={styles.textarea}
          />
          <div style={styles.buttonGroup}>
            <button 
              style={{
                ...styles.button,
                ...styles.primaryButton,
                opacity: cargando ? 0.7 : 1
              }} 
              onClick={procesarConIA} 
              disabled={cargando}
            >
              {cargando ? 'Generando...' : 'Crear Mensaje'}
            </button>
            <button 
              style={{
                ...styles.button,
                ...(grabando ? styles.recordingButton : styles.secondaryButton)
              }} 
              onClick={iniciarGrabacion}
            >
              {grabando ? <MicOff size={20} /> : <Mic size={20} />} 
              {grabando ? 'Grabando' : 'Grabar'}
            </button>
          </div>
        </div>

        {/* COLUMNA DERECHA - RESULTADO */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Mensaje listo:</h3>
          <div style={styles.resultBox}>
            {textoProcesado}
          </div>
          <div style={styles.buttonGroup}>
            <button 
              style={{
                ...styles.button,
                ...styles.whatsappButton
              }} 
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(textoProcesado)}`)}
            >
              <Send size={20} /> WhatsApp
            </button>
            <button 
              style={{
                ...styles.button,
                ...styles.copyButton
              }} 
              onClick={() => { 
                navigator.clipboard.writeText(textoProcesado); 
                alert('¡Copiado!'); 
              }}
            >
              <Copy size={20} /> Copiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}