import { useState, useEffect } from "react"; 
import "./styles/HomeAdmin.css";
import { useNavigate } from "react-router-dom";

import { useUser } from "../context/UserContext";
import HeaderAdmin from "../components/Header";
import MetricCard from "../components/MetricCard";

import ingresosIcon from "../assets/ingresos.svg";
import doctorIcon from "../assets/doctor.svg"; 
import userIcon from "../assets/user.png";

import registrosEjemplo from "../data/registrosEjemplo";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function HomeAdmin() {
  const { nombre, puesto } = useUser();
  const navigate = useNavigate();

  const [dataIngresos, setDataIngresos] = useState([]);
  const [totalDinero, setTotalDinero] = useState(0);
  const [numMedicos, setNumMedicos] = useState(0);
  const [numPacientes, setNumPacientes] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3000/pagos/ingresos")
      .then((res) => res.json())
      .then((data) => {
        setDataIngresos(data);
        const suma = data.reduce((acc, item) => acc + item.monto, 0);
        setTotalDinero(suma);
      })
      .catch((err) => console.error("Error cargando ingresos:", err));

    fetch("http://localhost:3000/medicos")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setNumMedicos(data.length);
      })
      .catch((err) => console.error("Error cargando médicos:", err));

    fetch("http://localhost:3000/pacientes")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setNumPacientes(data.length);
      })
      .catch((err) => console.error("Error cargando pacientes:", err));
  }, []);

  return (
    <div className="admin-container">
      <HeaderAdmin nombre={nombre} puesto={puesto} />

      <div className="top-grid">
        <MetricCard
          titulo="Ingresos mensuales"
          valor={`$${totalDinero.toLocaleString("en-US")}.00`} // Valor Real
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

      <div className="main-grid">
        <div className="Titulo-tabla-admin">
          <h3>Ingresos (Últimos 30 días)</h3>
          <h3 className="total">
            ${totalDinero.toLocaleString("en-US")}.00 <span>mxn</span>
          </h3>
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
                <Area
                  type="monotone"
                  dataKey="monto"
                  stroke="#3b82f6"
                  fill="url(#colorIngreso)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className="registros-box"
          onClick={() => navigate("/listado-registros")}
          style={{ cursor: "pointer" }}
        >
          <h3>Últimos registros</h3>

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
                {registrosEjemplo.slice(0, 14).map((reg) => (
                  <tr key={reg.id}>
                    <td>{reg.usuario}</td>
                    <td>{reg.accion}</td>
                    <td>
                      {reg.fecha}
                      <br />
                      {reg.hora}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}