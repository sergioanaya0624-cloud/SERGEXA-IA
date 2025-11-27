export default function OcioModule({ setModule }: { setModule: (m: string) => void }) {
  return (
    <div className="module">
      <h2>Ocio - Próximamente</h2>
      <button className="btn" onClick={() => setModule('inicio')}>← Volver al inicio</button>
    </div>
  );
}