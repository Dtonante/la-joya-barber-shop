import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import axios from "axios";
import "../css/quotes/QuotesCalendarCss.css"; // Podés crear estilos propios

const URI_GET_QUOTES_CALENDAR = "http://localhost:3000/api/v1/quotes/all/calendar";

const QuotesCalendar = () => {
    const [quotes, setQuotes] = useState([]);
    const [selectedDateQuotes, setSelectedDateQuotes] = useState([]);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("Token no disponible");

                const api = axios.create({
                    baseURL: URI_GET_QUOTES_CALENDAR,
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

    const quoteCountsByDate = quotes.reduce((acc, quote) => {
        const date = new Date(quote.dateAndTimeQuote).toLocaleDateString("en-CA");
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});



    const handleDateChange = (date) => {
        const selected = new Date(date).toLocaleDateString("en-CA"); // YYYY-MM-DD

        const filtered = quotes
            .filter((q) => {
                const quoteDate = new Date(q.dateAndTimeQuote).toLocaleDateString("en-CA");
                return quoteDate === selected;
            })
            .sort((a, b) => new Date(a.dateAndTimeQuote) - new Date(b.dateAndTimeQuote));

        setSelectedDateQuotes(filtered);
    };


    return (
        <div className="calendar-container">
            <h2>Calendario de Citas</h2>
            <div className="calendar-wrapper">
                <div className="calendar-legend">
                    <h4>Leyenda</h4>
                    <ul>
                        <li><span className="legend-color orange-day" /> 1 a 5 citas</li>
                        <li><span className="legend-color pink-day" /> 6 a 10 citas</li>
                        <li><span className="legend-color green-day" /> 11 o más citas</li>
                    </ul>
                </div>
    
                <Calendar onChange={handleDateChange}
                    tileClassName={({ date, view }) => {
                        if (view === 'month') {
                            const dateStr = date.toLocaleDateString("en-CA");
                            const count = quoteCountsByDate[dateStr] || 0;
    
                            if (count === 0) return 'yellow-day';
                            if (count >= 1 && count <= 5) return 'orange-day';
                            if (count >= 6 && count <= 10) return 'pink-day';
                            if (count >= 11) return 'green-day';
                        }
                    }} />
            </div>
    
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
    



    // return (
    //     <div className="calendar-container">
    //         <h2>Calendario de Citas</h2>
    //         <Calendar onChange={handleDateChange}
    //             tileClassName={({ date, view }) => {
    //                 if (view === 'month') {
    //                     const dateStr = date.toLocaleDateString("en-CA");
    //                     const count = quoteCountsByDate[dateStr] || 0;

    //                     if (count === 0) return 'yellow-day';
    //                     if (count >= 1 && count <= 5) return 'orange-day';
    //                     if (count >= 6 && count <= 10) return 'pink-day';
    //                     if (count >= 11) return 'green-day';
    //                 }
    //             }} />
    //         <div className="quote-list">
    //             <h3>Citas del día</h3>
    //             {selectedDateQuotes.length > 0 ? (
    //                 <ul>
    //                     {selectedDateQuotes.map((quote) => (
    //                         <li key={quote.id_quotePK}>
    //                             👤 {quote.tbl_user?.name} — 🕒 {new Date(quote.dateAndTimeQuote).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    //                         </li>
    //                     ))}
    //                 </ul>

    //             ) : (
    //                 <p>No hay citas para este día.</p>
    //             )}
    //         </div>
    //     </div>
    // );
};

export default QuotesCalendar;
