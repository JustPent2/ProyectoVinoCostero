import React from 'react';
import { useState } from "react";
import { useEffect } from "react";
import Axios from "axios";
// Estilos a Utilizar
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import '../Styles/GeneralStyle.css';

function ComGestionUsuarios() {

  const [nombre, setNombre] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [correo, setCorreo] = useState("");
  const [numero, setNumero] = useState("");
  const [id, setId] = useState(0);

  const [editar, setEditar] = useState(false);

  const [registrosList, setRegistros] = useState([]);

  const add = ()=>{
    Axios.post("http://localhost:3001/create",{
      nombre:nombre,
      contrasenia:contrasenia,
      correo:correo,
      numero:numero,
    }).then(()=>{
      getRegistros();
      limpiar();
      Swal.fire({
        title: "<strong>Registro Creado</strong>",
        text: "El Registro se guardo correctamente",
        icon: 'success',
        confirmButtonText: 'Continuar'
      })
    }).catch(function(error){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se logro crear el registro",
        footer: JSON.parse(JSON.stringify(error)).message
      });
    });
  };

  const update = () => {
    const data = {
        id: id,
        nombre: nombre,
        correo: correo,
        numero: numero,
    };

    // Solo actualizar la contraseña si el usuario ingresó una nueva
    if (contrasenia) {
        data.contrasenia = contrasenia;
    }

    Axios.put("http://localhost:3001/update", data)
    .then(() => {
        getRegistros();
        limpiar();
        Swal.fire({
            title: "<strong>Registro Modificado</strong>",
            text: "El Registro se modificó correctamente",
            icon: 'success',
            confirmButtonText: 'Continuar'
        });
    }).catch(function(error) {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se logró modificar el registro",
            footer: JSON.parse(JSON.stringify(error)).message
        });
    });
  };

  const deleteRegistro = (val)=>{

    Swal.fire({
      title: "Confirmar Eliminado?",
      text: "¿Desea eliminar el registro de "+val.nombre_usuario+"?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar"
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`http://localhost:3001/delete/${val.id_usuario}`).then(()=>{
          getRegistros();
          limpiar();
        });

        Swal.fire({
          title: "Eliminado!",
          text: "El registro "+val.nombre_usuario+" se ha eliminado exitosamente.",
          icon: "success",
          timer: 2500
        });
      }
    }).catch(function(error){
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se logro eliminar el registro",
        footer: JSON.parse(JSON.stringify(error)).message
      });
    });
  };

  const limpiar = ()=>{
    setNombre("");
    setContrasenia("");
    setCorreo("");
    setNumero("");
    setId("");
    setEditar(false);
  };

  const editarRegistro = (val)=>{
    console.log("Registro seleccionado para editar:", val);
    setEditar(true);

    setNombre(val.nombre_usuario);
    setContrasenia(""); // No mostrar la contraseña
    setCorreo(val.correo_electronico);
    setNumero(val.numero_telefono);
    setId(val.id_usuario);
  };

  const getRegistros = ()=>{
    Axios.get("http://localhost:3001/registros").then((response)=>{
      setRegistros(response.data);
    });
  };

  useEffect(() => {
    getRegistros();
  }, []);


  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Gestión de Usuarios</h1>
      <div className=''>
        {
          registrosList.map((val,key)=>{
            return <div className=''>{val.nombre}</div>
          })
        }
      </div>
        <div className="card text-center">
      <div className="card-body">
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Nombre:</span>
          <input type="text" 
          onChange={(event)=>{
            setNombre(event.target.value);
          }}
          className="form-control" value={nombre} placeholder="Ingrese un Nombre" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Contraseña:</span>
          <input type="password" 
          onChange={(event)=>{
            setContrasenia(event.target.value);
          }}
          className="form-control" value={contrasenia} placeholder="Ingrese una Contraseña" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Correo:</span>
          <input type="text" 
          onChange={(event)=>{
            setCorreo(event.target.value);
          }}
          className="form-control" value={correo} placeholder="Ingrese una Correo" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>

        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Número:</span>
          <input type="text" 
          onChange={(event)=>{
            setNumero(event.target.value);
          }}
          className="form-control" value={numero} placeholder="Ingrese un número de teléfono" aria-label="Username" aria-describedby="basic-addon1"/>
        </div>

        <div>
        {
          editar? 
          <div>
            <button className="btn btn-warning m-2" onClick={update}>Actualizar</button>
            <button className="btn btn-info m-2" onClick={limpiar}>Cancelar</button>
          </div>
          :<button className="btn btn-success" onClick={add}>Registrar</button>
        }
        </div>
      </div>
    </div>

      <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Correo Electrónico</th>
                  <th scope="col">Número de Teléfono</th>
                  <th scope="col">Acciones</th>
                </tr>
          </thead>
          <tbody>
            {
            registrosList.map((val,key)=>{
              return <tr key={val.id_usuario}>
                        <th scope="row">{val.id_usuario}</th>
                        <td>{val.nombre_usuario}</td>
                        <td>{val.correo_electronico}</td>
                        <td>{val.numero_telefono}</td>
                        <td>{val.rol}</td>
                        <td>
                          <div className="btn-group" role="group" aria-label="Basic example">
                            <button type="button" 
                            onClick={()=>{
                              editarRegistro(val);
                            }}
                            className="btn btn-primary">Editar</button>
                            <button type="button" onClick={()=>{
                              deleteRegistro(val);
                            }}className="btn btn-danger">Eliminar</button>
                          </div>
                        </td>
                      </tr>
              })
            }
          </tbody>
      </table>

    </div>
  );
}

export default ComGestionUsuarios;
