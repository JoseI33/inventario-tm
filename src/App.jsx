import "./App.css";
import { useEffect, useRef, useState } from "react";
import logoTM from "./assets/logotm.png";

function App() {
  // CONFIGURACION DE MANTENIMIENTO
  const [configInterno, setConfigInterno] = useState("");
  const [configPlan, setConfigPlan] = useState("");
  const [configPlanNombre, setConfigPlanNombre] = useState("");
  const [componentesConfig, setComponentesConfig] = useState([]);
  const [mensajeConfiguracion, setMensajeConfiguracion] = useState("");
  const [planesMantenimiento, setPlanesMantenimiento] = useState([]);
  const [planSeleccionado, setPlanSeleccionado] = useState("");
  const [editandoPlan, setEditandoPlan] = useState(false);

  const [equipoBaja, setEquipoBaja] = useState(null);

  const [datosBaja, setDatosBaja] = useState({
    fecha_fin: "",
    horometro_fin: "",
    motivo_baja: "",
    ubicacion_actual: "",
    observacion_baja: "",
  });

  const [mensajeBaja, setMensajeBaja] = useState("");

  const [configComponentes, setConfigComponentes] = useState({});

  // FILTROS DE HISTORIAL DE TRABAJO
  const [filtroInternoHistorial, setFiltroInternoHistorial] = useState("");
  const [filtroEmpresaHistorial, setFiltroEmpresaHistorial] = useState("");
  const [filtroTemporadaHistorial, setFiltroTemporadaHistorial] = useState("");
  const [filtroTipoHistorial, setFiltroTipoHistorial] = useState("");
  const [filtroMotivoHistorial, setFiltroMotivoHistorial] = useState("");
  const [filtroTipoContratoHistorial, setFiltroTipoContratoHistorial] =
    useState("");

  // HISTORIAL DE TRABAJO
  const [historialEquipos, setHistorialEquipos] = useState([]);

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
    tipo_contrato: "",
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
    const cargarPlanesMantenimiento = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/planes-mantenimiento",
        );

        const data = await response.json();

        if (!response.ok) {
          console.error("Error al cargar planes:", data);
          return;
        }

        setPlanesMantenimiento(data);
      } catch (error) {
        console.error("Error al consultar planes:", error);
      }
    };

    cargarPlanesMantenimiento();
  }, []);

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

      await actualizarDatosMantenimiento(equipoSeleccionado.interno);

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

      await actualizarEstadoEquipos();

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

  const actualizarEstadoEquipos = async () => {
    try {
      const [activosResponse, inactivosResponse, equiposResponse] =
        await Promise.all([
          fetch("http://localhost:3000/equipos-activos"),
          fetch("http://localhost:3000/equipos-inactivos"),
          fetch("http://localhost:3000/equipos"),
        ]);

      const activosData = await activosResponse.json();
      const inactivosData = await inactivosResponse.json();
      const equiposData = await equiposResponse.json();

      setEquiposActivos(activosData);
      setEquiposInactivos(inactivosData);
      setEquipos(equiposData);
    } catch (error) {
      console.error("Error al actualizar estado de equipos:", error);
    }
  };

  const actualizarDatosMantenimiento = async (internoEquipo) => {
    if (!internoEquipo) return;

    try {
      const [
        servicesResponse,
        mantenimientosResponse,
        filtrosResponse,
        planResponse,
        equiposResponse,
        activosResponse,
      ] = await Promise.all([
        fetch("http://localhost:3000/services"),
        fetch(`http://localhost:3000/equipos/${internoEquipo}/mantenimientos`),
        fetch(
          `http://localhost:3000/equipos/${internoEquipo}/filtros-especiales`,
        ),
        fetch(
          `http://localhost:3000/equipos/${internoEquipo}/plan-mantenimiento`,
        ),
        fetch("http://localhost:3000/equipos"),
        fetch("http://localhost:3000/equipos-activos"),
      ]);

      const servicesData = await servicesResponse.json();
      const mantenimientosData = await mantenimientosResponse.json();
      const filtrosData = await filtrosResponse.json();
      const planData = await planResponse.json();
      const equiposData = await equiposResponse.json();
      const activosData = await activosResponse.json();

      setServices(servicesData);
      setMantenimientos(mantenimientosData);
      setFiltrosEspecialesEstado(filtrosData);
      setPlanMantenimiento(planData);
      setEquipos(equiposData);
      setEquiposActivos(activosData);
    } catch (error) {
      console.error("Error al actualizar mantenimiento:", error);
    }
  };

  const guardarConfiguracionMantenimiento = async () => {
    if (!configInterno) {
      setMensajeConfiguracion("Seleccioná un interno.");
      return;
    }

    if (!configPlan) {
      setMensajeConfiguracion("El equipo no tiene un plan de mantenimiento.");
      return;
    }

    // Validar componentes opcionales marcados como cambiados
    for (const item of componentesConfig) {
      const config = configComponentes[item.componente_id];

      if (item.opcional && config?.cambiado && !config?.motivo) {
        setMensajeConfiguracion(
          `Seleccioná el motivo del cambio de ${item.nombre}.`,
        );
        return;
      }
    }

    try {
      setMensajeConfiguracion("Guardando configuración...");

      // SERVICE DE MOTOR
      // Todos los componentes obligatorios de 300 hs pertenecen
      // al mismo service de motor.
      const componentesMotor = componentesConfig.filter(
        (item) => !item.opcional && Number(item.frecuencia_horas) === 300,
      );

      const componenteMotorConDatos = componentesMotor.find((item) => {
        const config = configComponentes[item.componente_id];

        return config?.fecha && config?.horometro;
      });

      if (componenteMotorConDatos) {
        const configMotor =
          configComponentes[componenteMotorConDatos.componente_id];

        const secundarios = componentesConfig
          .filter((item) => {
            const esOpcional =
              item.opcional === true ||
              item.opcional === "true" ||
              item.opcional === 1;

            const config = configComponentes[item.componente_id];

            return esOpcional && config?.cambiado;
          })
          .map((item) => {
            const config = configComponentes[item.componente_id];

            return {
              componente_id: item.componente_id,
              cambiado: true,
              motivo: config.motivo || null,
              observaciones: null,
            };
          });

        const responseMotor = await fetch(
          `http://localhost:3000/equipos/${configInterno}/service-completo`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fecha: configMotor.fecha,
              horometro: Number(configMotor.horometro),
              secundarios,
            }),
          },
        );

        const dataMotor = await responseMotor.json();

        if (!responseMotor.ok) {
          setMensajeConfiguracion(
            dataMotor.error || "Error al guardar el service de motor.",
          );
          return;
        }
      }

      // COMPONENTES NO OPCIONALES
      for (const item of componentesConfig) {
        const config = configComponentes[item.componente_id];

        const esOpcional =
          item.opcional === true ||
          item.opcional === "true" ||
          item.opcional === 1;

        if (!config || esOpcional || Number(item.frecuencia_horas) === 300) {
          continue;
        }

        // Si no se cargó fecha ni horómetro, simplemente no se guarda
        if (!config.fecha && !config.horometro) {
          continue;
        }

        // Si cargó uno de los dos, exigir ambos
        const fechaCambio = config.fecha || configServiceMotor.fecha;
        const horometroCambio =
          config.horometro || configServiceMotor.horometro;

        if (!fechaCambio || !horometroCambio) {
          setMensajeConfiguracion(
            `Completá fecha y horómetro del service para registrar ${item.nombre}.`,
          );
          return;
        }

        const response = await fetch(
          `http://localhost:3000/equipos/${configInterno}/mantenimientos`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              componente_id: item.componente_id,
              fecha: fechaCambio,
              horometro: Number(horometroCambio),
              observaciones: config.motivo || "Cambio de componente opcional",
            }),
          },
        );

        const data = await response.json();

        if (!response.ok) {
          setMensajeConfiguracion(
            data.error || `Error al guardar ${item.nombre}.`,
          );
          return;
        }
      }

     

      // Actualizar toda la información de mantenimiento
      await actualizarDatosMantenimiento(configInterno);

      setMensajeConfiguracion(
        `Configuración del interno ${configInterno} guardada correctamente.`,
      );

      // Limpiar formulario dinámico
      const configuracionLimpia = {};

      componentesConfig.forEach((item) => {
        configuracionLimpia[item.componente_id] = {
          componente_id: item.componente_id,
          fecha: "",
          horometro: "",
          cambiado: false,
          motivo: "",
        };
      });

      setConfigComponentes(configuracionLimpia);
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

      await actualizarEstadoEquipos();

      // Volvemos a consultar el backend
      // para traer el registro completo del inactivo.
      await cargarEquiposInactivos();

      const internoDadoDeBaja = equipoBaja.interno;

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

  const cargarHistorialEquipos = async () => {
    try {
      const response = await fetch("http://localhost:3000/historial-equipos");

      if (!response.ok) {
        throw new Error("Error al cargar historial general");
      }

      const data = await response.json();

      setHistorialEquipos(data);
    } catch (error) {
      console.error("Error al cargar historial general:", error);
    }
  };

  const normalizarEmpresa = (nombre) =>
    nombre.trim().toLowerCase().replace(/\s+/g, " ");

  const empresasHistorial = [
    ...new Map(
      historialEquipos
        .filter((registro) => registro.empresa)
        .map((registro) => {
          const nombreLimpio = registro.empresa.trim().replace(/\s+/g, " ");
          console.log("nombreLimpio", nombreLimpio);
          return [normalizarEmpresa(nombreLimpio), nombreLimpio];
        }),
    ).values(),
  ].sort((a, b) => a.localeCompare(b));

  const temporadasHistorial = [
    ...new Set(
      historialEquipos
        .filter((registro) => registro.fecha_inicio)
        .map((registro) => new Date(registro.fecha_inicio).getFullYear()),
    ),
  ].sort((a, b) => b - a);

  const historialEquiposFiltrado = historialEquipos.filter((registro) => {
    const coincideInterno =
      !filtroInternoHistorial ||
      String(registro.interno) === String(filtroInternoHistorial);

    const coincideEmpresa =
      !filtroEmpresaHistorial ||
      normalizarEmpresa(registro.empresa || "") ===
        normalizarEmpresa(filtroEmpresaHistorial);

    const coincideTemporada =
      !filtroTemporadaHistorial ||
      (registro.fecha_inicio &&
        new Date(registro.fecha_inicio).getFullYear() ===
          Number(filtroTemporadaHistorial));

    const coincideTipoContrato =
      !filtroTipoContratoHistorial ||
      registro.tipo_contrato === filtroTipoContratoHistorial;

    const coincideTipo =
      !filtroTipoHistorial || registro.tipo === filtroTipoHistorial;

    const coincideMotivo =
      !filtroMotivoHistorial || registro.motivo_baja === filtroMotivoHistorial;

    return (
      coincideInterno &&
      coincideTipo &&
      coincideEmpresa &&
      coincideTemporada &&
      coincideMotivo &&
      coincideTipoContrato
    );
  });

  const resumenHistorial = {
    movimientos: historialEquiposFiltrado.length,

    maquinas: new Set(
      historialEquiposFiltrado.map((registro) => registro.interno),
    ).size,

    empresas: new Set(
      historialEquiposFiltrado
        .map((registro) => normalizarEmpresa(registro.empresa || ""))
        .filter(Boolean),
    ).size,

    horasTrabajadas: historialEquiposFiltrado.reduce(
      (total, registro) => total + (Number(registro.horas_trabajadas) || 0),
      0,
    ),
  };

  const componentesServiceMotor = componentesConfig.filter((item) => {
    const esOpcional =
      item.opcional === true || item.opcional === "true" || item.opcional === 1;

    return !esOpcional && Number(item.frecuencia_horas) === 300;
  });

  const primerComponenteMotor = componentesServiceMotor[0];

  const configServiceMotor = primerComponenteMotor
    ? configComponentes[primerComponenteMotor.componente_id] || {
        fecha: "",
        horometro: "",
      }
    : {
        fecha: "",
        horometro: "",
      };

  const cambiarFechaServiceMotor = (fecha) => {
    setConfigComponentes((configAnterior) => {
      const nuevaConfig = { ...configAnterior };

      componentesServiceMotor.forEach((item) => {
        nuevaConfig[item.componente_id] = {
          ...nuevaConfig[item.componente_id],
          componente_id: item.componente_id,
          fecha,
        };
      });

      return nuevaConfig;
    });
  };

  const cambiarHorometroServiceMotor = (horometro) => {
    setConfigComponentes((configAnterior) => {
      const nuevaConfig = { ...configAnterior };

      componentesServiceMotor.forEach((item) => {
        nuevaConfig[item.componente_id] = {
          ...nuevaConfig[item.componente_id],
          componente_id: item.componente_id,
          horometro,
        };
      });

      return nuevaConfig;
    });
  };

  console.log("COMPONENTES DEL PLAN:", componentesConfig);
  console.log("SERVICE MOTOR:", componentesServiceMotor);

  return (
    <div className="app-layout">
      {/* ================================= */}
      {/* MENÚ LATERAL GENERAL */}
      {/* ================================= */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logoTM} alt="Logo TM" className="sidebar-logo" />
          <span>Gestión de Maquinaria</span>
        </div>

        <nav className="sidebar-menu">
          <button
            className={`sidebar-item ${modulo === "inicio" ? "activo" : ""}`}
            onClick={() => setModulo("inicio")}
          >
            🏠 Dashboard
          </button>

          <button
            className={`sidebar-item ${
              modulo === "equipos-activos" ? "activo" : ""
            }`}
            onClick={() => {
              setMostrarAlertaServices(true);
              setModulo("equipos-activos");
            }}
          >
            🚜 Equipos Activos
          </button>

          <button
            className={`sidebar-item ${
              modulo === "equipos-inactivos" ? "activo" : ""
            }`}
            onClick={() => setModulo("equipos-inactivos")}
          >
            ⛔ Equipos Inactivos
          </button>

          <button
            className={`sidebar-item ${
              modulo === "historial-equipos" ? "activo" : ""
            }`}
            onClick={async () => {
              await cargarHistorialEquipos();
              setModulo("historial-equipos");
            }}
          >
            📋 Historial de Máquinas
          </button>

          <button
            className={`sidebar-item ${
              modulo === "inventario" ? "activo" : ""
            }`}
            onClick={() => setModulo("inventario")}
          >
            🏗 Inventario de Máquinas
          </button>

          <button
            className={`sidebar-item ${modulo === "equipos" ? "activo" : ""}`}
            onClick={() => {
              setModulo("equipos");
            }}
          >
            🔧 Equipo / Mantenimiento
          </button>

          <button
            className={`sidebar-item ${
              modulo === "nuevo-equipo" ? "activo" : ""
            }`}
            onClick={() => setModulo("nuevo-equipo")}
          >
            ➕ Nuevo Equipo
          </button>

          <button
            className={`sidebar-item ${
              modulo === "config-mantenimiento" ? "activo" : ""
            }`}
            onClick={() => setModulo("config-mantenimiento")}
          >
            ⚙ Configurar Mantenimiento
          </button>
        </nav>
      </aside>

      {/* ================================= */}
      {/* CONTENIDO GENERAL */}
      {/* ================================= */}

      <div className="app-content">
        {modulo === "inicio" && (
          <main className="dashboard-main">
            {/* CONTENIDO PRINCIPAL */}

            <div className="dashboard-header">
              <div>
                <h1>Sistema técnico</h1>
                <p>Estado general de la flota</p>
              </div>
            </div>

            {/* TARJETAS DE RESUMEN */}

            <section className="dashboard-resumen">
              <div className="resumen-card">
                <span className="resumen-titulo">Equipos Activos</span>

                <strong>{equiposActivos.length}</strong>

                <small>Actualmente trabajando</small>
              </div>

              <div className="resumen-card">
                <span className="resumen-titulo">Equipos Inactivos</span>

                <strong>{equiposInactivos.length}</strong>

                <small>Fuera de operación</small>
              </div>

              <div className="resumen-card">
                <span className="resumen-titulo">Total de equipos</span>

                <strong>{equipos.length}</strong>

                <small>Registrados en sistema</small>
              </div>

              <div className="resumen-card alerta">
                <span className="resumen-titulo">Alertas de Service</span>

                <strong>
                  {
                    equiposActivos.filter((equipo) => {
                      const horas = Number(
                        equipo.horas_restantes_service_motor,
                      );

                      return (
                        equipo.horas_restantes_service_motor !== null &&
                        horas <= 50
                      );
                    }).length
                  }
                </strong>

                <small>Próximos o vencidos</small>
              </div>
            </section>

            {/* ALERTAS */}
            <section className="dashboard-seccion">
              <div className="dashboard-seccion-header">
                <div>
                  <h2>Mantenimiento</h2>
                  <p>Services próximos y vencidos</p>
                </div>

                <button
                  type="button"
                  className="boton-ver"
                  onClick={() => {
                    setMostrarAlertaServices(true);
                    setModulo("equipos-activos");
                  }}
                >
                  Ver equipos
                </button>
              </div>

              <div className="dashboard-alertas">
                {equiposActivos.filter((equipo) => {
                  const horas = Number(equipo.horas_restantes_service_motor);

                  return (
                    equipo.horas_restantes_service_motor !== null && horas <= 50
                  );
                }).length === 0 ? (
                  <div className="sin-alertas">✓ No hay services próximos</div>
                ) : (
                  equiposActivos
                    .filter((equipo) => {
                      const horas = Number(
                        equipo.horas_restantes_service_motor,
                      );

                      return (
                        equipo.horas_restantes_service_motor !== null &&
                        horas <= 50
                      );
                    })
                    .slice(0, 5)
                    .map((equipo) => {
                      const horas = Number(
                        equipo.horas_restantes_service_motor,
                      );

                      return (
                        <div
                          key={equipo.interno}
                          className="dashboard-alerta-item"
                        >
                          <div>
                            <strong>Interno {equipo.interno}</strong>

                            <span>
                              {equipo.marca} {equipo.modelo}
                            </span>
                          </div>

                          {horas <= 0 ? (
                            <span className="service-vencido">
                              ✕ Vencido {Math.abs(horas)} hs
                            </span>
                          ) : (
                            <span className="service-proximo">
                              ⚠ Faltan {horas} hs
                            </span>
                          )}
                        </div>
                      );
                    })
                )}
              </div>
            </section>

            {/* ACCESOS RÁPIDOS */}
            <section className="dashboard-seccion">
              <div className="dashboard-seccion-header">
                <div>
                  <h2>Accesos rápidos</h2>
                  <p>Operaciones frecuentes</p>
                </div>
              </div>

              <div className="dashboard-accesos">
                <button onClick={() => setModulo("nuevo-equipo")}>
                  ＋ Registrar equipo
                </button>

                <button onClick={() => setModulo("equipos")}>
                  🔧 Consultar mantenimiento
                </button>

                <button onClick={() => setModulo("inventario")}>
                  🏗 Ver inventario
                </button>
              </div>
            </section>
          </main>
        )}

        {modulo === "inventario" && (
          <main className="panel panel-tabla">
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
          <main className="panel panel-tabla">
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
                        ) : Number(equipo.horas_restantes_service_motor) <=
                          0 ? (
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
                      <option value="Fin de mov. de carga">
                        Fin de mov. de carga
                      </option>
                      <option value="Fin de campaña">Fin de campaña</option>
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
          <main className="panel panel-tabla">
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
                      <th>Acción</th>
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
                        <td>
                          <button
                            className="btn-reactivar"
                            onClick={() => {
                              setInternoContrato(equipo.interno);

                              setNuevoContrato({
                                empresa: "",
                                ubicacion: "",
                                fecha_inicio: "",
                                horometro_inicio: equipo.horometro_fin || "",
                              });

                              setMensajeContrato("");

                              setModulo("nuevo-equipo");
                            }}
                          >
                            Reactivar
                          </button>
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

        {modulo === "historial-equipos" && (
          <main className="panel panel-tabla">
            <h2>Historial de Máquinas</h2>

            <div className="buscador-interno-historial">
              <input
                type="text"
                placeholder="Buscar interno..."
                value={filtroInternoHistorial}
                onChange={(e) => setFiltroInternoHistorial(e.target.value)}
              />
            </div>

            <div className="filtros-historial">
              <select
                value={filtroTipoHistorial}
                onChange={(e) => setFiltroTipoHistorial(e.target.value)}
              >
                <option value="">Todos los tipos</option>
                <option value="Autoelevador">Autoelevador</option>
                <option value="Tracto elevador">Tracto elevador</option>
                <option value="Tractor">Tractor</option>
              </select>

              <select
                value={filtroEmpresaHistorial}
                onChange={(e) => setFiltroEmpresaHistorial(e.target.value)}
              >
                <option value="">Todas las empresas</option>

                {empresasHistorial.map((empresa) => (
                  <option key={empresa} value={empresa}>
                    {empresa}
                  </option>
                ))}
              </select>

              <select
                value={filtroTemporadaHistorial}
                onChange={(e) => setFiltroTemporadaHistorial(e.target.value)}
              >
                <option value="">Todas las temporadas</option>

                {temporadasHistorial.map((temporada) => (
                  <option key={temporada} value={temporada}>
                    Temporada {temporada}
                  </option>
                ))}
              </select>

              <select
                value={filtroMotivoHistorial}
                onChange={(e) => setFiltroMotivoHistorial(e.target.value)}
              >
                <option value="">Todos los motivos</option>
                <option value="Fin de mov. de carga">
                  Fin de mov. de carga
                </option>
                <option value="Fin de campaña">Fin de campaña</option>
                <option value="Reparación">Reparación</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Reemplazo">Reemplazo</option>
                <option value="Otro">Otro</option>
              </select>

              <select
                value={filtroTipoContratoHistorial}
                onChange={(e) => setFiltroTipoContratoHistorial(e.target.value)}
              >
                <option value="">Todos los contratos</option>
                <option value="Alquiler">Alquiler</option>
                <option value="Movimiento de carga">Movimiento de carga</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setFiltroInternoHistorial("");
                  setFiltroEmpresaHistorial("");
                  setFiltroTemporadaHistorial("");
                  setFiltroTipoHistorial("");
                  setFiltroMotivoHistorial("");
                  setFiltroTipoContratoHistorial("");
                }}
              >
                Limpiar filtros
              </button>
            </div>

            <div className="resumen-historial">
              <div className="resumen-historial-card">
                <span>Movimientos</span>
                <strong>{resumenHistorial.movimientos}</strong>
              </div>

              <div className="resumen-historial-card">
                <span>Máquinas</span>
                <strong>{resumenHistorial.maquinas}</strong>
              </div>

              <div className="resumen-historial-card">
                <span>Empresas</span>
                <strong>{resumenHistorial.empresas}</strong>
              </div>

              <div className="resumen-historial-card">
                <span>Horas trabajadas</span>
                <strong>
                  {resumenHistorial.horasTrabajadas.toLocaleString("es-AR")} hs
                </strong>
              </div>
            </div>

            {historialEquiposFiltrado.length > 0 ? (
              <div className="tabla-contenedor">
                <table className="tabla-equipos">
                  <thead>
                    <tr>
                      <th>Interno</th>
                      <th>Empresa</th>
                      <th>Ubicación</th>
                      <th>Inicio</th>
                      <th>Fin</th>
                      <th>Hs inicio</th>
                      <th>Hs fin</th>
                      <th>Hs trabajadas</th>
                      <th>Estado</th>
                      <th>Tipo contrato</th>
                      <th>Motivo baja</th>
                      <th>Observaciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {historialEquiposFiltrado.map((registro) => (
                      <tr key={registro.id}>
                        <td>
                          <strong>{registro.interno}</strong>
                        </td>

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
                            ? new Date(registro.fecha_fin).toLocaleDateString(
                                "es-AR",
                              )
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

                        <td>{registro.tipo_contrato || "-"}</td>

                        <td>{registro.activo ? "Activo" : "Finalizado"}</td>

                        <td>{registro.motivo_baja || "-"}</td>

                        <td>{registro.observacion_baja || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No hay movimientos registrados.</p>
            )}
          </main>
        )}

        {modulo === "nuevo-equipo" && (
          <main className="panel panel-tabla">
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
            <select
              value={nuevoContrato.tipo_contrato}
              onChange={(e) =>
                setNuevoContrato({
                  ...nuevoContrato,
                  tipo_contrato: e.target.value,
                })
              }
            >
              <option value="">Seleccionar tipo</option>
              <option value="Alquiler">Alquiler</option>
              <option value="Movimiento de carga">Movimiento de carga</option>
              <option value="Servicio agricola">Servicio agricola</option>
            </select>
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
          <main className="panel panel-tabla">
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
                  onChange={async (e) => {
                    const internoSeleccionado = e.target.value;

                    setConfigInterno(internoSeleccionado);
                    setConfigPlan("");
                    setConfigPlanNombre("");
                    setComponentesConfig([]);
                    setConfigComponentes({});

                    if (!internoSeleccionado) return;

                    try {
                      const response = await fetch(
                        `http://localhost:3000/equipos/${internoSeleccionado}/plan-mantenimiento`,
                      );

                      const data = await response.json();

                      if (!response.ok) {
                        console.error("Error al cargar plan:", data);
                        return;
                      }

                      if (data.length > 0) {
                        const planId = String(data[0].plan_id);

                        setConfigPlan(planId);
                        setConfigPlanNombre(data[0].plan);

                        const responseComponentes = await fetch(
                          `http://localhost:3000/planes-mantenimiento/${planId}/componentes`,
                        );

                        const componentes = await responseComponentes.json();

                        if (!responseComponentes.ok) {
                          console.error(
                            "Error al cargar componentes:",
                            componentes,
                          );
                          setComponentesConfig([]);
                          return;
                        }

                        setComponentesConfig(componentes);

                        const nuevaConfiguracion = {};

                        componentes.forEach((item) => {
                          nuevaConfiguracion[item.componente_id] = {
                            componente_id: item.componente_id,
                            fecha: "",
                            horometro: "",
                            cambiado: false,
                            motivo: "",
                          };
                        });

                        setConfigComponentes(nuevaConfiguracion);
                      } else {
                        setConfigPlan("");
                        setConfigPlanNombre("");
                        setComponentesConfig([]);
                        setConfigComponentes({});
                      }
                    } catch (error) {
                      console.error(
                        "Error al consultar plan del equipo:",
                        error,
                      );
                    }
                  }}
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
                {configPlan && !editandoPlan ? (
                  <>
                    <input type="text" value={configPlanNombre} readOnly />

                    <button
                      type="button"
                      className="btn-plan"
                      onClick={() => {
                        setPlanSeleccionado(configPlan);
                        setEditandoPlan(true);
                      }}
                    >
                      Cambiar plan
                    </button>
                  </>
                ) : (
                  <select
                    value={planSeleccionado}
                    onChange={(e) => setPlanSeleccionado(e.target.value)}
                    disabled={!configInterno}
                  >
                    <option value="">Seleccionar plan...</option>

                    {planesMantenimiento.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.nombre}
                      </option>
                    ))}
                  </select>
                )}
              </label>
              {configInterno &&
                planSeleccionado &&
                (!configPlan || editandoPlan) && (
                  <button
                    className="btn-plan"
                    type="button"
                    onClick={async () => {
                      if (configPlan && editandoPlan) {
                        const confirmar = window.confirm(
                          `¿Seguro que querés cambiar el plan del interno ${configInterno}?`,
                        );

                        if (!confirmar) {
                          return;
                        }
                      }
                      try {
                        setMensajeConfiguracion("Asignando plan...");

                        const response = await fetch(
                          `http://localhost:3000/equipos/${configInterno}/plan-mantenimiento`,
                          {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              plan_id: Number(planSeleccionado),
                            }),
                          },
                        );

                        const data = await response.json();

                        if (!response.ok) {
                          setMensajeConfiguracion(
                            data.error || "Error al asignar el plan.",
                          );
                          return;
                        }

                        const plan = planesMantenimiento.find(
                          (item) =>
                            String(item.id) === String(planSeleccionado),
                        );

                        // Cargar componentes del plan recién asignado
                        const responseComponentes = await fetch(
                          `http://localhost:3000/planes-mantenimiento/${planSeleccionado}/componentes`,
                        );

                        const componentes = await responseComponentes.json();

                        if (!responseComponentes.ok) {
                          setMensajeConfiguracion(
                            "El plan se asignó, pero hubo un error al cargar sus componentes.",
                          );
                          return;
                        }

                        setConfigPlan(String(planSeleccionado));
                        setConfigPlanNombre(plan?.nombre || "");
                        setComponentesConfig(componentes);

                        const nuevaConfiguracion = {};

                        componentes.forEach((item) => {
                          nuevaConfiguracion[item.componente_id] = {
                            componente_id: item.componente_id,
                            fecha: "",
                            horometro: "",
                            cambiado: false,
                            motivo: "",
                          };
                        });

                        setConfigComponentes(nuevaConfiguracion);
                        setPlanSeleccionado("");

                        setMensajeConfiguracion(
                          `Plan ${plan?.nombre || ""} asignado correctamente al interno ${configInterno}.`,
                        );
                      } catch (error) {
                        console.error(error);
                        setMensajeConfiguracion(
                          "Error de conexión con el servidor.",
                        );
                      }
                    }}
                  >
                    Asignar plan
                  </button>
                )}
            </div>

            {configPlan && componentesConfig.length > 0 && (
              <>
                <h3>{configPlanNombre}</h3>

                {componentesServiceMotor.length > 0 && (
                  <div className="mantenimiento-card">
                    <h4>Service de motor</h4>

                    <p>
                      <strong>Frecuencia:</strong> 300 hs
                    </p>

                    <div className="service-componentes">
                      <strong>Incluye:</strong>

                      <ul>
                        {componentesServiceMotor.map((item) => (
                          <li key={item.componente_id}>
                            {item.nombre}

                            {item.codigo && <> — {item.codigo}</>}

                            {item.cantidad && (
                              <>
                                {" "}
                                — {item.cantidad} {item.unidad}
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <label>
                      Última fecha
                      <input
                        type="date"
                        value={configServiceMotor.fecha || ""}
                        onChange={(e) =>
                          cambiarFechaServiceMotor(e.target.value)
                        }
                      />
                    </label>

                    <label>
                      Último horómetro
                      <input
                        type="number"
                        value={configServiceMotor.horometro || ""}
                        onChange={(e) =>
                          cambiarHorometroServiceMotor(e.target.value)
                        }
                      />
                    </label>
                  </div>
                )}

                <div className="mantenimientos-grid">
                  {componentesConfig
                    .filter((item) => {
                      const esOpcional =
                        item.opcional === true ||
                        item.opcional === "true" ||
                        item.opcional === 1;

                      const esServiceMotor =
                        !esOpcional && Number(item.frecuencia_horas) === 300;

                      return !esServiceMotor;
                    })
                    .map((item) => {
                      const config = configComponentes[item.componente_id] || {
                        fecha: "",
                        horometro: "",
                        cambiado: false,
                        motivo: "",
                      };

                      // acá continúa exactamente tu código actual

                      return (
                        <div
                          className="mantenimiento-card"
                          key={item.componente_id}
                        >
                          <h4>{item.nombre}</h4>

                          {item.codigo && (
                            <p>
                              <strong>Código:</strong> {item.codigo}
                            </p>
                          )}

                          <p>
                            <strong>Frecuencia:</strong> {item.frecuencia_horas}{" "}
                            hs
                          </p>

                          {item.cantidad && (
                            <p>
                              <strong>Cantidad:</strong> {item.cantidad}{" "}
                              {item.unidad || ""}
                            </p>
                          )}

                          {item.opcional ? (
                            <>
                              <p>
                                <strong>Opcional</strong>
                              </p>

                              <label>
                                <input
                                  type="checkbox"
                                  checked={config.cambiado}
                                  onChange={(e) =>
                                    setConfigComponentes((anterior) => ({
                                      ...anterior,

                                      [item.componente_id]: {
                                        ...anterior[item.componente_id],
                                        componente_id: item.componente_id,
                                        cambiado: e.target.checked,
                                        motivo: e.target.checked
                                          ? anterior[item.componente_id]
                                              ?.motivo || ""
                                          : "",
                                      },
                                    }))
                                  }
                                />
                                Registrar cambio
                              </label>

                              {config.cambiado && (
                                <select
                                  value={config.motivo}
                                  onChange={(e) =>
                                    setConfigComponentes((anterior) => ({
                                      ...anterior,

                                      [item.componente_id]: {
                                        ...anterior[item.componente_id],
                                        motivo: e.target.value,
                                      },
                                    }))
                                  }
                                >
                                  <option value="">
                                    Seleccionar motivo...
                                  </option>

                                  <option value="Por frecuencia">
                                    Por frecuencia
                                  </option>

                                  <option value="Sucio">Sucio</option>

                                  <option value="Dañado">Dañado</option>

                                  <option value="Decisión jefe de mecánicos">
                                    Decisión jefe de mecánicos
                                  </option>

                                  <option value="Otro">Otro</option>
                                </select>
                              )}
                            </>
                          ) : (
                            <>
                              <label>
                                Última fecha
                                <input
                                  type="date"
                                  value={config.fecha}
                                  onChange={(e) =>
                                    setConfigComponentes((anterior) => ({
                                      ...anterior,

                                      [item.componente_id]: {
                                        ...anterior[item.componente_id],
                                        componente_id: item.componente_id,
                                        fecha: e.target.value,
                                      },
                                    }))
                                  }
                                />
                              </label>

                              <label>
                                Último horómetro
                                <input
                                  type="number"
                                  value={config.horometro}
                                  onChange={(e) =>
                                    setConfigComponentes((anterior) => ({
                                      ...anterior,

                                      [item.componente_id]: {
                                        ...anterior[item.componente_id],
                                        componente_id: item.componente_id,
                                        horometro: e.target.value,
                                      },
                                    }))
                                  }
                                />
                              </label>
                            </>
                          )}
                        </div>
                      );
                    })}
                </div>
              </>
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
          <main className="panel panel-tabla">
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

                  <button onClick={actualizarHorometro}>
                    Guardar horómetro
                  </button>

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

                {filtrosEspecialesEstado.length > 0 && (
                  <>
                    <h3>Filtros especiales</h3>

                    <div className="filtros-600-grid">
                      {filtrosEspecialesEstado.map((item) => (
                        <div
                          className="mantenimiento-card"
                          key={item.componente_id}
                        >
                          <h4>{item.componente}</h4>

                          {item.codigo && (
                            <p>
                              <strong>Código:</strong> {item.codigo}
                            </p>
                          )}

                          <p>
                            <strong>Frecuencia:</strong> {item.frecuencia_horas}{" "}
                            hs
                          </p>

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
                                <strong>Horas usadas:</strong>{" "}
                                {item.horas_usadas} hs
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
                  </>
                )}

                {mantenimientos.length > 0 && (
                  <h3>Mantenimientos programados</h3>
                )}

                {mantenimientos.length > 0 ? (
                  <div className="mantenimientos-grid">
                    {mantenimientos.map((item) => (
                      <div
                        className="mantenimiento-card"
                        key={item.componente_id}
                      >
                        <h4>{item.componente}</h4>

                        {item.codigo && (
                          <p>
                            <strong>Código:</strong> {item.codigo}
                          </p>
                        )}

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
                              <strong>Frecuencia:</strong>{" "}
                              {item.frecuencia_horas} hs
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

                          {item.cantidad && (
                            <small>
                              Cantidad: {item.cantidad} {item.unidad || ""}
                            </small>
                          )}

                          <small>Cada {item.frecuencia_horas} hs</small>

                          {item.opcional && <small>Opcional</small>}
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
    </div>
  );
}

export default App;
