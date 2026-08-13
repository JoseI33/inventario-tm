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

app.listen(3000, () => {
  console.log("Servidor funcionando en http://localhost:3000");
});