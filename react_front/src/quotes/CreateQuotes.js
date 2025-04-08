
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar.js";
import "../css/quotes/CreateQuoteCss.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";

const URI_CREATE_QUOTE = "http://localhost:3000/api/v1/quotes";

const CreateQuotes = () => {
  const [dateAndTimeQuote, setDateAndTimeQuote] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const toggleSidebar = () => setSidebarAbierto(!sidebarAbierto);

  const navigate = useNavigate();
  const id_userFK = localStorage.getItem("user");
  const name_user = localStorage.getItem("name_user");
  const token = localStorage.getItem("token");

  const getMinDate = () => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now.toISOString().slice(0, 16);
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
      await axios.post(
        URI_CREATE_QUOTE,
        { id_userFK, dateAndTimeQuote },
        { headers: { Authorization: `Bearer ${token}` } }
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
    <div style={{ display: "flex" }}>
      <Sidebar isOpen={sidebarAbierto} toggleSidebar={toggleSidebar} />

      <div
        style={{
          marginLeft: sidebarAbierto ? "200px" : "-5px",
          transition: "margin-left 0.3s",
          padding: "20px",
          width: "100%",
        }}
      >
        <div className="create-quotes-container">
          <h2 className="create-quotes-title">Crear Cita</h2>

          {error && (
            <div className="create-quotes-message error">{error}</div>
          )}
          {mensaje && (
            <div className="create-quotes-message success">{mensaje}</div>
          )}


          <form onSubmit={handleSubmit} className="create-quotes-form">
            <div>
              <label>Usuario</label><br />
              <input type="text" value={name_user} disabled />
            </div>

            <div>
              <label>Fecha y Hora</label><br />

              {/* Campo datetime-local */}
              <input
                type="datetime-local"
                min={getMinDate()}
                step="1800"
                value={dateAndTimeQuote}
                onChange={(e) => setDateAndTimeQuote(e.target.value)}
                required
              />
              <br />
              <br />

              {/* Calendario visual debajo */}
              <DatePicker
                selected={dateAndTimeQuote ? new Date(dateAndTimeQuote) : null}
                onChange={(date) => {
                  if (date) {
                    const formatted = new Date(date);
                    formatted.setHours(0, 0, 0, 0); // hora a 00:00 para que el input datetime-local quede limpio para hora
                    const iso = formatted.toISOString().slice(0, 10); // solo la fecha
                    const currentTime = dateAndTimeQuote.split("T")[1] || "00:00"; // hora actual o vacía
                    setDateAndTimeQuote(`${iso}T${currentTime}`);
                  }
                }}
                minDate={new Date()}
                dateFormat="yyyy-MM-dd"
                inline
                locale={es}
              />
            </div>

            <button type="submit" className="create-quotes-button">
              Guardar Cita
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="create-quotes-back"
            >
              Atrás
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default CreateQuotes;
