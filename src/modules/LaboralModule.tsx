import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function LaboralModule({ setModule }: { setModule: (m: string) => void }) {
  const [activeTab, setActiveTab] = useState<'inventario' | 'cavas' | 'percheros'>('inventario');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  // ====================== DETECCIÓN DE DISPOSITIVOS ======================
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // ====================== PERSISTENCIA DE DATOS ======================
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

  // ==================== FUNCIÓN CORREGIDA PARA CALCULAR TOTAL GENERAL ====================
  const calcularTotalGeneral = () => {
    const totalBlancas = cavas.reduce((sum, c) => {
      if (c.grupo === "V. Rojas & Blancas (V.Blancas)" || c.grupo === "V. Acondicionamiento") {
        return sum + c.inventario;
      }
      return sum;
    }, 0);

    const vRojas = cavas.find(c => c.grupo === "V. Rojas & Blancas (V.Rojas)")?.inventario || 0;
    const patasManos = cavas.find(c => c.grupo === "Patas & Manos")?.inventario || 0;
    const cabezas = cavas.find(c => c.grupo === "Cabezas")?.inventario || 0;

    const partes = [vRojas, totalBlancas, patasManos, cabezas];
    const minJuegosCompletos = Math.min(...partes);
    
    let totalJuegos = minJuegosCompletos;
    
    partes.forEach(parte => {
      if (parte > minJuegosCompletos) {
        totalJuegos += (parte - minJuegosCompletos) * 0.25;
      }
    });

    const totalCapacidad = cavas.reduce((sum, c) => sum + capacidadTotal(c), 0);
    const totalInventario = cavas.reduce((sum, c) => sum + c.inventario, 0);
    const promedioPorcentaje = totalCapacidad > 0 ? 
      Math.round((totalInventario / totalCapacidad) * 100) : 0;
    
    return {
      totalJuegos: totalJuegos,
      totalInventario: totalInventario,
      promedioPorcentaje,
      totalBlancas
    };
  };
  // ==================== FIN: PESTAÑA OCUPACIÓN CAVAS ====================

  // ==================== INICIO: PESTAÑA CARROS PERCHEROS ====================
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

  const totalEnUso = percheros.reduce((sum, p) => 
    sum + p.blancas + p.rojas + p.patasManos + p.cabezas + p.crudas, 0
  );

  const disponibles = stockTotal - danados - totalEnUso;
  const esBajoStock = disponibles < 30;

  // ==================== FIN: PESTAÑA CARROS PERCHEROS ====================

  // ====================== CHECKBOX INCLUIR ======================
  const [incluir, setIncluir] = useState({ 
    inv: true, 
    cavas: true, 
    percheros: true,
    distribucion: true
  });

  // ==================== FUNCIÓN GENERAR INFORME ====================
  const generarInforme = () => {
    const logo = "/logo_informe.png";
    const { totalJuegos, promedioPorcentaje } = calcularTotalGeneral();

    let htmlBeneficio = '';
    if (incluir.cavas && beneficioDia !== undefined) {
      htmlBeneficio = `
        <div style="text-align:center; margin:5px 0 10px 0;">
          <h2 style="color:#4CAF50;text-align:center;margin:0 0 15px 0;font-size:24px;font-weight:bold;">BENEFICIO DEL DÍA</h2>
          <div style="display:flex; justify-content:center; gap:15px; margin:0 auto; max-width:600px;">
            <div style="background:white; padding:20px; border-radius:10px; box-shadow:0 3px 10px rgba(0,0,0,0.12); text-align:center; flex:1; max-width:200px; border-top:5px solid #9b59b6;">
              <div style="color:#7f8c8d; font-size:14px; margin-bottom:10px;font-weight:bold;">ANIMALES BENEFICIADOS</div>
              <div style="font-size:36px; font-weight:bold; color:#9b59b6;">${beneficioDia}</div>
            </div>
          </div>
        </div>
      `;
    }

    let htmlInv = '';
    if (incluir.inv) {
      htmlInv = `
        <h1 style="color:#4CAF50;text-align:center;margin:20px 0 15px;font-size:24px;font-weight:bold;">INVENTARIO PRODUCTO FRÍO EN CAVA</h1>
        
        <div style="display:flex; justify-content:center; gap:15px; margin:20px 0 25px 0; flex-wrap:wrap;">
          <div style="background:white; padding:20px; border-radius:10px; box-shadow:0 3px 10px rgba(0,0,0,0.12); text-align:center; flex:1; max-width:180px; border-top:5px solid #27ae60;">
            <div style="color:#7f8c8d; font-size:14px; margin-bottom:8px;font-weight:bold;">JUEGOS COMPLETOS</div>
            <div style="font-size:28px; font-weight:bold; color:#27ae60;">${completos}</div>
          </div>
          <div style="background:white; padding:20px; border-radius:10px; box-shadow:0 3px 10px rgba(0,0,0,0.12); text-align:center; flex:1; max-width:180px; border-top:5px solid #e74c3c;">
            <div style="color:#7f8c8d; font-size:14px; margin-bottom:8px;font-weight:bold;">JUEGOS INCOMPLETOS</div>
            <div style="font-size:28px; font-weight:bold; color:#e74c3c;">${incompletos}</div>
          </div>
          <div style="background:white; padding:20px; border-radius:10px; box-shadow:0 3px 10px rgba(0,0,0,0.12); text-align:center; flex:1; max-width:180px; border-top:5px solid #3498db;">
            <div style="color:#7f8c8d; font-size:14px; margin-bottom:8px;font-weight:bold;">TOTAL JUEGOS</div>
            <div style="font-size:28px; font-weight:bold; color:#3498db;">${completos + incompletos}</div>
          </div>
        </div>
      `;

      if (novedades.length > 0) {
        let filasNovedades = novedades.map(n => 
          `<tr><td style="padding:8px 6px; font-size:28px;font-weight:bold;">${n.cod}</td><td style="padding:8px 6px; font-size:28px;">${n.desc}</td></tr>`
        ).join('');
        
        htmlInv += `
          <h3 style="color:#4CAF50;margin:20px 0 10px;text-align:center; font-size:20px;font-weight:bold;">NOVEDADES POR CÓDIGO</h3>
          <table style="width:90%;margin:0 auto;font-size:14px; border-collapse:collapse;box-shadow:0 2px 6px rgba(0,0,0,0.1);">
            <tr style="background:#4CAF50;color:white;">
              <th style="padding:10px 8px; font-size:16px; width:25%;font-weight:bold;">CÓDIGO</th>
              <th style="padding:10px 8px; font-size:16px; width:75%;font-weight:bold;">DETALLE</th>
            </tr>
            ${filasNovedades}
          </table>
        `;
      }
    }

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
                <td rowspan="${cavasDelGrupo.length}" style="background:#f0f0f0;font-weight:bold;vertical-align:middle;padding:10px 8px;font-size:22px; width:20%;">${grupo}</td>
                <td style="padding:10px 8px;font-size:22px; width:15%;">${c.tipo} × ${c.carros}</td>
                <td style="padding:10px 8px;font-size:22px; width:12%;font-weight:bold;">${capacidadTotal(c)}</td>
                <td style="background:#fff2f2;padding:10px 8px;font-size:22px; width:12%;font-weight:bold;">${c.inventario}</td>
                <td style="background:#fff8e1;font-weight:bold;padding:10px 8px;font-size:22px; width:10%;">${porcentaje(c)}%</td>
              </tr>
            `;
          } else {
            filasCavas += `
              <tr>
                <td style="padding:10px 8px;font-size:22px;">${c.tipo} × ${c.carros}</td>
                <td style="padding:10px 8px;font-size:22px;font-weight:bold;">${capacidadTotal(c)}</td>
                <td style="background:#fff2f2;padding:10px 8px;font-size:22px;font-weight:bold;">${c.inventario}</td>
                <td style="background:#fff8e1;font-weight:bold;padding:10px 8px;font-size:22px;">${porcentaje(c)}%</td>
              </tr>
            `;
          }
        });
      });

      htmlCavasTabla = `
        <h1 style="color:#4CAF50;text-align:center;margin:25px 0 15px;font-size:24px;font-weight:bold;">OCUPACIÓN CAVAS VÍSCERAS</h1>
        <table style="width:95%;margin:0 auto;border-collapse:collapse;font-size:16px;box-shadow:0 2px 6px rgba(0,0,0,0.1);">
          <tr style="background:#4CAF50;color:white;">
            <th style="padding:12px 10px;font-size:18px; width:20%;font-weight:bold;">CAVA</th>
            <th style="padding:12px 10px;font-size:18px; width:15%;font-weight:bold;">CARROS</th>
            <th style="padding:12px 10px;font-size:18px; width:12%;font-weight:bold;">CAPACIDAD TOTAL</th>
            <th style="padding:12px 10px;font-size:18px; width:12%;font-weight:bold;">INVENTARIO TOTAL</th>
            <th style="padding:12px 10px;font-size:18px; width:10%;font-weight:bold;">PARTICIPACIÓN TOTAL</th>
          </tr>
          ${filasCavas}
          <tr style="background:#4CAF50;color:white;font-weight:bold;">
            <td colspan="3" style="text-align:center;padding:12px 10px;font-size:22px;">TOTAL GENERAL</td>
            <td style="padding:12px 10px;font-size:24px;">${totalJuegos.toFixed(2)}</td>
            <td style="padding:12px 10px;font-size:24px;">${promedioPorcentaje}%</td>
          </tr>
        </table>
      `;
    }

    let htmlPercheros = '';
    if (incluir.percheros) {
      let filasPercheros = percheros.map(p => `
        <tr>
          <td style="text-align:left; padding:10px 8px; font-weight:bold; border:2px solid #ddd;font-size:14px;">${p.cava}</td>
          <td style="padding:10px 8px; border:2px solid #ddd;font-size:14px;font-weight:bold;">${p.blancas || '-'}</td>
          <td style="padding:10px 8px; border:2px solid #ddd;font-size:14px;font-weight:bold;">${p.rojas || '-'}</td>
          <td style="padding:10px 8px; border:2px solid #ddd;font-size:14px;font-weight:bold;">${p.patasManos || '-'}</td>
          <td style="padding:10px 8px; border:2px solid #ddd;font-size:14px;font-weight:bold;">${p.cabezas || '-'}</td>
          <td style="padding:10px 8px; border:2px solid #ddd;font-size:14px;font-weight:bold;">${p.crudas || '-'}</td>
        </tr>
      `).join('');

      let htmlDistribucion = '';
      if (incluir.distribucion) {
        htmlDistribucion = `
          <h2 style="color:#4CAF50;text-align:center;margin:25px 0 15px;font-size:20px;font-weight:bold;">DISTRIBUCIÓN POR CAVAS</h2>
          <table style="width:95%;margin:0 auto;border-collapse:collapse;font-size:14px;box-shadow:0 2px 6px rgba(0,0,0,0.1);">
            <tr style="background:#4CAF50;color:white;">
              <th style="padding:12px 10px;font-size:16px; text-align:left;font-weight:bold;">CAVAS</th>
              <th style="padding:12px 10px;font-size:16px;font-weight:bold;">V-BLANCAS</th>
              <th style="padding:12px 10px;font-size:16px;font-weight:bold;">V-ROJAS</th>
              <th style="padding:12px 10px;font-size:16px;font-weight:bold;">PATAS/MANOS</th>
              <th style="padding:12px 10px;font-size:16px;font-weight:bold;">CABEZAS</th>
              <th style="padding:12px 10px;font-size:16px;font-weight:bold;">CRUDAS</th>
            </tr>
            <tr style="background:#f0f0f0; font-weight:bold;">
              <td style="text-align:left; padding:10px 8px; border:2px solid #ddd;font-size:14px;">MÍNIMO PARA INICIAR</td>
              <td style="padding:10px 8px; border:2px solid #ddd;font-size:14px;">8</td>
              <td style="padding:10px 8px; border:2px solid #ddd;font-size:14px;">8</td>
              <td style="padding:10px 8px; border:2px solid #ddd;font-size:14px;">2</td>
              <td style="padding:10px 8px; border:2px solid #ddd;font-size:14px;">5</td>
              <td style="padding:10px 8px; border:2px solid #ddd;font-size:14px;">1</td>
            </tr>
            ${filasPercheros}
          </table>
        `;
      }

      htmlPercheros = `
        <h1 style="color:#4CAF50;text-align:center;margin:25px 0 15px;font-size:24px;font-weight:bold;">DISPONIBILIDAD DE CARROS PERCHEROS</h1>
        
        <div style="display:flex; justify-content:center; gap:15px; margin:20px 0 25px 0; flex-wrap:wrap;">
          <div style="background:white; padding:18px; border-radius:10px; box-shadow:0 3px 10px rgba(0,0,0,0.12); text-align:center; flex:1; max-width:160px; border-top:5px solid #3498db;">
            <div style="color:#7f8c8d; font-size:13px; margin-bottom:8px;font-weight:bold;">STOCK TOTAL</div>
            <div style="font-size:24px; font-weight:bold; color:#3498db;">${stockTotal}</div>
          </div>
          <div style="background:white; padding:18px; border-radius:10px; box-shadow:0 3px 10px rgba(0,0,0,0.12); text-align:center; flex:1; max-width:160px; border-top:5px solid #e74c3c;">
            <div style="color:#7f8c8d; font-size:13px; margin-bottom:8px;font-weight:bold;">DAÑADOS</div>
            <div style="font-size:24px; font-weight:bold; color:#e74c3c;">${danados}</div>
          </div>
          <div style="background:white; padding:18px; border-radius:10px; box-shadow:0 3px 10px rgba(0,0,0,0.12); text-align:center; flex:1; max-width:160px; border-top:5px solid #f39c12;">
            <div style="color:#7f8c8d; font-size:13px; margin-bottom:8px;font-weight:bold;">EN USO</div>
            <div style="font-size:24px; font-weight:bold; color:#f39c12;">${totalEnUso}</div>
          </div>
          <div style="background:white; padding:18px; border-radius:10px; box-shadow:0 3px 10px rgba(0,0,0,0.12); text-align:center; flex:1; max-width:160px; border-top:5px solid ${esBajoStock ? '#e74c3c' : '#27ae60'};">
            <div style="color:#7f8c8d; font-size:13px; margin-bottom:8px;font-weight:bold;">DISPONIBLES</div>
            <div style="font-size:24px; font-weight:bold; color:${esBajoStock ? '#e74c3c' : '#27ae60'};">${disponibles}</div>
            <div style="font-size:12px; color:${esBajoStock ? '#e74c3c' : '#27ae60'}; margin-top:6px; font-weight:bold;">
              ${esBajoStock ? '⚠️ BAJO' : '✅ OK'}
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
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
        body {
            font-family: Arial, sans-serif;
            margin: 15px;
            background: white;
            font-size: 14px;
            line-height: 1.3;
        }
        img {
            display: block;
            margin: 10px auto;
            width: 150px;
            height: auto;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        .header h1 {
            color: #2c3e50;
            margin: 10px 0 5px 0;
            font-size: 26px;
            font-weight: bold;
        }
        .header .subtitle {
            color: #7f8c8d;
            font-size: 16px;
            margin-top: 5px;
            font-weight: bold;
        }
        h1 {
            color: #4CAF50;
            text-align: center;
            font-size: 22px;
            margin: 15px 0;
            font-weight: bold;
        }
        h2 {
            color: #4CAF50;
            text-align: center;
            font-size: 20px;
            margin: 15px 0;
            font-weight: bold;
        }
        h3 {
            color: #4CAF50;
            text-align: center;
            font-size: 18px;
            margin: 12px 0;
            font-weight: bold;
        }
        table {
            width: 95%;
            max-width: 900px;
            margin: 15px auto;
            border-collapse: collapse;
            font-size: 14px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        th, td {
            border: 2px solid #ddd;
            padding: 10px 8px;
            text-align: center;
            font-size: 14px;
        }
        th {
            background: #4CAF50;
            color: white;
            font-weight: bold;
        }
        .firma {
            margin-top: 30px;
            text-align: center;
            color: #4CAF50;
            font-weight: bold;
            font-size: 16px;
        }
        .export-button {
            display: block;
            margin: 20px auto;
            padding: 12px 25px;
            background: #25D366;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            text-align: center;
            width: 280px;
        }
        .export-button:hover {
            background: #128C7E;
        }
        .export-button:disabled {
            background: #95a5a6;
            cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
            body {
                margin: 10px;
                font-size: 12px;
            }
            h1 {
                font-size: 18px !important;
                margin: 12px 0 !important;
            }
            h2 {
                font-size: 16px !important;
                margin: 10px 0 !important;
            }
            h3 {
                font-size: 14px !important;
                margin: 8px 0 !important;
            }
            table {
                font-size: 11px !important;
            }
            th, td {
                padding: 8px 6px !important;
                font-size: 11px !important;
            }
            .header h1 {
                font-size: 20px !important;
            }
            .header .subtitle {
                font-size: 14px !important;
            }
            .export-button {
                width: 90% !important;
                padding: 14px !important;
                font-size: 14px !important;
            }
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
        <small style="font-size:24px;">SERGIO ANAYA<br>
        <small style="font-size:24px;">GESTOR DE VÍSCERAS</small>
    </div>
    
    <button class="export-button" onclick="exportarComoPNGAltaCalidad()" id="exportBtn">
        📸 Exportar como PNG 4K
    </button>

    <script>
        function exportarComoPNGAltaCalidad() {
            const button = document.getElementById('exportBtn');
            const originalText = button.innerHTML;
            
            button.innerHTML = '⏳ Generando imagen 4K...';
            button.disabled = true;
            button.style.display = 'none';

            const options = {
                scale: 4,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                width: document.documentElement.scrollWidth,
                height: document.documentElement.scrollHeight,
                scrollX: 0,
                scrollY: 0,
                windowWidth: document.documentElement.scrollWidth,
                windowHeight: document.documentElement.scrollHeight,
                onclone: (clonedDoc) => {
                    const elements = clonedDoc.querySelectorAll('*');
                    elements.forEach(el => {
                        el.style.transform = 'translateZ(0)';
                    });
                }
            };

            setTimeout(() => {
                html2canvas(document.body, options).then(canvas => {
                    const imagen = canvas.toDataURL('image/png', 1.0);
                    
                    const enlace = document.createElement('a');
                    enlace.download = 'Informe_Visceras.png';
                    enlace.href = imagen;
                    document.body.appendChild(enlace);
                    enlace.click();
                    document.body.removeChild(enlace);
                    
                    button.style.display = 'block';
                    button.innerHTML = '✅ Descargado';
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.disabled = false;
                    }, 2000);
                    
                }).catch(error => {
                    console.error('Error al generar imagen:', error);
                    button.style.display = 'block';
                    button.innerHTML = '❌ Error - Reintentar';
                    setTimeout(() => {
                        button.innerHTML = originalText;
                        button.disabled = false;
                    }, 3000);
                });
            }, 1000);
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

  // ==================== ESTILOS RESPONSIVOS UNIFICADOS ====================
  const getResponsiveSize = (mobile: number, tablet: number, desktop: number) => {
    if (isMobile) return `${mobile}px`;
    if (isTablet) return `${tablet}px`;
    return `${desktop}px`;
  };

  const styles = {
    container: {
      padding: getResponsiveSize(10, 15, 20),
      maxWidth: '100%',
      margin: '0 auto',
      minHeight: '100vh',
      background: '#f5f5f5',
      overflowX: 'hidden' as const
    },
    header: {
      textAlign: 'center' as const,
      marginBottom: getResponsiveSize(15, 20, 25),
      position: 'relative' as const
    },
    title: {
      color: '#006400',
      fontSize: getResponsiveSize(18, 22, 26),
      fontWeight: 'bold',
      marginBottom: getResponsiveSize(10, 12, 0)
    },
    closeButton: {
      position: 'absolute' as const,
      top: getResponsiveSize(-5, 0, 5),
      right: '0',
      fontSize: getResponsiveSize(24, 28, 32),
      background: 'none',
      border: 'none',
      color: '#999',
      cursor: 'pointer',
      padding: '5px',
      lineHeight: '1'
    },
    tabsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: getResponsiveSize(6, 8, 10),
      marginBottom: getResponsiveSize(15, 18, 20),
      flexWrap: 'wrap' as const
    },
    tabButton: {
      padding: getResponsiveSize(10, 12, 14),
      border: 'none',
      borderRadius: '8px',
      fontWeight: 'bold',
      fontSize: getResponsiveSize(14, 15, 16),
      minWidth: getResponsiveSize(100, 120, 140),
      cursor: 'pointer',
      flex: isMobile ? '1' : 'none',
      transition: 'all 0.3s ease'
    },
    checkboxContainer: {
      background: '#e8f5e8',
      padding: getResponsiveSize(10, 12, 14),
      borderRadius: '10px',
      marginBottom: getResponsiveSize(15, 18, 20),
      textAlign: 'center' as const,
      border: '2px solid #006400'
    },
    checkboxLabel: {
      margin: `0 ${getResponsiveSize(8, 10, 12)}px`,
      display: isMobile ? 'block' : 'inline-block',
      marginBottom: isMobile ? '8px' : '0',
      fontSize: getResponsiveSize(14, 15, 16)
    },
    sectionContainer: {
      background: 'white',
      padding: getResponsiveSize(15, 20, 25),
      borderRadius: '12px',
      border: '2px solid #006400',
      marginBottom: getResponsiveSize(15, 20, 25),
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    input: {
      padding: getResponsiveSize(10, 12, 14),
      borderRadius: '8px',
      border: '2px solid #006400',
      fontSize: getResponsiveSize(14, 16, 18),
      width: '100%',
      minHeight: getResponsiveSize(44, 48, 52)
    },
    grid2Col: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: getResponsiveSize(10, 15, 20)
    },
    grid4Col: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
      gap: getResponsiveSize(8, 12, 16),
      marginBottom: getResponsiveSize(15, 20, 25)
    },
    dataItem: {
      background: '#f8f9fa',
      padding: getResponsiveSize(10, 12, 14),
      borderRadius: '8px',
      border: '1px solid #ddd',
      textAlign: 'center' as const,
      minHeight: getResponsiveSize(80, 90, 100)
    },
    tableInput: {
      width: getResponsiveSize(50, 60, 70),
      padding: getResponsiveSize(6, 8, 10),
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: getResponsiveSize(14, 15, 16),
      textAlign: 'center' as const
    },
    generateButton: {
      background: '#006400',
      color: 'white',
      padding: `${getResponsiveSize(14, 16, 18)} ${getResponsiveSize(30, 40, 50)}`,
      fontSize: getResponsiveSize(16, 18, 20),
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,100,0,0.3)',
      width: isMobile ? '100%' : 'auto',
      marginTop: getResponsiveSize(20, 25, 30),
      minHeight: getResponsiveSize(50, 55, 60)
    },
    actionButtons: {
      display: 'flex',
      justifyContent: 'center',
      gap: getResponsiveSize(10, 12, 15),
      marginBottom: getResponsiveSize(15, 18, 20),
      flexWrap: 'wrap' as const
    },
    secondaryButton: {
      background: '#666',
      color: 'white',
      padding: `${getResponsiveSize(8, 10, 12)} ${getResponsiveSize(16, 20, 24)}`,
      fontSize: getResponsiveSize(14, 15, 16),
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      minHeight: getResponsiveSize(40, 45, 50)
    },
    cavaContainer: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      gap: getResponsiveSize(10, 12, 15)
    },
    cavaRow: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr 1.5fr 1fr',
      gap: getResponsiveSize(8, 10, 12),
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '1000px',
      margin: '0 auto',
      padding: getResponsiveSize(10, 12, 14),
      background: '#f9f9f9',
      borderRadius: '10px',
      border: '1px solid #ddd'
    },
    cavaHeader: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr 1fr 1.5fr 1fr',
      gap: getResponsiveSize(8, 10, 12),
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      maxWidth: '1000px',
      margin: '0 auto 12px auto',
      padding: getResponsiveSize(10, 12, 14),
      background: '#006400',
      color: 'white',
      borderRadius: '8px',
      fontWeight: 'bold',
      fontSize: getResponsiveSize(14, 15, 16),
      textAlign: 'center' as const
    },
    cavaLabel: {
      fontWeight: 'bold',
      color: '#006400',
      fontSize: getResponsiveSize(14, 15, 16),
      textAlign: 'center' as const,
      padding: getResponsiveSize(5, 8, 10)
    },
    cavaInput: {
      width: '100%',
      padding: getResponsiveSize(6, 8, 10),
      border: '1px solid #006400',
      borderRadius: '6px',
      background: '#f0f8f0',
      fontSize: getResponsiveSize(14, 15, 16),
      textAlign: 'center' as const,
      minHeight: getResponsiveSize(40, 45, 50)
    },
    cavaInputLarge: {
      width: '100%',
      padding: getResponsiveSize(8, 10, 12),
      fontSize: getResponsiveSize(16, 18, 20),
      border: '3px solid #d32f2f',
      borderRadius: '8px',
      background: '#ffebee',
      fontWeight: 'bold',
      textAlign: 'center' as const,
      minHeight: getResponsiveSize(45, 50, 55)
    },
    cavaValue: {
      fontWeight: 'bold',
      textAlign: 'center' as const,
      fontSize: getResponsiveSize(14, 16, 18),
      color: '#006400',
      padding: getResponsiveSize(5, 8, 10)
    },
    cavaPercentage: {
      fontSize: getResponsiveSize(16, 18, 20),
      fontWeight: 'bold',
      color: '#006400',
      textAlign: 'center' as const,
      padding: getResponsiveSize(5, 8, 10)
    },
    percherosContainer: {
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden',
      marginBottom: getResponsiveSize(15, 20, 25)
    },
    percherosHeader: {
      background: '#2c3e50',
      color: 'white',
      padding: getResponsiveSize(12, 15, 18),
      textAlign: 'center' as const
    },
    percherosContent: {
      padding: getResponsiveSize(15, 20, 25)
    },
    percherosGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
      gap: getResponsiveSize(8, 12, 16),
      marginBottom: getResponsiveSize(15, 20, 25)
    },
    percherosTableContainer: {
      overflowX: 'auto',
      borderRadius: '6px',
      border: '1px solid #ddd',
      WebkitOverflowScrolling: 'touch' as const,
      marginBottom: getResponsiveSize(15, 20, 25)
    },
    percherosTable: {
      width: '100%',
      borderCollapse: 'collapse' as const,
      fontSize: getResponsiveSize(14, 15, 16)
    },
    percherosTableCell: {
      padding: getResponsiveSize(6, 8, 10),
      textAlign: 'center' as const,
      border: '1px solid #ddd',
      minHeight: getResponsiveSize(40, 45, 50)
    },
    percherosTableHeader: {
      background: '#2c3e50',
      color: 'white',
      padding: getResponsiveSize(8, 10, 12),
      textAlign: 'center' as const,
      fontWeight: 'bold'
    },
    beneficioInput: {
      width: getResponsiveSize(120, 140, 160),
      padding: getResponsiveSize(10, 12, 14),
      fontSize: getResponsiveSize(18, 20, 22),
      fontWeight: 'bold',
      border: '3px solid #006400',
      borderRadius: '10px',
      background: '#e8f5e8',
      textAlign: 'center' as const,
      margin: '0 auto',
      display: 'block',
      minHeight: getResponsiveSize(50, 55, 60)
    }
  };

  return (
    <div style={styles.container}>
      {/* CABECERA */}
      <div style={styles.header}>
        <h2 style={styles.title}>
          Módulo Laboral - <img src="/logo_informe.png" alt="Logo" style={{
            height: getResponsiveSize(25, 30, 35), 
            verticalAlign: 'middle', 
            marginLeft: getResponsiveSize(5, 8, 10)
          }} />
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

      {/* CHECKBOX INCLUIR */}
      <div style={styles.checkboxContainer}>
        <strong style={{fontSize: getResponsiveSize(14, 16, 18)}}>Incluir en el informe:</strong>
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
          <h3 style={{ 
            color: '#006400', 
            marginBottom: getResponsiveSize(20, 25, 30), 
            fontSize: getResponsiveSize(18, 20, 22),
            textAlign: 'center' as const
          }}>
            Inventario Producto Frío en Cava
          </h3>
          <div style={{ 
            display: 'grid', 
            gap: getResponsiveSize(15, 20, 25), 
            marginBottom: getResponsiveSize(20, 25, 30) 
          }}>
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

          <h4 style={{ 
            color: '#006400', 
            margin: `${getResponsiveSize(15, 20, 25)}px 0 ${getResponsiveSize(10, 12, 15)}px`, 
            fontSize: getResponsiveSize(16, 18, 20),
            textAlign: 'center' as const
          }}>
            Novedades por Código
          </h4>
          <div style={{ 
            display: 'flex', 
            gap: getResponsiveSize(8, 10, 12), 
            marginBottom: getResponsiveSize(15, 20, 25), 
            flexDirection: isMobile ? 'column' : 'row' 
          }}>
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
                padding: `${getResponsiveSize(8, 10, 12)}px ${getResponsiveSize(12, 15, 18)}px`, 
                background: '#006400', 
                color: 'white', 
                border: 'none', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontSize: getResponsiveSize(14, 15, 16),
                minHeight: getResponsiveSize(44, 48, 52),
                whiteSpace: 'nowrap' as const,
                fontWeight: 'bold'
              }}
            >
              <Plus size={getResponsiveSize(18, 20, 22)} /> {isMobile ? 'Agregar' : 'Agregar Novedad'}
            </button>
          </div>

          {novedades.map((n, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              background: '#fff3cd', 
              padding: getResponsiveSize(8, 10, 12), 
              borderRadius: '6px', 
              marginBottom: getResponsiveSize(8, 10, 12),
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '8px' : '0',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: getResponsiveSize(14, 15, 16), flex: 1 }}>
                <strong>{n.cod}</strong> → {n.desc}
              </span>
              <button 
                onClick={() => eliminarNovedad(i)} 
                style={{ 
                  color: '#d32f2f', 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  padding: getResponsiveSize(4, 6, 8)
                }}
              >
                <Trash2 size={getResponsiveSize(16, 18, 20)} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ==================== PESTAÑA OCUPACIÓN CAVAS ==================== */}
      {activeTab === 'cavas' && (
        <div style={styles.sectionContainer}>
          <div style={{ textAlign: 'center', marginBottom: getResponsiveSize(20, 25, 30) }}>
            <div style={{ 
              fontSize: getResponsiveSize(16, 18, 20), 
              fontWeight: 'bold', 
              color: '#006400', 
              marginBottom: getResponsiveSize(8, 10, 12) 
            }}>
              Beneficio del día
            </div>
            <input
              type="number"
              value={beneficioDia || ''}
              onChange={e => {setBeneficioDia(e.target.value ? +e.target.value : undefined); guardarDatos();}}
              style={styles.beneficioInput}
              placeholder="0"
            />
            <div style={{ 
              fontSize: getResponsiveSize(14, 16, 18), 
              fontWeight: 'bold', 
              color: '#006400', 
              marginTop: getResponsiveSize(8, 10, 12) 
            }}>
              animales
            </div>
          </div>

          <h3 style={{ 
            textAlign: 'center', 
            color: '#006400', 
            margin: `${getResponsiveSize(15, 20, 25)}px 0 ${getResponsiveSize(20, 25, 30)}px`, 
            fontWeight: 'bold',
            fontSize: getResponsiveSize(18, 20, 22)
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

          {/* FILAS DE CAVAS */}
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

      {/* ==================== PESTAÑA CARROS PERCHEROS ==================== */}
      {activeTab === 'percheros' && (
        <div style={styles.percherosContainer}>
          <div style={styles.percherosHeader}>
            <h3 style={{ 
              margin: 0, 
              fontSize: getResponsiveSize(18, 20, 22),
              fontWeight: 'bold'
            }}>
              Inventario Carros Percheros
            </h3>
            <small style={{
              fontSize: getResponsiveSize(12, 14, 16),
              opacity: 0.9
            }}>
              Actualización en tiempo real
            </small>
          </div>

          <div style={styles.percherosContent}>
            {/* RESUMEN GENERAL */}
            <div style={styles.percherosGrid}>
              <div style={styles.dataItem}>
                <div style={{ 
                  fontSize: getResponsiveSize(12, 14, 16), 
                  color: '#6c757d',
                  marginBottom: getResponsiveSize(5, 8, 10)
                }}>
                  Stock Total
                </div>
                <input 
                  type="number" 
                  value={stockTotal} 
                  onChange={e => {setStockTotal(+e.target.value || 0); guardarDatos();}} 
                  style={{ 
                    width: '100%', 
                    padding: getResponsiveSize(6, 8, 10), 
                    border: '1px solid #999', 
                    borderRadius: '6px', 
                    fontSize: getResponsiveSize(16, 18, 20), 
                    fontWeight: 'bold', 
                    marginTop: getResponsiveSize(4, 6, 8),
                    textAlign: 'center'
                  }} 
                />
              </div>
              <div style={styles.dataItem}>
                <div style={{ 
                  fontSize: getResponsiveSize(12, 14, 16), 
                  color: '#6c757d',
                  marginBottom: getResponsiveSize(5, 8, 10)
                }}>
                  Dañados
                </div>
                <input 
                  type="number" 
                  value={danados} 
                  onChange={e => {setDanados(+e.target.value || 0); guardarDatos();}} 
                  style={{ 
                    width: '100%', 
                    padding: getResponsiveSize(6, 8, 10), 
                    border: '1px solid #999', 
                    borderRadius: '6px', 
                    fontSize: getResponsiveSize(16, 18, 20), 
                    fontWeight: 'bold', 
                    marginTop: getResponsiveSize(4, 6, 8),
                    textAlign: 'center'
                  }} 
                />
              </div>
              <div style={styles.dataItem}>
                <div style={{ 
                  fontSize: getResponsiveSize(12, 14, 16), 
                  color: '#6c757d',
                  marginBottom: getResponsiveSize(5, 8, 10)
                }}>
                  En Uso
                </div>
                <div style={{ 
                  fontSize: getResponsiveSize(20, 22, 24), 
                  fontWeight: 'bold', 
                  color: '#2c3e50',
                  marginTop: getResponsiveSize(4, 6, 8)
                }}>
                  {totalEnUso}
                </div>
              </div>
              <div style={{
                ...styles.dataItem,
                background: esBajoStock ? '#ffeaea' : '#e8f5e9',
                border: esBajoStock ? '2px solid #e74c3c' : '1px solid #ddd'
              }}>
                <div style={{ 
                  fontSize: getResponsiveSize(12, 14, 16), 
                  color: '#6c757d',
                  marginBottom: getResponsiveSize(5, 8, 10)
                }}>
                  Disponibles
                </div>
                <div style={{ 
                  fontSize: getResponsiveSize(20, 22, 24), 
                  fontWeight: 'bold', 
                  color: esBajoStock ? '#e74c3c' : '#27ae60',
                  marginTop: getResponsiveSize(4, 6, 8)
                }}>
                  {disponibles}
                  {esBajoStock && (
                    <div style={{ 
                      fontSize: getResponsiveSize(10, 12, 14), 
                      marginTop: getResponsiveSize(4, 6, 8), 
                      background: '#e74c3c', 
                      color: 'white', 
                      padding: `${getResponsiveSize(2, 3, 4)}px ${getResponsiveSize(6, 8, 10)}px`, 
                      borderRadius: '10px',
                      display: 'inline-block'
                    }}>
                      BAJO STOCK
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* TABLA DISTRIBUCIÓN */}
            <h4 style={{ 
              color: '#2c3e50', 
              margin: `${getResponsiveSize(15, 20, 25)}px 0 ${getResponsiveSize(10, 12, 15)}px`, 
              fontWeight: '600',
              fontSize: getResponsiveSize(16, 18, 20),
              textAlign: 'center' as const
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
                    <td style={{ ...styles.percherosTableCell, textAlign: 'left' as const }}>Mínimo inicio</td>
                    <td style={styles.percherosTableCell}>8</td>
                    <td style={styles.percherosTableCell}>8</td>
                    <td style={styles.percherosTableCell}>2</td>
                    <td style={styles.percherosTableCell}>5</td>
                    <td style={styles.percherosTableCell}>1</td>
                  </tr>
                  {percheros.map((p, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? '#fdfdfd' : 'white' }}>
                      <td style={{ 
                        ...styles.percherosTableCell, 
                        textAlign: 'left' as const, 
                        fontWeight: '500',
                        fontSize: getResponsiveSize(14, 15, 16)
                      }}>
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

      {/* BOTÓN GENERAR INFORME */}
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
