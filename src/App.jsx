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

  // INFORMES TECNICOS
  const [equipoInforme, setEquipoInforme] = useState(null);
  const [busquedaInternoInforme, setBusquedaInternoInforme] = useState("");
  const [busquedaRepuesto, setBusquedaRepuesto] = useState("");
  const [resultadosRepuestos, setResultadosRepuestos] = useState([]);
  const [repuestosInforme, setRepuestosInforme] = useState([]);

  // REPUESTOS MANUALES
  const [mostrarRepuestoManual, setMostrarRepuestoManual] = useState(false);

  const [repuestoManual, setRepuestoManual] = useState({
    codigo: "",
    descripcion: "",
    cantidad: 1,
    unidad: "UN",
  });

  // UBICACIONES
  const [ubicaciones, setUbicaciones] = useState([]);
  const [busquedaUbicacion, setBusquedaUbicacion] = useState("");
  const [ubicacionInforme, setUbicacionInforme] = useState(null);

  const [mostrarNuevaUbicacion, setMostrarNuevaUbicacion] = useState(false);

  const [nuevaUbicacion, setNuevaUbicacion] = useState({
    nombre: "",
    latitud: null,
    longitud: null,
  });

  const [obteniendoUbicacion, setObteniendoUbicacion] = useState(false);

  const [trasladoInforme, setTrasladoInforme] = useState(null);

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

  // PENDIENTES
  const [tipoPendienteVista, setTipoPendienteVista] = useState("CENTRAL");
  const [pendientes, setPendientes] = useState([]);
  const [cargandoPendientes, setCargandoPendientes] = useState(false);

  const [mostrarNuevoPendiente, setMostrarNuevoPendiente] = useState(false);
  const [busquedaInternoPendiente, setBusquedaInternoPendiente] = useState("");
  const [equipoPendiente, setEquipoPendiente] = useState(null);
  const [nuevoPendiente, setNuevoPendiente] = useState({
    tipo: "CENTRAL",
    fecha: new Date().toISOString().split("T")[0],
    empresa: "",
    informado_por: "",
    descripcion: "",
    prioridad: "NORMAL",
    observaciones: "",
  });

  const [pendienteAFinalizar, setPendienteAFinalizar] = useState(null);
  const [solucionPendiente, setSolucionPendiente] = useState("");

  const [pendientesFinalizados, setPendientesFinalizados] = useState([]);
  const [busquedaPendienteFinalizado, setBusquedaPendienteFinalizado] =
    useState("");
  const [cargandoFinalizados, setCargandoFinalizados] = useState(false);
  const [pendienteDetalle, setPendienteDetalle] = useState(null);

  const [antecedentesPendiente, setAntecedentesPendiente] = useState([]);

  const [cargandoAntecedentes, setCargandoAntecedentes] = useState(false);

  // HOROMETROS
  const [fechaHorometro, setFechaHorometro] = useState("");
  const [nuevoHorometro, setNuevoHorometro] = useState("");
  const [mensajeHorometro, setMensajeHorometro] = useState("");

  // CONTRATOS
  const [internoContrato, setInternoContrato] = useState("");
  const [mensajeContrato, setMensajeContrato] = useState("");

  // PROYECCION DE SERVICE
  const [proyeccionService, setProyeccionService] = useState(null);

  // NUEVO CONTRATO
  const [mostrarDetalleTraslado, setMostrarDetalleTraslado] = useState(false);

  const [nuevoContrato, setNuevoContrato] = useState({
    empresa: "",
    ubicacion: "",
    fecha_inicio: "",
    horometro_inicio: "",
    tipo_contrato: "",
  });

  // NUEVO EQUIPO
  const [nuevoEquipo, setNuevoEquipo] = useState({
    categoria: "MAQUINARIA",

    // Maquinaria
    interno: "",
    horometro_actual: "",
    frecuencia_service: "",

    // Datos generales
    tipo: "",
    marca: "",
    modelo: "",

    // Flota
    patente: "",
    anio: "",
    responsable: "",
    kilometraje_actual: "",
  });

  const [mensajeNuevoEquipo, setMensajeNuevoEquipo] = useState("");
  const [equiposActivos, setEquiposActivos] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/ubicaciones")
      .then((res) => res.json())
      .then((data) => {
        setUbicaciones(data);
      })
      .catch((error) => {
        console.error("Error cargando ubicaciones:", error);
      });
  }, []);

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

  const calcularProyeccionService = async (interno, ultimoServiceMotor) => {
    try {
      const response = await fetch(
        `http://localhost:3000/equipos/${interno}/ultimos-horometros`,
      );

      const lecturas = await response.json();

      if (!response.ok || lecturas.length < 2) {
        setProyeccionService(null);
        return;
      }

      const ultimaLectura = lecturas[0];
      const lecturaAnterior = lecturas[1];

      const fechaUltima = new Date(ultimaLectura.fecha);
      const fechaAnterior = new Date(lecturaAnterior.fecha);
      const hoy = new Date();

      const MS_DIA = 1000 * 60 * 60 * 24;

      // Días entre las últimas dos visitas
      const diasEntreLecturas = Math.max(
        1,
        Math.round((fechaUltima - fechaAnterior) / MS_DIA),
      );

      // Horas trabajadas entre ambas visitas
      const diferenciaHorometro =
        Number(ultimaLectura.horometro) - Number(lecturaAnterior.horometro);

      // Promedio de uso diario
      const horasPromedioDia = diferenciaHorometro / diasEntreLecturas;

      // Días desde la última visita
      const diasDesdeUltimaVisita = Math.max(
        0,
        Math.floor((hoy - fechaUltima) / MS_DIA),
      );

      // Horómetro estimado al día de hoy
      const horometroEstimado =
        Number(ultimaLectura.horometro) +
        horasPromedioDia * diasDesdeUltimaVisita;

      // Próximo service
      const proximoService = Number(ultimoServiceMotor.horometro) + 300;

      // Horas estimadas restantes
      const horasRestantes = proximoService - horometroEstimado;

      // Días aproximados hasta el service
      const diasRestantes =
        horasPromedioDia > 0 ? horasRestantes / horasPromedioDia : null;

      const resultado = {
        interno,
        ultimaFecha: ultimaLectura.fecha,
        ultimoHorometro: Number(ultimaLectura.horometro),
        horasPromedioDia,
        diasDesdeUltimaVisita,
        horometroEstimado,
        proximoService,
        horasRestantes,
        diasRestantes,
        requiereControl: diasDesdeUltimaVisita >= 20,
      };

      setProyeccionService(resultado);
    } catch (error) {
      console.error("Error calculando proyección:", error);
      setProyeccionService(null);
    }
  };

  const [datosInforme, setDatosInforme] = useState({
    numero_ot: "",
    fecha: new Date().toISOString().split("T")[0],
    tipo_trabajo: "",
    horometro: "",
    cliente: "",
    contacto_cliente: "",
    reclamo_cliente: "",
    trabajo_realizado: "",
    observaciones: "",
    estado_final: "",
    mecanico: "",
    hora_inicio: "",
    hora_fin: "",
  });

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
    if (!interno || !ultimoService) return;

    const cargarProyeccion = async () => {
      await calcularProyeccionService(interno, ultimoService);
    };

    cargarProyeccion();
  }, [interno, ultimoService]);

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

      // Lo agregamos al estado de React
      setEquipos((equiposActuales) => [...equiposActuales, data]);

      if (nuevoEquipo.categoria === "MAQUINARIA") {
        // Solo maquinaria continúa con asignación de contrato
        setInternoContrato(data.interno);

        setMensajeNuevoEquipo(`Interno ${data.interno} creado correctamente.`);
      } else {
        // Flota no utiliza interno ni contrato
        setInternoContrato("");

        setMensajeNuevoEquipo(`Vehículo ${data.patente} creado correctamente.`);
      }

      // Limpiamos el formulario manteniendo
      // la categoría que estaba seleccionada
      setNuevoEquipo({
        categoria: nuevoEquipo.categoria,

        interno: "",
        horometro_actual: "",
        frecuencia_service: 300,

        tipo: "",
        marca: "",
        modelo: "",

        patente: "",
        anio: "",
        responsable: "",
        kilometraje_actual: "",
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
    const horasEstimadas = Number(equipo.horas_restantes_estimadas);

    const diasSinControl = Number(equipo.dias_sin_control);

    const alertaService =
      equipo.horas_restantes_estimadas !== null && horasEstimadas <= 50;

    const alertaControl =
      equipo.dias_sin_control !== null && diasSinControl >= 20;

    return alertaService || alertaControl;
  });

  const cantidadAlertasMantenimiento = equiposConAlertaService.length;

  const cantidadServicesVencidos = equiposActivos.filter((equipo) => {
    if (equipo.horas_restantes_estimadas === null) {
      return false;
    }

    return Number(equipo.horas_restantes_estimadas) <= 0;
  }).length;

  const cantidadControlesPendientes = equiposActivos.filter((equipo) => {
    if (equipo.dias_sin_control === null) {
      return false;
    }

    return Number(equipo.dias_sin_control) >= 20;
  }).length;

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

  const ubicacionesFiltradas =
    busquedaUbicacion.trim().length >= 2
      ? ubicaciones
          .filter((ubicacion) =>
            ubicacion.nombre
              .toLowerCase()
              .includes(busquedaUbicacion.toLowerCase()),
          )
          .slice(0, 8)
      : [];

  const calcularTraslado = async (ubicacionId) => {
    try {
      setTrasladoInforme(null);

      const respuesta = await fetch(
        `http://localhost:3000/distancia-traslado/${ubicacionId}`,
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo calcular el traslado");
      }

      const datos = await respuesta.json();

      setTrasladoInforme(datos);
    } catch (error) {
      console.error("Error calculando traslado:", error);
      setTrasladoInforme(null);
    }
  };

  const obtenerUbicacionActual = () => {
    if (!navigator.geolocation) {
      alert("Este dispositivo no permite obtener la ubicación.");
      return;
    }

    setObteniendoUbicacion(true);

    navigator.geolocation.getCurrentPosition(
      (posicion) => {
        setNuevaUbicacion((anterior) => ({
          ...anterior,
          latitud: posicion.coords.latitude,
          longitud: posicion.coords.longitude,
        }));

        setObteniendoUbicacion(false);
      },

      (error) => {
        console.error("Error obteniendo ubicación:", error);

        alert(
          "No se pudo obtener la ubicación. Verificá los permisos de ubicación.",
        );

        setObteniendoUbicacion(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      },
    );
  };

  const guardarNuevaUbicacion = async () => {
    if (!nuevaUbicacion.nombre.trim()) {
      alert("Ingresá un nombre para la ubicación.");
      return;
    }

    if (nuevaUbicacion.latitud === null || nuevaUbicacion.longitud === null) {
      alert("Primero obtené la ubicación.");
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:3000/ubicaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaUbicacion),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudo guardar la ubicación");
      }

      const ubicacionGuardada = datos.ubicacion;

      // Agregarla al listado sin volver a cargar todo
      setUbicaciones((anteriores) => [...anteriores, ubicacionGuardada]);

      // Seleccionarla automáticamente
      setUbicacionInforme(ubicacionGuardada);
      setBusquedaUbicacion(ubicacionGuardada.nombre);

      // Cerrar formulario
      setMostrarNuevaUbicacion(false);

      setNuevaUbicacion({
        nombre: "",
        latitud: null,
        longitud: null,
      });

      // Calcular traslado automáticamente
      calcularTraslado(ubicacionGuardada.id);
    } catch (error) {
      console.error("Error guardando ubicación:", error);

      alert("No se pudo guardar la ubicación.");
    }
  };

  const guardarInformeTecnico = async () => {
    if (!equipoInforme) {
      alert("Seleccioná un equipo.");
      return;
    }

    if (!ubicacionInforme) {
      alert("Seleccioná el lugar del trabajo.");
      return;
    }

    if (!datosInforme.fecha) {
      alert("Ingresá la fecha.");
      return;
    }

    if (!datosInforme.horometro) {
      alert("Ingresá el horómetro.");
      return;
    }

    if (!datosInforme.tipo_trabajo) {
      alert("Seleccioná el tipo de trabajo.");
      return;
    }

    if (!datosInforme.trabajo_realizado.trim()) {
      alert("Ingresá el trabajo realizado.");
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:3000/informes-tecnicos", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          interno: equipoInforme.interno,

          ...datosInforme,

          ubicacion_id: ubicacionInforme.id,

          movilidad_km: trasladoInforme?.distancia_total_km ?? null,

          horas_mano_obra: horasManoObra,

          repuestos: repuestosInforme,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudo guardar el informe");
      }

      alert(`Informe ${datos.informe.numero_ot} guardado correctamente`);

      console.log("Informe guardado:", datos.informe);
    } catch (error) {
      console.error("Error guardando informe:", error);

      alert("No se pudo guardar el informe técnico.");
    }

    // Limpiar equipo
    setBusquedaInternoInforme("");
    setEquipoInforme(null);

    // Limpiar ubicación y traslado
    setBusquedaUbicacion("");
    setUbicacionInforme(null);
    setTrasladoInforme(null);
    setMostrarDetalleTraslado(false);

    // Cerrar formulario de nueva ubicación
    setMostrarNuevaUbicacion(false);

    setNuevaUbicacion({
      nombre: "",
      latitud: null,
      longitud: null,
    });

    // Limpiar datos de la OT
    setDatosInforme({
      numero_ot: "",
      fecha: new Date().toISOString().split("T")[0],
      tipo_trabajo: "",
      horometro: "",
      cliente: "",
      contacto_cliente: "",
      reclamo_cliente: "",
      trabajo_realizado: "",
      observaciones: "",
      estado_final: "",
      mecanico: "",
      hora_inicio: "",
      hora_fin: "",
    });
  };

  const calcularHorasManoObra = () => {
    if (!datosInforme.hora_inicio || !datosInforme.hora_fin) {
      return null;
    }

    const [horaInicio, minutoInicio] = datosInforme.hora_inicio
      .split(":")
      .map(Number);

    const [horaFin, minutoFin] = datosInforme.hora_fin.split(":").map(Number);

    const inicio = horaInicio * 60 + minutoInicio;
    const fin = horaFin * 60 + minutoFin;

    if (fin < inicio) {
      return null;
    }

    return (fin - inicio) / 60;
  };

  const horasManoObra = calcularHorasManoObra();

  const buscarRepuestos = async (texto) => {
    setBusquedaRepuesto(texto);

    if (texto.trim().length < 2) {
      setResultadosRepuestos([]);
      return;
    }

    try {
      const respuesta = await fetch(
        `http://localhost:3000/componentes/buscar?q=${encodeURIComponent(
          texto,
        )}`,
      );

      if (!respuesta.ok) {
        throw new Error("No se pudieron buscar los repuestos");
      }

      const datos = await respuesta.json();

      setResultadosRepuestos(datos);
    } catch (error) {
      console.error("Error buscando repuestos:", error);
      setResultadosRepuestos([]);
    }
  };

  const agregarRepuestoInforme = (componente) => {
    const yaAgregado = repuestosInforme.some(
      (item) => item.componente_id === componente.id,
    );

    if (yaAgregado) {
      alert("Ese repuesto ya fue agregado.");
      return;
    }

    setRepuestosInforme((anteriores) => [
      ...anteriores,
      {
        componente_id: componente.id,
        codigo: componente.codigo || "",
        descripcion: componente.nombre,
        cantidad: 1,
        unidad: "UN",
        observaciones: "",
      },
    ]);

    setBusquedaRepuesto("");
    setResultadosRepuestos([]);
  };

  const cargarPendientes = async (tipo) => {
    try {
      setCargandoPendientes(true);

      const respuesta = await fetch(
        `http://localhost:3000/pendientes?tipo=${tipo}`,
      );

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los pendientes");
      }

      const datos = await respuesta.json();

      setPendientes(datos);
    } catch (error) {
      console.error("Error cargando pendientes:", error);
      setPendientes([]);
    } finally {
      setCargandoPendientes(false);
    }
  };

  const guardarPendiente = async () => {
    if (!equipoPendiente) {
      alert("Seleccioná un equipo.");
      return;
    }

    if (!nuevoPendiente.descripcion.trim()) {
      alert("Ingresá el trabajo pendiente.");
      return;
    }

    try {
      const respuesta = await fetch("http://localhost:3000/pendientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interno: equipoPendiente.interno,
          ...nuevoPendiente,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudo guardar el pendiente");
      }

      alert("Pendiente guardado correctamente");

      // Recordamos qué tipo se creó
      const tipoGuardado = nuevoPendiente.tipo;

      // Limpiar formulario
      setBusquedaInternoPendiente("");
      setEquipoPendiente(null);

      setNuevoPendiente({
        tipo: "CENTRAL",
        fecha: new Date().toISOString().split("T")[0],
        empresa: "",
        informado_por: "",
        descripcion: "",
        prioridad: "NORMAL",
        observaciones: "",
      });

      setMostrarNuevoPendiente(false);

      // Mostrar automáticamente la sección correspondiente
      setTipoPendienteVista(tipoGuardado);
      cargarPendientes(tipoGuardado);
    } catch (error) {
      console.error("Error guardando pendiente:", error);
      alert(error.message);
    }
  };

  const marcarPendienteEnProceso = async (id) => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/pendientes/${id}/en-proceso`,
        {
          method: "PUT",
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudo actualizar el pendiente");
      }

      cargarPendientes(tipoPendienteVista);
    } catch (error) {
      console.error("Error actualizando pendiente:", error);
      alert(error.message);
    }
  };

  const finalizarPendiente = async () => {
    if (!pendienteAFinalizar) {
      return;
    }

    if (!solucionPendiente.trim()) {
      alert("Ingresá la solución realizada.");
      return;
    }

    try {
      const respuesta = await fetch(
        `http://localhost:3000/pendientes/${pendienteAFinalizar.id}/finalizar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            solucion: solucionPendiente.trim(),
          }),
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudo finalizar el pendiente");
      }

      setPendienteAFinalizar(null);
      setSolucionPendiente("");

      cargarPendientes(tipoPendienteVista);
    } catch (error) {
      console.error("Error finalizando pendiente:", error);
      alert(error.message);
    }
  };

  const cargarPendientesFinalizados = async (interno = "") => {
    try {
      setCargandoFinalizados(true);

      let url = "http://localhost:3000/pendientes-finalizados";

      if (interno.trim()) {
        url += `?interno=${encodeURIComponent(interno.trim())}`;
      }

      const respuesta = await fetch(url);

      if (!respuesta.ok) {
        throw new Error("No se pudieron cargar los pendientes finalizados");
      }

      const datos = await respuesta.json();

      setPendientesFinalizados(datos);
    } catch (error) {
      console.error("Error cargando pendientes finalizados:", error);

      setPendientesFinalizados([]);
    } finally {
      setCargandoFinalizados(false);
    }
  };

  const cargarAntecedentesPendiente = async (interno) => {
    if (!interno) {
      setAntecedentesPendiente([]);
      return;
    }

    try {
      setCargandoAntecedentes(true);

      const respuesta = await fetch(
        `http://localhost:3000/pendientes-finalizados?interno=${encodeURIComponent(
          interno,
        )}`,
      );

      if (!respuesta.ok) {
        throw new Error("No se pudieron consultar los antecedentes");
      }

      const datos = await respuesta.json();

      setAntecedentesPendiente(datos);
    } catch (error) {
      console.error("Error consultando antecedentes:", error);

      setAntecedentesPendiente([]);
    } finally {
      setCargandoAntecedentes(false);
    }
  };

  const calcularProgresoMantenimiento = (horasUsadas, frecuencia) => {
    const usadas = Number(horasUsadas) || 0;
    const limite = Number(frecuencia) || 0;

    if (limite <= 0) {
      return 0;
    }

    const porcentaje = (usadas / limite) * 100;

    return Math.min(Math.max(porcentaje, 0), 100);
  };

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
              modulo === "pendientes" ? "activo" : ""
            }`}
            onClick={() => setModulo("pendientes")}
          >
            📌 Pendientes
          </button>

          <button
            className={`sidebar-item ${
              modulo === "informes-tecnicos" || modulo === "nuevo-informe"
                ? "activo"
                : ""
            }`}
            onClick={() => {
              setModulo("informes-tecnicos");
            }}
          >
            📋 Informes técnicos
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
                <span className="resumen-titulo">Alertas de mantenimiento</span>

                <strong>{cantidadAlertasMantenimiento}</strong>

                <small>Requieren atención</small>
              </div>
            </section>

            {/* ALERTAS */}
            {/* ALERTAS */}
            <section className="dashboard-seccion">
              <div className="dashboard-seccion-header">
                <div>
                  <h2>Mantenimiento</h2>
                  <p>Resumen de alertas de la flota</p>
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

              <div className="dashboard-alertas-resumen">
                <div className="dashboard-alerta-resumen">
                  <span>🔴</span>
                  <strong>{cantidadServicesVencidos}</strong>
                  <p>Services vencidos</p>
                </div>

                <div className="dashboard-alerta-resumen">
                  <span>🟠</span>
                  <strong>{cantidadControlesPendientes}</strong>
                  <p>Controles de visitas</p>
                </div>
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
                      const horasEstimadas = Number(
                        equipo.horas_restantes_estimadas,
                      );

                      const promedio = Number(equipo.promedio_horas_dia);

                      const diasSinControl = Number(equipo.dias_sin_control);

                      const diasEstimados =
                        promedio > 0 && horasEstimadas > 0
                          ? Math.ceil(horasEstimadas / promedio)
                          : null;

                      return (
                        <div
                          key={equipo.interno}
                          className="alerta-service-item"
                        >
                          <strong>Interno {equipo.interno}</strong>

                          {equipo.horas_restantes_estimadas !== null &&
                            horasEstimadas <= 0 && (
                              <span className="service-vencido">
                                ✕ Service estimado vencido por{" "}
                                {Math.abs(horasEstimadas)} hs
                              </span>
                            )}

                          {equipo.horas_restantes_estimadas !== null &&
                            horasEstimadas > 0 &&
                            horasEstimadas <= 50 && (
                              <span className="service-proximo">
                                ⚠ Service estimado en {diasEstimados} días /{" "}
                                {horasEstimadas} hs
                              </span>
                            )}

                          {equipo.dias_sin_control !== null &&
                            diasSinControl >= 20 && (
                              <span className="control-pendiente">
                                ⚠ Control pendiente — {diasSinControl} días sin
                                lectura
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

        {modulo === "pendientes" && (
          <section className="modulo-pendientes">
            <div className="pendientes-header">
              <div>
                <h2>Pendientes</h2>
                <p>Seguimiento de trabajos pendientes de equipos.</p>
              </div>

              <button
                type="button"
                className="btn-nuevo-pendiente"
                onClick={() => {
                  setMostrarNuevoPendiente(true);

                  setNuevoPendiente((anterior) => ({
                    ...anterior,
                    tipo: tipoPendienteVista === "FINCA" ? "FINCA" : "CENTRAL",
                  }));
                }}
              >
                + Nuevo pendiente
              </button>
            </div>

            {mostrarNuevoPendiente && (
              <div className="nuevo-pendiente-card">
                <div className="nuevo-pendiente-header">
                  <div>
                    <h3>Nuevo pendiente</h3>
                    <p>Registrá un trabajo pendiente para un equipo.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMostrarNuevoPendiente(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="nuevo-pendiente-grid">
                  <div className="campo-pendiente">
                    <label>Interno</label>

                    <input
                      type="text"
                      placeholder="Ej: 129"
                      value={busquedaInternoPendiente}
                      onChange={(e) => {
                        const valor = e.target.value;

                        setBusquedaInternoPendiente(valor);

                        const encontrado = equipos.find(
                          (equipo) =>
                            String(equipo.interno).toLowerCase() ===
                            valor.trim().toLowerCase(),
                        );

                        setEquipoPendiente(encontrado || null);

                        if (encontrado) {
                          cargarAntecedentesPendiente(encontrado.interno);
                        } else {
                          setAntecedentesPendiente([]);
                        }
                      }}
                    />
                  </div>

                  <div className="campo-pendiente">
                    <label>Tipo</label>

                    <select
                      value={nuevoPendiente.tipo}
                      onChange={(e) =>
                        setNuevoPendiente({
                          ...nuevoPendiente,
                          tipo: e.target.value,
                        })
                      }
                    >
                      <option value="CENTRAL">Central</option>

                      <option value="FINCA">Finca</option>
                    </select>
                  </div>

                  <div className="campo-pendiente">
                    <label>Fecha</label>

                    <input
                      type="date"
                      value={nuevoPendiente.fecha}
                      onChange={(e) =>
                        setNuevoPendiente({
                          ...nuevoPendiente,
                          fecha: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {equipoPendiente && (
                  <div className="equipo-pendiente-seleccionado">
                    <div>
                      <span>Interno</span>
                      <strong>{equipoPendiente.interno}</strong>
                    </div>

                    <div>
                      <span>Equipo</span>
                      <strong>{equipoPendiente.tipo || "-"}</strong>
                    </div>

                    <div>
                      <span>Marca</span>
                      <strong>{equipoPendiente.marca || "-"}</strong>
                    </div>

                    <div>
                      <span>Modelo</span>
                      <strong>{equipoPendiente.modelo || "-"}</strong>
                    </div>
                  </div>
                )}

                {equipoPendiente && (
                  <div className="antecedentes-equipo">
                    <div className="antecedentes-equipo-header">
                      <div>
                        <span>ANTECEDENTES DEL EQUIPO</span>

                        <strong>Interno {equipoPendiente.interno}</strong>
                      </div>

                      {antecedentesPendiente.length > 0 && (
                        <span className="cantidad-antecedentes">
                          {antecedentesPendiente.length}{" "}
                          {antecedentesPendiente.length === 1
                            ? "antecedente"
                            : "antecedentes"}
                        </span>
                      )}
                    </div>

                    {cargandoAntecedentes ? (
                      <p className="cargando-antecedentes">
                        Consultando antecedentes...
                      </p>
                    ) : antecedentesPendiente.length === 0 ? (
                      <div className="sin-antecedentes-equipo">
                        ✓ No registra pendientes finalizados anteriormente.
                      </div>
                    ) : (
                      <div className="ultimo-antecedente">
                        <div className="ultimo-antecedente-titulo">
                          <span>Último antecedente</span>

                          <strong>
                            {antecedentesPendiente[0].fecha_finalizacion
                              ? new Date(
                                  antecedentesPendiente[0].fecha_finalizacion,
                                ).toLocaleDateString("es-AR", {
                                  timeZone: "UTC",
                                })
                              : "-"}
                          </strong>
                        </div>

                        <div className="antecedente-problema">
                          <span>Problema</span>

                          <p>{antecedentesPendiente[0].descripcion}</p>
                        </div>

                        <div className="antecedente-solucion">
                          <span>Solución</span>

                          <p>{antecedentesPendiente[0].solucion || "-"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="nuevo-pendiente-grid">
                  <div className="campo-pendiente">
                    <label>Empresa</label>

                    <input
                      type="text"
                      placeholder="Ej: Nucete"
                      value={nuevoPendiente.empresa}
                      onChange={(e) =>
                        setNuevoPendiente({
                          ...nuevoPendiente,
                          empresa: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="campo-pendiente">
                    <label>Informado por</label>

                    <input
                      type="text"
                      placeholder="Ej: Rodrigo Sotelo"
                      value={nuevoPendiente.informado_por}
                      onChange={(e) =>
                        setNuevoPendiente({
                          ...nuevoPendiente,
                          informado_por: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="campo-pendiente">
                    <label>Prioridad</label>

                    <select
                      value={nuevoPendiente.prioridad}
                      onChange={(e) =>
                        setNuevoPendiente({
                          ...nuevoPendiente,
                          prioridad: e.target.value,
                        })
                      }
                    >
                      <option value="NORMAL">Normal</option>

                      <option value="URGENTE">Urgente</option>
                    </select>
                  </div>
                </div>

                <div className="campo-pendiente">
                  <label>Trabajo pendiente</label>

                  <textarea
                    rows="3"
                    placeholder="Ej: Reparar tren trasero por juego..."
                    value={nuevoPendiente.descripcion}
                    onChange={(e) =>
                      setNuevoPendiente({
                        ...nuevoPendiente,
                        descripcion: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="campo-pendiente">
                  <label>Observaciones</label>

                  <textarea
                    rows="2"
                    placeholder="Observaciones adicionales..."
                    value={nuevoPendiente.observaciones}
                    onChange={(e) =>
                      setNuevoPendiente({
                        ...nuevoPendiente,
                        observaciones: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="acciones-nuevo-pendiente">
                  <button
                    type="button"
                    onClick={() => setMostrarNuevoPendiente(false)}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="btn-guardar-pendiente"
                    onClick={guardarPendiente}
                  >
                    Guardar pendiente
                  </button>
                </div>
              </div>
            )}

            <div className="pendientes-tabs">
              <button
                type="button"
                className={tipoPendienteVista === "CENTRAL" ? "activo" : ""}
                onClick={() => {
                  setTipoPendienteVista("CENTRAL");
                  cargarPendientes("CENTRAL");
                }}
              >
                Central
              </button>
              {pendienteAFinalizar && (
                <div className="modal-pendiente-overlay">
                  <div className="modal-finalizar-pendiente">
                    <div className="modal-finalizar-header">
                      <div>
                        <h3>Finalizar pendiente</h3>
                        <p>
                          Registrá la solución realizada antes de cerrar este
                          trabajo.
                        </p>
                      </div>

                      <button
                        type="button"
                        className="modal-cerrar"
                        onClick={() => {
                          setPendienteAFinalizar(null);
                          setSolucionPendiente("");
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    <div className="modal-equipo-info">
                      <div>
                        <span>Interno</span>
                        <strong>{pendienteAFinalizar.interno}</strong>
                      </div>

                      <div>
                        <span>Equipo</span>
                        <strong>{pendienteAFinalizar.equipo || "-"}</strong>
                      </div>

                      <div>
                        <span>Empresa</span>
                        <strong>{pendienteAFinalizar.empresa || "-"}</strong>
                      </div>
                    </div>

                    <div className="modal-pendiente-original">
                      <span>TRABAJO PENDIENTE</span>

                      <p>{pendienteAFinalizar.descripcion}</p>
                    </div>

                    <div className="modal-solucion">
                      <label>
                        Solución realizada <strong>*</strong>
                      </label>

                      <textarea
                        rows="5"
                        autoFocus
                        placeholder="Describí el trabajo realizado para solucionar el pendiente..."
                        value={solucionPendiente}
                        onChange={(e) => setSolucionPendiente(e.target.value)}
                      />
                    </div>

                    <div className="modal-finalizar-footer">
                      <button
                        type="button"
                        className="btn-cancelar-finalizacion"
                        onClick={() => {
                          setPendienteAFinalizar(null);
                          setSolucionPendiente("");
                        }}
                      >
                        Cancelar
                      </button>

                      <button
                        type="button"
                        className="btn-confirmar-finalizacion"
                        onClick={finalizarPendiente}
                      >
                        ✓ Confirmar finalización
                      </button>
                    </div>
                  </div>
                </div>
              )}
              ;
              <button
                type="button"
                className={tipoPendienteVista === "FINCA" ? "activo" : ""}
                onClick={() => {
                  setTipoPendienteVista("FINCA");
                  cargarPendientes("FINCA");
                }}
              >
                Fincas
              </button>
              <button
                type="button"
                className={tipoPendienteVista === "CONSULTA" ? "activo" : ""}
                onClick={() => {
                  setTipoPendienteVista("CONSULTA");
                  cargarPendientesFinalizados(busquedaPendienteFinalizado);
                }}
              >
                Consulta
              </button>
            </div>

            {tipoPendienteVista !== "CONSULTA" && (
              <div className="tabla-pendientes-container">
                {cargandoPendientes ? (
                  <p>Cargando pendientes...</p>
                ) : pendientes.length === 0 ? (
                  <div className="sin-pendientes">
                    <span>✓</span>

                    <strong>No hay pendientes activos</strong>

                    <p>
                      No existen trabajos pendientes para{" "}
                      {tipoPendienteVista === "CENTRAL" ? "Central" : "Fincas"}.
                    </p>
                  </div>
                ) : (
                  <table className="tabla-pendientes">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Interno</th>
                        <th>Equipo</th>
                        <th>Empresa</th>
                        <th>Informado por</th>
                        <th>Pendiente</th>
                        <th>Prioridad</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>

                    <tbody>
                      {pendientes.map((pendiente) => (
                        <tr
                          key={pendiente.id}
                          className="fila-pendiente-historial"
                          onClick={() => {
                            console.log("Pendiente seleccionado:", pendiente);
                            setPendienteDetalle(pendiente);
                          }}
                        >
                          <td>
                            {pendiente.fecha
                              ? new Date(pendiente.fecha).toLocaleDateString(
                                  "es-AR",
                                  {
                                    timeZone: "UTC",
                                  },
                                )
                              : "-"}
                          </td>

                          <td>
                            <strong>{pendiente.interno}</strong>
                          </td>

                          <td>{pendiente.equipo}</td>

                          <td>{pendiente.empresa || "-"}</td>

                          <td>{pendiente.informado_por || "-"}</td>

                          <td>{pendiente.descripcion}</td>

                          <td>{pendiente.prioridad}</td>

                          <td>{pendiente.estado}</td>
                          <td>
                            <div className="acciones-pendiente">
                              {pendiente.estado === "PENDIENTE" && (
                                <button
                                  type="button"
                                  className="btn-en-proceso"
                                  onClick={() =>
                                    marcarPendienteEnProceso(pendiente.id)
                                  }
                                >
                                  En proceso
                                </button>
                              )}

                              <button
                                type="button"
                                className="btn-finalizar-pendiente"
                                onClick={() => {
                                  setPendienteAFinalizar(pendiente);
                                  setSolucionPendiente("");
                                }}
                              >
                                Finalizar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {tipoPendienteVista === "CONSULTA" && (
              <div className="consulta-pendientes">
                <div className="consulta-pendientes-header">
                  <div>
                    <h3>Historial de pendientes</h3>
                    <p>
                      Consultá los trabajos finalizados y las soluciones
                      realizadas.
                    </p>
                  </div>
                </div>

                <div className="buscador-historial-pendientes">
                  <div>
                    <label>Buscar por interno</label>

                    <input
                      type="text"
                      placeholder="Ej: 129"
                      value={busquedaPendienteFinalizado}
                      onChange={(e) =>
                        setBusquedaPendienteFinalizado(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          cargarPendientesFinalizados(
                            busquedaPendienteFinalizado,
                          );
                        }
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      cargarPendientesFinalizados(busquedaPendienteFinalizado)
                    }
                  >
                    Buscar
                  </button>

                  <button
                    type="button"
                    className="btn-limpiar-consulta"
                    onClick={() => {
                      setBusquedaPendienteFinalizado("");
                      cargarPendientesFinalizados("");
                    }}
                  >
                    Mostrar todos
                  </button>
                </div>

                {cargandoFinalizados ? (
                  <p>Cargando historial...</p>
                ) : pendientesFinalizados.length === 0 ? (
                  <div className="sin-pendientes">
                    <strong>No se encontraron antecedentes</strong>

                    <p>
                      No existen pendientes finalizados con los criterios
                      ingresados.
                    </p>
                  </div>
                ) : (
                  <div className="tabla-pendientes-container">
                    <table className="tabla-pendientes">
                      <thead>
                        <tr>
                          <th>Finalizado</th>
                          <th>Interno</th>
                          <th>Equipo</th>
                          <th>Empresa</th>
                          <th>Pendiente</th>
                          <th>Solución</th>
                        </tr>
                      </thead>

                      <tbody>
                        {pendientesFinalizados.map((pendiente) => (
                          <tr
                            key={pendiente.id}
                            className="fila-pendiente-historial"
                            onClick={() => {
                              setPendienteDetalle(pendiente);
                            }}
                            title="Ver detalle"
                          >
                            <td>
                              {pendiente.fecha_finalizacion
                                ? new Date(
                                    pendiente.fecha_finalizacion,
                                  ).toLocaleDateString("es-AR", {
                                    timeZone: "UTC",
                                  })
                                : "-"}
                            </td>

                            <td>
                              <strong>{pendiente.interno}</strong>
                            </td>

                            <td>{pendiente.equipo}</td>

                            <td>{pendiente.empresa || "-"}</td>

                            <td>{pendiente.descripcion}</td>

                            <td>{pendiente.solucion || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            {pendienteDetalle && (
              <div
                className="modal-pendiente-overlay"
                onClick={() => setPendienteDetalle(null)}
              >
                <div
                  className="modal-detalle-pendiente"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="detalle-pendiente-header">
                    <div>
                      <span className="detalle-etiqueta">
                        HISTORIAL DE PENDIENTE
                      </span>

                      <h3>Interno {pendienteDetalle.interno}</h3>

                      <p>
                        {pendienteDetalle.equipo || "-"} ·{" "}
                        {pendienteDetalle.marca || "-"} ·{" "}
                        {pendienteDetalle.modelo || "-"}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="modal-cerrar"
                      onClick={() => setPendienteDetalle(null)}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="detalle-pendiente-datos">
                    <div>
                      <span>Fecha informada</span>

                      <strong>
                        {pendienteDetalle.fecha
                          ? new Date(pendienteDetalle.fecha).toLocaleDateString(
                              "es-AR",
                              { timeZone: "UTC" },
                            )
                          : "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Fecha finalización</span>

                      <strong>
                        {pendienteDetalle.fecha_finalizacion
                          ? new Date(
                              pendienteDetalle.fecha_finalizacion,
                            ).toLocaleDateString("es-AR", { timeZone: "UTC" })
                          : "-"}
                      </strong>
                    </div>

                    <div>
                      <span>Tipo</span>
                      <strong>{pendienteDetalle.tipo || "-"}</strong>
                    </div>

                    <div>
                      <span>Prioridad</span>
                      <strong>{pendienteDetalle.prioridad || "-"}</strong>
                    </div>

                    <div>
                      <span>Empresa</span>
                      <strong>{pendienteDetalle.empresa || "-"}</strong>
                    </div>

                    <div>
                      <span>Informado por</span>
                      <strong>{pendienteDetalle.informado_por || "-"}</strong>
                    </div>
                  </div>

                  <div className="detalle-bloque detalle-problema">
                    <span>TRABAJO PENDIENTE</span>

                    <p>{pendienteDetalle.descripcion || "-"}</p>
                  </div>

                  <div className="detalle-bloque detalle-solucion">
                    <span>SOLUCIÓN REALIZADA</span>

                    <p>{pendienteDetalle.solucion || "-"}</p>
                  </div>

                  {pendienteDetalle.observaciones && (
                    <div className="detalle-observaciones">
                      <span>Observaciones</span>

                      <p>{pendienteDetalle.observaciones}</p>
                    </div>
                  )}

                  <div className="detalle-pendiente-footer">
                    <span className="estado-finalizado">✓ FINALIZADO</span>

                    <button
                      type="button"
                      onClick={() => setPendienteDetalle(null)}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {modulo === "informes-tecnicos" && (
          <section className="modulo-informes">
            <h2>Informes técnicos</h2>

            <button onClick={() => setModulo("nuevo-informe")}>
              + Nueva orden de trabajo
            </button>
          </section>
        )}

        {modulo === "nuevo-informe" && (
          <section className="modulo-informes">
            <h2>Nueva Orden de Trabajo</h2>

            <div className="ot-resumen-grid">
              {/* =========================
          EQUIPO
      ========================== */}
              <div className="ot-card">
                <h3>🚜 Equipo</h3>

                <label>Interno</label>

                <input
                  type="text"
                  placeholder="Ej: 81"
                  value={busquedaInternoInforme}
                  onChange={(e) => {
                    const valor = e.target.value;

                    setBusquedaInternoInforme(valor);

                    const encontrado = equipos.find(
                      (equipo) =>
                        String(equipo.interno).toLowerCase() ===
                        valor.trim().toLowerCase(),
                    );

                    setEquipoInforme(encontrado || null);
                  }}
                />

                {equipoInforme && (
                  <div className="equipo-seleccionado">
                    <strong>{equipoInforme.marca || "-"}</strong>

                    <span>Modelo: {equipoInforme.modelo || "-"}</span>

                    <span>
                      Horómetro: {equipoInforme.horometro_actual ?? "-"}
                    </span>

                    <span>Interno: {equipoInforme.interno}</span>
                  </div>
                )}
              </div>

              {/* =========================
          LUGAR DEL TRABAJO
      ========================== */}
              <div className="ot-card">
                <h3>📍 Lugar del trabajo</h3>

                <input
                  type="text"
                  placeholder="Buscar finca, planta, empaque..."
                  value={busquedaUbicacion}
                  onChange={(e) => {
                    setBusquedaUbicacion(e.target.value);

                    setUbicacionInforme(null);

                    // Evita mostrar el traslado de
                    // la ubicación anterior
                    setTrasladoInforme(null);
                  }}
                />

                {/* RESULTADOS DEL BUSCADOR */}

                {!ubicacionInforme && ubicacionesFiltradas.length > 0 && (
                  <div className="resultados-ubicacion">
                    {ubicacionesFiltradas.map((ubicacion) => (
                      <button
                        type="button"
                        key={ubicacion.id}
                        onClick={() => {
                          setUbicacionInforme(ubicacion);

                          setBusquedaUbicacion(ubicacion.nombre);

                          calcularTraslado(ubicacion.id);
                        }}
                      >
                        {ubicacion.nombre}
                      </button>
                    ))}
                  </div>
                )}

                {/* UBICACIÓN SELECCIONADA */}

                {ubicacionInforme && (
                  <div className="ubicacion-seleccionada">
                    <span>Ubicación seleccionada</span>

                    <strong>{ubicacionInforme.nombre}</strong>
                  </div>
                )}

                {/* UBICACIÓN NO ENCONTRADA */}

                {busquedaUbicacion.trim().length >= 2 &&
                  ubicacionesFiltradas.length === 0 &&
                  !ubicacionInforme &&
                  !mostrarNuevaUbicacion && (
                    <div className="ubicacion-no-encontrada">
                      <p>No encontramos esa ubicación.</p>

                      <button
                        type="button"
                        onClick={() => {
                          setMostrarNuevaUbicacion(true);

                          setNuevaUbicacion({
                            nombre: busquedaUbicacion,
                            latitud: null,
                            longitud: null,
                          });
                        }}
                      >
                        + Agregar nueva ubicación
                      </button>
                    </div>
                  )}

                {/* CREAR NUEVA UBICACIÓN */}

                {mostrarNuevaUbicacion && (
                  <div className="nueva-ubicacion">
                    <h4>Nueva ubicación</h4>

                    <label>Nombre</label>

                    <input
                      type="text"
                      value={nuevaUbicacion.nombre}
                      onChange={(e) =>
                        setNuevaUbicacion({
                          ...nuevaUbicacion,
                          nombre: e.target.value,
                        })
                      }
                    />

                    <button type="button" onClick={obtenerUbicacionActual}>
                      {obteniendoUbicacion
                        ? "Obteniendo ubicación..."
                        : "📍 Usar mi ubicación actual"}
                    </button>

                    {nuevaUbicacion.latitud !== null &&
                      nuevaUbicacion.longitud !== null && (
                        <div className="coordenadas-obtenidas">
                          <p>✓ Ubicación obtenida</p>

                          <small>
                            {nuevaUbicacion.latitud.toFixed(6)},{" "}
                            {nuevaUbicacion.longitud.toFixed(6)}
                          </small>

                          <button type="button" onClick={guardarNuevaUbicacion}>
                            Guardar ubicación
                          </button>
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* =========================
          TRASLADO
      ========================== */}
              <div className="ot-card">
                <h3>🚙 Traslado</h3>

                {trasladoInforme ? (
                  <>
                    <div className="traslado-principal">
                      <span>Ida y vuelta</span>

                      <strong>{trasladoInforme.distancia_total_km} km</strong>
                    </div>

                    <button
                      type="button"
                      className="btn-detalle-traslado"
                      onClick={() =>
                        setMostrarDetalleTraslado(!mostrarDetalleTraslado)
                      }
                    >
                      {mostrarDetalleTraslado
                        ? "Ocultar detalles"
                        : "Ver detalles del traslado"}
                    </button>

                    {mostrarDetalleTraslado && (
                      <div className="traslado-detalle">
                        <p>
                          <strong>Desde:</strong> {trasladoInforme.origen}
                        </p>

                        <p>
                          <strong>Hasta:</strong> {trasladoInforme.destino}
                        </p>

                        <p>
                          <strong>Distancia de ida:</strong>{" "}
                          {trasladoInforme.distancia_ida_km} km
                        </p>

                        <p>
                          <strong>Tiempo estimado:</strong>{" "}
                          {trasladoInforme.duracion_ida_min} min
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="sin-traslado">
                    Seleccioná una ubicación para calcular el traslado.
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {equipoInforme && ubicacionInforme && (
          <div className="formulario-informe">
            <div className="formulario-informe-header">
              <div>
                <h3>Datos del informe</h3>
                <p>
                  Completá la información correspondiente al trabajo realizado.
                </p>
              </div>
            </div>

            <div className="campo-informe campo-numero-ot">
              <label>N.º Orden de Trabajo</label>

              <input
                type="text"
                placeholder="Ej: 15482 — dejar vacío para generar automáticamente"
                value={datosInforme.numero_ot}
                onChange={(e) =>
                  setDatosInforme({
                    ...datosInforme,
                    numero_ot: e.target.value,
                  })
                }
              />

              <small>Si existe una OT física, ingresá el mismo número.</small>
            </div>

            {/* PRIMERA FILA */}
            <div className="informe-grid informe-grid-5">
              <div className="campo-informe">
                <label>Fecha</label>
                <input
                  type="date"
                  value={datosInforme.fecha}
                  onChange={(e) =>
                    setDatosInforme({
                      ...datosInforme,
                      fecha: e.target.value,
                    })
                  }
                />
              </div>

              <div className="campo-informe">
                <label>Horómetro</label>
                <input
                  type="number"
                  value={datosInforme.horometro}
                  placeholder={`Actual: ${
                    equipoInforme.horometro_actual ?? "-"
                  }`}
                  onChange={(e) =>
                    setDatosInforme({
                      ...datosInforme,
                      horometro: e.target.value,
                    })
                  }
                />
              </div>

              <div className="campo-informe">
                <label>Tipo de trabajo</label>

                <select
                  value={datosInforme.tipo_trabajo}
                  onChange={(e) =>
                    setDatosInforme({
                      ...datosInforme,
                      tipo_trabajo: e.target.value,
                    })
                  }
                >
                  <option value="">Seleccionar</option>
                  <option value="Reparación">Reparación</option>
                  <option value="Service">Service</option>
                  <option value="Control">Control</option>
                  <option value="Mantenimiento">Mantenimiento</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div className="campo-informe">
                <label>Empresa cliente</label>

                <input
                  type="text"
                  placeholder="Ej: San Miguel"
                  value={datosInforme.cliente}
                  onChange={(e) =>
                    setDatosInforme({
                      ...datosInforme,
                      cliente: e.target.value,
                    })
                  }
                />
              </div>

              <div className="campo-informe">
                <label>Contacto del cliente</label>
                <input
                  type="text"
                  placeholder="Nombre del contacto"
                  value={datosInforme.contacto_cliente}
                  onChange={(e) =>
                    setDatosInforme({
                      ...datosInforme,
                      contacto_cliente: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* SEGUNDA FILA */}
            <div className="informe-grid informe-grid-2">
              <div className="campo-informe">
                <label>Motivo / Reclamo</label>
                <textarea
                  rows="5"
                  placeholder="Describí el motivo de la intervención..."
                  value={datosInforme.reclamo_cliente}
                  onChange={(e) =>
                    setDatosInforme({
                      ...datosInforme,
                      reclamo_cliente: e.target.value,
                    })
                  }
                />
              </div>

              <div className="campo-informe">
                <label>Trabajo realizado</label>
                <textarea
                  rows="5"
                  placeholder="Detallá los trabajos realizados..."
                  value={datosInforme.trabajo_realizado}
                  onChange={(e) =>
                    setDatosInforme({
                      ...datosInforme,
                      trabajo_realizado: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="repuestos-informe">
              <div className="repuestos-header">
                <div>
                  <h4>Repuestos / materiales utilizados</h4>
                  <p>Buscá por código o descripción.</p>
                </div>
              </div>

              <div className="buscador-repuestos">
                <input
                  type="text"
                  placeholder="Ej: H2015, filtro de aceite..."
                  value={busquedaRepuesto}
                  onChange={(e) => buscarRepuestos(e.target.value)}
                />

                {resultadosRepuestos.length > 0 && (
                  <div className="resultados-repuestos">
                    {resultadosRepuestos.map((componente) => (
                      <button
                        type="button"
                        key={componente.id}
                        onClick={() => agregarRepuestoInforme(componente)}
                      >
                        <strong>{componente.codigo || "Sin código"}</strong>

                        <span>{componente.nombre}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="btn-repuesto-manual"
                onClick={() => setMostrarRepuestoManual(!mostrarRepuestoManual)}
              >
                {mostrarRepuestoManual
                  ? "Cancelar repuesto manual"
                  : "+ Agregar repuesto/material manual"}
              </button>

              {mostrarRepuestoManual && (
                <div className="form-repuesto-manual">
                  <div>
                    <label>Código</label>
                    <input
                      type="text"
                      placeholder="Ej: 30207"
                      value={repuestoManual.codigo}
                      onChange={(e) =>
                        setRepuestoManual({
                          ...repuestoManual,
                          codigo: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label>Descripción</label>
                    <input
                      type="text"
                      placeholder="Ej: Rodamiento 35x72x15"
                      value={repuestoManual.descripcion}
                      onChange={(e) =>
                        setRepuestoManual({
                          ...repuestoManual,
                          descripcion: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label>Cantidad</label>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={repuestoManual.cantidad}
                      onChange={(e) =>
                        setRepuestoManual({
                          ...repuestoManual,
                          cantidad: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label>Unidad</label>
                    <select
                      value={repuestoManual.unidad}
                      onChange={(e) =>
                        setRepuestoManual({
                          ...repuestoManual,
                          unidad: e.target.value,
                        })
                      }
                    >
                      <option value="UN">UN</option>
                      <option value="L">Litros</option>
                      <option value="KG">Kg</option>
                      <option value="M">Metros</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!repuestoManual.descripcion.trim()) {
                        alert("Ingresá una descripción para el repuesto.");
                        return;
                      }

                      setRepuestosInforme((anteriores) => [
                        ...anteriores,
                        {
                          componente_id: null,
                          codigo: repuestoManual.codigo.trim(),
                          descripcion: repuestoManual.descripcion.trim(),
                          cantidad: repuestoManual.cantidad,
                          unidad: repuestoManual.unidad,
                          observaciones: "",
                        },
                      ]);

                      setRepuestoManual({
                        codigo: "",
                        descripcion: "",
                        cantidad: 1,
                        unidad: "UN",
                      });

                      setMostrarRepuestoManual(false);
                    }}
                  >
                    Agregar
                  </button>
                </div>
              )}

              {repuestosInforme.length > 0 && (
                <div className="lista-repuestos">
                  {repuestosInforme.map((repuesto, index) => (
                    <div
                      className="repuesto-item"
                      key={`${repuesto.componente_id}-${index}`}
                    >
                      <div className="repuesto-descripcion">
                        <strong>{repuesto.codigo || "Sin código"}</strong>

                        <span>{repuesto.descripcion}</span>
                      </div>

                      <div className="repuesto-cantidad">
                        <label>Cantidad</label>

                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={repuesto.cantidad}
                          onChange={(e) => {
                            const nuevos = [...repuestosInforme];

                            nuevos[index] = {
                              ...nuevos[index],
                              cantidad: e.target.value,
                            };

                            setRepuestosInforme(nuevos);
                          }}
                        />
                      </div>

                      <div className="repuesto-unidad">
                        <label>Unidad</label>

                        <select
                          value={repuesto.unidad}
                          onChange={(e) => {
                            const nuevos = [...repuestosInforme];

                            nuevos[index] = {
                              ...nuevos[index],
                              unidad: e.target.value,
                            };

                            setRepuestosInforme(nuevos);
                          }}
                        >
                          <option value="UN">UN</option>
                          <option value="L">Litros</option>
                          <option value="KG">Kg</option>
                          <option value="M">Metros</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        className="btn-quitar-repuesto"
                        onClick={() =>
                          setRepuestosInforme(
                            repuestosInforme.filter((_, i) => i !== index),
                          )
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TERCERA FILA */}
            <div className="informe-grid informe-grid-4">
              <div className="campo-informe">
                <label>Mecánico</label>
                <input
                  type="text"
                  placeholder="Nombre del mecánico"
                  value={datosInforme.mecanico}
                  onChange={(e) =>
                    setDatosInforme({
                      ...datosInforme,
                      mecanico: e.target.value,
                    })
                  }
                />
              </div>

              <div className="campo-informe">
                <label>Hora de inicio</label>
                <input
                  type="time"
                  value={datosInforme.hora_inicio}
                  onChange={(e) =>
                    setDatosInforme({
                      ...datosInforme,
                      hora_inicio: e.target.value,
                    })
                  }
                />
              </div>

              <div className="campo-informe">
                <label>Hora de finalización</label>
                <input
                  type="time"
                  value={datosInforme.hora_fin}
                  onChange={(e) =>
                    setDatosInforme({
                      ...datosInforme,
                      hora_fin: e.target.value,
                    })
                  }
                />
              </div>

              <div className="campo-informe">
                <label>Estado final</label>

                <select
                  value={datosInforme.estado_final}
                  onChange={(e) =>
                    setDatosInforme({
                      ...datosInforme,
                      estado_final: e.target.value,
                    })
                  }
                >
                  <option value="">Seleccionar</option>
                  <option value="Operativo">Operativo</option>
                  <option value="Operativo con observaciones">
                    Operativo con observaciones
                  </option>
                  <option value="Fuera de servicio">Fuera de servicio</option>
                </select>
              </div>
            </div>

            {horasManoObra !== null && (
              <div className="resumen-mano-obra">
                <span>⏱ Tiempo de trabajo</span>

                <strong>
                  {Math.floor(horasManoObra)} h{" "}
                  {Math.round((horasManoObra - Math.floor(horasManoObra)) * 60)}{" "}
                  min
                </strong>
              </div>
            )}

            {/* OBSERVACIONES */}
            <div className="campo-informe observaciones-informe">
              <label>Observaciones</label>

              <textarea
                rows="4"
                placeholder="Observaciones adicionales..."
                value={datosInforme.observaciones}
                onChange={(e) =>
                  setDatosInforme({
                    ...datosInforme,
                    observaciones: e.target.value,
                  })
                }
              />
            </div>

            {/* ACCIONES */}
            <div className="acciones-informe">
              <button
                type="button"
                className="btn-guardar-informe"
                onClick={guardarInformeTecnico}
              >
                Guardar Orden de Trabajo
              </button>
            </div>
          </div>
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
                  setRepuestosInforme([]);
                  setBusquedaRepuesto("");
                  setResultadosRepuestos([]);

                  setMostrarRepuestoManual(false);

                  setRepuestoManual({
                    codigo: "",
                    descripcion: "",
                    cantidad: 1,
                    unidad: "UN",
                  });
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

            <div className="selector-categoria-equipo">
              <button
                type="button"
                className={`categoria-equipo-card ${
                  nuevoEquipo.categoria === "MAQUINARIA" ? "activo" : ""
                }`}
                onClick={() =>
                  setNuevoEquipo({
                    ...nuevoEquipo,
                    categoria: "MAQUINARIA",
                  })
                }
              >
                <span className="categoria-equipo-icono">⚙️</span>

                <div>
                  <strong>Maquinarias</strong>
                  <small>Interno + horómetro</small>
                  <small>Mantenimiento por horas</small>
                </div>
              </button>

              <button
                type="button"
                className={`categoria-equipo-card ${
                  nuevoEquipo.categoria === "FLOTA" ? "activo" : ""
                }`}
                onClick={() =>
                  setNuevoEquipo({
                    ...nuevoEquipo,
                    categoria: "FLOTA",
                  })
                }
              >
                <span className="categoria-equipo-icono">🚗</span>

                <div>
                  <strong>Vehículos de Flota</strong>
                  <small>Patente + kilometraje</small>
                  <small>Mantenimiento por kilómetros</small>
                </div>
              </button>
            </div>

            <div
              className={`nuevo-equipo-dashboard ${
                nuevoEquipo.categoria === "FLOTA"
                  ? "dashboard-flota"
                  : "dashboard-maquinaria"
              }`}
            >
              <div className="nuevo-equipo-dashboard-header">
                <div className="nuevo-equipo-dashboard-titulo">
                  <span className="nuevo-equipo-dashboard-icono">
                    {nuevoEquipo.categoria === "FLOTA" ? "🚗" : "⚙️"}
                  </span>

                  <div>
                    <span className="nuevo-equipo-dashboard-etiqueta">
                      NUEVO REGISTRO
                    </span>

                    <h3>
                      {nuevoEquipo.categoria === "FLOTA"
                        ? "Vehículo de Flota"
                        : "Maquinaria / Equipo"}
                    </h3>

                    <p>
                      {nuevoEquipo.categoria === "FLOTA"
                        ? "Alta de vehículo y control por kilometraje"
                        : "Alta de equipo y mantenimiento por horas"}
                    </p>
                  </div>
                </div>

                <span className="nuevo-equipo-dashboard-badge">
                  {nuevoEquipo.categoria === "FLOTA"
                    ? "CONTROL KM"
                    : "CONTROL HS"}
                </span>
              </div>

              <form
                className="form-nuevo-equipo form-nuevo-equipo-dashboard"
                onSubmit={guardarNuevoEquipo}
              >
                {nuevoEquipo.categoria === "MAQUINARIA" ? (
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
                ) : (
                  <label>
                    Patente *
                    <input
                      type="text"
                      placeholder="Ej: Patente"
                      value={nuevoEquipo.patente}
                      onChange={(e) =>
                        setNuevoEquipo({
                          ...nuevoEquipo,
                          patente: e.target.value.toUpperCase(),
                        })
                      }
                      required
                    />
                  </label>
                )}

                <label>
                  Tipo de equipo *
                  <input
                    type="text"
                    placeholder="Ej: Camión, Tractor, Autoelevador..."
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
                    placeholder="Ej: Fiat, John Deere, Toyota..."
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

                {nuevoEquipo.categoria === "MAQUINARIA" ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <label>
                      Año
                      <input
                        type="number"
                        min="1900"
                        max="2100"
                        placeholder="Ej: 2020"
                        value={nuevoEquipo.anio}
                        onChange={(e) =>
                          setNuevoEquipo({
                            ...nuevoEquipo,
                            anio: e.target.value,
                          })
                        }
                      />
                    </label>

                    <label>
                      Kilometraje actual *
                      <input
                        type="number"
                        min="0"
                        placeholder="Ej: 502331"
                        value={nuevoEquipo.kilometraje_actual}
                        onChange={(e) =>
                          setNuevoEquipo({
                            ...nuevoEquipo,
                            kilometraje_actual: e.target.value,
                          })
                        }
                        required
                      />
                    </label>

                    <label>
                      Responsable
                      <input
                        type="text"
                        placeholder="Ej: Oscar L."
                        value={nuevoEquipo.responsable}
                        onChange={(e) =>
                          setNuevoEquipo({
                            ...nuevoEquipo,
                            responsable: e.target.value,
                          })
                        }
                      />
                    </label>
                  </>
                )}

                <button type="submit">Guardar equipo</button>
              </form>
            </div>
            <hr />

            {nuevoEquipo.categoria === "MAQUINARIA" && (
              <div className="contrato-dashboard">
                <div className="contrato-dashboard-header">
                  <div className="contrato-dashboard-titulo">
                    <span className="contrato-dashboard-icono">📄</span>

                    <div>
                      <span className="contrato-dashboard-etiqueta">
                        CONTRATO
                      </span>

                      <h3>Asignar contrato</h3>

                      <p>
                        Vinculá el equipo a un contrato y registrá sus datos
                        iniciales
                      </p>
                    </div>
                  </div>

                  <span className="contrato-dashboard-badge">ASIGNACIÓN</span>
                </div>

                <div className="contrato-dashboard-body">
                  <div className="contrato-seccion-titulo">
                    IDENTIFICACIÓN DEL EQUIPO
                  </div>

                  <div className="contrato-fila-superior">
                    <label>
                      Buscar por interno *
                      <input
                        type="text"
                        placeholder="Ej: 62"
                        value={internoContrato}
                        onChange={(e) => setInternoContrato(e.target.value)}
                      />
                    </label>

                    {(() => {
                      const equipoEncontrado = equipos.find(
                        (equipo) =>
                          String(equipo.interno).trim().toLowerCase() ===
                            String(internoContrato).trim().toLowerCase() &&
                          (!equipo.categoria ||
                            equipo.categoria === "MAQUINARIA"),
                      );

                      if (!internoContrato) {
                        return (
                          <div className="contrato-equipo-estado">
                            <span>ℹ</span>
                            <p>Ingresá el interno del equipo.</p>
                          </div>
                        );
                      }

                      if (!equipoEncontrado) {
                        return (
                          <div className="contrato-equipo-estado no-encontrado">
                            <span>!</span>
                            <p>No encontramos el interno {internoContrato}.</p>
                          </div>
                        );
                      }

                      return (
                        <div className="contrato-equipo-estado seleccionado">
                          <span>✓</span>

                          <div>
                            <strong>Interno {equipoEncontrado.interno}</strong>

                            <p>
                              {equipoEncontrado.tipo || "Equipo"} ·{" "}
                              {equipoEncontrado.marca || "-"}{" "}
                              {equipoEncontrado.modelo || ""}
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="contrato-seccion-titulo">
                    DATOS DEL CONTRATO
                  </div>

                  <div className="contrato-form-grid">
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

                    <label className="contrato-tipo">
                      Tipo de contrato *
                      <select
                        value={nuevoContrato.tipo_contrato}
                        onChange={(e) =>
                          setNuevoContrato({
                            ...nuevoContrato,
                            tipo_contrato: e.target.value,
                          })
                        }
                      >
                        <option value="">Seleccionar tipo...</option>
                        <option value="Alquiler">Alquiler</option>
                        <option value="Movimiento de carga">
                          Movimiento de carga
                        </option>
                        <option value="Servicio agricola">
                          Servicio agrícola
                        </option>
                      </select>
                    </label>
                  </div>

                  <div className="contrato-dashboard-acciones">
                    <button
                      type="button"
                      onClick={guardarContrato}
                      disabled={!internoContrato}
                    >
                      Guardar contrato
                    </button>
                  </div>

                  {mensajeContrato && (
                    <p className="mensaje">{mensajeContrato}</p>
                  )}
                </div>
              </div>
            )}

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
              <div className="ficha ficha-mantenimiento-dashboard">
                <div className="equipo-dashboard-header">
                  <div className="equipo-dashboard-identidad">
                    <span className="equipo-dashboard-etiqueta">
                      EQUIPO SELECCIONADO
                    </span>

                    <h2>Interno {equipoSeleccionado.interno}</h2>

                    <p>
                      {equipoSeleccionado.tipo || "-"} ·{" "}
                      {equipoSeleccionado.marca || "-"}
                    </p>
                  </div>

                  <div className="equipo-dashboard-horometro">
                    <span>HORÓMETRO ACTUAL</span>

                    <strong>
                      {Number(
                        equipoSeleccionado.horometro_actual || 0,
                      ).toLocaleString("es-AR")}{" "}
                      <small>hs</small>
                    </strong>
                  </div>
                </div>

                <div className="horometro-dashboard-grid">
                  {/* ACTUALIZAR HORÓMETRO */}
                  <div className="dashboard-panel">
                    <div className="dashboard-panel-header">
                      <div>
                        <span className="dashboard-panel-etiqueta">
                          REGISTRO
                        </span>

                        <h3>Actualizar horómetro</h3>
                      </div>

                      <div className="dashboard-panel-icon">⏱</div>
                    </div>

                    <div className="horometro-form-dashboard">
                      <div className="campo-dashboard">
                        <label>Fecha de lectura</label>

                        <input
                          type="date"
                          value={fechaHorometro}
                          onChange={(e) => setFechaHorometro(e.target.value)}
                        />
                      </div>

                      <div className="campo-dashboard">
                        <label>Nuevo horómetro</label>

                        <div className="input-horas-dashboard">
                          <input
                            type="number"
                            placeholder="Ej: 15480"
                            value={nuevoHorometro}
                            onChange={(e) => setNuevoHorometro(e.target.value)}
                          />

                          <span>hs</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="btn-guardar-horometro-dashboard"
                      onClick={actualizarHorometro}
                    >
                      Guardar horómetro
                    </button>

                    {mensajeHorometro && (
                      <div className="mensaje-horometro-dashboard">
                        {mensajeHorometro}
                      </div>
                    )}
                  </div>

                  {/* HISTORIAL */}
                  <div className="dashboard-panel">
                    <div className="dashboard-panel-header">
                      <div>
                        <span className="dashboard-panel-etiqueta">
                          LECTURAS
                        </span>

                        <h3>Historial de horómetros</h3>
                      </div>

                      <div className="dashboard-panel-contador">
                        {historialHorometros.length}
                      </div>
                    </div>

                    {historialHorometros.length > 0 ? (
                      <div className="historial-dashboard">
                        {historialHorometros
                          .slice(0, 5)
                          .map((registro, index) => (
                            <div
                              className="historial-dashboard-item"
                              key={registro.id}
                            >
                              <div className="historial-dashboard-fecha">
                                <span
                                  className={
                                    index === 0
                                      ? "historial-punto ultimo"
                                      : "historial-punto"
                                  }
                                ></span>

                                <div>
                                  <small>
                                    {index === 0 ? "ÚLTIMA LECTURA" : "LECTURA"}
                                  </small>

                                  <strong>
                                    {new Date(
                                      registro.fecha,
                                    ).toLocaleDateString("es-AR", {
                                      timeZone: "UTC",
                                    })}
                                  </strong>
                                </div>
                              </div>

                              <strong className="historial-dashboard-horas">
                                {Number(registro.horometro).toLocaleString(
                                  "es-AR",
                                )}{" "}
                                <small>hs</small>
                              </strong>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="dashboard-sin-datos">
                        No hay lecturas registradas.
                      </div>
                    )}
                  </div>
                </div>
                <div className="service-motor-dashboard">
                  <div className="service-motor-header">
                    <div>
                      <span className="dashboard-panel-etiqueta">
                        SERVICE PRINCIPAL
                      </span>

                      <h3>Service de motor</h3>

                      <p>Seguimiento según el horómetro real del equipo.</p>
                    </div>

                    {ultimoService && (
                      <div
                        className={`service-motor-estado ${obtenerEstado()
                          .toLowerCase()
                          .replaceAll(" ", "-")}`}
                      >
                        {obtenerEstado() === "OK" && "✓ "}
                        {obtenerEstado() === "Próximo" && "⚠ "}
                        {obtenerEstado() === "Vencido" && "✕ "}

                        {obtenerEstado()}
                      </div>
                    )}
                  </div>

                  {ultimoService ? (
                    <>
                      <div className="service-motor-datos">
                        <div>
                          <span>Último service</span>

                          <strong>
                            {Number(ultimoService.horometro).toLocaleString(
                              "es-AR",
                            )}
                            <small> hs</small>
                          </strong>
                        </div>

                        <div>
                          <span>Horas utilizadas</span>

                          <strong>
                            {Number(horasUsadas).toLocaleString("es-AR")}
                            <small> hs</small>
                          </strong>
                        </div>

                        <div>
                          <span>Próximo service</span>

                          <strong>
                            {Number(proximoService).toLocaleString("es-AR")}
                            <small> hs</small>
                          </strong>
                        </div>

                        <div>
                          <span>
                            {horasRestantes < 0
                              ? "Horas excedidas"
                              : "Horas restantes"}
                          </span>

                          <strong
                            className={
                              horasRestantes < 0 ? "service-valor-vencido" : ""
                            }
                          >
                            {Math.abs(Number(horasRestantes)).toLocaleString(
                              "es-AR",
                            )}
                            <small> hs</small>
                          </strong>
                        </div>
                      </div>

                      <div className="service-progreso">
                        <div className="service-progreso-info">
                          <span>Avance hacia el próximo service</span>

                          <strong>
                            {Number(horasUsadas).toLocaleString("es-AR")}
                            {" / "}
                            {Number(
                              equipoSeleccionado.frecuencia_service || 300,
                            ).toLocaleString("es-AR")}
                            {" hs"}
                          </strong>
                        </div>

                        <div className="service-barra">
                          <div
                            className={`service-barra-relleno ${obtenerEstado()
                              .toLowerCase()
                              .replaceAll(" ", "-")}`}
                            style={{
                              width: `${Math.min(
                                Math.max(
                                  (Number(horasUsadas) /
                                    Number(
                                      equipoSeleccionado.frecuencia_service ||
                                        300,
                                    )) *
                                    100,
                                  0,
                                ),
                                100,
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="service-sin-registro">
                      <div className="service-sin-registro-icono">!</div>

                      <div>
                        <strong>Sin service registrado</strong>

                        <p>
                          Este equipo todavía no posee un service de motor
                          registrado.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <hr />

                {proyeccionService && (
                  <div className="proyeccion-dashboard">
                    <div className="proyeccion-dashboard-header">
                      <div>
                        <span className="dashboard-panel-etiqueta">
                          ESTIMACIÓN
                        </span>

                        <h3>Proyección de service</h3>

                        <p>Calculada según el uso reciente del equipo.</p>
                      </div>

                      <span className="badge-estimado">Dato estimado</span>
                    </div>

                    <div className="proyeccion-dashboard-grid">
                      <div className="proyeccion-dato">
                        <span>Promedio diario</span>

                        <strong>
                          {proyeccionService.horasPromedioDia.toFixed(2)}
                          <small> hs/día</small>
                        </strong>
                      </div>

                      <div className="proyeccion-dato">
                        <span>Última lectura real</span>

                        <strong>
                          {Number(
                            proyeccionService.ultimoHorometro,
                          ).toLocaleString("es-AR")}
                          <small> hs</small>
                        </strong>
                      </div>

                      <div className="proyeccion-dato">
                        <span>Estimado actual</span>

                        <strong>
                          {Number(
                            proyeccionService.horometroEstimado.toFixed(0),
                          ).toLocaleString("es-AR")}
                          <small> hs</small>
                        </strong>
                      </div>

                      <div className="proyeccion-dato">
                        <span>Restante estimado</span>

                        <strong>
                          {Number(
                            proyeccionService.horasRestantes.toFixed(0),
                          ).toLocaleString("es-AR")}
                          <small> hs</small>
                        </strong>
                      </div>
                    </div>

                    <div className="proyeccion-dashboard-footer">
                      <div>
                        <span>Días desde última lectura</span>

                        <strong>
                          {proyeccionService.diasDesdeUltimaVisita} días
                        </strong>
                      </div>

                      {proyeccionService.diasRestantes !== null && (
                        <div>
                          <span>Service estimado</span>

                          <strong>
                            ~{" "}
                            {Math.max(
                              0,
                              Math.ceil(proyeccionService.diasRestantes),
                            )}{" "}
                            días
                          </strong>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {filtrosEspecialesEstado.length > 0 && (
                  <div className="componentes-dashboard">
                    <div className="componentes-dashboard-header">
                      <div>
                        <span className="dashboard-panel-etiqueta">
                          SEGUIMIENTO
                        </span>

                        <h3>Filtros especiales</h3>

                        <p>Componentes con mantenimiento independiente.</p>
                      </div>

                      <span className="componentes-contador">
                        {filtrosEspecialesEstado.length}
                      </span>
                    </div>

                    <div className="componentes-lista">
                      {filtrosEspecialesEstado.map((item) => {
                        const progreso = calcularProgresoMantenimiento(
                          item.horas_usadas,
                          item.frecuencia_horas,
                        );

                        return (
                          <div
                            className="componente-dashboard-item"
                            key={item.componente_id}
                          >
                            <div className="componente-dashboard-superior">
                              <div className="componente-identidad">
                                <div
                                  className={`componente-indicador estado-${item.estado
                                    .toLowerCase()
                                    .replaceAll(" ", "-")}`}
                                ></div>

                                <div>
                                  <h4>{item.componente}</h4>

                                  <span>
                                    {item.codigo || "Sin código registrado"}
                                  </span>
                                </div>
                              </div>

                              <div
                                className={`componente-estado mantenimiento-${item.estado
                                  .toLowerCase()
                                  .replaceAll(" ", "-")}`}
                              >
                                {item.estado === "OK" && "✓ "}
                                {item.estado === "Próximo" && "⚠ "}
                                {item.estado === "Vencido" && "✕ "}

                                {item.estado}
                              </div>
                            </div>

                            {item.horometro_ultimo_cambio !== null ? (
                              <>
                                <div className="componente-datos">
                                  <div>
                                    <span>Último cambio</span>

                                    <strong>
                                      {Number(
                                        item.horometro_ultimo_cambio,
                                      ).toLocaleString("es-AR")}{" "}
                                      hs
                                    </strong>
                                  </div>

                                  <div>
                                    <span>Frecuencia</span>

                                    <strong>
                                      {Number(
                                        item.frecuencia_horas,
                                      ).toLocaleString("es-AR")}{" "}
                                      hs
                                    </strong>
                                  </div>

                                  <div>
                                    <span>Próximo cambio</span>

                                    <strong>
                                      {Number(
                                        item.proximo_cambio,
                                      ).toLocaleString("es-AR")}{" "}
                                      hs
                                    </strong>
                                  </div>

                                  <div>
                                    <span>
                                      {item.horas_restantes < 0
                                        ? "Excedido"
                                        : "Restante"}
                                    </span>

                                    <strong>
                                      {Math.abs(
                                        Number(item.horas_restantes),
                                      ).toLocaleString("es-AR")}{" "}
                                      hs
                                    </strong>
                                  </div>
                                </div>

                                <div className="progreso-componente">
                                  <div className="progreso-componente-info">
                                    <span>Uso desde último cambio</span>

                                    <strong>
                                      {Number(item.horas_usadas).toLocaleString(
                                        "es-AR",
                                      )}{" "}
                                      /{" "}
                                      {Number(
                                        item.frecuencia_horas,
                                      ).toLocaleString("es-AR")}{" "}
                                      hs
                                    </strong>
                                  </div>

                                  <div className="barra-progreso-componente">
                                    <div
                                      className={`barra-progreso-relleno progreso-${item.estado
                                        .toLowerCase()
                                        .replaceAll(" ", "-")}`}
                                      style={{
                                        width: `${progreso}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>

                                {item.observaciones && (
                                  <div className="componente-observacion">
                                    <span>Motivo último cambio:</span>{" "}
                                    {item.observaciones.replace(
                                      "Cambio durante service: ",
                                      "",
                                    )}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="componente-sin-historial">
                                Sin historial registrado.
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {mantenimientos.length > 0 ? (
                  <div className="componentes-dashboard">
                    <div className="componentes-dashboard-header">
                      <div>
                        <span className="dashboard-panel-etiqueta">
                          MANTENIMIENTO
                        </span>

                        <h3>Mantenimientos programados</h3>

                        <p>
                          Estado de los componentes según el horómetro actual.
                        </p>
                      </div>

                      <span className="componentes-contador">
                        {mantenimientos.length}
                      </span>
                    </div>

                    <div className="componentes-lista">
                      {mantenimientos.map((item) => {
                        const progreso = calcularProgresoMantenimiento(
                          item.horas_usadas,
                          item.frecuencia_horas,
                        );

                        return (
                          <div
                            className="componente-dashboard-item"
                            key={item.componente_id}
                          >
                            <div className="componente-dashboard-superior">
                              <div className="componente-identidad">
                                <div
                                  className={`componente-indicador estado-${item.estado
                                    .toLowerCase()
                                    .replaceAll(" ", "-")}`}
                                ></div>

                                <div>
                                  <h4>{item.componente}</h4>

                                  <span>
                                    {item.codigo || "Sin código registrado"}
                                  </span>
                                </div>
                              </div>

                              <div
                                className={`componente-estado mantenimiento-${item.estado
                                  .toLowerCase()
                                  .replaceAll(" ", "-")}`}
                              >
                                {item.estado === "OK" && "✓ "}
                                {item.estado === "Próximo" && "⚠ "}
                                {item.estado === "Vencido" && "✕ "}

                                {item.estado}
                              </div>
                            </div>

                            {item.horometro_ultimo_mantenimiento !== null ? (
                              <>
                                <div className="componente-datos">
                                  <div>
                                    <span>Último</span>

                                    <strong>
                                      {Number(
                                        item.horometro_ultimo_mantenimiento,
                                      ).toLocaleString("es-AR")}{" "}
                                      hs
                                    </strong>
                                  </div>

                                  <div>
                                    <span>Frecuencia</span>

                                    <strong>
                                      {Number(
                                        item.frecuencia_horas,
                                      ).toLocaleString("es-AR")}{" "}
                                      hs
                                    </strong>
                                  </div>

                                  <div>
                                    <span>Próximo</span>

                                    <strong>
                                      {Number(
                                        item.proximo_mantenimiento,
                                      ).toLocaleString("es-AR")}{" "}
                                      hs
                                    </strong>
                                  </div>

                                  <div>
                                    <span>
                                      {item.horas_restantes < 0
                                        ? "Excedido"
                                        : "Restante"}
                                    </span>

                                    <strong>
                                      {Math.abs(
                                        Number(item.horas_restantes),
                                      ).toLocaleString("es-AR")}{" "}
                                      hs
                                    </strong>
                                  </div>
                                </div>

                                <div className="progreso-componente">
                                  <div className="progreso-componente-info">
                                    <span>Uso desde último mantenimiento</span>

                                    <strong>
                                      {Number(item.horas_usadas).toLocaleString(
                                        "es-AR",
                                      )}{" "}
                                      /{" "}
                                      {Number(
                                        item.frecuencia_horas,
                                      ).toLocaleString("es-AR")}{" "}
                                      hs
                                    </strong>
                                  </div>

                                  <div className="barra-progreso-componente">
                                    <div
                                      className={`barra-progreso-relleno progreso-${item.estado
                                        .toLowerCase()
                                        .replaceAll(" ", "-")}`}
                                      style={{
                                        width: `${progreso}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="componente-sin-historial">
                                Sin historial registrado.
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="componentes-dashboard">
                    <div className="dashboard-sin-datos">
                      No hay mantenimientos generales registrados.
                    </div>
                  </div>
                )}

                <h3>Plan de mantenimiento</h3>
                <div className="plan-dashboard">
                  <div className="plan-dashboard-header">
                    <div>
                      <span className="dashboard-panel-etiqueta">
                        PLAN ASIGNADO
                      </span>

                      <h3>Plan de mantenimiento</h3>

                      {planMantenimiento.length > 0 && (
                        <p>{planMantenimiento[0].plan}</p>
                      )}
                    </div>

                    {planMantenimiento.length > 0 && (
                      <div className="plan-dashboard-total">
                        <strong>{planMantenimiento.length}</strong>

                        <span>
                          {planMantenimiento.length === 1
                            ? "componente"
                            : "componentes"}
                        </span>
                      </div>
                    )}
                  </div>

                  {planMantenimiento.length > 0 ? (
                    <div className="plan-dashboard-contenido">
                      <div className="plan-dashboard-titulos">
                        <span>Componente</span>
                        <span>Código</span>
                        <span>Cantidad</span>
                        <span>Frecuencia</span>
                      </div>

                      <div className="plan-dashboard-lista">
                        {planMantenimiento.map((item) => (
                          <div
                            className="plan-dashboard-item"
                            key={item.componente_id}
                          >
                            <div className="plan-componente">
                              <div className="plan-componente-icono">✓</div>

                              <div>
                                <strong>{item.componente}</strong>

                                {item.opcional && (
                                  <span className="plan-opcional">
                                    Opcional
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="plan-dato" data-label="Código">
                              <span className="plan-codigo">
                                {item.codigo || "—"}
                              </span>
                            </div>

                            <div className="plan-dato" data-label="Cantidad">
                              <strong>{item.cantidad || "—"}</strong>

                              {item.cantidad && (
                                <small>{item.unidad || "UN"}</small>
                              )}
                            </div>

                            <div className="plan-dato" data-label="Frecuencia">
                              <strong>
                                {Number(item.frecuencia_horas).toLocaleString(
                                  "es-AR",
                                )}
                              </strong>

                              <small>hs</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="plan-dashboard-vacio">
                      <div className="plan-vacio-icono">!</div>

                      <div>
                        <strong>Sin plan asignado</strong>

                        <p>
                          Este equipo no tiene un plan de mantenimiento
                          asignado.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        )}
      </div>
    </div>
  );
}

export default App;
