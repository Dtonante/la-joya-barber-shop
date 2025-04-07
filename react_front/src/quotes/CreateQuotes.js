// src/quotes/CrearCita.js
import React, { useState } from "react";
import axios from "axios";
import "../css/LoginCss.css"; // Reutilizamos los estilos del login

const CreateQuotes = () => {
  const [dateAndTimeQuote, setDateAndTimeQuote] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setError("");

    const id_userFK = localStorage.getItem("user");

    if (!id_userFK) {
      setError("No se encontró el ID del usuario.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/v1/quotes", {
        id_userFK,
        dateAndTimeQuote,
      });

      setMensaje("Cita creada con éxito.");
      setDateAndTimeQuote("");
    } catch (err) {
      setError("Error al crear la cita.");
    }
  };

  return (
    <div className="login-background">
      <div className="login-card">
        <div className="login-avatar"></div>
        <h2 className="login-title">Crear Cita</h2>

        {error && <div className="login-error">{error}</div>}
        {mensaje && <div className="login-error" style={{ backgroundColor: "#4caf50" }}>{mensaje}</div>}

        <form onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="datetime-local"
            value={dateAndTimeQuote}
            onChange={(e) => setDateAndTimeQuote(e.target.value)}
            required
          />

          <button className="login-button" type="submit">
            Guardar Cita
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuotes;
