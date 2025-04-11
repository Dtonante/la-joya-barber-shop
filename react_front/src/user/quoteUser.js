import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../sidebar/Sidebar"; // Asegúrate de que la ruta es correcta

const CompShowCitasUsuario = () => {
    const [citas, setCitas] = useState([]);
    const [sidebarAbierto, setSidebarAbierto] = useState(true);
    const toggleSidebar = () => setSidebarAbierto(!sidebarAbierto);

    const id_userFK = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchCitas = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/v1/quotes/all/${id_userFK}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setCitas(response.data);
            } catch (error) {
                console.error("Error al obtener las citas:", error);
            }
        };

        if (id_userFK && token) {
            fetchCitas();
        }
    }, [id_userFK, token]);

    const formatDate = (isoDate) => {
        const date = new Date(isoDate);
        return date.toLocaleString("es-CO", {
            dateStyle: "short",
            timeStyle: "short",
        });
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
                <h2>Mis Citas</h2>
                <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", textAlign: "left" }}>
                    <thead>
                        <tr>
                            <th>ID Cita</th>
                            <th>Fecha y Hora</th>
                        </tr>
                    </thead>
                    <tbody>
                        {citas.length > 0 ? (
                            citas.map((cita) => (
                                <tr key={cita.id_quotePK}>
                                    <td>{cita.id_quotePK}</td>
                                    <td>{formatDate(cita.dateAndTimeQuote)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2">No hay citas registradas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompShowCitasUsuario;
