import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../css/LoginCss.css';

const URI_LOGIN = "http://localhost:3000/api/v1/users/login";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Estado para mostrar carga
  const navigate = useNavigate();

  // Limpiar el token cuando el usuario entra al login
  useEffect(() => {
    localStorage.removeItem("token");
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(URI_LOGIN, { email, password });

      if (response.data?.token) {
        const rol = response.data.user.id_roleFK;
      
        localStorage.setItem("token", response.data.token); // Guardar token
        localStorage.setItem("rol", rol); // Guardar el id_rolFK
        localStorage.setItem("user", response.data.user.id_userPK); // Guardar el id_userPK
        console.log("user", response.data.user.id_userPK);
        console.log("rol", rol);
      
        // Redirección según el rol
        if (rol == 1) {
          navigate("/dashboard");
        } else if (rol == 2) {
          navigate("/createQuote");
        } else {
          setError("Rol no reconocido.");
        }
      }


    } catch (err) {
      console.error("Error al iniciar sesión:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background">
      <div className="login-card">
        <div className="login-avatar">

        </div>


        <h2 className="login-title">Iniciar sesión</h2>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            className="login-input"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="login-input"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Botón para iniciar sesion */}
          <button
            className="login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Iniciar sesión"}
          </button>

         {/* Botón para crear usuario */}
          <button
            className="login-button"
            type="button"
            onClick={() => navigate("/createUser")}
            disabled={loading}
          >
            Crear Usuario
          </button>
        </form>
      </div>
    </div>
  );


};

export default Login;
