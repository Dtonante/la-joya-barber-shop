import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/LoginCss.css";

const URI_CREATE_USER = "http://localhost:3000/api/v1/users";

const CreateUsers = () => {
  const [name, setName] = useState("");
  const [cellPhoneNumber, setCellPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const id_roleFK = 2;


  const handleCreateUser = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(URI_CREATE_USER, {
        name,
        cellPhoneNumber,
        email,
        password,
        id_roleFK,
      });

      if (response.status === 201) {
        navigate("/"); // Redirigir al login después de crear el usuario
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-background">
      <div className="login-card">
        <h2 className="login-title">Crear Usuario</h2>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleCreateUser}>
          <input
            className="login-input"
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="login-input"
            type="text"
            placeholder="Teléfono"
            value={cellPhoneNumber}
            onChange={(e) => setCellPhoneNumber(e.target.value)}
            required
          />
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
          
          <button className="login-button" type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear Usuario"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUsers;
