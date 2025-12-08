import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderRecep from "../components/Header";
import { useUser } from "../context/UserContext";
import BackIcon from "../assets/back-arrow.svg";
import "./styles/HomeRecep.css"; 

export default function Historial() {
  const { nombre, puesto } = useUser();
  const navigate = useNavigate();
  const [citas, setCitas] = useState([]);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/citas")
      .then((res) => res.json())
      .then((data) => {
        const ordenadas = data.sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));
        setCitas(ordenadas);
      })
      .catch(console.error);
  }, []);

  const citasFiltradas = citas.filter(c => 
    c.motivo_consulta.toLowerCase().includes(filtro.toLowerCase()) ||
    c.estado.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="recep-container">
      <HeaderRecep nombre={nombre} puesto={puesto} />
      
      <div className="main-grid" style={{ marginTop: '20px' }}>
        <div className="header-simple" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="back-button" onClick={() => navigate("/homerecep")}>
                <img src={BackIcon} alt="volver" style={{ width: '20px' }} />
            </button>
            <h2>Historial Completo de Citas</h2>
        </div>

        <div style={{ marginBottom: '20px' }}>
            <input 
                type="text" 
                placeholder="Filtrar por motivo o estado..." 
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                style={{ padding: '10px', width: '300px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
        </div>

        <div className="tabla-scroll">
            <table className="tabla">
                <thead>
                    <tr>
                        <th>Fecha</th>
                        <th>Paciente (ID)</th>
                        <th>Médico (ID)</th>
                        <th>Motivo</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {citasFiltradas.map(c => (
                        <tr key={c.id}>
                            <td>{new Date(c.fecha_hora).toLocaleDateString()} {new Date(c.fecha_hora).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</td>
                            <td>#{c.id_paciente}</td>
                            <td>#{c.id_medico}</td>
                            <td>{c.motivo_consulta}</td>
                            <td>
                                <span style={{
                                    padding: '4px 8px', borderRadius: '4px',
                                    backgroundColor: c.estado === 'Terminada' ? '#dcfce7' : c.estado === 'Cancelada' ? '#fee2e2' : '#e0f2fe',
                                    color: c.estado === 'Terminada' ? '#166534' : c.estado === 'Cancelada' ? '#991b1b' : '#075985',
                                    fontWeight: 'bold', fontSize: '0.9em'
                                }}>
                                    {c.estado}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}