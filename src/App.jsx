import { useState } from "react";
import "./App.css";
import { useEffect } from "react";

function App() {
  // CONFIGURACION DE MANTENIMIENTO
  const [configInterno, setConfigInterno] = useState("");
  const [configPlan, setConfigPlan] = useState("");

  const [planesMantenimiento, setPlanesMantenimiento] = useState([]);
  const [componentesConfig, setComponentesConfig] = useState([]);
  const [mensajeConfiguracion, setMensajeConfiguracion] = useState("");

  const [configMantenimientos, setConfigMantenimientos] = useState({
    motor: {
      fecha: "",
      horometro: "",
    },
    hidraulico: {
      componente_id: "",
      fecha: "",
      horometro: "",
    },
    caja: {
      componente_id: "",
      fecha: "",
      horometro: "",
    },
    reductor: {
      componente_id: "",
      fecha: "",
      horometro: "",
    },
  });

  // EQUIPOS
  const [equipos, setEquipos] = useState([]);
  const [interno, setInterno] = useState("");
  const [modulo, setModulo] = useState("inicio");

  // SERVIS Y MANTENIMIENTO
  const [services, setServices] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [planMantenimiento, setPlanMantenimiento] = useState([]);
  const [historialHorometros, setHistorialHorometros] = useState([]);

  // HOROMETROS
  const [fechaHorometro, setFechaHorometro] = useState("");
  const [nuevoHorometro, setNuevoHorometro] = useState("");
  const [mensajeHorometro, setMensajeHorometro] = useState("");

  // CONTRATOS
  const [internoContrato, setInternoContrato] = useState("");
  const [mensajeContrato, setMensajeContrato] = useState("");

  const [nuevoContrato, setNuevoContrato] = useState({
    empresa: "",
    ubicacion: "",
    fecha_inicio: "",
    horometro_inicio: "",
  });

  // NUEVO EQUIPO
  const [nuevoEquipo, setNuevoEquipo] = useState({
    interno: "",
    tipo: "",
    marca: "",
    modelo: "",
    horometro_actual: "",
    frecuencia_service: 300,
  });

  const [mensajeNuevoEquipo, setMensajeNuevoEquipo] = useState("");
  const [equiposActivos, setEquiposActivos] = useState([]);

  useEffect(() => {
    if (!interno) return;

    fetch(`http://localhost:3000/equipos/${interno}/plan-mantenimiento`)
      .then((response) => response.json())
      .then((data) => {
        setPlanMantenimiento(data);
      })
      .catch((error) => {
        console.error("Error al cargar plan de mantenimiento:", error);
        setPlanMantenimiento([]);
      });
  }, [interno]);

  useEffect(() => {
    fetch("http://localhost:3000/planes-mantenimiento")
      .then((response) => response.json())
      .then((data) => {
        setPlanesMantenimiento(data);
      })
      .catch((error) => {
        console.error("Error al cargar planes:", error);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/equipos-activos")
      .then((response) => response.json())
      .then((data) => {
        setEquiposActivos(data);
      })
      .catch((error) => {
        console.error("Error al cargar equipos activos:", error);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:3000/equipos")
      .then((response) => response.json())
      .then((data) => {
        setEquipos(data);
      })
      .catch((error) => {
        console.error("Error al cargar equipos:", error);
      });

    fetch("http://localhost:3000/services")
      .then((response) => response.json())
      .then((data) => {
        setServices(data);
      })
      .catch((error) => {
        console.error("Error al cargar services:", error);
      });
  }, []);

  useEffect(() => {
    if (!interno) return;

    fetch(`http://localhost:3000/equipos/${interno}/horometros`)
      .then((response) => response.json())
      .then((data) => {
        setHistorialHorometros(data);
      })
      .catch((error) => {
        console.error("Error al cargar historial:", error);
        setHistorialHorometros([]);
      });
  }, [interno]);

  const equipoSeleccionado = equipos.find(
    (equipo) => String(equipo.interno).trim() === String(interno).trim(),
  );

  const ultimoService = services
    .filter(
      (service) => service.interno === interno && service.tipo === "Motor",
    )
    .sort((a, b) => b.horometro - a.horometro)[0];

  useEffect(() => {
    if (!interno) return;

    fetch(`http://localhost:3000/equipos/${interno}/mantenimientos`)
      .then((response) => response.json())
      .then((data) => {
        setMantenimientos(data);
      })
      .catch((error) => {
        console.error("Error al cargar mantenimientos:", error);
        setMantenimientos([]);
      });
  }, [interno]);

  useEffect(() => {
    if (!configPlan) return;

    fetch(
      `http://localhost:3000/planes-mantenimiento/${configPlan}/componentes`,
    )
      .then((response) => response.json())
      .then((data) => {
        setComponentesConfig(data);
      })
      .catch((error) => {
        console.error("Error al cargar componentes del plan:", error);
      });
  }, [configPlan]);

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

  const actualizarHorometro = async () => {
    if (!equipoSeleccionado) return;

    if (!nuevoHorometro) {
      setMensajeHorometro("Ingresá un horómetro.");
      return;
    }

    if (!nuevoHorometro || !fechaHorometro) {
      setMensajeHorometro("Ingresá la fecha y el horómetro.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/equipos/${equipoSeleccionado.interno}/horometro`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            horometro: Number(nuevoHorometro),
            fecha: fechaHorometro,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMensajeHorometro(data.error);
        return;
      }

      setEquipos((equiposActuales) =>
        equiposActuales.map((equipo) =>
          equipo.interno === data.interno ? data : equipo,
        ),
      );

      const historialResponse = await fetch(
        `http://localhost:3000/equipos/${equipoSeleccionado.interno}/horometros`,
      );

      const historialData = await historialResponse.json();

      setHistorialHorometros(historialData);

      setNuevoHorometro("");
      setMensajeHorometro("Horómetro actualizado correctamente.");
    } catch (error) {
      console.error(error);
      setMensajeHorometro("No se pudo actualizar el horómetro.");
    }
  };

  const guardarNuevoEquipo = async (e) => {
    e.preventDefault();

    setMensajeNuevoEquipo("");

    try {
      const response = await fetch("http://localhost:3000/equipos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoEquipo),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensajeNuevoEquipo(data.error || "No se pudo crear el equipo.");
        return;
      }

      // setInternoCreado(data.interno);
      setInternoContrato(data.interno);

      // Lo agregamos también al estado de React
      setEquipos((equiposActuales) => [...equiposActuales, data]);

      setMensajeNuevoEquipo(`Interno ${data.interno} creado correctamente.`);

      // Limpiamos el formulario
      setNuevoEquipo({
        interno: "",
        tipo: "",
        marca: "",
        modelo: "",
        horometro_actual: "",
        frecuencia_service: 300,
      });
    } catch (error) {
      console.error(error);
      setMensajeNuevoEquipo("Error de conexión con el servidor.");
    }
  };

  const guardarContrato = async () => {
    if (!internoContrato) {
      setMensajeContrato("Seleccioná un equipo.");
      return;
    }

    if (
      !nuevoContrato.empresa ||
      !nuevoContrato.fecha_inicio ||
      !nuevoContrato.horometro_inicio
    ) {
      setMensajeContrato("Completá empresa, fecha y horómetro de inicio.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/contratos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interno: internoContrato,
          ...nuevoContrato,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensajeContrato(data.error || "No se pudo crear el contrato.");
        return;
      }

      setMensajeContrato(
        `Contrato del interno ${internoContrato} creado correctamente.`,
      );

      setNuevoContrato({
        empresa: "",
        ubicacion: "",
        fecha_inicio: "",
        horometro_inicio: "",
      });

      setInternoContrato("");
    } catch (error) {
      console.error(error);
      setMensajeContrato("Error de conexión con el servidor.");
    }
  };

  const componenteHidraulico = componentesConfig.find(
    (item) => item.nombre === "Filtro hidráulico",
  );

  const componenteCaja = componentesConfig.find(
    (item) => item.nombre === "Filtro de caja",
  );

  const componenteReductor = componentesConfig.find(
    (item) => item.nombre === "SAE 90",
  );

  const guardarConfiguracionMantenimiento = async () => {
    if (!configInterno) {
      setMensajeConfiguracion("Seleccioná un interno.");
      return;
    }

    if (!configPlan) {
      setMensajeConfiguracion("Seleccioná un plan de mantenimiento.");
      return;
    }

    try {
      setMensajeConfiguracion("Guardando configuración...");

      // 1. Asignar plan al equipo
      const responsePlan = await fetch(
        `http://localhost:3000/equipos/${configInterno}/plan-mantenimiento`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            plan_id: Number(configPlan),
          }),
        },
      );

      const dataPlan = await responsePlan.json();

      if (!responsePlan.ok) {
        setMensajeConfiguracion(
          dataPlan.error || "No se pudo asignar el plan.",
        );
        return;
      }

      if (
  configMantenimientos.motor.fecha &&
  configMantenimientos.motor.horometro
) {
  const responseMotor = await fetch(
    `http://localhost:3000/equipos/${configInterno}/services`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fecha: configMantenimientos.motor.fecha,
        horometro: Number(
          configMantenimientos.motor.horometro
        ),
      }),
    }
  );

  const dataMotor = await responseMotor.json();

  if (!responseMotor.ok) {
    setMensajeConfiguracion(
      dataMotor.error || "Error al guardar service de motor."
    );
    return;
  }
}

      // 2. Preparar mantenimientos que tengan fecha + horómetro
      const registros = [
        configMantenimientos.hidraulico,
        configMantenimientos.caja,
        configMantenimientos.reductor,
      ].filter((item) => item.componente_id && item.fecha && item.horometro);

      // 3. Guardar históricos
      for (const registro of registros) {
        const response = await fetch(
          `http://localhost:3000/equipos/${configInterno}/mantenimientos`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              componente_id: registro.componente_id,
              fecha: registro.fecha,
              horometro: Number(registro.horometro),
              observaciones: "Carga desde configuración",
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setMensajeConfiguracion(
            data.error || "Error al guardar mantenimiento.",
          );
          return;
        }
      }

      setMensajeConfiguracion(
        `Configuración del interno ${configInterno} guardada correctamente.`,
      );

      setConfigMantenimientos({
         motor: {
    fecha: "",
    horometro: "",
  },
        hidraulico: {
          componente_id: "",
          fecha: "",
          horometro: "",
        },
        caja: {
          componente_id: "",
          fecha: "",
          horometro: "",
        },
        reductor: {
          componente_id: "",
          fecha: "",
          horometro: "",
        },
      });
    } catch (error) {
      console.error(error);

      setMensajeConfiguracion("Error de conexión con el servidor.");
    }
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
          <button className="card" onClick={() => setModulo("equipos-activos")}>
            <h2>Equipos Alq/Serv.</h2>
            <p>Horómetros general, ubicación y empresas.</p>
          </button>

          <button className="card" onClick={() => setModulo("nuevo-equipo")}>
            <h2>Nuevo equipo</h2>
            <p>Registrar una nueva máquina en el sistema.</p>
          </button>
          <button
            className="card"
            onClick={() => setModulo("config-mantenimiento")}
          >
            <h2>Configurar mantenimiento</h2>
            <p>Asignar planes y cargar históricos.</p>
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

      {modulo === "equipos-activos" && (
        <main className="panel">
          <button className="volver" onClick={() => setModulo("inicio")}>
            ← Volver
          </button>

          <h2>Equipos actualmente en actividad</h2>

          <div className="tabla-contenedor">
            <table className="tabla-equipos">
              <thead>
                <tr>
                  <th>Interno</th>
                  <th>Empresa</th>
                  <th>Ubicación</th>
                  <th>Inicio contrato</th>
                  <th>Hs inicio</th>
                  <th>Última visita</th>
                  <th>Hs última visita</th>
                  <th>Diferencia hs</th>
                </tr>
              </thead>

              <tbody>
                {equiposActivos.map((equipo) => (
                  <tr
                    key={equipo.interno}
                    onClick={() => {
                      setInterno(equipo.interno);
                      setModulo("equipos");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <strong>{equipo.interno}</strong>
                    </td>

                    <td>{equipo.empresa}</td>

                    <td>{equipo.ubicacion || "-"}</td>

                    <td>
                      {equipo.fecha_inicio
                        ? new Date(equipo.fecha_inicio).toLocaleDateString(
                            "es-AR",
                          )
                        : "-"}
                    </td>

                    <td>{equipo.horometro_inicio} hs</td>

                    <td>
                      {equipo.ultima_visita
                        ? new Date(equipo.ultima_visita).toLocaleDateString(
                            "es-AR",
                          )
                        : "Sin visita"}
                    </td>

                    <td>
                      {equipo.horometro_ultima_visita !== null
                        ? `${equipo.horometro_ultima_visita} hs`
                        : "-"}
                    </td>

                    <td>
                      <span
                        className={
                          equipo.diferencia_horas >= 300
                            ? "alerta-roja"
                            : equipo.diferencia_horas >= 250
                              ? "alerta-amarilla"
                              : ""
                        }
                      >
                        {equipo.diferencia_horas !== null
                          ? `${equipo.diferencia_horas} hs`
                          : "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      )}

      {modulo === "nuevo-equipo" && (
        <main className="panel">
          <button className="volver" onClick={() => setModulo("inicio")}>
            ← Volver
          </button>

          <h2>Nuevo equipo</h2>

          <form className="form-nuevo-equipo" onSubmit={guardarNuevoEquipo}>
            <label>
              Interno *
              <input
                type="text"
                value={nuevoEquipo.interno}
                onChange={(e) =>
                  setNuevoEquipo({
                    ...nuevoEquipo,
                    interno: e.target.value,
                  })
                }
                required
              />
            </label>

            <label>
              Tipo de equipo *
              <input
                type="text"
                placeholder="Ej: Autoelevador"
                value={nuevoEquipo.tipo}
                onChange={(e) =>
                  setNuevoEquipo({
                    ...nuevoEquipo,
                    tipo: e.target.value,
                  })
                }
                required
              />
            </label>

            <label>
              Marca *
              <input
                type="text"
                placeholder="Ej: Mitsubishi"
                value={nuevoEquipo.marca}
                onChange={(e) =>
                  setNuevoEquipo({
                    ...nuevoEquipo,
                    marca: e.target.value,
                  })
                }
                required
              />
            </label>

            <label>
              Modelo
              <input
                type="text"
                value={nuevoEquipo.modelo}
                onChange={(e) =>
                  setNuevoEquipo({
                    ...nuevoEquipo,
                    modelo: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Horómetro actual *
              <input
                type="number"
                min="0"
                value={nuevoEquipo.horometro_actual}
                onChange={(e) =>
                  setNuevoEquipo({
                    ...nuevoEquipo,
                    horometro_actual: e.target.value,
                  })
                }
                required
              />
            </label>

            <label>
              Frecuencia de service
              <input
                type="number"
                min="1"
                value={nuevoEquipo.frecuencia_service}
                onChange={(e) =>
                  setNuevoEquipo({
                    ...nuevoEquipo,
                    frecuencia_service: e.target.value,
                  })
                }
              />
            </label>

            <button type="submit">Guardar equipo</button>
          </form>

          <hr />

          <h2 className="titulo-nuevo-equipo">Asignar contrato</h2>

          {internoContrato ? (
            <p className="mensaje">
              Equipo seleccionado: <strong>Interno {internoContrato}</strong>
            </p>
          ) : (
            <p className="mensaje">Primero guardá el nuevo equipo.</p>
          )}

          <label>
            Interno *
            <select
              value={internoContrato}
              onChange={(e) => setInternoContrato(e.target.value)}
            >
              <option value="">Seleccionar equipo...</option>

              {equipos.map((equipo) => (
                <option key={equipo.id} value={equipo.interno}>
                  Interno {equipo.interno} - {equipo.marca} {equipo.modelo}
                </option>
              ))}
            </select>
          </label>

          <div className="form-nuevo-equipo">
            <label>
              Empresa *
              <input
                type="text"
                value={nuevoContrato.empresa}
                onChange={(e) =>
                  setNuevoContrato({
                    ...nuevoContrato,
                    empresa: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Ubicación
              <input
                type="text"
                value={nuevoContrato.ubicacion}
                onChange={(e) =>
                  setNuevoContrato({
                    ...nuevoContrato,
                    ubicacion: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Fecha de inicio *
              <input
                type="date"
                value={nuevoContrato.fecha_inicio}
                onChange={(e) =>
                  setNuevoContrato({
                    ...nuevoContrato,
                    fecha_inicio: e.target.value,
                  })
                }
              />
            </label>

            <label>
              Horómetro de inicio *
              <input
                type="number"
                value={nuevoContrato.horometro_inicio}
                onChange={(e) =>
                  setNuevoContrato({
                    ...nuevoContrato,
                    horometro_inicio: e.target.value,
                  })
                }
              />
            </label>
          </div>
          <button
            type="button"
            onClick={guardarContrato}
            disabled={!internoContrato}
          >
            Guardar contrato
          </button>

          {mensajeContrato && <p className="mensaje">{mensajeContrato}</p>}

          {mensajeNuevoEquipo && (
            <p className="mensaje">{mensajeNuevoEquipo}</p>
          )}
        </main>
      )}

      {modulo === "config-mantenimiento" && (
        <main className="panel">
          <button className="volver" onClick={() => setModulo("inicio")}>
            ← Volver
          </button>

          <h2 className="titulo-nuevo-equipo">
            Configuración de mantenimiento
          </h2>

          <div className="form-nuevo-equipo">
            <label>
              Interno
              <select
                value={configInterno}
                onChange={(e) => setConfigInterno(e.target.value)}
              >
                <option value="">Seleccionar equipo...</option>

                {equipos.map((equipo) => (
                  <option key={equipo.id} value={equipo.interno}>
                    Interno {equipo.interno} - {equipo.marca} {equipo.modelo}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Plan de mantenimiento
              <select
                value={configPlan}
                onChange={(e) => setConfigPlan(e.target.value)}
              >
                <option value="">Seleccionar plan...</option>

                {planesMantenimiento.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.nombre}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mantenimiento-card">
            <h4>Service de motor</h4>

            <p>Frecuencia: 300 hs</p>

            <label>
              Última fecha
              <input
                type="date"
                value={configMantenimientos.motor.fecha}
                onChange={(e) =>
                  setConfigMantenimientos({
                    ...configMantenimientos,
                    motor: {
                      ...configMantenimientos.motor,
                      fecha: e.target.value,
                    },
                  })
                }
              />
            </label>

            <label>
              Último horómetro
              <input
                type="number"
                value={configMantenimientos.motor.horometro}
                onChange={(e) =>
                  setConfigMantenimientos({
                    ...configMantenimientos,
                    motor: {
                      ...configMantenimientos.motor,
                      horometro: e.target.value,
                    },
                  })
                }
              />
            </label>
          </div>

          {configPlan && (
            <div className="mantenimientos-grid">
              {/* HIDRÁULICO */}
              {componenteHidraulico && (
                <div className="mantenimiento-card">
                  <h4>Hidráulico</h4>

                  <p>Frecuencia: {componenteHidraulico.frecuencia_horas} hs</p>

                  <label>
                    Última fecha
                    <input
                      type="date"
                      value={configMantenimientos.hidraulico.fecha}
                      onChange={(e) =>
                        setConfigMantenimientos({
                          ...configMantenimientos,
                          hidraulico: {
                            ...configMantenimientos.hidraulico,
                            componente_id: componenteHidraulico.componente_id,
                            fecha: e.target.value,
                          },
                        })
                      }
                    />
                  </label>

                  <label>
                    Último horómetro
                    <input
                      type="number"
                      value={configMantenimientos.hidraulico.horometro}
                      onChange={(e) =>
                        setConfigMantenimientos({
                          ...configMantenimientos,
                          hidraulico: {
                            ...configMantenimientos.hidraulico,
                            componente_id: componenteHidraulico.componente_id,
                            horometro: e.target.value,
                          },
                        })
                      }
                    />
                  </label>
                </div>
              )}

              {/* CAJA */}
              {componenteCaja && (
                <div className="mantenimiento-card">
                  <h4>Caja</h4>

                  <p>Frecuencia: {componenteCaja.frecuencia_horas} hs</p>

                  <label>
                    Última fecha
                    <input
                      type="date"
                      value={configMantenimientos.caja.fecha}
                      onChange={(e) =>
                        setConfigMantenimientos({
                          ...configMantenimientos,
                          caja: {
                            ...configMantenimientos.caja,
                            componente_id: componenteCaja.componente_id,
                            fecha: e.target.value,
                          },
                        })
                      }
                    />
                  </label>

                  <label>
                    Último horómetro
                    <input
                      type="number"
                      value={configMantenimientos.caja.horometro}
                      onChange={(e) =>
                        setConfigMantenimientos({
                          ...configMantenimientos,
                          caja: {
                            ...configMantenimientos.caja,
                            componente_id: componenteCaja.componente_id,
                            horometro: e.target.value,
                          },
                        })
                      }
                    />
                  </label>
                </div>
              )}

              {/* REDUCTOR */}
              {componenteReductor && (
                <div className="mantenimiento-card">
                  <h4>Reductor</h4>

                  <p>Frecuencia: {componenteReductor.frecuencia_horas} hs</p>

                  <label>
                    Última fecha
                    <input
                      type="date"
                      value={configMantenimientos.reductor.fecha}
                      onChange={(e) =>
                        setConfigMantenimientos({
                          ...configMantenimientos,
                          reductor: {
                            ...configMantenimientos.reductor,
                            componente_id: componenteReductor.componente_id,
                            fecha: e.target.value,
                          },
                        })
                      }
                    />
                  </label>

                  <label>
                    Último horómetro
                    <input
                      type="number"
                      value={configMantenimientos.reductor.horometro}
                      onChange={(e) =>
                        setConfigMantenimientos({
                          ...configMantenimientos,
                          reductor: {
                            ...configMantenimientos.reductor,
                            componente_id: componenteReductor.componente_id,
                            horometro: e.target.value,
                          },
                        })
                      }
                    />
                  </label>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={guardarConfiguracionMantenimiento}
            disabled={!configInterno || !configPlan}
          >
            Guardar configuración
          </button>

          {mensajeConfiguracion && (
            <p className="mensaje">{mensajeConfiguracion}</p>
          )}
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
            onChange={(e) => {
              const valor = e.target.value;
              setInterno(valor);

              if (!valor) {
                setHistorialHorometros([]);
              }
            }}
          />

          {interno && !equipoSeleccionado && (
            <p>No se encontró el interno {interno}.</p>
          )}

          {equipoSeleccionado && (
            <div className="ficha">
              <h2>Interno {equipoSeleccionado.interno}</h2>

              <p>
                <strong>Equipo:</strong> {equipoSeleccionado.tipo}
              </p>

              <p>
                <strong>Marca:</strong> {equipoSeleccionado.marca}
              </p>

              <p>
                <strong>Horómetro actual:</strong>{" "}
                {equipoSeleccionado.horometro_actual} hs
              </p>

              <div className="actualizar-horometro">
                <h3>Actualizar horómetro</h3>

                <input
                  type="date"
                  value={fechaHorometro}
                  onChange={(e) => setFechaHorometro(e.target.value)}
                />

                <input
                  type="number"
                  placeholder="Nuevo horómetro"
                  value={nuevoHorometro}
                  onChange={(e) => setNuevoHorometro(e.target.value)}
                />

                <button onClick={actualizarHorometro}>Guardar horómetro</button>

                {mensajeHorometro && <p>{mensajeHorometro}</p>}
              </div>
              <hr />

              <h3>Historial de horómetros</h3>

              {historialHorometros.length > 0 ? (
                <div className="historial-horometros">
                  {historialHorometros.map((registro) => (
                    <div className="registro-horometro" key={registro.id}>
                      <strong>
                        {new Date(registro.fecha).toLocaleDateString("es-AR")}
                      </strong>

                      <span>{registro.horometro} hs</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No hay lecturas registradas.</p>
              )}

              <h3>Service de motor</h3>

              {ultimoService ? (
                <>
                  <p>
                    <strong>Último service:</strong> {ultimoService.horometro}{" "}
                    hs
                  </p>

                  <p>
                    <strong>Horas utilizadas:</strong> {horasUsadas} hs
                  </p>

                  <p>
                    <strong>Próximo service:</strong> {proximoService} hs
                  </p>

                  <p>
                    <strong>Horas restantes:</strong> {horasRestantes} hs
                  </p>

                  <div
                    className={`estado ${obtenerEstado().replaceAll(" ", "-")}`}
                  >
                    {obtenerEstado()}
                  </div>
                </>
              ) : (
                <hr />
              )}

              <hr />

              <h3>Mantenimientos anuales</h3>

              {mantenimientos.length > 0 ? (
                <div className="mantenimientos-grid">
                  {mantenimientos.map((item) => (
                    <div
                      className="mantenimiento-card"
                      key={item.componente_id}
                    >
                      <h4>
                        {item.componente === "Filtro hidráulico"
                          ? "Hidráulico"
                          : item.componente === "Filtro de caja"
                            ? "Caja"
                            : item.componente === "SAE 90"
                              ? "Reductor y Diferencial"
                              : item.componente}
                      </h4>

                      {item.horometro_ultimo_mantenimiento !== null ? (
                        <>
                          <p>
                            <strong>Último:</strong>{" "}
                            {item.horometro_ultimo_mantenimiento} hs
                          </p>

                          <p>
                            <strong>Fecha:</strong>{" "}
                            {new Date(
                              item.fecha_ultimo_mantenimiento,
                            ).toLocaleDateString("es-AR")}
                          </p>

                          <p>
                            <strong>Frecuencia:</strong> {item.frecuencia_horas}{" "}
                            hs
                          </p>

                          <p>
                            <strong>Horas usadas:</strong> {item.horas_usadas}{" "}
                            hs
                          </p>

                          <p>
                            <strong>Próximo:</strong>{" "}
                            {item.proximo_mantenimiento} hs
                          </p>

                          <p>
                            <strong>
                              {item.horas_restantes < 0
                                ? "Vencido por:"
                                : "Restante:"}
                            </strong>{" "}
                            {Math.abs(item.horas_restantes)} hs
                          </p>

                          <div
                            className={`estado mantenimiento-${item.estado
                              .toLowerCase()
                              .replaceAll(" ", "-")}`}
                          >
                            {item.estado}
                          </div>
                        </>
                      ) : (
                        <p>Sin historial registrado.</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No hay mantenimientos generales registrados.</p>
              )}

              <h3>Plan de mantenimiento</h3>

              {planMantenimiento.length > 0 ? (
                <>
                  <p>
                    <strong>Plan:</strong> {planMantenimiento[0].plan}
                  </p>

                  <div className="plan-mantenimiento">
                    {planMantenimiento.map((item) => (
                      <div className="filtro" key={item.componente_id}>
                        <strong>{item.componente}</strong>

                        <span>{item.codigo || "---"}</span>

                        <small>Cada {item.frecuencia_horas} hs</small>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p>Este equipo no tiene un plan de mantenimiento asignado.</p>
              )}
            </div>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
