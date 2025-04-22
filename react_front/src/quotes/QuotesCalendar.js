import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import axios from "axios";
import "../css/quotes/QuotesCalendarCss.css";
import { Box, Typography, Paper, Grid, List, ListItem, ListItemText } from "@mui/material";

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
        <Box
            sx={{
                maxWidth: 900,
                margin: "10px auto",
                padding: 3,
                display: "flex",
                flexDirection: "column",
                gap: 3
            }}
        >
            <Typography variant="h4" align="center" gutterBottom>
                Calendario de Citas
            </Typography>

            <Grid
                container
                spacing={2}
                justifyContent="center"
                alignItems="flex-start"
            >
                {/* Leyenda */}
                <Grid item xs={12} sm={4}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Leyenda
                        </Typography>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            <li style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                                <span className="legend-color orange-day" /> 1 a 5 citas
                            </li>
                            <li style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                                <span className="legend-color pink-day" /> 6 a 10 citas
                            </li>
                            <li style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                                <span className="legend-color green-day" /> 11 o más citas
                            </li>
                        </ul>
                    </Paper>
                </Grid>

                {/* Calendario */}
                <Grid item xs={12} sm={8}>
                    <Paper elevation={3} sx={{ padding: 2 }}>
                        <Calendar
                            onChange={handleDateChange}
                            tileClassName={({ date, view }) => {
                                if (view === "month") {
                                    const dateStr = date.toLocaleDateString("en-CA");
                                    const count = quoteCountsByDate[dateStr] || 0;

                                    if (count === 0) return "yellow-day";
                                    if (count >= 1 && count <= 5) return "orange-day";
                                    if (count >= 6 && count <= 10) return "pink-day";
                                    if (count >= 11) return "green-day";
                                }
                            }}
                        />
                    </Paper>
                </Grid>
            </Grid>

            {/* Lista de Citas del Día */}
            <Box mt={4}>
                <Typography variant="h5" gutterBottom>
                    Citas del día
                </Typography>

                {selectedDateQuotes.length > 0 ? (
                    <Paper elevation={2} sx={{ padding: 2 }}>
                        <List>
                            {selectedDateQuotes.map((quote) => (
                                <ListItem key={quote.id_quotePK}>
                                    <ListItemText
                                        primary={`👤 ${quote.tbl_user?.name}`}
                                        secondary={`🕒 ${new Date(quote.dateAndTimeQuote).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                ) : (
                    <Typography variant="body1">No hay citas para este día.</Typography>
                )}
            </Box>
        </Box>
    );


    // return (
    //     <Box
    //         sx={{
    //             maxWidth: 900,
    //             margin: "30px auto",
    //             padding: 3,
    //         }}
    //     >
    //         <Typography variant="h4" align="center" gutterBottom>
    //             Calendario de Citas
    //         </Typography>

    //         <Grid
    //             container
    //             spacing={2}
    //             justifyContent="center"
    //             alignItems="flex-start"
    //         >
    //             {/* Leyenda */}
    //             <Grid item xs={12} md={4}>
    //                 <Paper elevation={3} sx={{ padding: 2 }}>
    //                     <Typography variant="h6" gutterBottom>
    //                         Leyenda
    //                     </Typography>
    //                     <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
    //                         <li style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
    //                             <span className="legend-color orange-day" /> 1 a 5 citas
    //                         </li>
    //                         <li style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
    //                             <span className="legend-color pink-day" /> 6 a 10 citas
    //                         </li>
    //                         <li style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
    //                             <span className="legend-color green-day" /> 11 o más citas
    //                         </li>
    //                     </ul>
    //                 </Paper>
    //             </Grid>

    //             {/* Calendario */}
    //             <Grid item xs={12} md={8}>
    //                 <Paper elevation={3} sx={{ padding: 2 }}>
    //                     <Calendar
    //                         onChange={handleDateChange}
    //                         tileClassName={({ date, view }) => {
    //                             if (view === "month") {
    //                                 const dateStr = date.toLocaleDateString("en-CA");
    //                                 const count = quoteCountsByDate[dateStr] || 0;

    //                                 if (count === 0) return "yellow-day";
    //                                 if (count >= 1 && count <= 5) return "orange-day";
    //                                 if (count >= 6 && count <= 10) return "pink-day";
    //                                 if (count >= 11) return "green-day";
    //                             }
    //                         }}
    //                     />
    //                 </Paper>
    //             </Grid>
    //         </Grid>

    //         {/* Lista de Citas del Día */}
    //         <Box mt={4}>
    //             <Typography variant="h5" gutterBottom>
    //                 Citas del día
    //             </Typography>

    //             {selectedDateQuotes.length > 0 ? (
    //                 <Paper elevation={2} sx={{ padding: 2 }}>
    //                     <List>
    //                         {selectedDateQuotes.map((quote) => (
    //                             <ListItem key={quote.id_quotePK}>
    //                                 <ListItemText
    //                                     primary={`👤 ${quote.tbl_user?.name}`}
    //                                     secondary={`🕒 ${new Date(quote.dateAndTimeQuote).toLocaleTimeString([], {
    //                                         hour: "2-digit",
    //                                         minute: "2-digit",
    //                                     })}`}
    //                                 />
    //                             </ListItem>
    //                         ))}
    //                     </List>
    //                 </Paper>
    //             ) : (
    //                 <Typography variant="body1">No hay citas para este día.</Typography>
    //             )}
    //         </Box>
    //     </Box>
    // );

    // return (
    //     <div className="calendar-container">
    //         <h2>Calendario de Citas</h2>
    //         <div className="calendar-wrapper">
    //             <div className="calendar-legend">
    //                 <h4>Leyenda</h4>
    //                 <ul>
    //                     <li><span className="legend-color orange-day" /> 1 a 5 citas</li>
    //                     <li><span className="legend-color pink-day" /> 6 a 10 citas</li>
    //                     <li><span className="legend-color green-day" /> 11 o más citas</li>
    //                 </ul>
    //             </div>

    //             <Calendar onChange={handleDateChange}
    //                 tileClassName={({ date, view }) => {
    //                     if (view === 'month') {
    //                         const dateStr = date.toLocaleDateString("en-CA");
    //                         const count = quoteCountsByDate[dateStr] || 0;

    //                         if (count === 0) return 'yellow-day';
    //                         if (count >= 1 && count <= 5) return 'orange-day';
    //                         if (count >= 6 && count <= 10) return 'pink-day';
    //                         if (count >= 11) return 'green-day';
    //                     }
    //                 }} />
    //         </div>

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
