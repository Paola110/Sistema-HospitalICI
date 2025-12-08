import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeaderRecep from "../components/Header";
import { useUser } from "../context/UserContext";
import BackIcon from "../assets/back-arrow.svg";
import "./styles/HomeRecep.css";

export default function HistorialRecep() {
    const { nombre, puesto } = useUser();
    const navigate = useNavigate();
    const [todasLasCitas, setTodasLasCitas] = useState([]);

    // Filtros
    const [busquedaPac, setBusquedaPac] = useState("");
    const [busquedaDoc, setBusquedaDoc] = useState("");
    const [fechaFiltro, setFechaFiltro] = useState("");

    useEffect(() => {
        fetch("http://localhost:3000/citas")
            .then((res) => res.json())
            .then((data) => {
                // Ordenar por fecha descendente
                const ordenadas = data.sort((a, b) => new Date(b.fecha_hora) - new Date(a.fecha_hora));
                setTodasLasCitas(ordenadas);
            })
            .catch(console.error);
    }, []);

    const listaFiltrada = todasLasCitas.filter(c => {
        // 1. Filtro PACIENTE
        const nombrePac = `${c.nombres_paciente} ${c.apellidos_paciente}`.toLowerCase();
        const matchPac = nombrePac.includes(busquedaPac.toLowerCase());

        // 2. Filtro MEDICO
        const nombreDoc = `${c.nombres_medico} ${c.apellidos_medico}`.toLowerCase();
        const matchDoc = nombreDoc.includes(busquedaDoc.toLowerCase());

        // 3. Filtro FECHA
        let matchFecha = true;
        if (fechaFiltro) {
            const fechaCita = new Date(c.fecha_hora).toISOString().split('T')[0];
            matchFecha = fechaCita === fechaFiltro;
        }

        return matchPac && matchDoc && matchFecha;
    });

    return (
        <div className="recep-container">
            <HeaderRecep nombre={nombre} puesto={puesto} />

            <div className="main-grid" style={{ marginTop: '20px', flexDirection: 'column' }}>
                <div className="header-simple" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button className="back-button" onClick={() => navigate("/homerecep")}>
                        <img src={BackIcon} alt="volver" style={{ width: '20px' }} />
                    </button>
                    <h2>Agenda General de Citas</h2>
                </div>

                {/* FILTROS */}
                <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Buscar por Paciente..."
                        value={busquedaPac}
                        onChange={(e) => setBusquedaPac(e.target.value)}
                        style={{ padding: '10px', flex: 1, borderRadius: '5px', border: '1px solid #ccc', minWidth: '200px' }}
                    />
                    <input
                        type="text"
                        placeholder="Buscar por Médico..."
                        value={busquedaDoc}
                        onChange={(e) => setBusquedaDoc(e.target.value)}
                        style={{ padding: '10px', flex: 1, borderRadius: '5px', border: '1px solid #ccc', minWidth: '200px' }}
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
                                <th>Médico</th>
                                <th>Motivo</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {listaFiltrada.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', color: '#888' }}>
                                        No se encontraron registros.
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
                                            <td>
                                                Drag. {c.nombres_medico} {c.apellidos_medico}
                                            </td>
                                            <td>{c.motivo_consulta}</td>
                                            <td>
                                                <span style={{
                                                    padding: '4px 8px', borderRadius: '4px',
                                                    backgroundColor:
                                                        c.estado === 'Terminada' ? '#dcfce7' :
                                                            c.estado === 'Cancelada' ? '#fee2e2' :
                                                                c.estado === 'En curso' ? '#fef9c3' : '#dbeafe',
                                                    color:
                                                        c.estado === 'Terminada' ? '#166534' :
                                                            c.estado === 'Cancelada' ? '#991b1b' :
                                                                c.estado === 'En curso' ? '#854d0e' : '#1e40af',
                                                    fontWeight: 'bold', fontSize: '0.85em'
                                                }}>
                                                    {c.estado || 'Agendada'}
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
