import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function LaboralModule({ setModule }: { setModule: (m: string) => void }) {
  const [activeTab, setActiveTab] = useState<'inventario' | 'cavas' | 'percheros'>('inventario');
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

  // ====================== ESTADOS COMPARTIDOS ======================
  const [fecha, setFecha] = useState(new Date().toLocaleDateString('es-CO'));
  const [completos, setCompletos] = useState(42);
  const [incompletos, setIncompletos] = useState(0);
  const [beneficioDia, setBeneficioDia] = useState<number | undefined>(920);

  // ==================== INICIO: PESTAÑA INVENTARIO FRÍO ====================
  const [novedades, setNovedades] = useState<{ cod: string; desc: string }[]>([]);
  const [cod, setCod] = useState('');
  const [desc, setDesc] = useState('');

  const agregarNovedad = () => {
    if (cod.trim() && desc.trim()) {
      setNovedades([...novedades, { cod, desc }]);
      setCod('');
      setDesc('');
    }
  };

  const eliminarNovedad = (i: number) => setNovedades(novedades.filter((_, idx) => idx !== i));
  // ==================== FIN: PESTAÑA INVENTARIO FRÍO ====================

  // ==================== INICIO: PESTAÑA OCUPACIÓN CAVAS ====================
  const [cavas, setCavas] = useState([
    { grupo: "V. Rojas & Blancas (V.Rojas)", tipo: "18-Rojas", carros: 40, capPorCarro: 18, inventario: 673 },
    { grupo: "V. Rojas & Blancas (V.Blancas)", tipo: "10-Blancas", carros: 22, capPorCarro: 10, inventario: 673 },
    { grupo: "V. Acondicionamiento", tipo: "24-Blancas", carros: 22, capPorCarro: 24, inventario: 0 },
    { grupo: "Patas & Manos", tipo: "8-Patas", carros: 80, capPorCarro: 8, inventario: 673 },
    { grupo: "Cabezas", tipo: "9-Cabezas", carros: 80, capPorCarro: 9, inventario: 673 },
  ]);

  const actualizarCava = (i: number, campo: 'carros' | 'capPorCarro' | 'inventario', valor: number) => {
    setCavas(prev => prev.map((c, idx) => idx === i ? { ...c, [campo]: valor } : c));
  };

  const capacidadTotal = (c: typeof cavas[0]) => c.carros * c.capPorCarro;
  const porcentaje = (c: typeof cavas[0]) => capacidadTotal(c) > 0 ? Math.round((c.inventario / capacidadTotal(c)) * 100) : 0;
  // ==================== FIN: PESTAÑA OCUPACIÓN CAVAS ====================

  // ==================== INICIO: NUEVA PESTAÑA CARROS PERCHEROS ====================
  const [stockTotal, setStockTotal] = useState(100);
  const [danados, setDanados] = useState(2);

  const [percheros, setPercheros] = useState([
    { cava: "V. Rojas & Blancas", blancas: 13, rojas: 3, patasManos: 2, cabezas: 1, crudas: 0 },
    { cava: "V. Acondicionamiento", blancas: 22, rojas: 0, patasManos: 0, cabezas: 1, crudas: 0 },
    { cava: "Patas & Cabezas", blancas: 0, rojas: 0, patasManos: 9, cabezas: 9, crudas: 0 },
    { cava: "Recepción", blancas: 0, rojas: 0, patasManos: 17, cabezas: 0, crudas: 0 },
    { cava: "Retenidos", blancas: 0, rojas: 0, patasManos: 0, cabezas: 0, crudas: 0 },
  ]);

  const actualizarPerchero = (i: number, campo: keyof typeof percheros[0], valor: number) => {
    setPercheros(prev => prev.map((p, idx) => idx === i ? { ...p, [campo]: valor } : p));
  };

  // Calcular total en uso automáticamente
  const totalEnUso = percheros.reduce((sum, p) => 
    sum + p.blancas + p.rojas + p.patasManos + p.cabezas + p.crudas, 0
  );

  const disponibles = stockTotal - danados - totalEnUso;
  const esBajoStock = disponibles < 30;

  // ==================== FIN: NUEVA PESTAÑA CARROS PERCHEROS ====================

  // ====================== CHECKBOX INCLUIR ======================
  const [incluir, setIncluir] = useState({ 
    inv: true, 
    cavas: true, 
    percheros: true,
    distribucion: true
  });

  // ==================== FUNCIÓN GENERAR INFORME MEJORADA ====================
  const generarInforme = () => {
    const logo = "https://drive.google.com/uc?id=1TBHnJ5KKg2CVFx-YtbKCbmWlbNKyvovR";

    // HTML para Beneficio del Día en tarjeta
    let htmlBeneficio = '';
    if (incluir.cavas && beneficioDia !== undefined) {
      htmlBeneficio = `
        <div style="text-align:center; margin:20px 0 30px 0;">
          <h2 style="color:#4CAF50;text-align:center;margin:0 0 20px 0;font-size:22px;">Beneficio del día</h2>
          <div style="display:flex; justify-content:center; gap:20px; margin:0 auto; max-width:700px;">
            <div style="background:white; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); text-align:center; flex:1; max-width:200px; border-top:4px solid #9b59b6;">
              <div style="color:#7f8c8d; font-size:14px; margin-bottom:8px;">Animales Beneficiados</div>
              <div style="font-size:28px; font-weight:bold; color:#9b59b6;">${beneficioDia}</div>
            </div>
          </div>
        </div>
      `;
    }

    // HTML para Inventario Frío en tarjetas
    let htmlInv = '';
    if (incluir.inv) {
      htmlInv = `
        <h1 style="color:#4CAF50;text-align:center;margin:30px 0 20px;font-size:22px;">Inventario Producto frío en Cava</h1>
        
        <div style="display:flex; justify-content:center; gap:20px; margin:25px 0 30px 0; flex-wrap:wrap;">
          <div style="background:white; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); text-align:center; flex:1; max-width:200px; border-top:4px solid #27ae60;">
            <div style="color:#7f8c8d; font-size:14px; margin-bottom:8px;">Juegos Completos</div>
            <div style="font-size:28px; font-weight:bold; color:#27ae60;">${completos}</div>
          </div>
          <div style="background:white; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); text-align:center; flex:1; max-width:200px; border-top:4px solid #e74c3c;">
            <div style="color:#7f8c8d; font-size:14px; margin-bottom:8px;">Juegos Incompletos</div>
            <div style="font-size:28px; font-weight:bold; color:#e74c3c;">${incompletos}</div>
          </div>
          <div style="background:white; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); text-align:center; flex:1; max-width:200px; border-top:4px solid #3498db;">
            <div style="color:#7f8c8d; font-size:14px; margin-bottom:8px;">Total Juegos</div>
            <div style="font-size:28px; font-weight:bold; color:#3498db;">${completos + incompletos}</div>
          </div>
        </div>
      `;

      // Novedades por Código
      if (novedades.length > 0) {
        let filasNovedades = novedades.map(n => 
          `<tr><td style="padding:6px 4px; font-size:12px;">${n.cod}</td><td style="padding:6px 4px; font-size:12px;">${n.desc}</td></tr>`
        ).join('');
        
        htmlInv += `
          <h3 style="color:#4CAF50;margin:25px 0 12px;text-align:center; font-size:22px;">Novedades por Código</h3>
          <table style="width:85%;margin:0 auto;font-size:12px; border-collapse:collapse;">
            <tr style="background:#4CAF50;color:white;">
              <th style="padding:8px 6px; font-size:12px; width:25%;">Código</th>
              <th style="padding:8px 6px; font-size:12px; width:75%;">Detalle</th>
            </tr>
            ${filasNovedades}
          </table>
        `;
      }
    }

    // HTML para Cavas (CON LETRA MÁS GRANDE)
    let htmlCavasTabla = '';
    if (incluir.cavas) {
      const gruposUnicos = [...new Set(cavas.map(c => c.grupo))];
      
      let filasCavas = '';
      gruposUnicos.forEach(grupo => {
        const cavasDelGrupo = cavas.filter(c => c.grupo === grupo);
        cavasDelGrupo.forEach((c, index) => {
          if (index === 0) {
            filasCavas += `
              <tr>
                <td rowspan="${cavasDelGrupo.length}" style="background:#f0f0f0;font-weight:bold;vertical-align:middle;padding:8px 6px;font-size:14px; width:20%;">${grupo}</td>
                <td style="padding:8px 6px;font-size:14px; width:15%;">${c.tipo} × ${c.carros}</td>
                <td style="padding:8px 6px;font-size:14px; width:12%;">${capacidadTotal(c)}</td>
                <td style="background:#fff2f2;padding:8px 6px;font-size:14px; width:12%;">${c.inventario}</td>
                <td style="background:#fff8e1;font-weight:bold;padding:8px 6px;font-size:14px; width:10%;">${porcentaje(c)}%</td>
              </tr>
            `;
          } else {
            filasCavas += `
              <tr>
                <td style="padding:8px 6px;font-size:14px;">${c.tipo} × ${c.carros}</td>
                <td style="padding:8px 6px;font-size:14px;">${capacidadTotal(c)}</td>
                <td style="background:#fff2f2;padding:8px 6px;font-size:14px;">${c.inventario}</td>
                <td style="background:#fff8e1;font-weight:bold;padding:8px 6px;font-size:14px;">${porcentaje(c)}%</td>
              </tr>
            `;
          }
        });
      });

      const totalInventario = cavas.reduce((sum, c) => sum + c.inventario, 0);
      const promedioInventario = Math.round(totalInventario / cavas.length);
      const promedioPorcentaje = Math.round(cavas.reduce((sum, c) => sum + porcentaje(c), 0) / cavas.length);

      htmlCavasTabla = `
        <h1 style="color:#4CAF50;text-align:center;margin:40px 0 15px;font-size:24px;">Ocupación Cavas Vísceras</h1>
        <table style="width:95%;margin:0 auto;border-collapse:collapse;font-size:14px;">
          <tr style="background:#4CAF50;color:white;">
            <th style="padding:12px 8px;font-size:14px; width:20%;">Cava</th>
            <th style="padding:12px 8px;font-size:14px; width:15%;">Configuración</th>
            <th style="padding:12px 8px;font-size:14px; width:12%;">Capacidad Total</th>
            <th style="padding:12px 8px;font-size:14px; width:12%;">Inventario Total</th>
            <th style="padding:12px 8px;font-size:14px; width:10%;">Participación Total</th>
          </tr>
          ${filasCavas}
          <tr style="background:#4CAF50;color:white;font-weight:bold;">
            <td colspan="3" style="text-align:center;padding:12px 8px;font-size:15px;">Total general</td>
            <td style="padding:12px 8px;font-size:15px;">${promedioInventario}</td>
            <td style="padding:12px 8px;font-size:15px;">${promedioPorcentaje}%</td>
          </tr>
        </table>
      `;
    }

    // HTML para Carros Percheros
    let htmlPercheros = '';
    if (incluir.percheros) {
      let filasPercheros = percheros.map(p => `
        <tr>
          <td style="text-align:left; padding:10px 8px; font-weight:500; border:1px solid #ddd;">${p.cava}</td>
          <td style="padding:10px 8px; border:1px solid #ddd;">${p.blancas || '-'}</td>
          <td style="padding:10px 8px; border:1px solid #ddd;">${p.rojas || '-'}</td>
          <td style="padding:10px 8px; border:1px solid #ddd;">${p.patasManos || '-'}</td>
          <td style="padding:10px 8px; border:1px solid #ddd;">${p.cabezas || '-'}</td>
          <td style="padding:10px 8px; border:1px solid #ddd;">${p.crudas || '-'}</td>
        </tr>
      `).join('');

      // Solo incluir distribución si el checkbox está activado
      let htmlDistribucion = '';
      if (incluir.distribucion) {
        htmlDistribucion = `
          <h2 style="color:#4CAF50;text-align:center;margin:40px 0 15px;font-size:22px;">Distribución por Cavas</h2>
          <table style="width:95%;margin:0 auto;border-collapse:collapse;font-size:14px;">
            <tr style="background:#4CAF50;color:white;">
              <th style="padding:12px 8px;font-size:14px; text-align:left;">Cavas</th>
              <th style="padding:12px 8px;font-size:14px;">V-Blancas</th>
              <th style="padding:12px 8px;font-size:14px;">V-Rojas</th>
              <th style="padding:12px 8px;font-size:14px;">Patas/Manos</th>
              <th style="padding:12px 8px;font-size:14px;">Cabezas</th>
              <th style="padding:12px 8px;font-size:14px;">Crudas</th>
            </tr>
            <tr style="background:#f0f0f0; font-weight:600;">
              <td style="text-align:left; padding:10px 8px; border:1px solid #ddd;">Mínimo para iniciar</td>
              <td style="padding:10px 8px; border:1px solid #ddd;">8</td>
              <td style="padding:10px 8px; border:1px solid #ddd;">8</td>
              <td style="padding:10px 8px; border:1px solid #ddd;">2</td>
              <td style="padding:10px 8px; border:1px solid #ddd;">5</td>
              <td style="padding:10px 8px; border:1px solid #ddd;">1</td>
            </tr>
            ${filasPercheros}
          </table>
        `;
      }

      htmlPercheros = `
        <h1 style="color:#4CAF50;text-align:center;margin:40px 0 20px;font-size:24px;">Disponibilidad de Carros Percheros</h1>
        
        <div style="display:flex; justify-content:center; gap:20px; margin:25px 0 30px 0; flex-wrap:wrap;">
          <div style="background:white; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); text-align:center; flex:1; max-width:180px; border-top:4px solid #3498db;">
            <div style="color:#7f8c8d; font-size:14px; margin-bottom:8px;">Stock Total</div>
            <div style="font-size:24px; font-weight:bold; color:#3498db;">${stockTotal}</div>
          </div>
          <div style="background:white; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); text-align:center; flex:1; max-width:180px; border-top:4px solid #e74c3c;">
            <div style="color:#7f8c8d; font-size:14px; margin-bottom:8px;">Dañados</div>
            <div style="font-size:24px; font-weight:bold; color:#e74c3c;">${danados}</div>
          </div>
          <div style="background:white; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); text-align:center; flex:1; max-width:180px; border-top:4px solid #f39c12;">
            <div style="color:#7f8c8d; font-size:14px; margin-bottom:8px;">En Uso</div>
            <div style="font-size:24px; font-weight:bold; color:#f39c12;">${totalEnUso}</div>
          </div>
          <div style="background:white; padding:20px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1); text-align:center; flex:1; max-width:180px; border-top:4px solid ${esBajoStock ? '#e74c3c' : '#27ae60'};">
            <div style="color:#7f8c8d; font-size:14px; margin-bottom:8px;">Disponibles</div>
            <div style="font-size:24px; font-weight:bold; color:${esBajoStock ? '#e74c3c' : '#27ae60'};">${disponibles}</div>
            <div style="font-size:12px; color:${esBajoStock ? '#e74c3c' : '#27ae60'}; margin-top:5px; font-weight:bold;">
              ${esBajoStock ? '⚠️ STOCK BAJO' : '✅ STOCK OK'}
            </div>
          </div>
        </div>

        ${htmlDistribucion}
      `;
    }

    const htmlFinal = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Informe Colbeef</title>
<style>
  body{font-family:Arial,sans-serif;margin:15px;background:white;}
  img{display:block;margin:12px auto;width:130px;}
  .header {
    text-align: center;
    border-bottom: 2px solid #4CAF50;
    padding-bottom: 20px;
    margin-bottom: 30px;
  }
  .header h1 {
    color: #2c3e50;
    margin: 0;
    font-size: 28px;
  }
  .header .subtitle {
    color: #7f8c8d;
    font-size: 16px;
    margin-top: 5px;
  }
  h1{color:#4CAF50;text-align:center;font-size:24px;margin:20px 0;}
  h2{color:#4CAF50;text-align:center;font-size:22px;margin:20px 0;}
  table{width:95%;max-width:850px;margin:15px auto;border-collapse:collapse;font-size:14px;}
  th,td{border:1px solid #ddd;padding:8px 6px;text-align:center;}
  th{background:#4CAF50;color:white;}
  .summary-table{width:60%;margin:15px auto;font-size:14px;}
  .summary-table th,.summary-table td{text-align:center;padding:10px;border:1px solid #ddd;}
  .summary-table th{background:#4CAF50;color:white;font-size:14px;}
  .firma{margin-top:40px;text-align:center;color:#4CAF50;font-weight:bold;font-size:16px;}
</style></head><body>
  <div class="container">
    <div class="header">
      <img src="${logo}" alt="Colbeef" class="logo">
      <h1>Gestión del área de Vísceras</h1>
      <div class="subtitle">Informe generado el: ${fecha}</div>
    </div>
  </div>
  ${htmlBeneficio}
  ${htmlInv}
  ${htmlCavasTabla}
  ${htmlPercheros}
  <div class="firma">Sergio Anaya<br><small>Gestor de Vísceras - Colbeef S.A.S.</small></div>
</body></html>`;

    const win = window.open('', '_blank');
    if (win) { 
      win.document.write(htmlFinal); 
      win.document.close(); 
    }
  };

  // Estilos responsivos
  const styles = {
    container: {
      padding: isMobile ? '10px' : '20px',
      maxWidth: '1100px',
      margin: '0 auto',
      minHeight: '100vh'
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: isMobile ? '15px' : '20px',
      position: 'relative' as const
    },
    title: {
      color: '#006400',
      fontSize: isMobile ? '1.5rem' : '2rem',
      fontWeight: 'bold',
      marginBottom: isMobile ? '10px' : '0'
    },
    closeButton: {
      position: 'absolute' as const,
      top: isMobile ? '-10px' : '0',
      right: isMobile ? '-5px' : '0',
      fontSize: isMobile ? '2rem' : '2.5rem',
      background: 'none',
      border: 'none',
      color: '#999',
      cursor: 'pointer'
    },
    tabsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: isMobile ? '5px' : '10px',
      marginBottom: isMobile ? '15px' : '20px',
      flexWrap: 'wrap' as const
    },
    tabButton: {
      padding: isMobile ? '8px 12px' : '10px 20px',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 'bold',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      minWidth: isMobile ? '100px' : 'auto'
    },
    checkboxContainer: {
      background: '#e8f5e8',
      padding: isMobile ? '8px' : '12px',
      borderRadius: '12px',
      marginBottom: isMobile ? '15px' : '20px',
      textAlign: 'center' as const,
      border: '2px solid #006400',
      fontSize: isMobile ? '0.8rem' : '1rem'
    },
    checkboxLabel: {
      margin: isMobile ? '0 8px' : '0 12px',
      display: isMobile ? 'block' : 'inline-block',
      marginBottom: isMobile ? '5px' : '0'
    },
    sectionContainer: {
      background: 'white',
      padding: isMobile ? '1rem' : '2.5rem',
      borderRadius: '16px',
      border: '3px solid #006400',
      marginBottom: isMobile ? '15px' : '0'
    },
    input: {
      padding: isMobile ? '10px' : '12px',
      borderRadius: '8px',
      border: '2px solid #006400',
      fontSize: isMobile ? '1rem' : '1.2rem',
      width: '100%'
    },
    grid2Col: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? '1rem' : '1.5rem'
    },
    grid4Col: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
      gap: isMobile ? '10px' : '16px',
      marginBottom: isMobile ? '15px' : '24px'
    },
    dataItem: {
      background: '#f8f9fa',
      padding: isMobile ? '10px' : '14px',
      borderRadius: '10px',
      border: '1px solid #ddd'
    },
    tableInput: {
      width: isMobile ? '50px' : '60px',
      padding: isMobile ? '4px' : '6px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: isMobile ? '0.8rem' : '0.9rem'
    },
    generateButton: {
      background: '#006400',
      color: 'white',
      padding: isMobile ? '15px 40px' : '20px 100px',
      fontSize: isMobile ? '1.5rem' : '2rem',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '16px',
      cursor: 'pointer',
      boxShadow: '0 8px 20px rgba(0,100,0,0.3)',
      width: isMobile ? '100%' : 'auto',
      marginTop: isMobile ? '20px' : '40px'
    }
  };

  return (
    <div style={styles.container}>
      {/* CABECERA */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          Módulo Laboral - Colbeef
        </h2>
        <button
          onClick={() => setModule('inicio')}
          style={styles.closeButton}
        >
          ×
        </button>
      </div>

      {/* PESTAÑAS */}
      <div style={styles.tabsContainer}>
        <button
          onClick={() => setActiveTab('inventario')}
          style={{
            ...styles.tabButton,
            background: activeTab === 'inventario' ? '#006400' : '#ddd',
            color: activeTab === 'inventario' ? 'white' : '#333',
          }}
        >
          Inventario Frío
        </button>
        <button
          onClick={() => setActiveTab('cavas')}
          style={{
            ...styles.tabButton,
            background: activeTab === 'cavas' ? '#006400' : '#ddd',
            color: activeTab === 'cavas' ? 'white' : '#333',
          }}
        >
          Ocupación Cavas
        </button>
        <button
          onClick={() => setActiveTab('percheros')}
          style={{
            ...styles.tabButton,
            background: activeTab === 'percheros' ? '#006400' : '#ddd',
            color: activeTab === 'percheros' ? 'white' : '#333',
          }}
        >
          Carros Percheros
        </button>
      </div>

      {/* CHECKBOX INCLUIR MEJORADO */}
      <div style={styles.checkboxContainer}>
        <strong>Incluir en el informe:</strong>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={incluir.inv} onChange={e => setIncluir({ ...incluir, inv: e.target.checked })} /> Inventario
        </label>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={incluir.cavas} onChange={e => setIncluir({ ...incluir, cavas: e.target.checked })} /> Cavas
        </label>
        <label style={styles.checkboxLabel}>
          <input type="checkbox" checked={incluir.percheros} onChange={e => setIncluir({ ...incluir, percheros: e.target.checked })} /> Percheros
        </label>
        {activeTab === 'percheros' && (
          <label style={styles.checkboxLabel}>
            <input type="checkbox" checked={incluir.distribucion} onChange={e => setIncluir({ ...incluir, distribucion: e.target.checked })} /> Distribución
          </label>
        )}
      </div>

      {/* ==================== PESTAÑA INVENTARIO FRÍO ==================== */}
      {activeTab === 'inventario' && (
        <div style={styles.sectionContainer}>
          <h3 style={{ color: '#006400', marginBottom: isMobile ? '1.5rem' : '2rem', fontSize: isMobile ? '1.2rem' : '1.5rem' }}>
            Inventario Producto Frío en Cava
          </h3>
          <div style={{ display: 'grid', gap: isMobile ? '1rem' : '1.5rem', marginBottom: isMobile ? '1.5rem' : '2rem' }}>
            <input 
              type="text" 
              value={fecha} 
              onChange={e => setFecha(e.target.value)} 
              placeholder="Fecha" 
              style={styles.input} 
            />
            <input 
              type="number" 
              value={completos} 
              onChange={e => setCompletos(+e.target.value || 0)} 
              placeholder="Juegos Viscerales Completos" 
              style={styles.input} 
            />
            <input 
              type="number" 
              value={incompletos} 
              onChange={e => setIncompletos(+e.target.value || 0)} 
              placeholder="Juegos Viscerales Incompletos" 
              style={{...styles.input, borderColor: '#ff9800'}} 
            />
          </div>

          <h4 style={{ color: '#006400', margin: isMobile ? '1.5rem 0 0.8rem' : '2rem 0 1rem', fontSize: isMobile ? '1rem' : '1.2rem' }}>
            Novedades por Código
          </h4>
          <div style={{ display: 'flex', gap: isMobile ? '0.5rem' : '1rem', marginBottom: '1rem', flexDirection: isMobile ? 'column' : 'row' }}>
            <input 
              placeholder="Código" 
              value={cod} 
              onChange={e => setCod(e.target.value)} 
              style={{...styles.input, borderColor: '#666', flex: isMobile ? 'none' : 1}} 
            />
            <input 
              placeholder="Detalle" 
              value={desc} 
              onChange={e => setDesc(e.target.value)} 
              style={{...styles.input, borderColor: '#666', flex: isMobile ? 'none' : 2}} 
            />
            <button 
              onClick={agregarNovedad} 
              style={{
                padding: isMobile ? '10px 15px' : '12px 20px', 
                background: '#006400', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: isMobile ? '0.9rem' : '1rem'
              }}
            >
              <Plus size={isMobile ? 18 : 24} /> {isMobile ? 'Agregar' : 'Agregar'}
            </button>
          </div>

          {novedades.map((n, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              background: '#fff3cd', 
              padding: isMobile ? '8px' : '12px', 
              borderRadius: '8px', 
              marginBottom: '8px',
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '5px' : '0'
            }}>
              <span style={{ fontSize: isMobile ? '0.9rem' : '1rem' }}>
                <strong>{n.cod}</strong> → {n.desc}
              </span>
              <button 
                onClick={() => eliminarNovedad(i)} 
                style={{ 
                  color: '#d32f2f', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  alignSelf: isMobile ? 'flex-end' : 'center'
                }}
              >
                <Trash2 size={isMobile ? 16 : 20} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ==================== PESTAÑA OCUPACIÓN CAVAS ==================== */}
      {activeTab === 'cavas' && (
        <div style={styles.sectionContainer}>
          <div style={{ textAlign: 'center', marginBottom: isMobile ? '25px' : '35px' }}>
            <div style={{ 
              fontSize: isMobile ? '1.2rem' : '1.5rem', 
              fontWeight: 'bold', 
              color: '#006400', 
              marginBottom: '10px' 
            }}>
              Beneficio del día
            </div>
            <input
              type="number"
              value={beneficioDia || ''}
              onChange={e => setBeneficioDia(e.target.value ? +e.target.value : undefined)}
              style={{
                width: isMobile ? '200px' : '260px',
                padding: isMobile ? '12px 16px' : '16px 20px',
                fontSize: isMobile ? '2rem' : '2.8rem',
                fontWeight: 'bold',
                border: '4px solid #006400',
                borderRadius: '14px',
                background: '#e8f5e8',
                textAlign: 'center',
                margin: '0 auto',
                display: 'block'
              }}
              placeholder="920"
            />
            <div style={{ 
              fontSize: isMobile ? '1.2rem' : '1.6rem', 
              fontWeight: 'bold', 
              color: '#006400', 
              marginTop: '8px' 
            }}>
              animales
            </div>
          </div>

          <h3 style={{ 
            textAlign: 'center', 
            color: '#006400', 
            margin: isMobile ? '15px 0 20px' : '20px 0 25px', 
            fontWeight: 'bold',
            fontSize: isMobile ? '1.2rem' : '1.5rem'
          }}>
            Configuración de Cavas
          </h3>

          {cavas.map((c, i) => (
            <div key={i} style={{ 
              marginBottom: isMobile ? '15px' : '20px', 
              padding: isMobile ? '10px' : '14px', 
              background: i % 2 === 0 ? '#f9f9f9' : 'white', 
              borderRadius: '12px' 
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr 1fr 2fr 1.5fr', 
                gap: isMobile ? '8px' : '10px', 
                alignItems: 'center', 
                fontSize: isMobile ? '0.8rem' : '14px' 
              }}>
                <div style={{ fontWeight: 'bold', color: '#006400', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  {c.grupo}
                </div>
                <div>
                  <input 
                    type="number" 
                    value={c.carros} 
                    onChange={e => actualizarCava(i, 'carros', +e.target.value || 0)} 
                    style={{ 
                      width: '100%', 
                      padding: isMobile ? '8px' : '10px', 
                      border: '1px solid #006400', 
                      borderRadius: '6px', 
                      background: '#f0f8f0',
                      fontSize: isMobile ? '0.9rem' : '1rem'
                    }} 
                  />
                </div>
                <div>
                  <input 
                    type="number" 
                    value={c.capPorCarro} 
                    onChange={e => actualizarCava(i, 'capPorCarro', +e.target.value || 0)} 
                    style={{ 
                      width: '100%', 
                      padding: isMobile ? '8px' : '10px', 
                      border: '1px solid #006400', 
                      borderRadius: '6px', 
                      background: '#f0f8f0',
                      fontSize: isMobile ? '0.9rem' : '1rem'
                    }} 
                  />
                </div>
                <div style={{ fontWeight: 'bold', textAlign: 'center', fontSize: isMobile ? '0.9rem' : '1rem' }}>
                  {capacidadTotal(c)}
                </div>
                <div>
                  <input 
                    type="number" 
                    value={c.inventario} 
                    onChange={e => actualizarCava(i, 'inventario', +e.target.value || 0)} 
                    style={{ 
                      width: '100%', 
                      padding: isMobile ? '12px' : '16px', 
                      fontSize: isMobile ? '1.2rem' : '1.6rem', 
                      border: '4px solid #d32f2f', 
                      borderRadius: '10px', 
                      background: '#ffebee', 
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }} 
                  />
                </div>
                <div style={{ 
                  fontSize: isMobile ? '1.5rem' : '2rem', 
                  fontWeight: 'bold', 
                  color: '#006400', 
                  textAlign: 'center' 
                }}>
                  {porcentaje(c)}%
                </div>
              </div>
              <div style={{ 
                marginTop: '8px', 
                fontSize: isMobile ? '0.7rem' : '13px', 
                color: '#555', 
                textAlign: 'center' 
              }}>
                {c.tipo}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==================== NUEVA PESTAÑA CARROS PERCHEROS ==================== */}
      {activeTab === 'percheros' && (
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)', 
          overflow: 'hidden',
          marginBottom: isMobile ? '15px' : '0'
        }}>
          <div style={{ 
            background: '#2c3e50', 
            color: 'white', 
            padding: isMobile ? '12px' : '16px', 
            textAlign: 'center' 
          }}>
            <h3 style={{ margin: 0, fontSize: isMobile ? '1.1rem' : '1.3rem' }}>
              Inventario Carros Percheros
            </h3>
            <small>Actualización en tiempo real</small>
          </div>

          <div style={{ padding: isMobile ? '15px' : '20px' }}>
            {/* RESUMEN GENERAL */}
            <div style={styles.grid4Col}>
              <div style={styles.dataItem}>
                <div style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', color: '#6c757d' }}>Stock Total</div>
                <input 
                  type="number" 
                  value={stockTotal} 
                  onChange={e => setStockTotal(+e.target.value || 0)} 
                  style={{ 
                    width: '100%', 
                    padding: isMobile ? '6px' : '8px', 
                    border: '1px solid #999', 
                    borderRadius: '6px', 
                    fontSize: isMobile ? '1rem' : '1.1rem', 
                    fontWeight: 'bold', 
                    marginTop: '4px' 
                  }} 
                />
              </div>
              <div style={styles.dataItem}>
                <div style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', color: '#6c757d' }}>Dañados</div>
                <input 
                  type="number" 
                  value={danados} 
                  onChange={e => setDanados(+e.target.value || 0)} 
                  style={{ 
                    width: '100%', 
                    padding: isMobile ? '6px' : '8px', 
                    border: '1px solid #999', 
                    borderRadius: '6px', 
                    fontSize: isMobile ? '1rem' : '1.1rem', 
                    fontWeight: 'bold', 
                    marginTop: '4px' 
                  }} 
                />
              </div>
              <div style={styles.dataItem}>
                <div style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', color: '#6c757d' }}>En Uso</div>
                <div style={{ 
                  fontSize: isMobile ? '1.2rem' : '1.4rem', 
                  fontWeight: 'bold', 
                  color: '#2c3e50',
                  marginTop: '4px'
                }}>
                  {totalEnUso}
                </div>
              </div>
              <div style={{
                ...styles.dataItem,
                background: esBajoStock ? '#ffeaea' : '#e8f5e9',
                border: esBajoStock ? '2px solid #e74c3c' : '1px solid #ddd'
              }}>
                <div style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', color: '#6c757d' }}>Disponibles</div>
                <div style={{ 
                  fontSize: isMobile ? '1.4rem' : '1.8rem', 
                  fontWeight: 'bold', 
                  color: esBajoStock ? '#e74c3c' : '#27ae60',
                  marginTop: '4px'
                }}>
                  {disponibles}
                  {esBajoStock && (
                    <span style={{ 
                      fontSize: isMobile ? '0.7rem' : '0.9rem', 
                      marginLeft: '5px', 
                      background: '#e74c3c', 
                      color: 'white', 
                      padding: '2px 6px', 
                      borderRadius: '12px' 
                    }}>
                      BAJO
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* TABLA DISTRIBUCIÓN (SIN OPL) */}
            <h4 style={{ 
              color: '#2c3e50', 
              margin: isMobile ? '15px 0 8px' : '24px 0 12px', 
              fontWeight: '600',
              fontSize: isMobile ? '0.9rem' : '1rem'
            }}>
              Distribución por Cavas
            </h4>
            <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #ddd' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: isMobile ? '0.7rem' : '0.85rem' }}>
                <thead>
                  <tr style={{ background: '#2c3e50', color: 'white' }}>
                    <th style={{ padding: isMobile ? '8px 6px' : '10px 8px' }}>Cava</th>
                    <th style={{ padding: isMobile ? '8px 6px' : '10px 8px' }}>V-Blancas</th>
                    <th style={{ padding: isMobile ? '8px 6px' : '10px 8px' }}>V-Rojas</th>
                    <th style={{ padding: isMobile ? '8px 6px' : '10px 8px' }}>Patas/Manos</th>
                    <th style={{ padding: isMobile ? '8px 6px' : '10px 8px' }}>Cabezas</th>
                    <th style={{ padding: isMobile ? '8px 6px' : '10px 8px' }}>Crudas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: '#f0f0f0', fontWeight: '600' }}>
                    <td style={{ padding: isMobile ? '8px 6px' : '10px 8px', textAlign: 'left' }}>Mínimo inicio</td>
                    <td style={{ padding: isMobile ? '8px 6px' : '10px 8px' }}>8</td>
                    <td style={{ padding: isMobile ? '8px 6px' : '10px 8px' }}>8</td>
                    <td style={{ padding: isMobile ? '8px 6px' : '10px 8px' }}>2</td>
                    <td style={{ padding: isMobile ? '8px 6px' : '10px 8px' }}>5</td>
                    <td style={{ padding: isMobile ? '8px 6px' : '10px 8px' }}>1</td>
                  </tr>
                  {percheros.map((p, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fdfdfd' : 'white' }}>
                      <td style={{ 
                        padding: isMobile ? '8px 6px' : '10px 8px', 
                        textAlign: 'left', 
                        fontWeight: '500',
                        fontSize: isMobile ? '0.7rem' : '0.85rem'
                      }}>
                        {p.cava}
                      </td>
                      <td>
                        <input 
                          type="number" 
                          value={p.blancas} 
                          onChange={e => actualizarPerchero(i, 'blancas', +e.target.value || 0)} 
                          style={styles.tableInput} 
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          value={p.rojas} 
                          onChange={e => actualizarPerchero(i, 'rojas', +e.target.value || 0)} 
                          style={styles.tableInput} 
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          value={p.patasManos} 
                          onChange={e => actualizarPerchero(i, 'patasManos', +e.target.value || 0)} 
                          style={styles.tableInput} 
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          value={p.cabezas} 
                          onChange={e => actualizarPerchero(i, 'cabezas', +e.target.value || 0)} 
                          style={styles.tableInput} 
                        />
                      </td>
                      <td>
                        <input 
                          type="number" 
                          value={p.crudas} 
                          onChange={e => actualizarPerchero(i, 'crudas', +e.target.value || 0)} 
                          style={styles.tableInput} 
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* BOTÓN GENERAR INFORME MEJORADO */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={generarInforme}
          style={styles.generateButton}
        >
          GENERAR INFORME OFICIAL
        </button>
      </div>
    </div>
  );
}