const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());
app.put("/equipos/:interno/horometro", ...)

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

app.listen(3000, () => {
  console.log("Servidor funcionando en http://localhost:3000");
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
  const { horometro } = req.body;

  try {
    const equipoActual = await pool.query(
      "SELECT horometro_actual FROM equipos WHERE interno = $1",
      [interno]
    );

    if (equipoActual.rows.length === 0) {
      return res.status(404).json({
        error: "Equipo no encontrado",
      });
    }

    const horometroAnterior = equipoActual.rows[0].horometro_actual;

    if (Number(horometro) < Number(horometroAnterior)) {
      return res.status(400).json({
        error: "El nuevo horómetro no puede ser menor al actual",
      });
    }

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