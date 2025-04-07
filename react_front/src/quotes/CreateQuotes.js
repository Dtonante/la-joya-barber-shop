import React, { useState } from "react";
import axios from "axios";
import "../css/LoginCss.css";
import { useNavigate } from "react-router-dom";

const URI_CREATE_QUOTE = "http://localhost:3000/api/v1/quotes";

const CreateQuotes = () => {
  const [dateAndTimeQuote, setDateAndTimeQuote] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const id_userFK = localStorage.getItem("user");
  const name_user = localStorage.getItem("name_user");
  const token = localStorage.getItem("token");

  // Función para obtener fecha y hora actual en formato datetime-local
  const getMinDate = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0); // empieza desde hoy, sin limitar la hora
    const isoString = now.toISOString();
    return isoString.slice(0, 16);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    if (!id_userFK) {
      setError("No se encontró el ID del usuario.");
      return;
    }

    try {
      const res = await axios.post(
        URI_CREATE_QUOTE,
        {
          id_userFK,
          dateAndTimeQuote,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMensaje("Cita creada con éxito.");
      setDateAndTimeQuote("");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("Ya hay una cita agendada para esta fecha y hora.");
      } else {
        setError("Error al crear la cita.");
      }
    }
  };

  return (
    <div className="login-background">
      <div className="login-card">
        <div className="login-avatar"></div>
        <h2 className="login-title">Crear Cita</h2>

        {error && <div className="login-error">{error}</div>}
        {mensaje && (
          <div
            className="login-error"
            style={{ backgroundColor: "#4caf50" }}
          >
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input value={name_user} className="login-input" disabled />

          <input
            className="login-input"
            type="datetime-local"
            min={getMinDate()} // sigue usando fecha mínima de hoy
            step="1800" // 30 minutos en segundos
            value={dateAndTimeQuote}
            onChange={(e) => setDateAndTimeQuote(e.target.value)}
            required
          />


          <button className="login-button" type="submit">
            Guardar Cita
          </button>

          <button
            type="button"
            className="login-button"
            onClick={() => navigate("/")}
          >
            Atrás
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuotes;
