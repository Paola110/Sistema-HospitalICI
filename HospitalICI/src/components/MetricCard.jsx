import "./components.css";
import { useNavigate } from "react-router-dom";

export default function MetricCard({ titulo, valor, icono, color, to }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
  };

  return (
    <div
      className={`metric-card ${color} ${to ? "metric-clickable" : ""}`}
      onClick={handleClick}
    >
      <div className="metric-header">
        <p>{titulo}</p>
        <img src={icono} alt="icono" />
      </div>
      <h2>{valor}</h2>
    </div>
  );
}
