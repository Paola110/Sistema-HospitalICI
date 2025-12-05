import { Link } from "react-router-dom";
import "./components.css";

export default function QuickAction({
  titulo,
  descripcion,
  icono,
  to,
  onClick,
  disabled,
  pequeño,
}) {
  const className = `quick-action 
    ${disabled ? "-disabled" : ""} 
    ${pequeño ? "qa-small" : ""}
  `;

  if (onClick) {
    return (
      <button
        className={className}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
      >
        <img className="qa-icon" src={icono} alt="" />
        <div>
          <h4 className="qa-title">{titulo}</h4>
          <p className="qa-desc">{descripcion}</p>
        </div>
      </button>
    );
  }

  return (
    <Link className={className} to={disabled ? "#" : to}>
      <img className="qa-icon" src={icono} alt="" />
      <div>
        <h4 className="qa-title">{titulo}</h4>
        <p className="qa-desc">{descripcion}</p>
      </div>
    </Link>
  );
}
