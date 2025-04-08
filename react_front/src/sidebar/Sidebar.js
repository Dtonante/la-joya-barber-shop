
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../css/sidebar/SidebarCss.css";
import { FaHome, FaUser, FaCalendarAlt, FaSignOutAlt, FaClipboard } from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const role = localStorage.getItem("rol");

    // Todos los ítems posibles
    const allNavItems = [
        { to: "/homeClients", label: "Inicio", icon: <FaHome /> },
        { to: "/listUsers", label: "Usuarios", icon: <FaUser /> },
        { to: "/listQuotes", label: "Citas", icon: <FaCalendarAlt /> },
        { to: "/createQuote", label: "Agendar Cita", icon: <FaClipboard /> },
        {
            to: "/",
            label: "Cerrar sesión",
            icon: <FaSignOutAlt />,
            action: () => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                localStorage.removeItem("name_user");
                localStorage.removeItem("rol");
                navigate("/");
            },
        },
    ];

    let filteredNavItems = [];

    if (role === "1") {
        filteredNavItems = allNavItems.filter(item => item.label !== "Agendar Cita");
    } else if (role === "2") {
        filteredNavItems = allNavItems.filter(item => item.label !== "Usuarios" && item.label !== "Citas");
    } else {
        filteredNavItems = []; // mostrar todos por defecto
    }


    return (
        <>
            {/* Solo mostrar el botón fuera cuando el sidebar está cerrado */}
            {!isOpen && (
                <button className="toggle-btn" onClick={toggleSidebar}>
                    ☰
                </button>
            )}

            <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
                {/* Mostrar la X dentro del sidebar cuando está abierto */}
                {isOpen && (
                    <button className="toggle-btn close-btn" onClick={toggleSidebar}>
                        ❌
                    </button>
                    
                )}
                <nav className="nav-links"><br/><br/>
                    {filteredNavItems.map(({ to, label, icon, action }) => (
                        <Link
                            key={label}
                            to={to}
                            className={`nav-item ${location.pathname === to ? "active" : ""}`}
                            onClick={action}
                            title={!isOpen ? label : undefined}
                        >
                            <span className="icon">{icon}</span>
                            {isOpen && <span className="label">{label}</span>}
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    );


};

export default Sidebar;
