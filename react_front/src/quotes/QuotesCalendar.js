import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import axios from "axios";
import "../css/quotes/QuotesCalendarCss.css"; // Podés crear estilos propios

const URI_GET_QUOTES = "http://localhost:3000/api/v1/quotes";

const QuotesCalendar = () => {
    const [quotes, setQuotes] = useState([]);
    const [selectedDateQuotes, setSelectedDateQuotes] = useState([]);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Token no disponible");

                const api = axios.create({
                    baseURL: URI_GET_QUOTES,
                    headers: { Authorization: `Bearer ${token}` },
                });

                const res = await api.get();
                setQuotes(res.data.data);
            } catch (err) {
                console.error("Error al obtener las citas:", err);
            }
        };

        fetchQuotes();
    }, []);

    const handleDateChange = (date) => {
        const selected = new Date(date).toISOString().split("T")[0];
    
        const filtered = quotes
            .filter(q => q.dateAndTimeQuote.startsWith(selected))
            .sort((a, b) => new Date(a.dateAndTimeQuote) - new Date(b.dateAndTimeQuote)); // Orden ascendente
    
        setSelectedDateQuotes(filtered);
    };
    

    return (
        <div className="calendar-container">
            <h2>Calendario de Citas</h2>
            <Calendar onChange={handleDateChange} />
            <div className="quote-list">
                <h3>Citas del día</h3>
                {selectedDateQuotes.length > 0 ? (
                    <ul>
                        {selectedDateQuotes.map((quote) => (
                            <li key={quote.id_quotePK}>
                                👤 {quote.tbl_user?.name} — 🕒 {new Date(quote.dateAndTimeQuote).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </li>
                        ))}
                    </ul>

                ) : (
                    <p>No hay citas para este día.</p>
                )}
            </div>
        </div>
    );
};

export default QuotesCalendar;
