import "./styles/HomeAdmin.css";
import { useNavigate } from "react-router-dom";

import { useUser } from "../context/UserContext";
import HeaderAdmin from "../components/Header";
import MetricCard from "../components/MetricCard";

import ingresos from "../assets/ingresos.svg";
import doctor from "../assets/doctor.svg";
import user from "../assets/user.png";

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
import { ingresos7dias } from "../data/ingresosEjemplo";

export default function HomeAdmin() {
  const { nombre, puesto } = useUser();
  const navigate = useNavigate();

  const data = ingresos7dias;
  const total = data.reduce((sum, item) => sum + item.monto, 0);

  return (
    <div className="admin-container">
      <HeaderAdmin nombre={nombre} puesto={puesto} />

      {/* MÉTRICAS */}
      <div className="top-grid">
        <MetricCard
          titulo="Ingresos mensuales totales"
          valor="$12,760.00"
          icono={ingresos}
          color="green"
          to="/reportes-ingresos"
        />

        <MetricCard
          titulo="Medicos Activos"
          valor="43"
          icono={doctor}
          color="blue"
          to="/listado-medicos"
        />

        <MetricCard
          titulo="Pacientes Activos"
          valor="389"
          icono={user}
          color="purple"
          to="/listado-pacientes"
        />
      </div>

      {/* TABLA + ACCIONES */}
      <div className="main-grid">
        <div className="Titulo-tabla-admin">
          <h3>Ingresos Semanales</h3>
          <h3 className="total">
            ${total.toLocaleString("en-US")}.00 <span>mxn</span>
          </h3>
          <div className="chart-box">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data}>
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
