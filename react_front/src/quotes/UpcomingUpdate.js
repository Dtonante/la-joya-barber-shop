import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar.js";
import QuotesCalendar from "./QuotesCalendar.js";
import "../css/user/ShowUsersCss.css";
import CancelButtonQuote from "../components/cancelButtonQuote/CancelButtonQuote.js";

const URI_QUOTES_UPCOMING_UPDATE = "http://localhost:3000/api/v1/quotes/upcoming/update";

const CompShowQuotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [filtroCampo, setFiltroCampo] = useState("");
    const [filtroValor, setFiltroValor] = useState("");
    const [sidebarAbierto, setSidebarAbierto] = useState(true);
    const toggleSidebar = () => setSidebarAbierto(!sidebarAbierto);

    useEffect(() => {
        getQuotes();
    }, [pagina, filtroCampo]);

    const getQuotes = async () => {
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token no disponible");

            const api = axios.create({
                baseURL: URI_QUOTES_UPCOMING_UPDATE,
                headers: { Authorization: `Bearer ${token}` },
            });

            let url = `?page=${pagina}`;
            if (filtroCampo && filtroValor) {
                url += `&${filtroCampo}=${encodeURIComponent(filtroValor)}`;
            }

            const res = await api.get(url);
            if (res.data && Array.isArray(res.data.data)) {
                setQuotes(res.data.data);
                setTotalPaginas(res.data.totalPaginas);
            } else {
                throw new Error("Formato de respuesta incorrecto");
            }
        } catch (err) {
            console.error("Error al obtener citas:", err);
            setError("Error al cargar las citas");
        } finally {
            setLoading(false);
        }
    };

    const limpiarFiltros = () => {
        setFiltroCampo("");
        setFiltroValor("");
        setPagina(1);
    };

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
            setPagina(nuevaPagina);
        }
    };

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ display: "flex" }} className="je">
            <Sidebar isOpen={sidebarAbierto} toggleSidebar={toggleSidebar} />
            <div style={{
                marginLeft: sidebarAbierto ? "200px" : "0px",
                transition: "margin-left 0.3s",
                padding: "20px",
                width: "100%"
            }}>
                <div className="container">
                    <div className="row">
                        <div className="col">
                            {/* Filtros */}
                            <div className="filter-container mb-3">
                                <select className="form-select" value={filtroCampo} onChange={(e) => setFiltroCampo(e.target.value)}>
                                    <option value="">Selecciona un campo</option>
                                    <option value="id_userFK">ID Usuario</option>
                                    <option value="dateAndTimeQuote">Fecha</option>
                                    <option value="name">Nombre</option>
                                </select>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Valor a filtrar"
                                    value={filtroValor}
                                    onChange={(e) => setFiltroValor(e.target.value)}
                                    disabled={!filtroCampo}
                                />

                                <button
                                    className="btn btn-primary"
                                    onClick={() => {
                                        setPagina(1);
                                        getQuotes();
                                    }}
                                    disabled={!filtroCampo || !filtroValor}
                                >
                                    Filtrar
                                </button>

                                <button
                                    className="btn btn-secondary"
                                    onClick={limpiarFiltros}
                                    disabled={!filtroCampo && !filtroValor}
                                >
                                    Limpiar
                                </button>
                            </div>



                            <div className="table-responsive">
                                {/* Tabla de citas */}
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Fecha y Hora</th>
                                            <th>Nombre del Usuario</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {quotes.length > 0 ? (
                                            quotes.map((quote) => (
                                                <tr key={quote.id_quotePK}>
                                                    <td>{quote.tbl_user?.name || "Sin nombre"}</td>
                                                    <td>{new Date(quote.dateAndTimeQuote).toLocaleString()}</td>
                                                    <td>
                                                        <Link to={`/editar-cita/${quote.id_quotePK}`} className="btn btn-info">
                                                            Editar
                                                        </Link>

                                                        {quote.status === "activa" && (
                                                            <CancelButtonQuote
                                                                idQuote={quote.id_quotePK}
                                                                onCancelSuccess={() => getQuotes()}
                                                            />
                                                        )}

                                                    </td>

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4">No hay citas registradas</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                            </div>

                            {/* Paginación */}
                            <div className="pagination">
                                <button onClick={() => cambiarPagina(pagina - 1)} disabled={pagina === 1}>
                                    Anterior
                                </button>
                                <span>
                                    Página {pagina} de {totalPaginas}
                                </span>
                                <button onClick={() => cambiarPagina(pagina + 1)} disabled={pagina === totalPaginas}>
                                    Siguiente
                                </button>
                            </div>
                        </div>
                        <QuotesCalendar />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompShowQuotes;
