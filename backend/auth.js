
const jwt = require("jsonwebtoken");
const pool = require("./db");

// Verifica que el usuario tenga una sesión válida
const autenticar = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization || "";

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Debés iniciar sesión.",
      });
    }

    const token = authorization.slice(7).trim();

    if (!token || !process.env.JWT_SECRET) {
      return res.status(401).json({
        error: "Sesión inválida.",
      });
    }

    const datos = jwt.verify(
      token,
      process.env.JWT_SECRET,
      {
        algorithms: ["HS256"],
        issuer: "tmroldan-api",
      }
    );

    const usuarioId = Number(datos.sub);

    if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
      return res.status(401).json({
        error: "Sesión inválida.",
      });
    }

    const resultado = await pool.query(
      `
      SELECT
        u.id,
        u.nombre,
        u.email,
        u.activo,
        u.empresa_id,
        r.id AS rol_id,
        r.codigo AS rol,
        e.activo AS empresa_activa
      FROM usuarios_sistema u
      JOIN roles r ON r.id = u.rol_id
      LEFT JOIN empresas_sistema e ON e.id = u.empresa_id
      WHERE u.id = $1
      `,
      [usuarioId]
    );

    const usuario = resultado.rows[0];

    if (
      !usuario ||
      usuario.activo !== true ||
      (usuario.empresa_id !== null && usuario.empresa_activa !== true)
    ) {
      return res.status(401).json({
        error: "Usuario inactivo o no disponible.",
      });
    }

    // Consultamos los permisos actuales en PostgreSQL
    const resultadoPermisos = await pool.query(
      `
      SELECT p.codigo
      FROM rol_permisos rp
      JOIN permisos p ON p.id = rp.permiso_id
      WHERE rp.rol_id = $1
      `,
      [usuario.rol_id]
    );

    req.usuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      empresa_id: usuario.empresa_id,
    };

    req.permisos = resultadoPermisos.rows.map(
      (permiso) => permiso.codigo
    );

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        error: "Sesión inválida o vencida.",
      });
    }

    console.error("Error de autenticación:", error);

    return res.status(500).json({
      error: "Error al verificar la sesión.",
    });
  }
};

// Comprueba si el usuario tiene un permiso específico
const exigirPermiso = (codigoPermiso) => {
  return (req, res, next) => {
    if (!req.usuario || !Array.isArray(req.permisos)) {
      return res.status(401).json({
        error: "Debés iniciar sesión.",
      });
    }

    if (!req.permisos.includes(codigoPermiso)) {
      return res.status(403).json({
        error: "No tenés permiso para esta operación.",
      });
    }

    next();
  };
};

module.exports = {
  autenticar,
  exigirPermiso,
};
