import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Copy, Send, Sparkles } from 'lucide-react';

export default function MensajesModule({ setModule }: { setModule: (m: string) => void }) {
  const [textoOriginal, setTextoOriginal] = useState('');
  const [textoProcesado, setTextoProcesado] = useState('El mensaje aparecerá aquí...');
  const [cargando, setCargando] = useState(false);
  const [grabando, setGrabando] = useState(false);
  const [contexto, setContexto] = useState<'tecnico' | 'formal' | 'informal'>('tecnico');
  const [conFirma, setConFirma] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Detectar móvil
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const API_KEY = "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";

  // ============= GRABACIÓN DE VOZ =============
  const iniciarGrabacion = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Tu navegador no soporta reconocimiento de voz.");

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "es-ES";

      recognitionRef.current.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setTextoOriginal(prev => prev + " " + text);
      };

      recognitionRef.current.onerror = () => setGrabando(false);
      recognitionRef.current.onend = () => setGrabando(false);
    }

    recognitionRef.current.start();
    setGrabando(true);
  };

  // ============= GENERACIÓN CON IA =============
  const generarPrompt = () => {
    const firma = conFirma ? `\n\nSergio Anaya\nGestor de Vísceras` : "";

    // --- CONTEXTO TÉCNICO GENERAL, NO SOLO VÍSCERAS ---
    if (contexto === "tecnico") {
      return `
Eres un asistente especializado en redactar mensajes **técnicos**, **operativos**, **claros** y **bien estructurados**, sin importar el tema.
Siempre entregarás el mensaje ordenado con:

- Encabezado profesional
- Listas con emojis técnicos
- Secciones con saltos de línea
- Datos clave organizados
- Negrillas estilo WhatsApp (*texto*)

Formato obligatorio:

*🔹 TITULAR DEL REPORTE*
Descripción breve del caso.

*📌 DATOS RELEVANTES*
- Elemento 1
- Elemento 2
- Elemento 3

*⚠️ NOVEDAD / ACCIONES*
- Qué ocurrió
- Qué acción se tomó
- Qué sigue

*📝 OBSERVACIÓN*
Detalles adicionales.

${firma}
`.trim();
    }

    // --- CONTEXTO FORMAL ---
    if (contexto === "formal") {
      return `
Redacta un mensaje formal, corporativo y profesional en español.
Debe ser claro, respetuoso, conciso y bien estructurado.
Evita adornos innecesarios.
Incluye saludos, cuerpo del mensaje y cierre profesional.

${firma}
`.trim();
    }

    // --- CONTEXTO INFORMAL ---
    return `
Redacta un mensaje en tono informal, cercano, amigable y fluido.
Incluye emojis naturales, no saturados.
Debe sonar humano y relajado.

${conFirma ? "Firma como *Sergio 😎*" : ""}
`.trim();
  };

  const procesarConIA = async () => {
    if (!textoOriginal.trim()) return alert("Escribe algo primero.");
    if (!API_KEY || API_KEY.includes("tu_clave")) return alert("Pega tu API Key de Groq.");

    setCargando(true);
    setTextoProcesado("Generando mensaje...");

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          max_tokens: 800,
          temperature: 0.6,
          messages: [
            { role: "system", content: generarPrompt() },
            { role: "user", content: textoOriginal }
          ]
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error?.message || "Error generando mensaje.");

      setTextoProcesado(data.choices[0].message.content.trim());
    } catch (err: any) {
      setTextoProcesado("Error: " + err.message);
    }

    setCargando(false);
  };

  // ============= ESTILOS =============
  const styles = {
    container: {
      padding: isMobile ? "15px" : "30px",
      maxWidth: "1400px",
      margin: "0 auto",
      minHeight: "100vh"
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: isMobile ? "1.5rem" : "2rem",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "1rem" : "0"
    },
    title: {
      fontSize: isMobile ? "1.8rem" : "2.4rem",
      color: "#166088",
      display: "flex",
      alignItems: "center",
      gap: "15px",
      margin: 0
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: isMobile ? "2.5rem" : "3rem",
      cursor: "pointer",
      color: "#999",
      alignSelf: isMobile ? "flex-end" : "center"
    },
    configPanel: {
      background: "#f0f7ff",
      padding: isMobile ? "1rem" : "1.5rem",
      borderRadius: "16px",
      marginBottom: isMobile ? "1.5rem" : "2rem",
      border: "2px solid #4a6fa5"
    },
    configOptions: {
      display: "flex",
      gap: isMobile ? "1rem" : "2rem",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: isMobile ? "center" : "flex-start"
    },
    configLabel: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: isMobile ? "0.9rem" : "1rem",
      cursor: "pointer"
    },
    mainGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: isMobile ? "2rem" : "3rem"
    },
    section: { display: "flex", flexDirection: "column" },
    sectionTitle: {
      color: "#166088",
      marginBottom: "1rem",
      fontSize: isMobile ? "1.1rem" : "1.3rem"
    },
    textarea: {
      width: "100%",
      height: isMobile ? "300px" : "460px",
      padding: isMobile ? "1rem" : "1.5rem",
      borderRadius: "16px",
      border: "2px solid #ddd",
      fontSize: isMobile ? "1rem" : "1.1rem",
      resize: "none",
      fontFamily: "inherit"
    },
    resultBox: {
      background: "#e8f5e8",
      padding: isMobile ? "1.5rem" : "2rem",
      borderRadius: "16px",
      minHeight: isMobile ? "300px" : "460px",
      whiteSpace: "pre-wrap",
      fontSize: isMobile ? "1rem" : "1.15rem",
      lineHeight: "1.6",
      border: "3px solid #4fc3a1",
      overflow: "auto"
    },
    buttonGroup: {
      display: "flex",
      gap: "1rem",
      marginTop: "1rem",
      flexWrap: "wrap"
    },
    button: {
      padding: isMobile ? "10px 16px" : "12px 24px",
      border: "none",
      borderRadius: "8px",
      fontSize: isMobile ? "0.9rem" : "1rem",
      fontWeight: "bold",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "all 0.3s ease",
      flex: isMobile ? "1" : "none"
    },
    primaryButton: { background: "#4fc3a1", color: "white" },
    secondaryButton: { background: "#9b59b6", color: "white" },
    whatsappButton: { background: "#25D366", color: "white" },
    copyButton: { background: "#3498db", color: "white" },
    recordingButton: { background: "#e74c3c", color: "white" }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <Sparkles size={isMobile ? 30 : 40} style={{ color: "#4fc3a1" }} />
          Mensajes Inteligentes
        </h2>
        <button onClick={() => setModule("inicio")} style={styles.closeButton}>×</button>
      </div>

      <div style={styles.configPanel}>
        <div style={styles.configOptions}>
          <label style={styles.configLabel}>
            <input type="radio" checked={contexto === "tecnico"} onChange={() => setContexto("tecnico")} /> Técnico
          </label>

          <label style={styles.configLabel}>
            <input type="radio" checked={contexto === "formal"} onChange={() => setContexto("formal")} /> Formal
          </label>

          <label style={styles.configLabel}>
            <input type="radio" checked={contexto === "informal"} onChange={() => setContexto("informal")} /> Informal
          </label>

          <label style={styles.configLabel}>
            <input type="checkbox" checked={conFirma} onChange={() => setConFirma(!conFirma)} />
            Firmar como Sergio Anaya
          </label>
        </div>
      </div>

      <div style={styles.mainGrid}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Tu texto o voz:</h3>

          <textarea
            value={textoOriginal}
            onChange={(e) => setTextoOriginal(e.target.value)}
            placeholder="Escribe aquí el mensaje desordenado..."
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
              {cargando ? "Generando..." : "Crear Mensaje"}
            </button>

            <button
              style={{
                ...styles.button,
                ...(grabando ? styles.recordingButton : styles.secondaryButton)
              }}
              onClick={iniciarGrabacion}
            >
              {grabando ? <MicOff size={20} /> : <Mic size={20} />}
              {grabando ? "Grabando" : "Grabar"}
            </button>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Mensaje listo:</h3>

          <div style={styles.resultBox}>{textoProcesado}</div>

          <div style={styles.buttonGroup}>
            <button
              style={{ ...styles.button, ...styles.whatsappButton }}
              onClick={() =>
                window.open(`https://wa.me/?text=${encodeURIComponent(textoProcesado)}`)
              }
            >
              <Send size={20} /> WhatsApp
            </button>

            <button
              style={{ ...styles.button, ...styles.copyButton }}
              onClick={() => {
                navigator.clipboard.writeText(textoProcesado);
                alert("¡Copiado!");
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
