
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar.js";
import "../css/quotes/CreateQuoteCss.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";


import { es } from "date-fns/locale";

const URI_CREATE_QUOTE = "http://localhost:3000/api/v1/quotes";

const CreateQuotes = () => {
  const [dateAndTimeQuote, setDateAndTimeQuote] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const toggleSidebar = () => setSidebarAbierto(!sidebarAbierto);

  const navigate = useNavigate();
  const id_userFK = localStorage.getItem("user");
  const name_user = localStorage.getItem("name_user");
  const token = localStorage.getItem("token");

  const [availableHours, setAvailableHours] = useState([]);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchAvailableHours = async () => {
      if (!dateAndTimeQuote) return;

      const formattedDate = new Date(dateAndTimeQuote).toISOString().split("T")[0];

      try {
        const res = await axios.get(
          `http://localhost:3000/api/v1/quotes/disponibles/horas?fecha=${formattedDate}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setAvailableHours(Array.isArray(res.data.horasDisponibles) ? res.data.horasDisponibles : []);
        setFetchError("");
      } catch (err) {
        console.error("Error al obtener horas disponibles", err);
        setAvailableHours([]);
        setFetchError("Error al obtener horas disponibles.");
      }
    };

    fetchAvailableHours();
  }, [dateAndTimeQuote]);


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

              {/* Campo de solo lectura que muestra la fecha y hora seleccionadas */}
              <input
                type="text"
                value={
                  dateAndTimeQuote
                    ? dateAndTimeQuote.toLocaleString("es-ES", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })
                    : ""
                }
                readOnly
              />

              <br />
              <br />

              {/* Calendario visual */}
              <DatePicker
                selected={dateAndTimeQuote ? new Date(dateAndTimeQuote) : null}
                onChange={(date) => {
                  setDateAndTimeQuote(date); // YYYY-MM-DDTHH:mm
                }}
                dateFormat="yyyy-MM-dd HH:mm"
                minDate={new Date()}
                locale={es}
                inline
              />
              <h3>Horas disponibles</h3>
              {fetchError && <div style={{ color: "red" }}>{fetchError}</div>}

              {availableHours.length > 0 ? (
                <div className="available-hours-container">
                {availableHours.map((hora, index) => (
                  <button
                    key={index}
                    type="button"
                    className="available-hour-btn"
                    onClick={() => {
                      if (dateAndTimeQuote) {
                        const [hour, minute] = hora.split(":");
                        const nuevaFecha = new Date(dateAndTimeQuote);
                        nuevaFecha.setHours(Number(hour));
                        nuevaFecha.setMinutes(Number(minute));
                        nuevaFecha.setSeconds(0);
                        nuevaFecha.setMilliseconds(0);
                        setDateAndTimeQuote(nuevaFecha);
                      }
                    }}
                  >
                    {hora}
                  </button>
                ))}
              </div>
              
              ) : dateAndTimeQuote && !fetchError ? (
                <p>No hay horas disponibles para esta fecha.</p>
              ) : null}

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
