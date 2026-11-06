import "../login.css";
import logoTM from "../assets/logotm.png";
import fondoTaller from "../assets/taller.jpg";

export default function Login({ onLogin }) {
  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `
          linear-gradient(rgba(20, 39, 79, 0.72), rgba(20, 39, 79, 0.72)),
          url(${fondoTaller})
        `,
      }}
    >
      <div className="login-overlay">
        <div className="login-card">
          <h2>Iniciar sesión</h2>
          <p>Completá tus datos para continuar</p>

          <label>
            Correo electrónico
            <input type="email" placeholder="usuario@tmroldansrl.com.ar" />
          </label>

          <label>
            Contraseña
            <input type="password" placeholder="••••••••" />
          </label>

          <button type="button" onClick={onLogin}>
            Ingresar
          </button>

          <small>Acceso exclusivo para personal autorizado</small>
        </div>

        <div className="login-hero">
          <div className="login-hero-logo">
            <img src={logoTM} alt="TM Roldan" />
          </div>

          <h1>Gestión inteligente de maquinaria y flotas</h1>

          <p>
            Centralizá el control de equipos, mantenimientos, operaciones e
            informes en una sola plataforma.
          </p>

          <div className="login-hero-linea"></div>

          <span className="login-hero-footer">
            CONTROL TM | SISTEMA DE GESTIÓN
          </span>
        </div>
      </div>
    </div>
  );
}