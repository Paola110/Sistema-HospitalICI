import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/HomeAdmin.css";
import { API_URL } from "../config";

import { useUser } from "../context/UserContext";
import HeaderAdmin from "../components/Header";
import MetricCard from "../components/MetricCard";
import RegistrarPersonal from "../components/RegistrarPersonal";

import ingresosIcon from "../assets/ingresos.svg";
import doctorIcon from "../assets/doctor.svg";
import userIcon from "../assets/user.png";
import addIcon from "../assets/user-add.svg"; // Reusing existing icon if available, or just generic

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

export default function HomeAdmin() {
  const { nombre, puesto } = useUser();
  const navigate = useNavigate();

  // Estados
  const [dataIngresos, setDataIngresos] = useState([]);
  const [totalDinero, setTotalDinero] = useState(0);
  const [numMedicos, setNumMedicos] = useState(0);
  const [numPacientes, setNumPacientes] = useState(0);

  // NUEVO: Estado para los Logs Reales
  const [ultimosLogs, setUltimosLogs] = useState([]);
  const [showModalPersonal, setShowModalPersonal] = useState(false);

  useEffect(() => {
    // 1. Ingresos
    fetch(`${API_URL}/pagos/ingresos`)
      .then((res) => res.json())
      .then((data) => {
        setDataIngresos(data);
        setTotalDinero(data.reduce((acc, item) => acc + item.monto, 0));
      })
      .catch(console.error);

    // 2. Contar Médicos
    fetch(`${API_URL}/medicos`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setNumMedicos(data.length); })
      .catch(console.error);

    // 3. Contar Pacientes
    fetch(`${API_URL}/pacientes`)
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setNumPacientes(data.length); })
      .catch(console.error);

    // 4. CARGAR LOGS DE AUDITORÍA (Los últimos 7)
    fetch(`${API_URL}/admin/registros`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // El backend ya los manda ordenados por fecha DESC, solo cortamos
          setUltimosLogs(data.slice(0, 7));
        }
      })
      .catch(console.error);

  }, []);

  // Helper para colores de acción
  const getColorAccion = (accion) => {
    const acc = (accion || "").toUpperCase();
    if (acc.includes("CREAR")) return "#166534"; // Verde
    if (acc.includes("ELIMINAR")) return "#991b1b"; // Rojo
    if (acc.includes("ACTUALIZAR")) return "#075985"; // Azul
    return "#374151"; // Gris
  };

  const getBgAccion = (accion) => {
    const acc = (accion || "").toUpperCase();
    if (acc.includes("CREAR")) return "#dcfce7";
    if (acc.includes("ELIMINAR")) return "#fee2e2";
    if (acc.includes("ACTUALIZAR")) return "#e0f2fe";
    return "#f3f4f6";
  };

  return (
    <div className="admin-container">
      <HeaderAdmin nombre={nombre} puesto={puesto} />

      <div className="top-grid">
        <MetricCard
          titulo="Ingresos mensuales"
          valor={`$${totalDinero.toLocaleString("en-US")}.00`}
          icono={ingresosIcon}
          color="green"
          to="/reportes-ingresos"
        />
        <MetricCard
          titulo="Medicos Activos"
          valor={numMedicos}
          icono={doctorIcon}
          color="blue"
          to="/listado-medicos"
        />
        <MetricCard
          titulo="Pacientes Activos"
          valor={numPacientes}
          icono={userIcon}
          color="purple"
          to="/listado-pacientes"
        />
      </div>

      {/* SECCIÓN DE ACCIONES RÁPIDAS (Botonera) */}
      <div style={{ padding: '0 20px', display: 'flex', gap: '15px' }}>
        <button
          className="btn-crear"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }}
          onClick={() => setShowModalPersonal(true)}
        >
          <span style={{ fontSize: '1.2em' }}>+</span> Registrar Nuevo Personal
        </button>
      </div>

      <div className="main-grid">
        {/* GRÁFICA */}
        <div className="Titulo-tabla-admin">
          <h3>Ingresos (Últimos 30 días)</h3>
          <h3 className="total">${totalDinero.toLocaleString("en-US")}.00 <span>mxn</span></h3>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dataIngresos}>
                <defs>
                  <linearGradient id="colorIngreso" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="10%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="monto" stroke="#3b82f6" fill="url(#colorIngreso)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TABLA DE LOGS REALES */}
        <div
          className="registros-box"
          onClick={() => navigate("/listado-registros")}
          style={{ cursor: "pointer" }}
        >
          <h3>Bitácora de Seguridad (Reciente)</h3>

          <div className="tabla-registros-scroll">
            <table className="tabla-registros">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Acción</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {ultimosLogs.length > 0 ? (
                  ultimosLogs.map((log) => (
                    <tr key={log.id}>
                      <td style={{ fontWeight: 'bold', fontSize: '0.9em' }}>
                        {log.usuario}
                      </td>
                      <td>
                        <span style={{
                          padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', fontWeight: 'bold',
                          color: getColorAccion(log.accion),
                          backgroundColor: getBgAccion(log.accion)
                        }}>
                          {log.accion}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.85em', color: '#666' }}>
                          {log.fecha} <br /> {log.hora}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                      Sin movimientos recientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModalPersonal && (
        <RegistrarPersonal
          onClose={() => setShowModalPersonal(false)}
          onSave={() => {
            // Recargar contadores
            fetch(`${API_URL}/medicos`).then(r => r.json()).then(d => setNumMedicos(d.length || 0));
            // Opcional: Recargar logs
            fetch(`${API_URL}/admin/registros`).then(r => r.json()).then(d => setUltimosLogs(d.slice(0, 7)));
          }}
        />
      )}

    </div>
  );
}