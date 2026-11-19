import { useEffect, useState } from "react";
import "../weeklyInspection.css";

const API = "http://localhost:3000";

const ESTADOS = [
  ["LISTO", "Listo"],
  ["ALISTAR", "Para alistar"],
  ["REPARANDO", "Reparando"],
  ["PAUSADO", "Pausado"],
  ["EN_CONTROL", "En control"],
  ["ESPERA_REPUESTO", "Esperando repuesto"],
  ["EXHIBICION", "Exhibición"],
  ["OTRO", "Otro"],
];

function lunesActual() {
  const fecha = new Date();
  const dias = (fecha.getDay() + 6) % 7;
  fecha.setDate(fecha.getDate() - dias);

  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

async function consultar(url, opciones) {
  const response = await fetch(url, opciones);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Error al consultar el servidor.");
  }

  return data;
}

export default function WeeklyInspection({ onVolver }) {
  const [equipos, setEquipos] = useState([]);
  const [fechaSemana, setFechaSemana] = useState(lunesActual);
  const [semanaId, setSemanaId] = useState(null);

  const [registros, setRegistros] = useState({});
  const [formularios, setFormularios] = useState({});

  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [guardandoId, setGuardandoId] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;

    consultar(`${API}/relevamientos/taller/equipos`)
      .then((data) => {
        if (activo) setEquipos(data);
      })
      .catch((err) => {
        if (activo) setError(err.message);
      });

    return () => {
      activo = false;
    };
  }, []);

  const abrirSemana = async () => {
    setError("");
    setMensaje("");

    if (!fechaSemana || new Date(`${fechaSemana}T12:00:00`).getDay() !== 1) {
      setError("Seleccioná una fecha que corresponda a un lunes.");
      return;
    }

    setCargando(true);

    try {
      const semana = await consultar(`${API}/relevamientos/semanales`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fecha_semana: fechaSemana }),
      });

      const [listaEquipos, detalles] = await Promise.all([
        consultar(`${API}/relevamientos/taller/equipos`),
        consultar(`${API}/relevamientos/semanales/${semana.id}/detalles`),
      ]);

      const guardados = {};
      const borradores = {};

      detalles.forEach((item) => {
        guardados[item.equipo_id] = item;

        borradores[item.equipo_id] = {
          estado: item.estado,
          observacion: item.observacion || "",
          responsable: item.responsable || "",
          prioridad: item.prioridad || "MEDIA",
        };
      });

      setEquipos(listaEquipos);
      setRegistros(guardados);
      setFormularios(borradores);
      setSemanaId(semana.id);

      setMensaje("✓ Relevamiento semanal abierto correctamente.");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const modificarCampo = (equipoId, campo, valor) => {
    setFormularios((actual) => ({
      ...actual,
      [equipoId]: {
        estado: "",
        observacion: "",
        responsable: "",
        prioridad: "MEDIA",
        ...actual[equipoId],
        [campo]: valor,
      },
    }));
  };

  const guardarControl = async (equipo) => {
    const formulario = formularios[equipo.id];

    if (!semanaId || !formulario?.estado) {
      setError("Seleccioná un estado antes de guardar.");
      return;
    }

    setGuardandoId(equipo.id);
    setError("");
    setMensaje("");

    try {
      const resultado = await consultar(
        `${API}/relevamientos/semanales/${semanaId}/equipos/${equipo.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formulario),
        },
      );

      setRegistros((actual) => ({
        ...actual,
        [equipo.id]: resultado.registro,
      }));

      setMensaje(`✓ Control del interno ${equipo.interno} guardado.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardandoId(null);
    }
  };

  const equiposFiltrados = equipos.filter((equipo) => {
    const texto = [equipo.interno, equipo.tipo, equipo.marca, equipo.modelo]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return texto.includes(busqueda.toLowerCase());
  });

  const revisados = equipos.filter((equipo) => registros[equipo.id]).length;

  const listos = equipos.filter(
    (equipo) => registros[equipo.id]?.estado === "LISTO",
  ).length;

  const reparando = equipos.filter(
    (equipo) => registros[equipo.id]?.estado === "REPARANDO",
  ).length;

  return (
    <main className="panel panel-tabla relevamiento-panel">
      <button className="volver" onClick={onVolver}>
        ← Volver
      </button>

      <div className="weekly-header">
        <div className="weekly-header-info">
          <span className="weekly-header-icon">📝</span>

          <div>
            <span className="weekly-header-label">CONTROL DE TALLER</span>
            <h2>Relevamiento semanal</h2>
            <p>Seguimiento de equipos en taller y novedades de la semana</p>
          </div>
        </div>
      </div>

      <div className="relevamiento-resumen">
        <div>
          <span>EN TALLER</span>
          <strong>{equipos.length}</strong>
        </div>
        <div>
          <span>REVISADOS</span>
          <strong>{revisados}</strong>
        </div>
        <div>
          <span>PENDIENTES</span>
          <strong>{equipos.length - revisados}</strong>
        </div>
        <div>
          <span>LISTOS</span>
          <strong>{listos}</strong>
        </div>
        <div>
          <span>REPARANDO</span>
          <strong>{reparando}</strong>
        </div>
      </div>

      <section className="relevamiento-seccion">
        <h3>Control del lunes</h3>

        
<div className="weekly-toolbar">
  <div className="weekly-open-box">
    <label>
      Semana de relevamiento

      <input
        type="date"
        value={fechaSemana}
        onChange={(e) => {
          setFechaSemana(e.target.value);
          setSemanaId(null);
          setRegistros({});
          setFormularios({});
          setMensaje("");
        }}
      />
    </label>

    <button
      type="button"
      onClick={abrirSemana}
      disabled={cargando}
    >
      {cargando ? "Cargando..." : "Abrir semana"}
    </button>
  </div>
</div>

        {mensaje && <p className="relevamiento-exito">{mensaje}</p>}
        {error && <p className="relevamiento-error">{error}</p>}

        {semanaId && (
          <>
            <div className="relevamiento-buscador">
              <input
                type="search"
                placeholder="Buscar por interno, marca o modelo..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <span>{equiposFiltrados.length} equipos</span>
            </div>

            <div className="relevamiento-lista">
              {equiposFiltrados.map((equipo) => {
                const formulario = formularios[equipo.id] || {};
                const registrado = Boolean(registros[equipo.id]);

                return (
                  <div className="relevamiento-equipo" key={equipo.id}>
                    <div className="relevamiento-equipo-info">
                      <div>
                        <strong>
  {equipo.interno?.trim()
    ? `Interno ${equipo.interno}`
    : `${equipo.tipo || "Equipo"} — Sin interno`}
</strong>
                        <p>
                          {equipo.marca} {equipo.modelo}
                        </p>
                        <small>{equipo.tipo}</small>
                      </div>

                      <span
                        className={
                          registrado
                            ? "relevamiento-guardado"
                            : "relevamiento-pendiente"
                        }
                      >
                        {registrado ? "Revisado" : "Sin revisar"}
                      </span>
                    </div>

                    <div className="relevamiento-formulario">
                      <label>
                        Estado
                        <select
                          value={formulario.estado || ""}
                          onChange={(e) =>
                            modificarCampo(equipo.id, "estado", e.target.value)
                          }
                        >
                          <option value="">Seleccionar estado</option>
                          {ESTADOS.map(([codigo, nombre]) => (
                            <option key={codigo} value={codigo}>
                              {nombre}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label>
                        Prioridad
                        <select
                          value={formulario.prioridad || "MEDIA"}
                          onChange={(e) =>
                            modificarCampo(
                              equipo.id,
                              "prioridad",
                              e.target.value,
                            )
                          }
                        >
                          <option value="BAJA">Baja</option>
                          <option value="MEDIA">Media</option>
                          <option value="ALTA">Alta</option>
                        </select>
                      </label>

                      <label className="relevamiento-campo-amplio">
                        Observación
                        <input
                          type="text"
                          placeholder="Trabajo pendiente o novedades..."
                          value={formulario.observacion || ""}
                          onChange={(e) =>
                            modificarCampo(
                              equipo.id,
                              "observacion",
                              e.target.value,
                            )
                          }
                        />
                      </label>

                      
<div className="relevamiento-footer">
  <label>
    Responsable
    <input
      type="text"
      placeholder="Mecánico responsable"
      value={formulario.responsable || ""}
      onChange={(e) =>
        modificarCampo(
          equipo.id,
          "responsable",
          e.target.value,
        )
      }
    />
  </label>

  <button
    type="button"
    disabled={!formulario.estado || guardandoId !== null}
    onClick={() => guardarControl(equipo)}
  >
    {guardandoId === equipo.id
      ? "Guardando..."
      : registrado
        ? "Actualizar control"
        : "Guardar control"}
  </button>
</div>

                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
