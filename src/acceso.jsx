import { useState } from "react";
import App from "./App.jsx";
import Login from "./components/Login.jsx";

export default function Acceso() {
  const [sesion, setSesion] = useState(null);

  // Sin sesión: mostrar Login
  if (!sesion) {
    return <Login onLogin={setSesion} />;
  }

  // Con sesión: mostrar el sistema
  return (
    <App
      sesion={sesion}
      onCerrarSesion={() => setSesion(null)}
    />
  );
}