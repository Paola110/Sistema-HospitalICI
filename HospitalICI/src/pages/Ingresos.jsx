import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import "./styles/Ingresos.css";
import {
  ingresos28dias,
  ingresos7dias,
  ingresos90dias,
} from "../data/ingresosEjemplo";
import { useUser } from "../context/UserContext";

import backIcon from "../assets/back-arrow.svg";

export default function Ingresos() {
  const navigate = useNavigate();
  const { nombre, puesto } = useUser();

  const [rango, setRango] = useState(28);

  const data =
    rango === 7
      ? ingresos7dias
      : rango === 90
      ? ingresos90dias
      : ingresos28dias;

  const total = data.reduce((sum, item) => sum + item.monto, 0);
  const promedio = (total / data.length).toFixed(2);
  const mayorIngreso = Math.max(...data.map((d) => d.monto));

  return (
    <div className="ingresos-container">
      {/* TÍTULO */}
      <div className="header-ingresos">
        <button className="back-button" onClick={() => navigate(-1)}>
          <img src={backIcon} alt="volver" />
        </button>

        <h2 className="title">Ingresos</h2>
      </div>

      <p className="subtitle">Total Recaudado</p>
      <h3 className="total">
        ${total.toLocaleString("en-US")}.00 <span>mxn</span>
      </h3>
      {/* CONTROLES */}
      <div className="controls">
        <div className="rango-buttons">
          <button
            className={rango === 7 ? "active" : ""}
            onClick={() => setRango(7)}
          >
            7 días
          </button>
          <button
            className={rango === 28 ? "active" : ""}
            onClick={() => setRango(28)}
          >
            28 días
          </button>
          <button
            className={rango === 90 ? "active" : ""}
            onClick={() => setRango(90)}
          >
            90 días
          </button>
        </div>
      </div>
      {/* GRAFICA */}
      <div className="chart-box">
        <ResponsiveContainer width="100%" height={300}>
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
      {/* TARJETAS INFERIORES */}
      <div className="info-grid-ingresos">
        <div className="info-card-ingresos">
          <p>PROMEDIO DIARIO</p>
          <h3>${promedio}</h3>
        </div>

        <div className="info-card-ingresos">
          <p>MAYOR INGRESO</p>
          <h3>${mayorIngreso}.00</h3>
        </div>

        <div className="info-card-ingresos">
          <p>TRANSACCIONES</p>
          <h3>{data.length}</h3>
        </div>
      </div>
    </div>
  );
}
