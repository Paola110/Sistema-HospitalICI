import MotivationIcon from "../assets/doctor.svg";

export default function TarjetaMotivoConsulta({ motivoDetallado, sintomas }) {
  const getTagClass = (sintoma) => {
    const lowerSintoma = sintoma.toLowerCase();
    if (lowerSintoma.includes("dolor") || lowerSintoma.includes("agudo")) {
      return "tag-red";
    }
    if (
      lowerSintoma.includes("náuseas") ||
      lowerSintoma.includes("sensibilidad") ||
      lowerSintoma.includes("frío")
    ) {
      return "tag-yellow";
    }
    if (
      lowerSintoma.includes("malestar") ||
      lowerSintoma.includes("molestia")
    ) {
      return "tag-orange";
    }
    return "";
  };

  return (
    <div className="tarjeta-motivo">
      <div className="header-with-icon">
        <h2>Motivo de Consulta</h2>
        <img
          className="card-header-icon"
          src={MotivationIcon}
          alt="Icono Motivo"
        />
      </div>

      <p className="descripcion">
        {motivoDetallado ||
          "No se proporcionó un motivo detallado para esta consulta."}
      </p>

      {sintomas && sintomas.length > 0 && (
        <>
          <p className="sintomas-label">Síntomas reportados:</p>
          <ul className="sintomas-list">
            {sintomas.map((sintoma, index) => (
              <li key={index} className={`sintoma-tag ${getTagClass(sintoma)}`}>
                {sintoma}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
