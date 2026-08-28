import "./App.css";
import { useEffect, useRef, useState } from "react";

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

  const [filtrosEspeciales, setFiltrosEspeciales] = useState({
    secundario: {
      componente_id: "",
      cambiado: false,
      motivo: "",
    },
    electrico: {
      componente_id: "",
      cambiado: false,
      motivo: "",
    },
  });

  const [equipoBaja, setEquipoBaja] = useState(null);

  const [datosBaja, setDatosBaja] = useState({
    fecha_fin: "",
    horometro_fin: "",
    motivo_baja: "",
    ubicacion_actual: "",
    observacion_baja: "",
  });

  const [mensajeBaja, setMensajeBaja] = useState("");

  // HISTORIAL DE TRABAJO
  const [historialTrabajo, setHistorialTrabajo] = useState([]);
  const [mostrarHistorialTrabajo, setMostrarHistorialTrabajo] = useState(false);

  // ALERTA DE SERVICES POPUP
  const [mostrarAlertaServices, setMostrarAlertaServices] = useState(false);

  // EQUIPOS INACTIVOS
  const [equiposInactivos, setEquiposInactivos] = useState([]);
  // FORMULARIO DE BAJA
  const formularioBajaRef = useRef(null);

  // EQUIPOS
  const [equipos, setEquipos] = useState([]);
  const [interno, setInterno] = useState("");
  const [modulo, setModulo] = useState("inicio");

  // SERVIS Y MANTENIMIENTO
  const [services, setServices] = useState([]);
  const [filtrosEspecialesEstado, setFiltrosEspecialesEstado] = useState([]);
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
    fetch("http://localhost:3000/equipos-inactivos")
      .then((response) => response.json())
      .then((data) => {
        setEquiposInactivos(data);
      })
      .catch((error) => {
        console.error("Error al cargar equipos inactivos:", error);
      });
  }, []);

  useEffect(() => {
    if (!interno) return;

    fetch(`http://localhost:3000/equipos/${interno}/filtros-especiales`)
      .then((response) => response.json())
      .then((data) => {
        setFiltrosEspecialesEstado(data);
      })
      .catch((error) => {
        console.error("Error al cargar filtros especiales:", error);
        setFiltrosEspecialesEstado([]);
      });
  }, [interno]);

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

  const componenteSecundario = componentesConfig.find((item) =>
    item.nombre.toLowerCase().includes("secundario"),
  );

  const componenteElectrico = componentesConfig.find(
    (item) =>
      item.nombre.toLowerCase().includes("eléctrico") ||
      item.nombre.toLowerCase().includes("electrico"),
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

    if (
      filtrosEspeciales.secundario.cambiado &&
      !filtrosEspeciales.secundario.motivo
    ) {
      setMensajeConfiguracion(
        "Seleccioná el motivo del cambio del filtro secundario.",
      );
      return;
    }

    if (
      filtrosEspeciales.electrico.cambiado &&
      !filtrosEspeciales.electrico.motivo
    ) {
      setMensajeConfiguracion(
        "Seleccioná el motivo del cambio del filtro eléctrico.",
      );
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
        const secundarios = [];

        if (componenteSecundario) {
          secundarios.push({
            componente_id: componenteSecundario.componente_id,
            cambiado: filtrosEspeciales.secundario.cambiado,
            motivo: filtrosEspeciales.secundario.cambiado
              ? filtrosEspeciales.secundario.motivo
              : null,
          });
        }

        if (componenteElectrico) {
          secundarios.push({
            componente_id: componenteElectrico.componente_id,
            cambiado: filtrosEspeciales.electrico.cambiado,
            motivo: filtrosEspeciales.electrico.cambiado
              ? filtrosEspeciales.electrico.motivo
              : null,
          });
        }

        const responseMotor = await fetch(
          `http://localhost:3000/equipos/${configInterno}/service-completo`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fecha: configMantenimientos.motor.fecha,
              horometro: Number(configMantenimientos.motor.horometro),
              secundarios,
            }),
          },
        );

        const dataMotor = await responseMotor.json();

        if (!responseMotor.ok) {
          setMensajeConfiguracion(
            dataMotor.error || "Error al guardar el service.",
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

  const confirmarBajaEquipo = async () => {
    if (!equipoBaja) return;

    if (
      !datosBaja.fecha_fin ||
      !datosBaja.horometro_fin ||
      !datosBaja.motivo_baja ||
      !datosBaja.ubicacion_actual
    ) {
      setMensajeBaja("Completá fecha, horómetro, motivo y ubicación.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/equipos/${equipoBaja.interno}/dar-de-baja`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fecha_fin: datosBaja.fecha_fin,
            horometro_fin: Number(datosBaja.horometro_fin),
            motivo_baja: datosBaja.motivo_baja,
            ubicacion_actual: datosBaja.ubicacion_actual,
            observacion_baja: datosBaja.observacion_baja,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMensajeBaja(data.error || "No se pudo dar de baja el equipo.");
        return;
      }

      const internoDadoDeBaja = equipoBaja.interno;

      setEquiposActivos((actuales) =>
        actuales.filter((equipo) => equipo.interno !== internoDadoDeBaja),
      );

      // Volvemos a consultar el backend
      // para traer el registro completo del inactivo.
      await cargarEquiposInactivos();

      setMensajeBaja(
        `Interno ${internoDadoDeBaja} dado de baja correctamente.`,
      );

      setEquipoBaja(null);
    } catch (error) {
      console.error(error);
      setMensajeBaja("Error de conexión con el servidor.");
    }
  };

  const cargarEquiposInactivos = async () => {
    try {
      const response = await fetch("http://localhost:3000/equipos-inactivos");

      if (!response.ok) {
        throw new Error("Error al cargar equipos inactivos");
      }

      const data = await response.json();
      setEquiposInactivos(data);
    } catch (error) {
      console.error("Error al cargar equipos inactivos:", error);
    }
  };

  const equiposConAlertaService = equiposActivos.filter((equipo) => {
    const horas = Number(equipo.horas_restantes_service_motor);

    return equipo.horas_restantes_service_motor !== null && horas <= 50;
  });

  const cargarHistorialTrabajo = async () => {
    if (!interno) return;

    try {
      const response = await fetch(
        `http://localhost:3000/equipos/${interno}/historial-trabajo`,
      );

      if (!response.ok) {
        throw new Error("Error al cargar historial");
      }

      const data = await response.json();

      setHistorialTrabajo(data);
      setMostrarHistorialTrabajo(true);
    } catch (error) {
      console.error("Error al cargar historial:", error);
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
          <button
            className="card"
            onClick={() => {
              setMostrarAlertaServices(true);
              setModulo("equipos-activos");
            }}
          >
            <h2>Equipos Alq/Serv.</h2>
            <p>Horómetros general, ubicación y empresas.</p>

            {mostrarAlertaServices && (
              <div className="alerta-services-overlay">
                <div className="alerta-services-modal">
                  <h3>⚠ Mantenimientos próximos</h3>

                  {equiposActivos
                    .filter((equipo) => {
                      const horas = Number(
                        equipo.horas_restantes_service_motor,
                      );

                      return (
                        equipo.horas_restantes_service_motor !== null &&
                        horas <= 50
                      );
                    })
                    .map((equipo) => {
                      const horas = Number(
                        equipo.horas_restantes_service_motor,
                      );

                      return (
                        <div
                          key={equipo.interno}
                          className="alerta-service-item"
                        >
                          <strong>Interno {equipo.interno}</strong>

                          {horas <= 0 ? (
                            <span className="service-vencido">
                              ✕ Service vencido por {Math.abs(horas)} hs
                            </span>
                          ) : (
                            <span className="service-proximo">
                              ⚠ Faltan {horas} hs para el service
                            </span>
                          )}
                        </div>
                      );
                    })}

                  <button
                    type="button"
                    onClick={() => setMostrarAlertaServices(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}
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
          <button
            className="card"
            onClick={() => setModulo("equipos-inactivos")}
          >
            <h2>Equipos Inactivos</h2>
            <p>Equipos fuera de servicio y ubicación actual.</p>
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
          <button
            className="volver"
            onClick={() => {
              setMostrarAlertaServices(false);
              setModulo("inicio");
            }}
          >
            ← Volver
          </button>

          <h2>Equipos actualmente en actividad</h2>

          {modulo === "equipos-activos" &&
            mostrarAlertaServices &&
            equiposConAlertaService.length > 0 && (
              <div className="alerta-services-overlay">
                <div className="alerta-services-modal">
                  <h3>⚠ Mantenimientos próximos</h3>

                  {equiposConAlertaService.map((equipo) => {
                    const horas = Number(equipo.horas_restantes_service_motor);

                    return (
                      <div key={equipo.interno} className="alerta-service-item">
                        <strong>Interno {equipo.interno}</strong>

                        {horas <= 0 ? (
                          <span className="service-vencido">
                            ✕ Service vencido por {Math.abs(horas)} hs
                          </span>
                        ) : (
                          <span className="service-proximo">
                            ⚠ Faltan {horas} hs para el service
                          </span>
                        )}
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setMostrarAlertaServices(false)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            )}

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
                  <th>Service motor</th>
                  <th>Acción</th>
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
                    <td>
                      {equipo.horas_restantes_service_motor === null ? (
                        <span>-</span>
                      ) : Number(equipo.horas_restantes_service_motor) <= 0 ? (
                        <span className="service-vencido">
                          ✕ Vencido{" "}
                          {Math.abs(
                            Number(equipo.horas_restantes_service_motor),
                          )}{" "}
                          hs
                        </span>
                      ) : Number(equipo.horas_restantes_service_motor) <=
                        250 ? (
                        <span className="service-proximo">
                          ⚠ En {equipo.horas_restantes_service_motor} hs
                        </span>
                      ) : (
                        <span className="service-ok">✓ OK</span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();

                          setEquipoBaja(equipo);

                          setDatosBaja({
                            fecha_fin: "",
                            horometro_fin: equipo.horometro_actual || "",
                            motivo_baja: "",
                            ubicacion_actual: "",
                            observacion_baja: "",
                          });

                          setMensajeBaja("");

                          setTimeout(() => {
                            formularioBajaRef.current?.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }, 100);
                        }}
                      >
                        Dar de baja
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {equipoBaja && (
              <div className="form-baja" ref={formularioBajaRef}>
                <h3>Dar de baja - Interno {equipoBaja.interno}</h3>

                <label>
                  Fecha de baja
                  <input
                    type="date"
                    value={datosBaja.fecha_fin}
                    onChange={(e) =>
                      setDatosBaja({
                        ...datosBaja,
                        fecha_fin: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Horómetro de baja
                  <input
                    type="number"
                    value={datosBaja.horometro_fin}
                    onChange={(e) =>
                      setDatosBaja({
                        ...datosBaja,
                        horometro_fin: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Motivo
                  <select
                    value={datosBaja.motivo_baja}
                    onChange={(e) =>
                      setDatosBaja({
                        ...datosBaja,
                        motivo_baja: e.target.value,
                      })
                    }
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Fin de contrato">Fin de contrato</option>
                    <option value="Fin de temporada">Fin de temporada</option>
                    <option value="Reparación">Reparación</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                    <option value="Reemplazo">Reemplazo</option>
                    <option value="Otro">Otro</option>
                  </select>
                </label>

                <label>
                  Ubicación actual
                  <select
                    value={datosBaja.ubicacion_actual}
                    onChange={(e) =>
                      setDatosBaja({
                        ...datosBaja,
                        ubicacion_actual: e.target.value,
                      })
                    }
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Taller">Taller</option>
                    <option value="Galpón">Galpón</option>
                    <option value="Finca Sofia">Finca Sofia</option>
                    <option value="Finca Salinas">Finca Salinas</option>
                    <option value="Finca Lules">Finca Lules</option>
                    <option value="Santa Isabel">Santa Isabel</option>
                    <option value="Otro">Otro</option>
                  </select>
                </label>

                <label>
                  Observaciones
                  <textarea
                    value={datosBaja.observacion_baja}
                    onChange={(e) =>
                      setDatosBaja({
                        ...datosBaja,
                        observacion_baja: e.target.value,
                      })
                    }
                    placeholder="Observación opcional..."
                  />
                </label>

                <button type="button" onClick={confirmarBajaEquipo}>
                  Confirmar baja
                </button>

                <button type="button" onClick={() => setEquipoBaja(null)}>
                  Cancelar
                </button>

                {mensajeBaja && <p>{mensajeBaja}</p>}
              </div>
            )}
          </div>
        </main>
      )}

      {modulo === "equipos-inactivos" && (
        <main className="panel">
          <button className="volver" onClick={() => setModulo("inicio")}>
            ← Volver
          </button>

          <h2>Equipos Inactivos</h2>

          {equiposInactivos.length > 0 ? (
            <div className="tabla-contenedor">
              <table className="tabla-equipos">
                <thead>
                  <tr>
                    <th>Interno</th>
                    <th>Última empresa</th>
                    <th>Fecha baja</th>
                    <th>Motivo</th>
                    <th>Observaciones</th>
                    <th>Ubicación actual</th>
                    <th>Hs baja</th>
                    <th>Horas trabajadas</th>
                  </tr>
                </thead>

                <tbody>
                  {equiposInactivos.map((equipo) => (
                    <tr key={equipo.interno}>
                      <td>
                        <strong>{equipo.interno}</strong>
                      </td>

                      <td>{equipo.empresa || "-"}</td>

                      <td>
                        {equipo.fecha_fin
                          ? new Date(equipo.fecha_fin).toLocaleDateString(
                              "es-AR",
                            )
                          : "-"}
                      </td>

                      <td>{equipo.motivo_baja || "-"}</td>

                      <td>{equipo.observacion_baja || "-"}</td>

                      <td>{equipo.ubicacion_actual || "-"}</td>

                      <td>
                        {equipo.horometro_fin !== null
                          ? `${equipo.horometro_fin} hs`
                          : "-"}
                      </td>

                      <td>
                        {equipo.horas_trabajadas !== null
                          ? `${equipo.horas_trabajadas} hs`
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No hay equipos inactivos registrados.</p>
          )}
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
          <div className="mantenimiento-card">
            <h4>Filtros especiales</h4>

            {componenteSecundario && (
              <div>
                <strong>Filtro aire secundario</strong>

                <p>Frecuencia: {componenteSecundario.frecuencia_horas} hs</p>

                <label>
                  <input
                    type="checkbox"
                    checked={filtrosEspeciales.secundario.cambiado}
                    onChange={(e) =>
                      setFiltrosEspeciales({
                        ...filtrosEspeciales,
                        secundario: {
                          ...filtrosEspeciales.secundario,
                          componente_id: componenteSecundario.componente_id,
                          cambiado: e.target.checked,
                          motivo: e.target.checked
                            ? filtrosEspeciales.secundario.motivo
                            : "",
                        },
                      })
                    }
                  />
                  Cambiar filtro
                </label>

                {filtrosEspeciales.secundario.cambiado && (
                  <select
                    value={filtrosEspeciales.secundario.motivo}
                    onChange={(e) =>
                      setFiltrosEspeciales({
                        ...filtrosEspeciales,
                        secundario: {
                          ...filtrosEspeciales.secundario,
                          motivo: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">Seleccionar motivo...</option>
                    <option value="Por frecuencia">Por frecuencia</option>
                    <option value="Sucio">Sucio</option>
                    <option value="Dañado">Dañado</option>
                    <option value="Decisión jefe de mecánicos">
                      Decisión jefe de mecánicos
                    </option>
                    <option value="Otro">Otro</option>
                  </select>
                )}
              </div>
            )}

            {componenteElectrico && (
              <div>
                <strong>Filtro combustible eléctrico</strong>

                <p>Frecuencia: {componenteElectrico.frecuencia_horas} hs</p>

                <label>
                  <input
                    type="checkbox"
                    checked={filtrosEspeciales.electrico.cambiado}
                    onChange={(e) =>
                      setFiltrosEspeciales({
                        ...filtrosEspeciales,
                        electrico: {
                          ...filtrosEspeciales.electrico,
                          componente_id: componenteElectrico.componente_id,
                          cambiado: e.target.checked,
                          motivo: e.target.checked
                            ? filtrosEspeciales.electrico.motivo
                            : "",
                        },
                      })
                    }
                  />
                  Cambiar filtro
                </label>

                {filtrosEspeciales.electrico.cambiado && (
                  <select
                    value={filtrosEspeciales.electrico.motivo}
                    onChange={(e) =>
                      setFiltrosEspeciales({
                        ...filtrosEspeciales,
                        electrico: {
                          ...filtrosEspeciales.electrico,
                          motivo: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">Seleccionar motivo...</option>
                    <option value="Por frecuencia">Por frecuencia</option>
                    <option value="Sucio">Sucio</option>
                    <option value="Dañado">Dañado</option>
                    <option value="Decisión por el mecánico">
                      Decisión por el mecánico
                    </option>
                    <option value="Otro">Otro</option>
                  </select>
                )}
              </div>
            )}
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
                  <h4>Reductor y Diferencial</h4>

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

<button type="button" onClick={cargarHistorialTrabajo}>
                📋 Ver historial de trabajo
              </button>
              {mostrarHistorialTrabajo && (
                <div className="historial-trabajo">
                  <h3>Historial de trabajo - Interno {interno}</h3>

                  {historialTrabajo.length > 0 ? (
                    <div className="tabla-contenedor">
                      <table className="tabla-equipos">
                        <thead>
                          <tr>
                            <th>Empresa</th>
                            <th>Ubicación</th>
                            <th>Inicio</th>
                            <th>Fin</th>
                            <th>Hs inicio</th>
                            <th>Hs fin</th>
                            <th>Hs trabajadas</th>
                            <th>Estado</th>
                            <th>Motivo baja</th>
                            <th>Observaciones</th>
                          </tr>
                        </thead>

                        <tbody>
                          {historialTrabajo.map((registro) => (
                            <tr key={registro.id}>
                              <td>{registro.empresa || "-"}</td>
                              <td>{registro.ubicacion || "-"}</td>

                              <td>
                                {registro.fecha_inicio
                                  ? new Date(
                                      registro.fecha_inicio,
                                    ).toLocaleDateString("es-AR")
                                  : "-"}
                              </td>

                              <td>
                                {registro.fecha_fin
                                  ? new Date(
                                      registro.fecha_fin,
                                    ).toLocaleDateString("es-AR")
                                  : "-"}
                              </td>

                              <td>
                                {registro.horometro_inicio !== null
                                  ? `${registro.horometro_inicio} hs`
                                  : "-"}
                              </td>

                              <td>
                                {registro.horometro_fin !== null
                                  ? `${registro.horometro_fin} hs`
                                  : "-"}
                              </td>

                              <td>
                                {registro.horas_trabajadas !== null
                                  ? `${registro.horas_trabajadas} hs`
                                  : "-"}
                              </td>

                              <td>
                                {registro.activo ? "Activo" : "Finalizado"}
                              </td>

                              <td>{registro.motivo_baja || "-"}</td>

                              <td>{registro.observacion_baja || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p>No hay historial registrado para este interno.</p>
                  )}

                  <button
                    type="button"
                    onClick={() => setMostrarHistorialTrabajo(false)}
                  >
                    Cerrar historial
                  </button>
                </div>
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

              <h3>Filtros 600 hs</h3>

              {filtrosEspecialesEstado.length > 0 ? (
                <div className="filtros-600-grid">
                  {filtrosEspecialesEstado.map((item) => (
                    <div
                      className="mantenimiento-card"
                      key={item.componente_id}
                    >
                      <h4>
                        {item.componente === "Filtro aire secundario"
                          ? "Filtro secundario"
                          : "Filtro combustible eléctrico"}
                      </h4>

                      {item.horometro_ultimo_cambio !== null ? (
                        <>
                          <p>
                            <strong>Último cambio:</strong>{" "}
                            {item.horometro_ultimo_cambio} hs
                          </p>

                          <p>
                            <strong>Fecha:</strong>{" "}
                            {new Date(
                              item.fecha_ultimo_cambio,
                            ).toLocaleDateString("es-AR")}
                          </p>

                          {item.observaciones && (
                            <p>
                              <strong>Motivo por cambio:</strong>{" "}
                              {item.observaciones.replace(
                                "Cambio durante service: ",
                                "",
                              )}
                            </p>
                          )}

                          <p>
                            <strong>Frecuencia:</strong> {item.frecuencia_horas}{" "}
                            hs
                          </p>

                          <p>
                            <strong>Horas usadas:</strong> {item.horas_usadas}{" "}
                            hs
                          </p>

                          <p>
                            <strong>Próximo cambio:</strong>{" "}
                            {item.proximo_cambio} hs
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
                            {item.estado === "OK" && "✓ "}
                            {item.estado === "Próximo" && "⚠ "}
                            {item.estado === "Vencido" && "✕ "}
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
                <p>No hay filtros especiales registrados.</p>
              )}

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
                            {item.estado === "OK" && "✓ "}
                            {item.estado === "Próximo" && "⚠ "}
                            {item.estado === "Vencido" && "✕ "}
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
