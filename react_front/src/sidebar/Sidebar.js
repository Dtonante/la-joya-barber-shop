import React from "react";
import { Link } from "react-router-dom";
import "../css/sidebar/SidebarCss.css";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
            <button className="toggle-btn" onClick={toggleSidebar}>
                {isOpen ? "❌" : "☰"}
            </button>
            {isOpen && (
                <nav className="nav-links">
                    <Link to="/">🏠 Inicio</Link>
                    <Link to="/listUsers">👤 Usuarios</Link>
                    <Link to="/listQuotes">📅 Citas</Link>
                    <Link to="/" onClick={() => {
                        localStorage.removeItem("token");
                    }}>🔒 Cerrar sesión</Link>
                </nav>
            )}
        </div>
    );
};

export default Sidebar;

