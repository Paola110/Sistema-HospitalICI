import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [rol, setRol] = useState(null);
  const [nombre, setNombre] = useState(null);
  const [puesto, setPuesto] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("userData");

    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setRol(parsed.rol);
      setNombre(parsed.nombre);
      setPuesto(parsed.puesto);
    }
  }, []);

  useEffect(() => {
    if (rol && nombre && puesto) {
      localStorage.setItem("userData", JSON.stringify({ rol, nombre, puesto }));
    }
  }, [rol, nombre, puesto]);

  return (
    <UserContext.Provider
      value={{
        rol,
        setRol,
        nombre,
        setNombre,
        puesto,
        setPuesto,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
