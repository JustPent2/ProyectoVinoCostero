import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';

const ComGestionLogistica = () => {
    const [insumo, setInsumo] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [proveedor, setProveedor] = useState("");
    const [requerimientos, setRequerimientos] = useState([]);
    const [idRequerimiento, setIdRequerimiento] = useState(null);

    const limpiarFormulario = () => {
        setIdRequerimiento(null);
        setInsumo("");
        setCantidad("");
        setProveedor("");
    };

    const obtenerRequerimientos = () => {
        axios.get("http://localhost:3001/registrosRequerimientos").then((response) => {
            setRequerimientos(response.data);
        }).catch((error) => {
            Swal.fire("Error", "Hubo un problema al obtener los requerimientos", "error");
        });
    };

    const crearRequerimiento = () => {
        if (!insumo || !cantidad || !proveedor) {
            Swal.fire("Advertencia", "Todos los campos son obligatorios", "warning");
            return;
        }

        axios.post("http://localhost:3001/createRequerimiento", {
            insumo,
            cantidad,
            proveedor
        }).then(() => {
            Swal.fire("Éxito", "El requerimiento ha sido agregado correctamente", "success");
            obtenerRequerimientos();
            limpiarFormulario();
        }).catch((error) => {
            Swal.fire("Error", "No se pudo agregar el requerimiento", "error");
        });
    };

    const seleccionarRequerimiento = (requerimiento) => {
        setIdRequerimiento(requerimiento.id);
        setInsumo(requerimiento.insumo);
        setCantidad(requerimiento.cantidad);
        setProveedor(requerimiento.proveedor);
    };

    const actualizarRequerimiento = () => {
        if (!insumo || !cantidad || !proveedor) {
            Swal.fire("Advertencia", "Todos los campos son obligatorios", "warning");
            return;
        }

        axios.put("http://localhost:3001/updateRequerimiento", {
            id: idRequerimiento,
            insumo,
            cantidad,
            proveedor
        }).then(() => {
            Swal.fire("Éxito", "El requerimiento ha sido actualizado correctamente", "success");
            obtenerRequerimientos();
            limpiarFormulario();
        }).catch((error) => {
            Swal.fire("Error", "No se pudo actualizar el requerimiento", "error");
        });
    };

    const eliminarRequerimiento = (id) => {
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
                axios.delete(`http://localhost:3001/deleteRequerimiento/${id}`)
                    .then(() => {
                        Swal.fire("Eliminado", "El requerimiento ha sido eliminado", "success");
                        obtenerRequerimientos();
                    }).catch((error) => {
                        Swal.fire("Error", "No se pudo eliminar el requerimiento", "error");
                    });
            }
        });
    };

    useEffect(() => {
        obtenerRequerimientos();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Gestión de Logística de Requerimientos</h1>
            <div className="card p-4 mb-4">
                <div className="row">
                    <div className="col-md-4">
                        <label htmlFor="insumo">Insumo</label>
                        <input
                            type="text"
                            id="insumo"
                            className="form-control"
                            value={insumo}
                            onChange={(e) => setInsumo(e.target.value)} />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="cantidad">Cantidad</label>
                        <input
                            type="number"
                            id="cantidad"
                            className="form-control"
                            value={cantidad}
                            onChange={(e) => setCantidad(e.target.value)} />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="proveedor">Proveedor</label>
                        <input
                            type="text"
                            id="proveedor"
                            className="form-control"
                            value={proveedor}
                            onChange={(e) => setProveedor(e.target.value)} />
                    </div>
                </div>
                <div className="text-center mt-4">
                    {idRequerimiento ? (
                        <>
                            <button className="btn btn-warning me-2" onClick={actualizarRequerimiento}>
                                Actualizar Requerimiento
                            </button>
                            <button className="btn btn-secondary" onClick={limpiarFormulario}>
                                Cancelar Edición
                            </button>
                        </>
                    ) : (
                        <button className="btn btn-success" onClick={crearRequerimiento}>
                            Agregar Requerimiento
                        </button>
                    )}
                </div>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Insumo</th>
                        <th>Cantidad</th>
                        <th>Proveedor</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {requerimientos.map((requerimiento) => (
                        <tr key={requerimiento.id}>
                            <td>{requerimiento.id}</td>
                            <td>{requerimiento.insumo}</td>
                            <td>{requerimiento.cantidad}</td>
                            <td>{requerimiento.proveedor}</td>
                            <td>
                                <button className="btn btn-primary me-2" onClick={() => seleccionarRequerimiento(requerimiento)}>
                                    Editar
                                </button>
                                <button className="btn btn-danger" onClick={() => eliminarRequerimiento(requerimiento.id)}>
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

export default ComGestionLogistica;