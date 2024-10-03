import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import 'bootstrap/dist/css/bootstrap.min.css';

const ComGestionProdVinos = () => {
  const [nombreVino, setNombreVino] = useState("");
  const [tipoVino, setTipoVino] = useState("");
  const [cantidadProducida, setCantidadProducida] = useState("");
  const [fechaProduccion, setFechaProduccion] = useState("");
  const [estadoLote, setEstadoLote] = useState("En Proceso");
  const [descripcion, setDescripcion] = useState("");
  const [precioUnitario, setPrecioUnitario] = useState("");
  const [registros, setRegistros] = useState([]);
  const [idLote, setIdLote] = useState(null);

  // Función para limpiar los campos del formulario
  const limpiarFormulario = () => {
    setIdLote(null);
    setNombreVino("");
    setTipoVino("");
    setCantidadProducida("");
    setFechaProduccion("");
    setEstadoLote("En Proceso");
    setDescripcion("");
    setPrecioUnitario("");
  };

  // Función para obtener todos los registros de produccion_vinos
  const obtenerRegistros = () => {
    axios.get("http://localhost:3001/registrosProduccion").then((response) => {
        setRegistros(response.data);
      })
      .catch((error) => {
        Swal.fire("Error", "Hubo un problema al obtener los registros", "error");
      });
  };

  // Función para crear un nuevo registro de producción
  const crearRegistro = () => {
    if (!nombreVino || !tipoVino || !cantidadProducida || !fechaProduccion) {
      Swal.fire("Advertencia", "Todos los campos son obligatorios", "warning");
      return;
    }

    axios.post("http://localhost:3001/createProduccion", {
        nombre_vino: nombreVino,
        tipo_vino: tipoVino,
        cantidad_producida: cantidadProducida,
        fecha_produccion: fechaProduccion,
        estado_lote: estadoLote,
        descripcion,
        precio_unitario: precioUnitario
      }).then(() => {
        Swal.fire("Éxito", "El lote de vino ha sido agregado", "success");
        obtenerRegistros(); // Actualizamos la tabla
        limpiarFormulario();
      }).catch((error) => {
        Swal.fire("Error", "No se pudo agregar el lote", "error");
      });
  };

  // Función para seleccionar un registro y cargarlo en el formulario
  const seleccionarRegistro = (registro) => {
    setIdLote(registro.id_lote);
    setNombreVino(registro.nombre_vino);
    setTipoVino(registro.tipo_vino);
    setCantidadProducida(registro.cantidad_producida);
    setFechaProduccion(registro.fecha_produccion);
    setEstadoLote(registro.estado_lote);
    setDescripcion(registro.descripcion);
    setPrecioUnitario(registro.precio_unitario);
  };

  // Función para actualizar un registro
  const actualizarRegistro = () => {
    if (!nombreVino || !tipoVino || !cantidadProducida || !fechaProduccion) {
      Swal.fire("Advertencia", "Todos los campos son obligatorios", "warning");
      return;
    }

    axios.put("http://localhost:3001/updateProduccion", {
        id_lote: idLote,
        nombre_vino: nombreVino,
        tipo_vino: tipoVino,
        cantidad_producida: cantidadProducida,
        fecha_produccion: fechaProduccion,
        estado_lote: estadoLote,
        descripcion,
        precio_unitario: precioUnitario
      }).then(() => {
        Swal.fire("Éxito", "El lote de vino ha sido actualizado", "success");
        obtenerRegistros();
        limpiarFormulario();
      }).catch((error) => {
        Swal.fire("Error", "No se pudo actualizar el lote", "error");
      });
  };

  // Función para eliminar un registro
  const eliminarRegistro = (idLote) => {
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
        axios
          .delete(`http://localhost:3001/deleteProduccion/${idLote}`)
          .then(() => {
            Swal.fire("Eliminado", "El lote de vino ha sido eliminado", "success");
            obtenerRegistros();
          })
          .catch((error) => {
            Swal.fire("Error", "No se pudo eliminar el lote", "error");
          });
      }
    });
  };

  // Cargar registros al iniciar
  useEffect(() => {
    obtenerRegistros();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Gestión de Producción de Vinos</h1>
      <div className="card p-4 mb-4">
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="nombreVino">Nombre del Vino</label>
            <input
              type="text"
              id="nombreVino"
              className="form-control"
              value={nombreVino}
              onChange={(e) => setNombreVino(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label htmlFor="tipoVino">Tipo de Vino</label>
            <input
              type="text"
              id="tipoVino"
              className="form-control"
              value={tipoVino}
              onChange={(e) => setTipoVino(e.target.value)} />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <label htmlFor="cantidadProducida">Cantidad Producida (Litros)</label>
            <input
              type="number"
              id="cantidadProducida"
              className="form-control"
              value={cantidadProducida}
              onChange={(e) => setCantidadProducida(e.target.value)} />
          </div>
          <div className="col-md-6">
            <label htmlFor="fechaProduccion">Fecha de Producción</label>
            <input
              type="date"
              id="fechaProduccion"
              className="form-control"
              value={fechaProduccion}
              onChange={(e) => setFechaProduccion(e.target.value)} />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <label htmlFor="estadoLote">Estado del Lote</label>
            <select
              id="estadoLote"
              className="form-control"
              value={estadoLote}
              onChange={(e) => setEstadoLote(e.target.value)}>
              <option value="En Proceso">En Proceso</option>
              <option value="Terminado">Terminado</option>
              <option value="Distribuido">Distribuido</option>
            </select>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-12">
            <label htmlFor="descripcion">Descripción</label>
            <textarea
              id="descripcion"
              className="form-control"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)} />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <label htmlFor="precioUnitario">Precio Unitario</label>
            <input
              type="number"
              id="precioUnitario"
              className="form-control"
              value={precioUnitario}
              onChange={(e) => setPrecioUnitario(e.target.value)} />
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
            <th>Nombre del Vino</th>
            <th>Tipo de Vino</th>
            <th>Cantidad Producida (L)</th>
            <th>Fecha de Producción</th>
            <th>Estado del Lote</th>
            <th>Precio Unitario</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro, index) => (
            <tr key={registro.id_lote}>
              <td>{index + 1}</td>
              <td>{registro.nombre_vino}</td>
              <td>{registro.tipo_vino}</td>
              <td>{registro.cantidad_producida}</td>
              <td>{registro.fecha_produccion}</td>
              <td>{registro.estado_lote}</td>
              <td>Q{registro.precio_unitario}</td>
              <td>
                <div className="btn-group" role="group" aria-label="Basic example">
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => seleccionarRegistro(registro)}>
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => eliminarRegistro(registro.id_lote)}>
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComGestionProdVinos;