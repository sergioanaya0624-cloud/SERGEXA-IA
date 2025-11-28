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

  // ====================== PERSISTENCIA DE DATOS ======================
  // Cargar datos guardados al iniciar
  useEffect(() => {
    const savedData = localStorage.getItem('laboralModuleData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setFecha(data.fecha || new Date().toLocaleDateString('es-CO'));
      setCompletos(data.completos || 0);
      setIncompletos(data.incompletos || 0);
      setBeneficioDia(data.beneficioDia || 0);
      setNovedades(data.novedades || []);
      setCavas(data.cavas || [
        { grupo: "V. Rojas & Blancas (V.Rojas)", tipo: "", carros: 40, capPorCarro: 20, inventario: 0 },
        { grupo: "V. Rojas & Blancas (V.Blancas)", tipo: "", carros: 22, capPorCarro: 25, inventario: 0 },
        { grupo: "V. Acondicionamiento", tipo: "", carros: 22, capPorCarro: 25, inventario: 0 },
        { grupo: "Patas & Manos", tipo: "", carros: 80, capPorCarro: 9, inventario: 0 },
        { grupo: "Cabezas", tipo: "", carros: 80, capPorCarro: 9, inventario: 0 },
      ]);
      setStockTotal(data.stockTotal || 100);
      setDanados(data.danados || 2);
      setPercheros(data.percheros || [
        { cava: "V. Rojas & Blancas", blancas: 0, rojas: 0, patasManos: 0, cabezas: 0, crudas: 0 },
        { cava: "V. Acondicionamiento", blancas: 0, rojas: 0, patasManos: 0, cabezas: 0, crudas: 0 },
        { cava: "Patas & Cabezas", blancas: 0, rojas: 0, patasManos: 0, cabezas: 0, crudas: 0 },
        { cava: "Recepción", blancas: 0, rojas: 0, patasManos: 0, cabezas: 0, crudas: 0 },
        { cava: "Retenidos", blancas: 0, rojas: 0, patasManos: 0, cabezas: 0, crudas: 0 },
      ]);
    }
  }, []);

  // Función para guardar datos automáticamente
  const guardarDatos = () => {
    const data = {
      fecha,
      completos,
      incompletos,
      beneficioDia,
      novedades,
      cavas,
      stockTotal,
      danados,
      percheros
    };
    localStorage.setItem('laboralModuleData', JSON.stringify(data));
  };

  // Función para limpiar datos
  const limpiarDatos = () => {
    localStorage.removeItem('laboralModuleData');
    setFecha(new Date().toLocaleDateString('es-CO'));
    setCompletos(0);
    setIncompletos(0);
    setBeneficioDia(0);
    setNovedades([]);
    setCavas([
      { grupo: "V. Rojas & Blancas (V.Rojas)", tipo: "", carros: 40, capPorCarro: 20, inventario: 0 },
      { grupo: "V. Rojas & Blancas (V.Blancas)", tipo: "", carros: 22, capPorCarro: 25, inventario: 0 },
      { grupo: "V. Acondicionamiento", tipo: "", carros: 22, capPorCarro: 25, inventario: 0 },
      { grupo: "Patas & Manos", tipo: "", carros: 80, capPorCarro: 9, inventario: 0 },
      { grupo: "Cabezas", tipo: "", carros: 80, capPorCarro: 9, inventario: 0 },
    ]);
    setStockTotal(100);
    setDanados(2);
    setPercheros([
      { cava: "V. Rojas & Blancas", blancas: 0, rojas: 0, patasManos: 0, cabezas: 0, crudas: 0 },
      { cava: "V. Acondicionamiento", blancas: 0, rojas: 0, patasManos: 0, cabezas: 0, crudas: 0 },
      { cava: "Patas & Cabezas", blancas: 0, rojas: 0, patasManos: 0, cabezas: 0, crudas: 0 },
      { cava: "Recepción", blancas: 0, rojas: 0, patasManos: 0, cabezas: 0, crudas: 0 },
      { cava: "Retenidos", blancas: 0, rojas: 0, patasManos: 0, cabezas: 0, crudas: 0 },
    ]);
  };

  // ====================== ESTADOS COMPARTIDOS ======================
  const [fecha, setFecha] = useState(new Date().toLocaleDateString('es-CO'));
  const [completos, setCompletos] = useState(0);
  const [incompletos, setIncompletos] = useState(0);
  const [beneficioDia, setBeneficioDia] = useState<number | undefined>(0);

  // ==================== INICIO: PESTAÑA INVENTARIO FRÍO ====================
  const [novedades, setNovedades] = useState<{ cod: string; desc: string }[]>([]);
  const [cod, setCod] = useState('');
  const [desc, setDesc] = useState('');

  const agregarNovedad = () => {
    if (cod.trim() && desc.trim()) {
      const nuevasNovedades = [...novedades, { cod, desc }];
      setNovedades(nuevasNovedades);
      setCod('');
      setDesc('');
      // Guardar automáticamente
      guardarDatos();
    }
  };

  const eliminarNovedad = (i: number) => {
    const nuevasNovedades = novedades.filter((_, idx) => idx !== i);
    setNovedades(nuevasNovedades);
    guardarDatos();
  };
  // ==================== FIN: PESTAÑA INVENTARIO FRÍO ====================

  // ==================== INICIO: PESTAÑA OCUPACIÓN CAVAS ====================
  const [cavas, setCavas] = useState([
    { grupo: "V. Rojas & Blancas (V.Rojas)", tipo: "", carros: 40, capPorCarro: 20, inventario: 0 },
    { grupo: "V. Rojas & Blancas (V.Blancas)", tipo: "", carros: 22, capPorCarro: 25, inventario: 0 },
    { grupo: "V. Acondicionamiento", tipo: "", carros: 22, capPorCarro: 25, inventario: 0 },
    { grupo: "Patas & Manos", tipo: "", carros: 80, capPorCarro: 9, inventario: 0 },
    { grupo: "Cabezas", tipo: "", carros: 80, capPorCarro: 9, inventario: 0 },
  ]);

  const actualizarCava = (i: number, campo: 'carros' | 'capPorCarro' | 'inventario', valor: number) => {
    setCavas(prev => {
      const nuevasCavas = prev.map((c, idx) => idx === i ? { ...c, [campo]: valor } : c);
      guardarDatos();
      return nuevasCavas;
    });
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
    setPercheros(prev => {
      const nuevosPercheros = prev.map((p, idx) => idx === i ? { ...p, [campo]: valor } : p);
      guardarDatos();
      return nuevosPercheros;
    });
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
    // Usar el logo local en lugar del de Google Drive
    const logo = "/logo_informe.png"; // Ruta relativa desde la carpeta public

    // HTML para Beneficio del Día en tarjeta
    let htmlBeneficio = '';
    if (incluir.cavas && beneficioDia !== undefined) {
      htmlBeneficio = `
        <div style="text-align:center; margin:20px 0 30px 0;">
          <h2 style="color:#4CAF50;text-align:center;margin:0 0 20px 0;font-size:28px;font-weight:bold;">BENEFICIO DEL DÍA</h2>
          <div style="display:flex; justify-content:center; gap:20px; margin:0 auto; max-width:700px;">
            <div style="background:white; padding:25px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.15); text-align:center; flex:1; max-width:250px; border-top:6px solid #9b59b6;">
              <div style="color:#7f8c8d; font-size:18px; margin-bottom:12px;font-weight:bold;">ANIMALES BENEFICIADOS</div>
              <div style="font-size:42px; font-weight:bold; color:#9b59b6;">${beneficioDia}</div>
            </div>
          </div>
        </div>
      `;
    }

    // HTML para Inventario Frío en tarjetas
    let htmlInv = '';
    if (incluir.inv) {
      htmlInv = `
        <h1 style="color:#4CAF50;text-align:center;margin:30px 0 25px;font-size:28px;font-weight:bold;">INVENTARIO PRODUCTO FRÍO EN CAVA</h1>
        
        <div style="display:flex; justify-content:center; gap:25px; margin:30px 0 35px 0; flex-wrap:wrap;">
          <div style="background:white; padding:25px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.15); text-align:center; flex:1; max-width:220px; border-top:6px solid #27ae60;">
            <div style="color:#7f8c8d; font-size:16px; margin-bottom:12px;font-weight:bold;">JUEGOS COMPLETOS</div>
            <div style="font-size:36px; font-weight:bold; color:#27ae60;">${completos}</div>
          </div>
          <div style="background:white; padding:25px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.15); text-align:center; flex:1; max-width:220px; border-top:6px solid #e74c3c;">
            <div style="color:#7f8c8d; font-size:16px; margin-bottom:12px;font-weight:bold;">JUEGOS INCOMPLETOS</div>
            <div style="font-size:36px; font-weight:bold; color:#e74c3c;">${incompletos}</div>
          </div>
          <div style="background:white; padding:25px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.15); text-align:center; flex:1; max-width:220px; border-top:6px solid #3498db;">
            <div style="color:#7f8c8d; font-size:16px; margin-bottom:12px;font-weight:bold;">TOTAL JUEGOS</div>
            <div style="font-size:36px; font-weight:bold; color:#3498db;">${completos + incompletos}</div>
          </div>
        </div>
      `;

      // Novedades por Código
      if (novedades.length > 0) {
        let filasNovedades = novedades.map(n => 
          `<tr><td style="padding:10px 8px; font-size:16px;font-weight:bold;">${n.cod}</td><td style="padding:10px 8px; font-size:16px;">${n.desc}</td></tr>`
        ).join('');
        
        htmlInv += `
          <h3 style="color:#4CAF50;margin:30px 0 15px;text-align:center; font-size:24px;font-weight:bold;">NOVEDADES POR CÓDIGO</h3>
          <table style="width:90%;margin:0 auto;font-size:16px; border-collapse:collapse;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            <tr style="background:#4CAF50;color:white;">
              <th style="padding:12px 10px; font-size:18px; width:25%;font-weight:bold;">CÓDIGO</th>
              <th style="padding:12px 10px; font-size:18px; width:75%;font-weight:bold;">DETALLE</th>
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
                <td rowspan="${cavasDelGrupo.length}" style="background:#f0f0f0;font-weight:bold;vertical-align:middle;padding:12px 10px;font-size:18px; width:20%;">${grupo}</td>
                <td style="padding:12px 10px;font-size:18px; width:15%;">${c.tipo} × ${c.carros}</td>
                <td style="padding:12px 10px;font-size:18px; width:12%;font-weight:bold;">${capacidadTotal(c)}</td>
                <td style="background:#fff2f2;padding:12px 10px;font-size:18px; width:12%;font-weight:bold;">${c.inventario}</td>
                <td style="background:#fff8e1;font-weight:bold;padding:12px 10px;font-size:18px; width:10%;">${porcentaje(c)}%</td>
              </tr>
            `;
          } else {
            filasCavas += `
              <tr>
                <td style="padding:12px 10px;font-size:18px;">${c.tipo} × ${c.carros}</td>
                <td style="padding:12px 10px;font-size:18px;font-weight:bold;">${capacidadTotal(c)}</td>
                <td style="background:#fff2f2;padding:12px 10px;font-size:18px;font-weight:bold;">${c.inventario}</td>
                <td style="background:#fff8e1;font-weight:bold;padding:12px 10px;font-size:18px;">${porcentaje(c)}%</td>
              </tr>
            `;
          }
        });
      });

      const totalInventario = cavas.reduce((sum, c) => sum + c.inventario, 0);
      const promedioInventario = Math.round(totalInventario / cavas.length);
      const promedioPorcentaje = Math.round(cavas.reduce((sum, c) => sum + porcentaje(c), 0) / cavas.length);

      htmlCavasTabla = `
        <h1 style="color:#4CAF50;text-align:center;margin:40px 0 20px;font-size:28px;font-weight:bold;">OCUPACIÓN CAVAS VÍSCERAS</h1>
        <table style="width:95%;margin:0 auto;border-collapse:collapse;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
          <tr style="background:#4CAF50;color:white;">
            <th style="padding:15px 12px;font-size:20px; width:20%;font-weight:bold;">CAVA</th>
            <th style="padding:15px 12px;font-size:20px; width:15%;font-weight:bold;">CARROS</th>
            <th style="padding:15px 12px;font-size:20px; width:12%;font-weight:bold;">CAPACIDAD TOTAL</th>
            <th style="padding:15px 12px;font-size:20px; width:12%;font-weight:bold;">INVENTARIO TOTAL</th>
            <th style="padding:15px 12px;font-size:20px; width:10%;font-weight:bold;">PARTICIPACIÓN TOTAL</th>
          </tr>
          ${filasCavas}
          <tr style="background:#4CAF50;color:white;font-weight:bold;">
            <td colspan="3" style="text-align:center;padding:15px 12px;font-size:20px;">TOTAL GENERAL</td>
            <td style="padding:15px 12px;font-size:20px;">${promedioInventario}</td>
            <td style="padding:15px 12px;font-size:20px;">${promedioPorcentaje}%</td>
          </tr>
        </table>
      `;
    }

    // HTML para Carros Percheros
    let htmlPercheros = '';
    if (incluir.percheros) {
      let filasPercheros = percheros.map(p => `
        <tr>
          <td style="text-align:left; padding:12px 10px; font-weight:bold; border:2px solid #ddd;font-size:16px;">${p.cava}</td>
          <td style="padding:12px 10px; border:2px solid #ddd;font-size:16px;font-weight:bold;">${p.blancas || '-'}</td>
          <td style="padding:12px 10px; border:2px solid #ddd;font-size:16px;font-weight:bold;">${p.rojas || '-'}</td>
          <td style="padding:12px 10px; border:2px solid #ddd;font-size:16px;font-weight:bold;">${p.patasManos || '-'}</td>
          <td style="padding:12px 10px; border:2px solid #ddd;font-size:16px;font-weight:bold;">${p.cabezas || '-'}</td>
          <td style="padding:12px 10px; border:2px solid #ddd;font-size:16px;font-weight:bold;">${p.crudas || '-'}</td>
        </tr>
      `).join('');

      // Solo incluir distribución si el checkbox está activado
      let htmlDistribucion = '';
      if (incluir.distribucion) {
        htmlDistribucion = `
          <h2 style="color:#4CAF50;text-align:center;margin:40px 0 20px;font-size:24px;font-weight:bold;">DISTRIBUCIÓN POR CAVAS</h2>
          <table style="width:95%;margin:0 auto;border-collapse:collapse;font-size:16px;box-shadow:0 2px 8px rgba(0,0,0,0.1);">
            <tr style="background:#4CAF50;color:white;">
              <th style="padding:15px 12px;font-size:18px; text-align:left;font-weight:bold;">CAVAS</th>
              <th style="padding:15px 12px;font-size:18px;font-weight:bold;">V-BLANCAS</th>
              <th style="padding:15px 12px;font-size:18px;font-weight:bold;">V-ROJAS</th>
              <th style="padding:15px 12px;font-size:18px;font-weight:bold;">PATAS/MANOS</th>
              <th style="padding:15px 12px;font-size:18px;font-weight:bold;">CABEZAS</th>
              <th style="padding:15px 12px;font-size:18px;font-weight:bold;">CRUDAS</th>
            </tr>
            <tr style="background:#f0f0f0; font-weight:bold;">
              <td style="text-align:left; padding:12px 10px; border:2px solid #ddd;font-size:16px;">MÍNIMO PARA INICIAR</td>
              <td style="padding:12px 10px; border:2px solid #ddd;font-size:16px;">8</td>
              <td style="padding:12px 10px; border:2px solid #ddd;font-size:16px;">8</td>
              <td style="padding:12px 10px; border:2px solid #ddd;font-size:16px;">2</td>
              <td style="padding:12px 10px; border:2px solid #ddd;font-size:16px;">5</td>
              <td style="padding:12px 10px; border:2px solid #ddd;font-size:16px;">1</td>
            </tr>
            ${filasPercheros}
          </table>
        `;
      }

      htmlPercheros = `
        <h1 style="color:#4CAF50;text-align:center;margin:40px 0 25px;font-size:28px;font-weight:bold;">DISPONIBILIDAD DE CARROS PERCHEROS</h1>
        
        <div style="display:flex; justify-content:center; gap:25px; margin:30px 0 35px 0; flex-wrap:wrap;">
          <div style="background:white; padding:25px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.15); text-align:center; flex:1; max-width:200px; border-top:6px solid #3498db;">
            <div style="color:#7f8c8d; font-size:16px; margin-bottom:12px;font-weight:bold;">STOCK TOTAL</div>
            <div style="font-size:32px; font-weight:bold; color:#3498db;">${stockTotal}</div>
          </div>
          <div style="background:white; padding:25px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.15); text-align:center; flex:1; max-width:200px; border-top:6px solid #e74c3c;">
            <div style="color:#7f8c8d; font-size:16px; margin-bottom:12px;font-weight:bold;">DAÑADOS</div>
            <div style="font-size:32px; font-weight:bold; color:#e74c3c;">${danados}</div>
          </div>
          <div style="background:white; padding:25px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.15); text-align:center; flex:1; max-width:200px; border-top:6px solid #f39c12;">
            <div style="color:#7f8c8d; font-size:16px; margin-bottom:12px;font-weight:bold;">EN USO</div>
            <div style="font-size:32px; font-weight:bold; color:#f39c12;">${totalEnUso}</div>
          </div>
          <div style="background:white; padding:25px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.15); text-align:center; flex:1; max-width:200px; border-top:6px solid ${esBajoStock ? '#e74c3c' : '#27ae60'};">
            <div style="color:#7f8c8d; font-size:16px; margin-bottom:12px;font-weight:bold;">DISPONIBLES</div>
            <div style="font-size:32px; font-weight:bold; color:${esBajoStock ? '#e74c3c' : '#27ae60'};">${disponibles}</div>
            <div style="font-size:14px; color:${esBajoStock ? '#e74c3c' : '#27ae60'}; margin-top:8px; font-weight:bold;">
              ${esBajoStock ? '⚠️ STOCK BAJO' : '✅ STOCK OK'}
            </div>
          </div>
        </div>

        ${htmlDistribucion}
      `;
    }

    const htmlFinal = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Informe Laboral</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            background: white;
            font-size: 16px;
            line-height: 1.4;
        }
        img {
            display: block;
            margin: 15px auto;
            width: 180px;
            height: auto;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #4CAF50;
            padding-bottom: 25px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #2c3e50;
            margin: 15px 0 5px 0;
            font-size: 32px;
            font-weight: bold;
        }
        .header .subtitle {
            color: #7f8c8d;
            font-size: 20px;
            margin-top: 8px;
            font-weight: bold;
        }
        h1 {
            color: #4CAF50;
            text-align: center;
            font-size: 28px;
            margin: 25px 0;
            font-weight: bold;
        }
        h2 {
            color: #4CAF50;
            text-align: center;
            font-size: 24px;
            margin: 25px 0;
            font-weight: bold;
        }
        h3 {
            color: #4CAF50;
            text-align: center;
            font-size: 22px;
            margin: 20px 0;
            font-weight: bold;
        }
        table {
            width: 95%;
            max-width: 900px;
            margin: 20px auto;
            border-collapse: collapse;
            font-size: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        th, td {
            border: 2px solid #ddd;
            padding: 12px 10px;
            text-align: center;
            font-size: 16px;
        }
        th {
            background: #4CAF50;
            color: white;
            font-weight: bold;
        }
        .firma {
            margin-top: 50px;
            text-align: center;
            color: #4CAF50;
            font-weight: bold;
            font-size: 20px;
        }
        .export-button {
            display: block;
            margin: 30px auto;
            padding: 15px 30px;
            background: #25D366;
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            text-align: center;
            width: 300px;
        }
        .export-button:hover {
            background: #128C7E;
        }
        .export-button:disabled {
            background: #95a5a6;
            cursor: not-allowed;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="${logo}" alt="Logo Empresa" class="logo">
            <h1>GESTIÓN DEL ÁREA DE VÍSCERAS</h1>
            <div class="subtitle">INFORME GENERADO EL: ${fecha}</div>
        </div>
    </div>
    ${htmlBeneficio}
    ${htmlInv}
    ${htmlCavasTabla}
    ${htmlPercheros}
    <div class="firma">
        SERGIO ANAYA<br>
        <small style="font-size:16px;">GESTOR DE VÍSCERAS</small>
    </div>
    
    <button class="export-button" onclick="exportarComoPNG()" id="exportBtn">
        📸 Exportar como PNG
    </button>

    <script>
        function exportarComoPNG() {
            const button = document.getElementById('exportBtn');
            const originalText = button.innerHTML;
            
            button.innerHTML = '⏳ Generando imagen...';
            button.disabled = true;

            // Ocultar el botón temporalmente para la captura
            button.style.display = 'none';

            setTimeout(() => {
                html2canvas(document.body, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff'
                }).then(canvas => {
                    // Mostrar el botón nuevamente
                    button.style.display = 'block';
                    
                    const imagen = canvas.toDataURL('image/png');
                    const enlace = document.createElement('a');
                    enlace.download = 'Informe_Completo.png';
                    enlace.href = imagen;
                    enlace.click();
                    
                    button.innerHTML = '✅ Descargado';
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.disabled = false;
                    }, 2000);
                    
                }).catch(error => {
                    button.style.display = 'block';
                    button.innerHTML = '❌ Error';
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.disabled = false;
                    }, 3000);
                });
            }, 500);
        }
    </script>
</body>
</html>`;

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
      minHeight: '100vh',
      background: '#f5f5f5'
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
      minWidth: isMobile ? '100px' : 'auto',
      cursor: 'pointer'
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
      border: '1px solid #ddd',
      textAlign: 'center' as const
    },
    tableInput: {
      width: isMobile ? '50px' : '60px',
      padding: isMobile ? '4px' : '6px',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      textAlign: 'center' as const
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
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      marginBottom: '20px',
      flexWrap: 'wrap' as const
    },
    secondaryButton: {
      background: '#666',
      color: 'white',
      padding: isMobile ? '10px 20px' : '12px 25px',
      fontSize: isMobile ? '0.9rem' : '1rem',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer'
    },
    // Nuevos estilos para la vista de cavas centrada
    cavaContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      gap: '15px'
    },
    cavaRow: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr 1.5fr 1fr',
      gap: isMobile ? '10px' : '15px',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '1000px',
      margin: '0 auto',
      padding: isMobile ? '12px' : '15px',
      background: '#f9f9f9',
      borderRadius: '12px',
      border: '1px solid #ddd'
    },
    cavaHeader: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr 1.5fr 1fr',
      gap: isMobile ? '10px' : '15px',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '1000px',
      margin: '0 auto 15px auto',
      padding: isMobile ? '10px' : '12px',
      background: '#006400',
      color: 'white',
      borderRadius: '10px',
      fontWeight: 'bold',
      fontSize: isMobile ? '0.8rem' : '0.9rem',
      textAlign: 'center' as const
    },
    cavaLabel: {
      fontWeight: 'bold',
      color: '#006400',
      fontSize: isMobile ? '0.9rem' : '1rem',
      textAlign: 'center' as const
    },
    cavaInput: {
      width: '100%',
      padding: isMobile ? '8px' : '10px',
      border: '1px solid #006400',
      borderRadius: '6px',
      background: '#f0f8f0',
      fontSize: isMobile ? '0.9rem' : '1rem',
      textAlign: 'center' as const
    },
    cavaInputLarge: {
      width: '100%',
      padding: isMobile ? '12px' : '16px',
      fontSize: isMobile ? '1.2rem' : '1.6rem',
      border: '4px solid #d32f2f',
      borderRadius: '10px',
      background: '#ffebee',
      fontWeight: 'bold',
      textAlign: 'center' as const
    },
    cavaValue: {
      fontWeight: 'bold',
      textAlign: 'center' as const,
      fontSize: isMobile ? '0.9rem' : '1rem',
      color: '#006400'
    },
    cavaPercentage: {
      fontSize: isMobile ? '1.5rem' : '2rem',
      fontWeight: 'bold',
      color: '#006400',
      textAlign: 'center' as const
    },
    // Nuevos estilos para carros percheros centrados
    percherosContainer: {
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      marginBottom: isMobile ? '15px' : '0'
    },
    percherosHeader: {
      background: '#2c3e50',
      color: 'white',
      padding: isMobile ? '12px' : '16px',
      textAlign: 'center' as const
    },
    percherosContent: {
      padding: isMobile ? '15px' : '20px'
    },
    percherosGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
      gap: isMobile ? '10px' : '16px',
      marginBottom: isMobile ? '15px' : '24px'
    },
    percherosTableContainer: {
      overflowX: 'auto',
      borderRadius: '8px',
      border: '1px solid #ddd'
    },
    percherosTable: {
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: isMobile ? '0.7rem' : '0.85rem'
    },
    percherosTableCell: {
      padding: isMobile ? '8px 6px' : '10px 8px',
      textAlign: 'center' as const,
      border: '1px solid #ddd'
    },
    percherosTableHeader: {
      background: '#2c3e50',
      color: 'white',
      padding: isMobile ? '8px 6px' : '10px 8px',
      textAlign: 'center' as const
    }
  };

  return (
    <div style={styles.container}>
      {/* CABECERA */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          Módulo Laboral - <img src="/logo_informe.png" alt="Logo" style={{height: '40px', verticalAlign: 'middle', marginLeft: '10px'}} />
        </h2>
        <button
          onClick={() => setModule('inicio')}
          style={styles.closeButton}
        >
          ×
        </button>
      </div>

      {/* BOTÓN DE LIMPIAR */}
      <div style={styles.actionButtons}>
        <button
          onClick={limpiarDatos}
          style={{...styles.secondaryButton, background: '#e74c3c'}}
        >
          🗑️ Limpiar Todo
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
              onChange={e => {setFecha(e.target.value); guardarDatos();}} 
              placeholder="Fecha" 
              style={styles.input} 
            />
            <input 
              type="number" 
              value={completos} 
              onChange={e => {setCompletos(+e.target.value || 0); guardarDatos();}} 
              placeholder="Juegos Viscerales Completos" 
              style={styles.input} 
            />
            <input 
              type="number" 
              value={incompletos} 
              onChange={e => {setIncompletos(+e.target.value || 0); guardarDatos();}} 
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

      {/* ==================== PESTAÑA OCUPACIÓN CAVAS - MEJORADA ==================== */}
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
              onChange={e => {setBeneficioDia(e.target.value ? +e.target.value : undefined); guardarDatos();}}
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
              placeholder="0"
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

          {/* CABECERA DE LA TABLA DE CAVAS */}
          <div style={styles.cavaHeader}>
            <div>CAVA</div>
            <div>CARRROS</div>
            <div>CAP. POR CARRO</div>
            <div>CAPACIDAD TOTAL</div>
            <div>INVENTARIO</div>
            <div>PARTICIPACIÓN</div>
          </div>

          {/* FILAS DE CAVAS - CENTRADAS Y ALINEADAS */}
          <div style={styles.cavaContainer}>
            {cavas.map((c, i) => (
              <div key={i} style={styles.cavaRow}>
                <div style={styles.cavaLabel}>{c.grupo}</div>
                
                <div>
                  <input 
                    type="number" 
                    value={c.carros} 
                    onChange={e => actualizarCava(i, 'carros', +e.target.value || 0)} 
                    style={styles.cavaInput} 
                  />
                </div>
                
                <div>
                  <input 
                    type="number" 
                    value={c.capPorCarro} 
                    onChange={e => actualizarCava(i, 'capPorCarro', +e.target.value || 0)} 
                    style={styles.cavaInput} 
                  />
                </div>
                
                <div style={styles.cavaValue}>
                  {capacidadTotal(c)}
                </div>
                
                <div>
                  <input 
                    type="number" 
                    value={c.inventario} 
                    onChange={e => actualizarCava(i, 'inventario', +e.target.value || 0)} 
                    style={styles.cavaInputLarge} 
                  />
                </div>
                
                <div style={styles.cavaPercentage}>
                  {porcentaje(c)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== NUEVA PESTAÑA CARROS PERCHEROS - MEJORADA ==================== */}
      {activeTab === 'percheros' && (
        <div style={styles.percherosContainer}>
          <div style={styles.percherosHeader}>
            <h3 style={{ margin: 0, fontSize: isMobile ? '1.1rem' : '1.3rem' }}>
              Inventario Carros Percheros
            </h3>
            <small>Actualización en tiempo real</small>
          </div>

          <div style={styles.percherosContent}>
            {/* RESUMEN GENERAL - CENTRADO */}
            <div style={styles.percherosGrid}>
              <div style={styles.dataItem}>
                <div style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', color: '#6c757d' }}>Stock Total</div>
                <input 
                  type="number" 
                  value={stockTotal} 
                  onChange={e => {setStockTotal(+e.target.value || 0); guardarDatos();}} 
                  style={{ 
                    width: '100%', 
                    padding: isMobile ? '6px' : '8px', 
                    border: '1px solid #999', 
                    borderRadius: '6px', 
                    fontSize: isMobile ? '1rem' : '1.1rem', 
                    fontWeight: 'bold', 
                    marginTop: '4px',
                    textAlign: 'center'
                  }} 
                />
              </div>
              <div style={styles.dataItem}>
                <div style={{ fontSize: isMobile ? '0.7rem' : '0.8rem', color: '#6c757d' }}>Dañados</div>
                <input 
                  type="number" 
                  value={danados} 
                  onChange={e => {setDanados(+e.target.value || 0); guardarDatos();}} 
                  style={{ 
                    width: '100%', 
                    padding: isMobile ? '6px' : '8px', 
                    border: '1px solid #999', 
                    borderRadius: '6px', 
                    fontSize: isMobile ? '1rem' : '1.1rem', 
                    fontWeight: 'bold', 
                    marginTop: '4px',
                    textAlign: 'center'
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

            {/* TABLA DISTRIBUCIÓN - CENTRADA Y ALINEADA */}
            <h4 style={{ 
              color: '#2c3e50', 
              margin: isMobile ? '15px 0 8px' : '24px 0 12px', 
              fontWeight: '600',
              fontSize: isMobile ? '0.9rem' : '1rem',
              textAlign: 'center'
            }}>
              Distribución por Cavas
            </h4>
            <div style={styles.percherosTableContainer}>
              <table style={styles.percherosTable}>
                <thead>
                  <tr>
                    <th style={styles.percherosTableHeader}>Cava</th>
                    <th style={styles.percherosTableHeader}>V-Blancas</th>
                    <th style={styles.percherosTableHeader}>V-Rojas</th>
                    <th style={styles.percherosTableHeader}>Patas/Manos</th>
                    <th style={styles.percherosTableHeader}>Cabezas</th>
                    <th style={styles.percherosTableHeader}>Crudas</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: '#f0f0f0', fontWeight: '600' }}>
                    <td style={{ ...styles.percherosTableCell, textAlign: 'left' }}>Mínimo inicio</td>
                    <td style={styles.percherosTableCell}>8</td>
                    <td style={styles.percherosTableCell}>8</td>
                    <td style={styles.percherosTableCell}>2</td>
                    <td style={styles.percherosTableCell}>5</td>
                    <td style={styles.percherosTableCell}>1</td>
                  </tr>
                  {percheros.map((p, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fdfdfd' : 'white' }}>
                      <td style={{ ...styles.percherosTableCell, textAlign: 'left', fontWeight: '500' }}>
                        {p.cava}
                      </td>
                      <td style={styles.percherosTableCell}>
                        <input 
                          type="number" 
                          value={p.blancas} 
                          onChange={e => actualizarPerchero(i, 'blancas', +e.target.value || 0)} 
                          style={styles.tableInput} 
                        />
                      </td>
                      <td style={styles.percherosTableCell}>
                        <input 
                          type="number" 
                          value={p.rojas} 
                          onChange={e => actualizarPerchero(i, 'rojas', +e.target.value || 0)} 
                          style={styles.tableInput} 
                        />
                      </td>
                      <td style={styles.percherosTableCell}>
                        <input 
                          type="number" 
                          value={p.patasManos} 
                          onChange={e => actualizarPerchero(i, 'patasManos', +e.target.value || 0)} 
                          style={styles.tableInput} 
                        />
                      </td>
                      <td style={styles.percherosTableCell}>
                        <input 
                          type="number" 
                          value={p.cabezas} 
                          onChange={e => actualizarPerchero(i, 'cabezas', +e.target.value || 0)} 
                          style={styles.tableInput} 
                        />
                      </td>
                      <td style={styles.percherosTableCell}>
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