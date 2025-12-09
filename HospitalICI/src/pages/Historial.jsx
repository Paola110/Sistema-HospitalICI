import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderRecep from "../components/Header"; // Puede reutilizarse o importar HeaderMed si prefieres
import { useUser } from "../context/UserContext";
import BackIcon from "../assets/back-arrow.svg";
import "./styles/HomeRecep.css";
import { API_URL } from "../config";

export default function Historial() {
    const { nombre, puesto, userId } = useUser();
    const navigate = useNavigate();
    const [citasTerminadas, setCitasTerminadas] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [fechaFiltro, setFechaFiltro] = useState("");

    useEffect(() => {
        if (!userId) return;

        fetch(`${API_URL}/citas/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                // 1. Filtrar solo las terminadas (Case insensitive por seguridad)
                // 2. Ordenar por fecha descendente
                const terminadas = data
                    .filter(c => c.estado && c.estado.toLowerCase() === 'terminada')
                    .sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));

                setCitasTerminadas(terminadas);
            })
            .catch(console.error);
    }, [userId]);

    const listaFiltrada = citasTerminadas.filter(c => {
        // Filtro por NOMBRE PACIENTE
        const nombreCompleto = `${c.nombres_paciente} ${c.apellidos_paciente}`.toLowerCase();
        const coincideNombre = nombreCompleto.includes(busqueda.toLowerCase());

        // Filtro por FECHA
        let coincideFecha = true;
        if (fechaFiltro) {
            const fechaCita = new Date(c.fecha_hora).toISOString().split('T')[0];
            coincideFecha = fechaCita === fechaFiltro;
        }

        return coincideNombre && coincideFecha;
    });

    return (
        <div className="recep-container">
            {/* Header reutilizado, muestra datos del usuario actual */}
            <HeaderRecep nombre={nombre} puesto={puesto} />

            <div className="main-grid" style={{ marginTop: '20px', flexDirection: 'column' }}>
                <div className="header-simple" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button className="back-button" onClick={() => navigate("/homemed")}>
                        <img src={BackIcon} alt="volver" style={{ width: '20px' }} />
                    </button>
                    <h2>Historial Clínico</h2>
                </div>

                {/* FILTROS */}
                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Buscar por paciente..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        style={{ padding: '10px', flex: 1, borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    <input
                        type="date"
                        value={fechaFiltro}
                        onChange={(e) => setFechaFiltro(e.target.value)}
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                </div>

                <div className="tabla-scroll">
                    <table className="tabla">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Paciente</th>
                                <th>Motivo</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaFiltrada.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', color: '#888' }}>
                                        No se encontraron citas terminadas.
                                    </td>
                                </tr>
                            ) : (
                                listaFiltrada.map(c => {
                                    const fechaObj = new Date(c.fecha_hora);
                                    return (
                                        <tr key={c.id}>
                                            <td>{fechaObj.toLocaleDateString()}</td>
                                            <td>{fechaObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                            <td style={{ fontWeight: 'bold' }}>
                                                {c.nombres_paciente} {c.apellidos_paciente}
                                            </td>
                                            <td>{c.motivo_consulta}</td>
                                            <td>
                                                <span style={{
                                                    padding: '4px 8px', borderRadius: '4px',
                                                    backgroundColor: '#dcfce7',
                                                    color: '#166534',
                                                    fontWeight: 'bold', fontSize: '0.9em'
                                                }}>
                                                    {c.estado}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}