import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';

const ComGestionLotesProd = () => {
    const [numeroLote, setNumeroLote] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("");
    const [estadoLote, setEstadoLote] = useState("En Proceso");
    const [descripcion, setDescripcion] = useState("");
    const [cantidadProducida, setCantidadProducida] = useState("");
    const [idVino, setIdVino] = useState("");
    const [registros, setRegistros] = useState([]);
    const [idLote, setIdLote] = useState(null);

    // Función para limpiar el formulario
    const limpiarFormulario = () => {
        setIdLote(null);
        setNumeroLote("");
        setFechaInicio("");
        setFechaFin("");
        setEstadoLote("En Proceso");
        setDescripcion("");
        setCantidadProducida("");
        setIdVino("");
    };

    // Función para obtener todos los registros de lotes
    const obtenerRegistros = () => {
        axios.get("http://localhost:3001/lotes").then((response) => {
            setRegistros(response.data);
        }).catch((error) => {
            Swal.fire("Error", "Hubo un problema al obtener los registros", "error");
        });
    };

    // Función para crear un nuevo registro
    const crearRegistro = () => {
        if (!numeroLote || !fechaInicio || !cantidadProducida) {
            Swal.fire("Advertencia", "Todos los campos obligatorios deben ser completados", "warning");
            return;
        }

        axios.post("http://localhost:3001/createLote", {
            numero_lote: numeroLote,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            estado_lote: estadoLote,
            descripcion,
            cantidad_producida: cantidadProducida,
            id_vino: idVino
        }).then(() => {
            Swal.fire("Éxito", "El lote ha sido agregado correctamente", "success");
            obtenerRegistros();
            limpiarFormulario();
        }).catch((error) => {
            Swal.fire("Error", "No se pudo agregar el lote", "error");
        });
    };

    // Función para seleccionar un registro y cargarlo en el formulario
    const seleccionarRegistro = (registro) => {
        setIdLote(registro.id_lote);
        setNumeroLote(registro.numero_lote);
        setFechaInicio(registro.fecha_inicio);
        setFechaFin(registro.fecha_fin);
        setEstadoLote(registro.estado_lote);
        setDescripcion(registro.descripcion);
        setCantidadProducida(registro.cantidad_producida);
        setIdVino(registro.id_vino);
    };

    // Función para actualizar un registro
    const actualizarRegistro = () => {
        if (!numeroLote || !fechaInicio || !cantidadProducida) {
            Swal.fire("Advertencia", "Todos los campos obligatorios deben ser completados", "warning");
            return;
        }

        axios.put("http://localhost:3001/updateLote", {
            id_lote: idLote,
            numero_lote: numeroLote,
            fecha_inicio: fechaInicio,
            fecha_fin: fechaFin,
            estado_lote: estadoLote,
            descripcion,
            cantidad_producida: cantidadProducida,
            id_vino: idVino
        }).then(() => {
            Swal.fire("Éxito", "El lote ha sido actualizado correctamente", "success");
            obtenerRegistros();
            limpiarFormulario();
        }).catch((error) => {
            Swal.fire("Error", "No se pudo actualizar el lote", "error");
        });
    };

    // Función para eliminar un registro
    const eliminarRegistro = (id_lote) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¡No podrás revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:3001/deleteLote/${id_lote}`)
                    .then(() => {
                        Swal.fire("Eliminado", "El lote ha sido eliminado", "success");
                        obtenerRegistros();
                    }).catch((error) => {
                        Swal.fire("Error", "No se pudo eliminar el lote", "error");
                    });
            }
        });
    };

    // Cargar registros al iniciar el componente
    useEffect(() => {
        obtenerRegistros();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Gestión de Lotes de Producción</h1>
            <div className="card p-4 mb-4">
                <div className="row">
                    <div className="col-md-6">
                        <label htmlFor="numeroLote">Número de Lote</label>
                        <input
                            type="text"
                            id="numeroLote"
                            className="form-control"
                            value={numeroLote}
                            onChange={(e) => setNumeroLote(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="fechaInicio">Fecha de Inicio</label>
                        <input
                            type="date"
                            id="fechaInicio"
                            className="form-control"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)} />
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-6">
                        <label htmlFor="fechaFin">Fecha de Finalización</label>
                        <input
                            type="date"
                            id="fechaFin"
                            className="form-control"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="estadoLote">Estado del Lote</label>
                        <select
                            id="estadoLote"
                            className="form-control"
                            value={estadoLote}
                            onChange={(e) => setEstadoLote(e.target.value)}>
                            <option value="En Proceso">En Proceso</option>
                            <option value="Completado">Completado</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-6">
                        <label htmlFor="descripcion">Descripción</label>
                        <textarea
                            id="descripcion"
                            className="form-control"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="cantidadProducida">Cantidad Producida</label>
                        <input
                            type="number"
                            id="cantidadProducida"
                            className="form-control"
                            value={cantidadProducida}
                            onChange={(e) => setCantidadProducida(e.target.value)} />
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-6">
                        <label htmlFor="idVino">ID del Vino</label>
                        <input
                            type="number"
                            id="idVino"
                            className="form-control"
                            value={idVino}
                            onChange={(e) => setIdVino(e.target.value)} />
                    </div>
                </div>
                <div className="text-center mt-4">
                    {idLote ? (
                        <>
                            <button className="btn btn-warning me-2" onClick={actualizarRegistro}>
                                Actualizar Lote
                            </button>
                            <button className="btn btn-secondary" onClick={limpiarFormulario}>
                                Cancelar Edición
                            </button>
                        </>
                    ) : (
                        <button className="btn btn-success" onClick={crearRegistro}>
                            Agregar Lote
                        </button>
                    )}
                </div>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Número de Lote</th>
                        <th>Fecha de Inicio</th>
                        <th>Fecha de Fin</th>
                        <th>Estado</th>
                        <th>Cantidad Producida</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {registros.map((registro) => (
                        <tr key={registro.id_lote}>
                            <td>{registro.id_lote}</td>
                            <td>{registro.numero_lote}</td>
                            <td>{registro.fecha_inicio}</td>
                            <td>{registro.fecha_fin || "N/A"}</td>
                            <td>{registro.estado_lote}</td>
                            <td>{registro.cantidad_producida}</td>
                            <td>{registro.descripcion}</td>
                            <td>
                                <button className="btn btn-primary me-2" onClick={() => seleccionarRegistro(registro)}>
                                    Editar
                                </button>
                                <button className="btn btn-danger" onClick={() => eliminarRegistro(registro.id_lote)}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ComGestionLotesProd;