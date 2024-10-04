import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';

function ComGestionRoles() {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [nuevoRol, setNuevoRol] = useState('');

  // Cargar los usuarios desde la base de datos
  useEffect(() => {
    axios.get('http://localhost:3001/usuarios')
      .then((response) => {
        setUsuarios(response.data);
      })
      .catch((error) => {
        console.error('Error al obtener los usuarios:', error);
      });
  }, []);

  // Manejar la gestión de un usuario
  const gestionarUsuario = (usuario) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas gestionar el rol de ${usuario.nombre_usuario}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, gestionar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setUsuarioSeleccionado(usuario);
        setNuevoRol(usuario.rol); // Inicializa el rol actual
      }
    });
  };

  // Función para actualizar el rol del usuario
  const actualizarRol = (idUsuario) => {
    const rolesMap = {
      'Administrador': 1,
      'Operario': 2,
      'Analista': 3
    };
    const id_rol = rolesMap[nuevoRol];
  
    if (!id_rol) {
      Swal.fire('Error', 'Por favor selecciona un rol válido.', 'error');
      return;
    }
  
    axios.put(`http://localhost:3001/actualizar_rol/${idUsuario}`, {
      id_rol: id_rol
    })
      .then(() => {
        Swal.fire('Actualizado', `El rol ha sido actualizado a ${nuevoRol}.`, 'success');
        // Actualizar la lista de usuarios localmente
        setUsuarios((prevUsuarios) => 
          prevUsuarios.map((user) =>
            user.id_usuario === idUsuario ? { ...user, rol: nuevoRol } : user
          )
        );
        // Limpiar la selección
        setUsuarioSeleccionado(null);
      })
      .catch((error) => {
        console.error('Error al actualizar el rol:', error);
        Swal.fire('Error', 'Hubo un error al actualizar el rol.', 'error');
      });
  };

  return (
    <div className="container">
      <h1 className="text-center mb-4">Gestión de Roles de Usuario</h1>
      {/* Tabla de usuarios */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID Usuario</th>
            <th>Nombre</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Rol Actual</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id_usuario}>
              <td>{usuario.id_usuario}</td>
              <td>{usuario.nombre_usuario}</td>
              <td>{usuario.correo_electronico}</td>
              <td>{usuario.numero_telefono}</td>
              <td>{usuario.rol}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => gestionarUsuario(usuario)}>
                  Gestionar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Sección de gestión de usuario */}
      {usuarioSeleccionado && (
        <div className="card p-4 mb-4">
          <h3 className="text-center">Asignar Nuevo Rol</h3>
          <div className="form-group">
            <label>Nombre Usuario:</label>
            <input
              type="text"
              className="form-control"
              value={usuarioSeleccionado.nombre_usuario}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Correo Electrónico:</label>
            <input
              type="text"
              className="form-control"
              value={usuarioSeleccionado.correo_electronico}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Rol Actual:</label>
            <input
              type="text"
              className="form-control"
              value={usuarioSeleccionado.rol}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Nuevo Rol:</label>
            <select
            className="form-control"
            value={nuevoRol}
            onChange={(e) => setNuevoRol(e.target.value)}>
            <option value="">Seleccionar Rol</option>
            <option value="Administrador">Administrador</option>
            <option value="Operario">Operario</option>
            <option value="Analista">Analista</option>
            </select>
          </div>

          {/* Botones de acción */}
          <div className="text-center mt-3">
            <button
              className="btn btn-success mx-2"
              onClick={() => actualizarRol(usuarioSeleccionado.id_usuario)}>
              Actualizar Rol
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComGestionRoles;