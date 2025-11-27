import { useState } from 'react'
import InicioModule from './modules/InicioModule'
import MensajesModule from './modules/MensajesModule'
import LaboralModule from './modules/LaboralModule'
import OcioModule from './modules/OcioModule'
import NotasModule from './modules/NotasModule'
import './App.css'

function App() {
  const [module, setModule] = useState<'inicio' | 'mensajes' | 'laboral' | 'ocio' | 'notas'>('inicio')

  return (
    <div className="app">
      <header>
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">SERGEXA-IA</span>
            <h1>SERGEXA-IA</h1>
          </div>
          <nav>
            <ul>
              <li>
                <a 
                  href="#" 
                  className={module === 'inicio' ? 'active' : ''} 
                  onClick={(e) => { e.preventDefault(); setModule('inicio'); }}
                >
                  Inicio
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={module === 'laboral' ? 'active' : ''} 
                  onClick={(e) => { e.preventDefault(); setModule('laboral'); }}
                >
                  Laboral
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={module === 'mensajes' ? 'active' : ''} 
                  onClick={(e) => { e.preventDefault(); setModule('mensajes'); }}
                >
                  Mensajes
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={module === 'notas' ? 'active' : ''} 
                  onClick={(e) => { e.preventDefault(); setModule('notas'); }}
                >
                  Notas con IA
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className={module === 'ocio' ? 'active' : ''} 
                  onClick={(e) => { e.preventDefault(); setModule('ocio'); }}
                >
                  Ocio
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="module-container">
        {module === 'inicio' && <InicioModule setModule={setModule} />}
        {module === 'mensajes' && <MensajesModule setModule={setModule} />}
        {module === 'laboral' && <LaboralModule setModule={setModule} />}
        {module === 'ocio' && <OcioModule setModule={setModule} />}
        {module === 'notas' && <NotasModule setModule={setModule} />}
      </main>

      <footer>
        <p>© 2025 SERGEXA-IA • Creado por Sergio Anaya Bautista</p>
      </footer>
    </div>
  )
}

export default App