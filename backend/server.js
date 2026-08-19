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
      ORDER BY e.interno;
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Error al consultar equipos activos",
    });
  }
});

app.listen(3000, () => {
  console.log("Servidor funcionando en http://localhost:3000");
});