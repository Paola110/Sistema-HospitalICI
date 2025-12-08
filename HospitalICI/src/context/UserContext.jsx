import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  // Mantenemos rol, nombre, puesto por compatibilidad, pero idealmente usaríamos solo 'userData'
  const [rol, setRol] = useState(null);
  const [nombre, setNombre] = useState(null);
  const [puesto, setPuesto] = useState(null);
  const [userId, setUserId] = useState(null);
  const [fullUserData, setFullUserData] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("userData");

    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setRol(parsed.rol);
      setNombre(parsed.nombre);
      setPuesto(parsed.puesto);
      setUserId(parsed.userId);
      setFullUserData(parsed.fullUserData);
    }
  }, []);

  useEffect(() => {
    if (rol) {
      localStorage.setItem("userData", JSON.stringify({
        rol,
        nombre,
        puesto,
        userId,
        fullUserData
      }));
    }
  }, [rol, nombre, puesto, userId, fullUserData]);

  // Helper para actualizar todo el estado de golpe al hacer login
  const loginUser = (apiUser) => {
    // Mapeo de campos de la API a los usados en el frontend
    const nuevoRol = apiUser.rol === 'doctor' ? 'medico' : apiUser.rol; // Normalizar 'doctor' a 'medico' si es necesario para tus rutas
    const nuevoNombre = `${apiUser.nombres} ${apiUser.apellidos}`;
    const nuevoPuesto = apiUser.especialidad || apiUser.puesto || 'Personal';

    setRol(nuevoRol);
    setNombre(nuevoNombre);
    setPuesto(nuevoPuesto);
    setUserId(apiUser.id);
    setFullUserData(apiUser);
  };

  return (
    <UserContext.Provider
      value={{
        rol,
        setRol,
        nombre,
        setNombre,
        puesto,
        setPuesto,
        userId,
        setUserId,
        fullUserData,
        loginUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
}


export function useUser() {
  return useContext(UserContext);
}
