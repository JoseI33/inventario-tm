import { useState } from "react";
import "./App.css";

function App() {
  const [modulo, setModulo] = useState("inicio");
  const [interno, setInterno] = useState("");

  const equipoEjemplo = {
    interno: "62",
    equipo: "Autoelevador",
    marca: "Mitsubishi",
    horometroActual: 4860,
    ultimoService: 4600,
    frecuenciaService: 300,
    filtros: [
      { tipo: "Aceite motor", codigo: "H2015", cambio: "Cada service" },
      { tipo: "Combustible", codigo: "WK940/18", cambio: "Cada service" },
      { tipo: "Aire primario", codigo: "P181186", cambio: "Cada service" },
      { tipo: "Aire secundario", codigo: "P181187", cambio: "Cada 600 hs" },
      {
        tipo: "Combustible eléctrico",
        codigo: "DBH-5062",
        cambio: "Según equipo",
      },
    ],
  };

  const horasUsadas =
    equipoEjemplo.horometroActual - equipoEjemplo.ultimoService;

  const proximoService =
    equipoEjemplo.ultimoService + equipoEjemplo.frecuenciaService;

  const horasRestantes =
    proximoService - equipoEjemplo.horometroActual;

  const obtenerEstado = () => {
    if (horasRestantes <= 0) return "Service vencido";
    if (horasRestantes <= 50) return "Próximo a service";
    return "OK";
  };

  return (
    <div className="app">
      <header>
        <h1>TM ROLDAN</h1>
        <p>Sistema Técnico</p>
      </header>

      {modulo === "inicio" && (
        <main className="cards">
          <button className="card" onClick={() => setModulo("inventario")}>
            <h2>Inventario</h2>
            <p>Buscar repuestos, códigos y ubicaciones.</p>
          </button>

          <button className="card" onClick={() => setModulo("equipos")}>
            <h2>Equipos</h2>
            <p>Horómetros, services y filtros.</p>
          </button>
        </main>
      )}

      {modulo === "inventario" && (
        <main className="panel">
          <button className="volver" onClick={() => setModulo("inicio")}>
            ← Volver
          </button>

          <h2>Buscador de inventario</h2>

          <input
            type="text"
            placeholder="Ubicación, código o repuesto..."
          />

          <p className="mensaje">
            En el próximo paso conectaremos aquí el inventario real.
          </p>
        </main>
      )}

      {modulo === "equipos" && (
        <main className="panel">
          <button className="volver" onClick={() => setModulo("inicio")}>
            ← Volver
          </button>

          <h2>Equipos / Mantenimiento</h2>

          <input
            type="text"
            placeholder="Ingresar interno..."
            value={interno}
            onChange={(e) => setInterno(e.target.value)}
          />

          {interno === "62" && (
            <div className="ficha">
              <h2>Interno {equipoEjemplo.interno}</h2>

              <p>
                <strong>Equipo:</strong> {equipoEjemplo.equipo}
              </p>

              <p>
                <strong>Marca:</strong> {equipoEjemplo.marca}
              </p>

              <p>
                <strong>Horómetro actual:</strong>{" "}
                {equipoEjemplo.horometroActual} hs
              </p>

              <hr />

              <h3>Service de motor</h3>

              <p>
                Último service: {equipoEjemplo.ultimoService} hs
              </p>

              <p>
                Horas utilizadas: {horasUsadas} hs
              </p>

              <p>
                Próximo service: {proximoService} hs
              </p>

              <p>
                Horas restantes: {horasRestantes} hs
              </p>

              <div className={`estado ${obtenerEstado().replaceAll(" ", "-")}`}>
                {obtenerEstado()}
              </div>

              <hr />

              <h3>Filtros</h3>

              {equipoEjemplo.filtros.map((filtro) => (
                <div className="filtro" key={filtro.tipo}>
                  <strong>{filtro.tipo}</strong>
                  <span>{filtro.codigo}</span>
                  <small>{filtro.cambio}</small>
                </div>
              ))}
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default App;