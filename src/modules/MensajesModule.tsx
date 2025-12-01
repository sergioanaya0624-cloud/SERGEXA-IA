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

  // ========== API KEY ==========
  const API_KEY = "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";

  // Detectar móvil
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ========== GRABACIÓN DE VOZ ==========
  const iniciarGrabacion = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

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

  // ========== PROMPT MAESTRO ==========
  const generarPrompt = () => {
    const firma = conFirma
      ? `\n\n*Atentamente,*\n*Sergio Anaya*\nGestor de Vísceras`
      : "";

    if (contexto === "tecnico") {
      return `
Eres un asistente experto en redacción de reportes operativos del área de vísceras.
Tu tarea es convertir cualquier texto del usuario, formal o informal, en un reporte profesional, coherente, visual y estructurado, respetando todas las cifras, temperaturas, colores, nombres y descripciones exactas, sin inventar información ni asumir causas.

Además, debes analizar automáticamente el texto para:

Detectar palabras clave como: “viscera roja/blanca”, “cabeza”, “patas”, “vehículo”, “temperatura”, “olor”, “color”, “devolución”, “revisión”, “cava”, etc.

Asignar emojis pertinentes según el tipo de información:

🔴 Viscera roja

⚪ Viscera blanca

🐮 Cabeza

🐾 Patas y manos

❄️ Temperatura baja / refrigeración

🚨 Temperatura alta

⚠️ Novedad / alerta

🛠️ Acción o inspección

✅ Acción completada o revisada

El reporte debe respetar estrictamente este formato, incluyendo emojis y estilo ejecutivo-operativo:


📌 *DATOS REPORTADOS*

📝 Motivo: [extraído textualmente del mensaje del usuario, si aplica]
🚚 Vehículo: [extraído textualmente]

🌡️ *Temperatura de las vísceras:*

🔴 Viscera roja: [valor exacto]
⚪ Viscera blanca: [valor exacto]
🐾 Patas y manos: [detalle exacto]
🐮 Cabeza: [valor exacto]

[Agregar cualquier otro dato reportado tal cual]

⚠️ NOVEDAD / SITUACIÓN
🔹 [Resumen de lo sucedido, basado únicamente en la información del texto, resaltando novedades con emojis según gravedad]

📝 ACCIÓN / PASO A SEGUIR
[Acciones reales basadas únicamente en el texto recibido]

Indicar si se deja en cava, se revisa por calidad, inspección de vehículo, etc.

Asignar emojis para indicar acción o seguimiento: 🛠️, 🔄, 📦, ✅.

No inventar acciones ni asumir causas.

*Atentamente,*

*Sergio Anaya*
_Gestor de Vísceras_

Reglas estrictas:

Mantener emojis coherentes según tipo de dato o novedad.

No inventar datos, no corregir cifras ni temperaturas.

No suponer causas ni conclusiones.

No cambiar nombres ni colores.

Mantener tono ejecutivo-operativo.

Funciona con cualquier tipo de texto, informal o formal.

Los emojis se asignan automáticamente según palabras clave y contexto de gravedad o acción.

TEXTO DEL USUARIO A PROCESAR:

${firma}

NO des explicaciones externas. NO agregues nada que yo no haya dicho. Solo estructura.
      `.trim();
    }

    if (contexto === "formal") {
      return `
Convierte mi texto en un comunicado formal, profesional y claro.
No agregues información externa.

${firma}
      `.trim();
    }

    if (contexto === "informal") {
      return `
Convierte mi texto en un mensaje informal, sencillo y natural.

${conFirma ? "*Sergio 😎*" : ""}
      `.trim();
    }
  };

  // ========== PROCESAR CON IA ==========
  const procesarConIA = async () => {
    if (!textoOriginal.trim()) return alert("Escribe algo primero.");

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
          messages: [
            { role: "system", content: generarPrompt() },
            { role: "user", content: textoOriginal }
          ],
          max_tokens: 800,
          temperature: 0.5
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || "Error al generar mensaje.");
      }

      setTextoProcesado(data.choices[0].message.content.trim());
    } catch (err: any) {
      setTextoProcesado("Error: " + err.message);
    }

    setCargando(false);
  };

  // ========== ESTILOS ==========
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
      marginBottom: "2rem",
      flexDirection: isMobile ? "column" : "row",
      gap: "1rem"
    },
    title: {
      fontSize: isMobile ? "1.8rem" : "2.4rem",
      color: "#166088",
      display: "flex",
      alignItems: "center",
      gap: "15px"
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "3rem",
      cursor: "pointer",
      color: "#999"
    },
    configPanel: {
      background: "#f0f7ff",
      padding: "1.5rem",
      borderRadius: "16px",
      marginBottom: "2rem",
      border: "2px solid #4a6fa5"
    },
    configOptions: {
      display: "flex",
      gap: "1.5rem",
      flexWrap: "wrap"
    },
    mainGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: "2rem"
    },
    textarea: {
      width: "100%",
      height: isMobile ? "280px" : "420px",
      padding: "1.5rem",
      borderRadius: "16px",
      border: "2px solid #ddd",
      fontSize: "1.1rem",
      resize: "none"
    },
    resultBox: {
      background: "#e8f5e8",
      padding: "2rem",
      borderRadius: "16px",
      minHeight: isMobile ? "280px" : "420px",
      whiteSpace: "pre-wrap",
      fontSize: "1.15rem",
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
      padding: "12px 24px",
      border: "none",
      borderRadius: "10px",
      fontSize: "1rem",
      fontWeight: "bold",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      transition: "0.3s"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <Sparkles size={40} style={{ color: "#4fc3a1" }} />
          Mensajes Inteligentes
        </h2>

        <button onClick={() => setModule("inicio")} style={styles.closeButton}>×</button>
      </div>

      <div style={styles.configPanel}>
        <div style={styles.configOptions}>
          <label><input type="radio" checked={contexto === "tecnico"} onChange={() => setContexto("tecnico")} /> Técnico</label>
          <label><input type="radio" checked={contexto === "formal"} onChange={() => setContexto("formal")} /> Formal</label>
          <label><input type="radio" checked={contexto === "informal"} onChange={() => setContexto("informal")} /> Informal</label>
          <label><input type="checkbox" checked={conFirma} onChange={() => setConFirma(!conFirma)} /> Firmar como Sergio Anaya</label>
        </div>
      </div>

      <div style={styles.mainGrid}>
        <div>
          <h3>Tu texto o voz:</h3>

          <textarea
            value={textoOriginal}
            onChange={(e) => setTextoOriginal(e.target.value)}
            placeholder="Escribe aquí el mensaje desordenado…"
            style={styles.textarea}
          />

          <div style={styles.buttonGroup}>
            <button
              style={{ ...styles.button, background: "#4fc3a1", color: "#fff" }}
              onClick={procesarConIA}
              disabled={cargando}
            >
              {cargando ? "Generando..." : "Crear Mensaje"}
            </button>

            <button
              style={{
                ...styles.button,
                background: grabando ? "#e74c3c" : "#9b59b6",
                color: "white"
              }}
              onClick={iniciarGrabacion}
            >
              {grabando ? <MicOff size={20} /> : <Mic size={20} />}
              {grabando ? "Grabando" : "Grabar"}
            </button>
          </div>
        </div>

        <div>
          <h3>Mensaje listo:</h3>

          <div style={styles.resultBox}>{textoProcesado}</div>

          <div style={styles.buttonGroup}>
            <button
              style={{ ...styles.button, background: "#25D366", color: "#fff" }}
              onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(textoProcesado)}`)}
            >
              <Send size={20} /> WhatsApp
            </button>

            <button
              style={{ ...styles.button, background: "#3498db", color: "#fff" }}
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
