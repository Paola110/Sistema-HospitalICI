import { useState, useEffect } from "react";
import "./styles/BuscadorPaciente.css";
import RegistrarPaciente from "./RegistrarPaciente";

export default function BuscadorPaciente({
  onSelectPaciente,
}) {
  const [query, setQuery] = useState("");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si no hay query, limpiamos resultados
    if (query.trim().length === 0) {
      setResultados([]);
      return;
    }

    // Debounce para no saturar la API
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/pacientes/buscar?termino=${encodeURIComponent(query)}`);

        if (res.ok) {
          const data = await res.json();
          setResultados(data);
        } else {
          setResultados([]); // Fallback si error
        }
      } catch (err) {
        console.error("Error buscando pacientes:", err);
      } finally {
        setLoading(false);
      }
    }, 500); // Espera 500ms tras dejar de escribir

    return () => clearTimeout(timer);
  }, [query]);


  return (
    <div className="buscador-container">
      <div className="buscador-top">
        <input
          type="text"
          placeholder="Buscar paciente por nombre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <button className="btn-nuevo" onClick={() => setMostrarModal(true)}>
          Registrar nuevo paciente
        </button>

        {mostrarModal && (
          <RegistrarPaciente
            onClose={() => setMostrarModal(false)}
            onSave={(data) => {
              console.log("Paciente guardado:", data);
              setMostrarModal(false);
            }}
          />
        )}
      </div>

      {query.length > 0 && (
        <div className="buscador-resultados">
          {loading && <p className="cargando-search">Buscando...</p>}

          {!loading && resultados.length === 0 ? (
            <p className="sin-resultados">No se encontraron pacientes</p>
          ) : (
            ResultadosRender(resultados, onSelectPaciente, setQuery)
          )}
        </div>
      )}
    </div>
  );
}

// Helper para renderizar
function ResultadosRender(arr, onSelect, setQuery) {
  return arr.map((p) => (
    <div
      key={p.id}
      className="buscador-item"
      onClick={() => {
        onSelect(p);
        setQuery(""); // Limpia la búsqueda para cerrar la lista
      }}
    >
      <span style={{ fontWeight: 'bold' }}>{p.nombres} {p.apellidos}</span>
      <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '10px' }}>
        Tel: {p.telefono}
      </span>
    </div>
  ));
}
