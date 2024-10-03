import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';

const ComGestionCompradores = () => {
    const [nombre, setNombre] = useState("");
    const [direccion, setDireccion] = useState("");
    const [historialCompras, setHistorialCompras] = useState("");
    const [compradores, setCompradores] = useState([]);
    const [idComprador, setIdComprador] = useState(null);

    const limpiarFormulario = () => {
        setIdComprador(null);
        setNombre("");
        setDireccion("");
        setHistorialCompras("");
    };

    const obtenerCompradores = () => {
        axios.get("http://localhost:3001/registrosCompradores").then((response) => {
            setCompradores(response.data);
        }).catch((error) => {
            Swal.fire("Error", "Hubo un problema al obtener los compradores", "error");
        });
    };

    const crearComprador = () => {
        if (!nombre || !direccion) {
            Swal.fire("Advertencia", "Los campos nombre y dirección son obligatorios", "warning");
            return;
        }

        axios.post("http://localhost:3001/createComprador", {
            nombre,
            direccion,
            historial_compras: historialCompras
        }).then(() => {
            Swal.fire("Éxito", "El comprador ha sido agregado correctamente", "success");
            obtenerCompradores();
            limpiarFormulario();
        }).catch((error) => {
            Swal.fire("Error", "No se pudo agregar el comprador", "error");
        });
    };

    const seleccionarComprador = (comprador) => {
        setIdComprador(comprador.id);
        setNombre(comprador.nombre);
        setDireccion(comprador.direccion);
        setHistorialCompras(comprador.historial_compras);
    };

    const actualizarComprador = () => {
        if (!nombre || !direccion) {
            Swal.fire("Advertencia", "Los campos nombre y dirección son obligatorios", "warning");
            return;
        }

        axios.put("http://localhost:3001/updateComprador", {
            id: idComprador,
            nombre,
            direccion,
            historial_compras: historialCompras
        }).then(() => {
            Swal.fire("Éxito", "El comprador ha sido actualizado correctamente", "success");
            obtenerCompradores();
            limpiarFormulario();
        }).catch((error) => {
            Swal.fire("Error", "No se pudo actualizar el comprador", "error");
        });
    };

    const eliminarComprador = (id) => {
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
                axios.delete(`http://localhost:3001/deleteComprador/${id}`)
                    .then(() => {
                        Swal.fire("Eliminado", "El comprador ha sido eliminado", "success");
                        obtenerCompradores();
                    }).catch((error) => {
                        Swal.fire("Error", "No se pudo eliminar el comprador", "error");
                    });
            }
        });
    };

    useEffect(() => {
        obtenerCompradores();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Gestión de Compradores</h1>
            <div className="card p-4 mb-4">
                <div className="row">
                    <div className="col-md-6">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            type="text"
                            id="nombre"
                            className="form-control"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="direccion">Dirección</label>
                        <input
                            type="text"
                            id="direccion"
                            className="form-control"
                            value={direccion}
                            onChange={(e) => setDireccion(e.target.value)} />
                    </div>
                </div>
                <div className="row mt-3">
                    <div className="col-md-12">
                        <label htmlFor="historialCompras">Historial de Compras</label>
                        <textarea
                            id="historialCompras"
                            className="form-control"
                            value={historialCompras}
                            onChange={(e) => setHistorialCompras(e.target.value)} />
                    </div>
                </div>
                <div className="text-center mt-4">
                    {idComprador ? (
                        <>
                            <button className="btn btn-warning me-2" onClick={actualizarComprador}>
                                Actualizar Comprador
                            </button>
                            <button className="btn btn-secondary" onClick={limpiarFormulario}>
                                Cancelar Edición
                            </button>
                        </>
                    ) : (
                        <button className="btn btn-success" onClick={crearComprador}>
                            Agregar Comprador
                        </button>
                    )}
                </div>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Dirección</th>
                        <th>Historial de Compras</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {compradores.map((comprador) => (
                        <tr key={comprador.id}>
                            <td>{comprador.id}</td>
                            <td>{comprador.nombre}</td>
                            <td>{comprador.direccion}</td>
                            <td>{comprador.historial_compras || "N/A"}</td>
                            <td>
                                <button className="btn btn-primary me-2" onClick={() => seleccionarComprador(comprador)}>
                                    Editar
                                </button>
                                <button className="btn btn-danger" onClick={() => eliminarComprador(comprador.id)}>
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

export default ComGestionCompradores;