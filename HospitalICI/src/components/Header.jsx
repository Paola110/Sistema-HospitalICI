import "./components.css";

export default function HeaderRecep({ nombre, puesto }) {
  const hoy = new Date();
  const fechaFormateada = hoy.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="header">
      <div>
        <h2>Bienvenida, {nombre}</h2>
        <p className="subtext">Panel de control - {puesto}</p>
      </div>

      <div className="header-date">
        <p>{fechaFormateada}</p>
      </div>
    </div>
  );
}
