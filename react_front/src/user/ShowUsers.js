import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const URI_USERS = "http://localhost:3000/api/v1/users";


const CompShowUser = () => {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagina, setPagina] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);

    // Filtros
    const [filtroCampo, setFiltroCampo] = useState(""); // 'email' o 'name'
    const [filtroValor, setFiltroValor] = useState(""); // Valor del filtro

    useEffect(() => {
        getUser();
    }, [pagina]); // Se recarga cuando cambian estos valores

    // Obtener datos con filtros y paginación
    const getUser = async () => {
        setLoading(true);
        setError(null);



        try {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("Token no disponible");
            }

            // Configurar una instancia de axios con el token
            const api = axios.create({
                baseURL: URI_USERS,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            let url = `?page=${pagina}`;

            // Agregar filtros si están seleccionados
            if (filtroCampo && filtroValor) {
                url += `&${filtroCampo}=${encodeURIComponent(filtroValor)}`;
            }

            const res = await api.get(url);

            if (res.data && Array.isArray(res.data.data)) {
                setUser(res.data.data);
                setTotalPaginas(res.data.totalPaginas);
            } else {
                throw new Error("Formato de respuesta incorrecto");
            }
        } catch (err) {
            console.error("Error al obtener datos:", err);
            setError("Error al cargar datos");
        } finally {
            setLoading(false);
        }
    };

    // Limpiar filtros
    const limpiarFiltros = () => {
        setFiltroCampo("");
        setFiltroValor("");
        setPagina(1);
    };

    // Cambiar de página
    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina > 0 && nuevaPagina <= totalPaginas) {
            setPagina(nuevaPagina);
        }
    };

    if (loading) return <p>Cargando datos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="container">
            <div className="row">
                <div className="col">

                    {/* Filtros */}
                    <div className="filter-container mb-3">
                        <select className="form-select" value={filtroCampo} onChange={(e) => setFiltroCampo(e.target.value)}>
                            <option value="">Selecciona un campo</option>
                            <option value="email">Email</option>
                            <option value="name">Nombre</option>
                        </select>

                        <input
                            type="text"
                            className="form-control"
                            placeholder="Valor a filtrar"
                            value={filtroValor}
                            onChange={(e) => setFiltroValor(e.target.value)}
                            disabled={!filtroCampo} // Deshabilitar si no hay campo seleccionado
                        />

                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setPagina(1);
                                getUser(); // Llama manualmente a la función
                            }}
                            disabled={!filtroCampo || !filtroValor}
                        >
                            Filtrar
                        </button>


                        <button className="btn btn-secondary" onClick={limpiarFiltros} disabled={!filtroCampo && !filtroValor}>
                            Limpiar
                        </button>
                    </div>

                    {/* Tabla */}
                    <table className="table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.length > 0 ? (
                                user.map((usuario) => (
                                    <tr key={usuario.id_userPK}>
                                        <td>{usuario.id_userPK}</td>
                                        <td>{usuario.name}</td>
                                        <td>{usuario.email}</td>
                                        <td>
                                            <Link to={`/editar/${usuario.id_userPK}`} className="btn btn-info">Editar</Link>
                                            {/* <button onClick={() => deleteUser(usuario.id_userPK)} className="btn btn-danger">Eliminar</button> */}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No hay usuarios registrados</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Controles de paginación */}
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
            </div>
        </div>
    );
};

export default CompShowUser;
