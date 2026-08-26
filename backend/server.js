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
        (h.horometro - c.horometro_inicio) AS diferencia_horas
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
  } = req.body;

  try {
    if (!interno || !empresa || !fecha_inicio || !horometro_inicio) {
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
        activo
      )
      VALUES ($1, $2, $3, $4, $5, true)
      RETURNING *
      `,
      [
        equipo.rows[0].id,
        empresa,
        ubicacion || null,
        fecha_inicio,
        Number(horometro_inicio),
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
        pc.frecuencia_horas
      FROM equipos e
      JOIN planes_mantenimiento p
        ON p.id = e.plan_mantenimiento_id
      JOIN plan_componentes pc
        ON pc.plan_id = p.id
      JOIN componentes_mantenimiento c
        ON c.id = pc.componente_id
      WHERE e.interno = $1
      ORDER BY pc.frecuencia_horas, c.nombre
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
        c.id AS componente_id,
        c.nombre AS componente,
        c.codigo,
        pc.frecuencia_horas,
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
        ORDER BY m2.fecha DESC, m2.id DESC
        LIMIT 1
      ) m ON true

      WHERE e.interno = $1

      AND (
        c.nombre = 'Filtro hidráulico'
        OR c.nombre = 'Filtro de caja'
        OR c.nombre = 'SAE 90'
      )

      ORDER BY pc.frecuencia_horas, c.nombre
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
        pc.frecuencia_horas
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

        c.id AS componente_id,
        c.nombre AS componente,
        c.codigo,

        pc.frecuencia_horas,

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
        ORDER BY m2.fecha DESC, m2.id DESC
        LIMIT 1
      ) m ON true

      WHERE e.interno = $1
        AND (
          c.nombre = 'Filtro aire secundario'
          OR c.nombre = 'Filtro combustible eléctrico'
        )

      ORDER BY c.nombre
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

app.listen(3000, () => {
  console.log("Servidor funcionando en http://localhost:3000");
});