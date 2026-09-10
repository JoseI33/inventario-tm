const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API TM ROLDAN funcionando");
});

app.get("/equipos", async (req, res) => {
  try {
    const resultado = await pool.query(
      "SELECT * FROM equipos ORDER BY interno"
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al consultar equipos",
    });
  }
});

app.get("/services", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        s.id,
        e.interno,
        s.fecha,
        s.horometro,
        s.tipo,
        s.observaciones
      FROM services s
      JOIN equipos e ON e.id = s.equipo_id
      ORDER BY s.fecha DESC, s.horometro DESC
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Error al consultar services",
    });
  }
});

app.put("/equipos/:interno/horometro", async (req, res) => {
  const { interno } = req.params;
  const { horometro, fecha } = req.body;

  try {
    if (!horometro || !fecha) {
      return res.status(400).json({
        error: "Horómetro y fecha son obligatorios",
      });
    }

    const equipoActual = await pool.query(
      `
      SELECT id, horometro_actual
      FROM equipos
      WHERE interno = $1
      `,
      [interno]
    );

    if (equipoActual.rows.length === 0) {
      return res.status(404).json({
        error: "Equipo no encontrado",
      });
    }

    const equipo = equipoActual.rows[0];

    if (Number(horometro) < Number(equipo.horometro_actual)) {
      return res.status(400).json({
        error: "El nuevo horómetro no puede ser menor al actual",
      });
    }

    await pool.query(
      `
      INSERT INTO horometros (
        equipo_id,
        fecha,
        horometro
      )
      VALUES ($1, $2, $3)
      `,
      [equipo.id, fecha, horometro]
    );

    const resultado = await pool.query(
      `
      UPDATE equipos
      SET horometro_actual = $1
      WHERE interno = $2
      RETURNING *
      `,
      [horometro, interno]
    );

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al actualizar horómetro",
    });
  }
});

app.put("/equipos/:interno/plan-mantenimiento", async (req, res) => {
  const { interno } = req.params;
  const { plan_id } = req.body;

  try {
    const resultado = await pool.query(
      `
      UPDATE equipos
      SET plan_mantenimiento_id = $1
      WHERE interno = $2
      RETURNING *
      `,
      [plan_id, interno]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({
        error: "Equipo no encontrado",
      });
    }

    res.json(resultado.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al asignar plan de mantenimiento",
    });
  }
});

app.post("/equipos/:interno/mantenimientos", async (req, res) => {
  const { interno } = req.params;

  const {
    componente_id,
    fecha,
    horometro,
    observaciones,
  } = req.body;

  try {
    if (!componente_id || !fecha || !horometro) {
      return res.status(400).json({
        error: "Componente, fecha y horómetro son obligatorios",
      });
    }

    const equipo = await pool.query(
      `
      SELECT id
      FROM equipos
      WHERE interno = $1
      `,
      [interno]
    );

    if (equipo.rows.length === 0) {
      return res.status(404).json({
        error: "Equipo no encontrado",
      });
    }

    const resultado = await pool.query(
      `
      INSERT INTO mantenimientos (
        equipo_id,
        componente_id,
        fecha,
        horometro,
        observaciones
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        equipo.rows[0].id,
        componente_id,
        fecha,
        Number(horometro),
        observaciones || null,
      ]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al registrar mantenimiento",
    });
  }
});

app.post("/equipos/:interno/services", async (req, res) => {
  const { interno } = req.params;
  const { fecha, horometro } = req.body;

  try {
    if (!fecha || !horometro) {
      return res.status(400).json({
        error: "Fecha y horómetro son obligatorios",
      });
    }

    const equipo = await pool.query(
      "SELECT id FROM equipos WHERE interno = $1",
      [interno]
    );

    if (equipo.rows.length === 0) {
      return res.status(404).json({
        error: "Equipo no encontrado",
      });
    }

    const resultado = await pool.query(
      `
      INSERT INTO services (
        equipo_id,
        fecha,
        horometro,
        tipo,
        observaciones
      )
      VALUES ($1, $2, $3, 'Motor', $4)
      RETURNING *
      `,
      [
        equipo.rows[0].id,
        fecha,
        Number(horometro),
        "Carga desde configuración",
      ]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al registrar service de motor",
    });
  }
});

app.get("/equipos/:interno/horometros", async (req, res) => {
  const { interno } = req.params;

  try {
    const resultado = await pool.query(
      `
      SELECT
        h.id,
        h.fecha,
        h.horometro
      FROM horometros h
      JOIN equipos e ON e.id = h.equipo_id
      WHERE e.interno = $1
      ORDER BY h.fecha DESC, h.id DESC
      `,
      [interno]
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al consultar historial de horómetros",
    });
  }
});

app.get("/equipos-activos", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        e.interno,
        e.tipo,
        e.marca,
        e.modelo,
        c.empresa,
        c.ubicacion,
        c.fecha_inicio,
        c.horometro_inicio,

        h.fecha AS ultima_visita,
        h.horometro AS horometro_ultima_visita,
        (h.horometro - c.horometro_inicio) AS diferencia_horas,

        s.fecha AS fecha_ultimo_service_motor,
        s.horometro AS horometro_ultimo_service_motor,

        CASE
          WHEN s.horometro IS NULL THEN NULL
          ELSE s.horometro + 300
        END AS proximo_service_motor,

        CASE
          WHEN s.horometro IS NULL OR h.horometro IS NULL THEN NULL
          ELSE (s.horometro + 300) - h.horometro
        END AS horas_restantes_service_motor

      FROM contratos_equipos c

      JOIN equipos e
        ON e.id = c.equipo_id

      LEFT JOIN LATERAL (
        SELECT
          h2.fecha,
          h2.horometro
        FROM horometros h2
        WHERE h2.equipo_id = e.id
        ORDER BY h2.fecha DESC, h2.id DESC
        LIMIT 1
      ) h ON true

      LEFT JOIN LATERAL (
        SELECT
          s2.fecha,
          s2.horometro
        FROM services s2
        WHERE s2.equipo_id = e.id
          AND LOWER(s2.tipo) = 'motor'
        ORDER BY s2.horometro DESC, s2.id DESC
        LIMIT 1
      ) s ON true

      WHERE c.activo = true

      ORDER BY CAST(e.interno AS INTEGER) ASC;
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al consultar equipos activos",
    });
  }
});

app.post("/equipos", async (req, res) => {
  const {
    interno,
    tipo,
    marca,
    modelo,
    horometro_actual,
    frecuencia_service,
  } = req.body;

  try {
    if (!interno || !tipo || !marca || !horometro_actual) {
      return res.status(400).json({
        error: "Completá los campos obligatorios.",
      });
    }

    const existe = await pool.query(
      "SELECT id FROM equipos WHERE interno = $1",
      [interno]
    );

    if (existe.rows.length > 0) {
      return res.status(400).json({
        error: `El interno ${interno} ya existe.`,
      });
    }

    const resultado = await pool.query(
      `
      INSERT INTO equipos (
        interno,
        tipo,
        marca,
        modelo,
        horometro_actual,
        frecuencia_service
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        interno,
        tipo,
        marca,
        modelo || null,
        Number(horometro_actual),
        Number(frecuencia_service) || 300,
      ]
    );

    res.status(201).json(resultado.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al crear el equipo.",
    });
  }
});

app.post("/contratos", async (req, res) => {
  const {
    interno,
    empresa,
    ubicacion,
    fecha_inicio,
    horometro_inicio,
    tipo_contrato,
  } = req.body;

  try {
    if (!interno || !empresa || !fecha_inicio || !horometro_inicio || !tipo_contrato) {
      return res.status(400).json({
        error: "Completá los campos obligatorios del contrato.",
      });
    }

    const equipo = await pool.query(
      "SELECT id FROM equipos WHERE interno = $1",
      [interno]
    );

    if (equipo.rows.length === 0) {
      return res.status(404).json({
        error: "Equipo no encontrado.",
      });
    }

    const resultado = await pool.query(
      `
      INSERT INTO contratos_equipos (
        equipo_id,
        empresa,
        ubicacion,
        fecha_inicio,
        horometro_inicio,
        tipo_contrato,
        activo
      )
      VALUES ($1, $2, $3, $4, $5, $6, true)
      RETURNING *
      `,
      [
        equipo.rows[0].id,
        empresa,
        ubicacion || null,
        fecha_inicio,
        Number(horometro_inicio),
        tipo_contrato || null,
      ]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al crear el contrato.",
    });
  }
});

app.get("/equipos/:interno/plan-mantenimiento", async (req, res) => {
  const { interno } = req.params;

  try {
    const resultado = await pool.query(
      `
      SELECT
        e.interno,

        p.id AS plan_id,
        p.nombre AS plan,

        c.id AS componente_id,
        c.nombre AS componente,
        c.codigo,

        pc.frecuencia_horas,
        pc.cantidad,
        pc.unidad,
        pc.opcional

      FROM equipos e

      JOIN planes_mantenimiento p
        ON p.id = e.plan_mantenimiento_id

      JOIN plan_componentes pc
        ON pc.plan_id = p.id

      JOIN componentes_mantenimiento c
        ON c.id = pc.componente_id

      WHERE e.interno = $1

      ORDER BY
        pc.frecuencia_horas,
        c.nombre
      `,
      [interno]
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al consultar el plan de mantenimiento",
    });
  }
});

app.get("/equipos/:interno/mantenimientos", async (req, res) => {
  const { interno } = req.params;

  try {
    const resultado = await pool.query(
      `
      SELECT
        e.interno,
        e.horometro_actual,

        p.id AS plan_id,
        p.nombre AS plan,

        c.id AS componente_id,
        c.nombre AS componente,
        c.codigo,

        pc.frecuencia_horas,
        pc.cantidad,
        pc.unidad,
        pc.opcional,

        m.fecha AS fecha_ultimo_mantenimiento,
        m.horometro AS horometro_ultimo_mantenimiento,

        (
          e.horometro_actual - m.horometro
        ) AS horas_usadas,

        (
          m.horometro + pc.frecuencia_horas
        ) AS proximo_mantenimiento,

        (
          (m.horometro + pc.frecuencia_horas)
          - e.horometro_actual
        ) AS horas_restantes

      FROM equipos e

      JOIN planes_mantenimiento p
        ON p.id = e.plan_mantenimiento_id

      JOIN plan_componentes pc
        ON pc.plan_id = p.id

      JOIN componentes_mantenimiento c
        ON c.id = pc.componente_id

      LEFT JOIN LATERAL (
        SELECT
          m2.fecha,
          m2.horometro

        FROM mantenimientos m2

        WHERE m2.equipo_id = e.id
          AND m2.componente_id = c.id

        ORDER BY
          m2.fecha DESC,
          m2.id DESC

        LIMIT 1
      ) m ON true

      WHERE e.interno = $1

        AND pc.opcional = FALSE
        AND pc.frecuencia_horas > 300

      ORDER BY
        pc.frecuencia_horas,
        c.nombre
      `,
      [interno]
    );

    const mantenimientos = resultado.rows.map((item) => {
      let estado = "Sin historial";

      if (item.horometro_ultimo_mantenimiento !== null) {
        if (item.horas_restantes <= 0) {
          estado = "Vencido";
        } else if (item.horas_restantes <= 200) {
          estado = "Próximo";
        } else {
          estado = "OK";
        }
      }

      return {
        ...item,
        estado,
      };
    });

    res.json(mantenimientos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al consultar mantenimientos",
    });
  }
});

app.get("/planes-mantenimiento", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT id, nombre, tipo_equipo, marca, modelo
      FROM planes_mantenimiento
      ORDER BY nombre
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al consultar planes de mantenimiento",
    });
  }
});

app.get("/planes-mantenimiento/:id/componentes", async (req, res) => {
  const { id } = req.params;

  try {
    const resultado = await pool.query(
      `
      SELECT
        c.id AS componente_id,
        c.nombre,
        c.codigo,
        pc.frecuencia_horas,
        pc.cantidad,
        pc.unidad,
        pc.opcional
      FROM plan_componentes pc
      JOIN componentes_mantenimiento c
        ON c.id = pc.componente_id
      WHERE pc.plan_id = $1
      ORDER BY pc.frecuencia_horas, c.nombre
      `,
      [id]
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al consultar componentes del plan",
    });
  }
});

app.post("/equipos/:interno/service-completo", async (req, res) => {
  const { interno } = req.params;

  const {
    fecha,
    horometro,
    secundarios = [],
  } = req.body;

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const equipo = await client.query(
      `
      SELECT id
      FROM equipos
      WHERE interno = $1
      `,
      [interno]
    );

    if (equipo.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        error: "Equipo no encontrado",
      });
    }

    if (!fecha || !horometro) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        error: "Fecha y horómetro son obligatorios",
      });
    }

    const equipoId = equipo.rows[0].id;

    // 1. Crear service de motor
    const service = await client.query(
      `
      INSERT INTO services (
        equipo_id,
        fecha,
        horometro,
        tipo,
        observaciones
      )
      VALUES ($1, $2, $3, 'Motor', $4)
      RETURNING *
      `,
      [
        equipoId,
        fecha,
        Number(horometro),
        "Service registrado desde sistema",
      ]
    );

    const serviceId = service.rows[0].id;

    // 2. Registrar filtros especiales
    for (const item of secundarios) {
      await client.query(
        `
        INSERT INTO service_componentes (
          service_id,
          componente_id,
          cambiado,
          motivo,
          observaciones
        )
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
          serviceId,
          item.componente_id,
          Boolean(item.cambiado),
          item.motivo || null,
          item.observaciones || null,
        ]
      );

      // 3. Si se cambió, reiniciamos su contador
      if (item.cambiado) {
        await client.query(
          `
          INSERT INTO mantenimientos (
            equipo_id,
            componente_id,
            fecha,
            horometro,
            observaciones
          )
          VALUES ($1, $2, $3, $4, $5)
          `,
          [
            equipoId,
            item.componente_id,
            fecha,
            Number(horometro),
            item.motivo
              ? `Cambio durante service: ${item.motivo}`
              : "Cambio durante service",
          ]
        );
      }
    }

    await client.query("COMMIT");

    res.status(201).json({
      mensaje: "Service registrado correctamente",
      service: service.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      error: "Error al registrar service completo",
    });
  } finally {
    client.release();
  }
});

app.get("/equipos/:interno/filtros-especiales", async (req, res) => {
  const { interno } = req.params;

  try {
    const resultado = await pool.query(
      `
      SELECT
        e.interno,
        e.horometro_actual,

        p.id AS plan_id,
        p.nombre AS plan,

        c.id AS componente_id,
        c.nombre AS componente,
        c.codigo,

        pc.frecuencia_horas,
        pc.cantidad,
        pc.unidad,
        pc.opcional,

        m.fecha AS fecha_ultimo_cambio,
        m.horometro AS horometro_ultimo_cambio,
        m.observaciones,

        (
          e.horometro_actual - m.horometro
        ) AS horas_usadas,

        (
          m.horometro + pc.frecuencia_horas
        ) AS proximo_cambio,

        (
          (m.horometro + pc.frecuencia_horas)
          - e.horometro_actual
        ) AS horas_restantes

      FROM equipos e

      JOIN planes_mantenimiento p
        ON p.id = e.plan_mantenimiento_id

      JOIN plan_componentes pc
        ON pc.plan_id = p.id

      JOIN componentes_mantenimiento c
        ON c.id = pc.componente_id

      LEFT JOIN LATERAL (
        SELECT
          m2.fecha,
          m2.horometro,
          m2.observaciones

        FROM mantenimientos m2

        WHERE m2.equipo_id = e.id
          AND m2.componente_id = c.id

        ORDER BY
          m2.fecha DESC,
          m2.id DESC

        LIMIT 1
      ) m ON true

      WHERE e.interno = $1

        AND pc.opcional = TRUE

      ORDER BY
        pc.frecuencia_horas,
        c.nombre
      `,
      [interno]
    );

    const filtros = resultado.rows.map((item) => {
      let estado = "Sin historial";

      if (item.horometro_ultimo_cambio !== null) {
        if (item.horas_restantes <= 0) {
          estado = "Vencido";
        } else if (item.horas_restantes <= 50) {
          estado = "Próximo";
        } else {
          estado = "OK";
        }
      }

      return {
        ...item,
        estado,
      };
    });

    res.json(filtros);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al consultar filtros especiales",
    });
  }
});

app.put("/equipos/:interno/dar-de-baja", async (req, res) => {
  const { interno } = req.params;

  const {
    fecha_fin,
    horometro_fin,
    motivo_baja,
    ubicacion_actual,
    observacion_baja,
  } = req.body;

  const client = await pool.connect();

  try {
    if (
      !fecha_fin ||
      !horometro_fin ||
      !motivo_baja ||
      !ubicacion_actual
    ) {
      return res.status(400).json({
        error:
          "Fecha, horómetro, motivo y ubicación son obligatorios.",
      });
    }

    await client.query("BEGIN");

    const equipo = await client.query(
      `
      SELECT id
      FROM equipos
      WHERE interno = $1
      `,
      [interno]
    );

    if (equipo.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        error: "Equipo no encontrado.",
      });
    }

    const equipoId = equipo.rows[0].id;

    const contratoActivo = await client.query(
      `
      SELECT id, horometro_inicio
      FROM contratos_equipos
      WHERE equipo_id = $1
        AND activo = true
      ORDER BY fecha_inicio DESC, id DESC
      LIMIT 1
      `,
      [equipoId]
    );

    if (contratoActivo.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        error: "El equipo no tiene un contrato activo.",
      });
    }

    const contrato = contratoActivo.rows[0];

    if (
      Number(horometro_fin) <
      Number(contrato.horometro_inicio)
    ) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        error:
          "El horómetro de baja no puede ser menor al horómetro de inicio.",
      });
    }

    const contratoActualizado = await client.query(
      `
      UPDATE contratos_equipos
      SET
        activo = false,
        fecha_fin = $1,
        horometro_fin = $2,
        motivo_baja = $3,
        observacion_baja = $4
      WHERE id = $5
      RETURNING *
      `,
      [
        fecha_fin,
        Number(horometro_fin),
        motivo_baja,
        observacion_baja || null,
        contrato.id,
      ]
    );

    await client.query(
      `
      UPDATE equipos
      SET
        ubicacion_actual = $1,
        horometro_actual = $2
      WHERE id = $3
      `,
      [
        ubicacion_actual,
        Number(horometro_fin),
        equipoId,
      ]
    );

    await client.query(
      `
      INSERT INTO horometros (
        equipo_id,
        fecha,
        horometro
      )
      VALUES ($1, $2, $3)
      `,
      [
        equipoId,
        fecha_fin,
        Number(horometro_fin),
      ]
    );

    await client.query("COMMIT");

    res.json({
      mensaje: `Interno ${interno} dado de baja correctamente.`,
      contrato: contratoActualizado.rows[0],
      ubicacion_actual,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(error);

    res.status(500).json({
      error: "Error al dar de baja el equipo.",
    });
  } finally {
    client.release();
  }
});

app.get("/equipos-inactivos", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        e.interno,
        e.tipo,
        e.marca,
        e.modelo,
        e.horometro_actual,
        e.ubicacion_actual,

        c.empresa,
        c.ubicacion AS ultima_ubicacion_trabajo,
        c.fecha_inicio,
        c.horometro_inicio,
        c.fecha_fin,
        c.horometro_fin,
        c.motivo_baja,
        c.observacion_baja,

        (
          c.horometro_fin - c.horometro_inicio
        ) AS horas_trabajadas

      FROM equipos e

      JOIN LATERAL (
        SELECT
          c2.*
        FROM contratos_equipos c2
        WHERE c2.equipo_id = e.id
          AND c2.activo = false
        ORDER BY c2.fecha_fin DESC, c2.id DESC
        LIMIT 1
      ) c ON true

      WHERE NOT EXISTS (
        SELECT 1
        FROM contratos_equipos ca
        WHERE ca.equipo_id = e.id
          AND ca.activo = true
      )

      ORDER BY CAST(e.interno AS INTEGER) ASC;
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al consultar equipos inactivos",
    });
  }
});

app.get("/equipos/:interno/historial-trabajo", async (req, res) => {
  const { interno } = req.params;

  try {
    const resultado = await pool.query(
      `
      SELECT
        c.id,
        e.interno,
        c.empresa,
        c.ubicacion,
        c.fecha_inicio,
        c.fecha_fin,
        c.horometro_inicio,
        c.horometro_fin,
        c.activo,
        c.motivo_baja,
        c.observacion_baja,

        CASE
          WHEN c.horometro_fin IS NOT NULL
          THEN c.horometro_fin - c.horometro_inicio
          ELSE NULL
        END AS horas_trabajadas

      FROM contratos_equipos c

      JOIN equipos e
        ON e.id = c.equipo_id

      WHERE e.interno = $1

      ORDER BY c.fecha_inicio DESC, c.id DESC;
      `,
      [interno]
    );

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al consultar historial:", error);

    res.status(500).json({
      error: "Error al consultar historial del equipo",
    });
  }
});

app.get("/historial-equipos", async (req, res) => {
  try {
    const resultado = await pool.query(`
      SELECT
        c.id,
        e.interno,
        e.tipo,
        c.empresa,
        c.ubicacion,
        c.fecha_inicio,
        c.fecha_fin,
        c.horometro_inicio,
        c.horometro_fin,
        c.tipo_contrato,
        c.activo,
        c.motivo_baja,
        c.observacion_baja,

        CASE
          WHEN c.horometro_fin IS NOT NULL
          THEN c.horometro_fin - c.horometro_inicio
          ELSE NULL
        END AS horas_trabajadas

      FROM contratos_equipos c

      JOIN equipos e
        ON e.id = c.equipo_id

      ORDER BY c.fecha_inicio DESC, c.id DESC;
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error("Error al consultar historial general:", error);

    res.status(500).json({
      error: "Error al consultar historial general de equipos",
    });
  }
});

app.listen(3000, () => {
  console.log("Servidor funcionando en http://localhost:3000");
});