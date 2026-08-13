import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import { services } from "./data/services";
import { filtros } from "./data/filtros";

function App() {
  const [equipos, setEquipos] = useState([]);

useEffect(() => {
  console.log("Intentando conectar con API...");

  fetch("http://localhost:3000/equipos")
    .then((response) => {
      console.log("Respuesta API:", response.status);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      return response.json();
    })
    .then((data) => {
      console.log("Equipos recibidos:", data);
      setEquipos(data);
    })
    .catch((error) => {
      console.error("Error al cargar equipos:", error);
    });
}, []);

  const [modulo, setModulo] = useState("inicio");
  const [interno, setInterno] = useState("");

  const equipoSeleccionado = equipos.find(
  (equipo) =>
    String(equipo.interno).trim() === String(interno).trim()
  );

  console.log("interno buscado:", interno);
console.log("equipos:", equipos);
console.log("equipo encontrado:", equipoSeleccionado);

  const ultimoService = services
    .filter(
      (service) => service.interno === interno && service.tipo === "Motor",
    )
    .sort((a, b) => b.horometro - a.horometro)[0];

  const filtrosEquipo = filtros.filter((filtro) => filtro.interno === interno);

  let horasUsadas = 0;
  let proximoService = 0;
  let horasRestantes = 0;

  if (equipoSeleccionado && ultimoService) {
    horasUsadas = equipoSeleccionado.horometro_actual - ultimoService.horometro;

    proximoService =
      ultimoService.horometro + equipoSeleccionado.frecuencia_service;

    horasRestantes = proximoService - equipoSeleccionado.horometro_actual;
  }

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

          <input type="text" placeholder="Ubicación, código o repuesto..." />

          <p className="mensaje">
            En el próximo paso conectaremos aquí el inventario real.
          </p>
        </main>
      )}

      {modulo === "equipos" && (
  <main className="panel">
    <button
      className="volver"
      onClick={() => setModulo("inicio")}
    >
      ← Volver
    </button>

    <h2>Equipos / Mantenimiento</h2>

    <input
      type="text"
      placeholder="Ingresar interno..."
      value={interno}
      onChange={(e) => setInterno(e.target.value)}
    />

    {interno && !equipoSeleccionado && (
      <p>No se encontró el interno {interno}.</p>
    )}

    {equipoSeleccionado && (
      <div className="ficha">

        <h2>
          Interno {equipoSeleccionado.interno}
        </h2>

        <p>
          <strong>Equipo:</strong>{" "}
          {equipoSeleccionado.tipo}
        </p>

        <p>
          <strong>Marca:</strong>{" "}
          {equipoSeleccionado.marca}
        </p>

        <p>
          <strong>Horómetro actual:</strong>{" "}
          {equipoSeleccionado.horometro_actual} hs
        </p>

        <hr />

        <h3>Service de motor</h3>

        {ultimoService ? (
          <>

        <p>
          <strong>Último service:</strong>{" "}
          {ultimoService.horometro} hs
        </p>

        <p>
          <strong>Horas utilizadas:</strong>{" "}
          {horasUsadas} hs
        </p>

        <p>
          <strong>Próximo service:</strong>{" "}
          {proximoService} hs
        </p>

        <p>
          <strong>Horas restantes:</strong>{" "}
          {horasRestantes} hs
        </p>

        <div
          className={`estado ${obtenerEstado().replaceAll(
            " ",
            "-"
            )}`}
            >
          {obtenerEstado()}
        </div>
        </>
        ) : ( 
        <hr />
      )}

        <h3>Filtros</h3>

        {filtrosEquipo.length > 0 ? (
          filtrosEquipo.map((filtro) => (
            <div
              className="filtro"
              key={`${filtro.interno}-${filtro.tipo}`}
            >
              <strong>{filtro.tipo}</strong>

              <span>{filtro.codigo}</span>

              <small>
                Cada {filtro.frecuenciaHoras} hs
              </small>
            </div>
          ))
        ) : (
          <p>
            No hay filtros registrados para este equipo.
          </p>
        )}

      </div>
    )}
  </main>
)}
    </div>
  );
}

export default App;
