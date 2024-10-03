import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Axios from 'axios';
import Swal from 'sweetalert2';
// Estilos a Utilizar
import '../Styles/InicioSesion.css';
// Imagenes a Utilizar
import Logo from '../Images/FaltaImagen.png'; // Imagen opcional

function InicioSesion() {
  // Definir el estado para almacenar el nombre de usuario y la contraseña
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook para redirigir entre páginas

  // Función para manejar el inicio de sesión
  const handleLogin = (e) => {
    e.preventDefault(); // Evitar que el formulario se envíe de manera predeterminada

    // Realizar la solicitud POST al backend para verificar las credenciales
    Axios.post("http://localhost:3001/login", { // Dirección del servidor backend
      username: username,
      password: password
    }).then((response) => {
      // Verificar si las credenciales son correctas
      if (response.data.authenticated) {
        // Mostrar un mensaje de éxito con SweetAlert
        Swal.fire({
          title: "¡Bienvenido!",
          text: "Has iniciado sesión correctamente.",
          icon: "success",
          confirmButtonText: "Continuar"
        }).then(() => {
          // Redirigir a la página de Gestión de Ventas después del login
          navigate("/iniciogeneral");
        });
      } else {
        // Si el login falla, mostrar un mensaje de error
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.message, // Mensaje del backend si las credenciales son incorrectas
          confirmButtonText: "Intentar de nuevo"
        });
      }
    }).catch((error) => {
      // Manejar errores en el servidor
      Swal.fire({
        icon: "error",
        title: "Error en el servidor",
        text: "Hubo un problema al procesar tu solicitud.",
        footer: error.message
      });
    });
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <img src={Logo} alt="Logo Vino Costero" className="logo" />
        <h1>Vino Costero
        <h2>Gestión y Administración</h2></h1>
      </header>

      <form className="login-form" onSubmit={handleLogin}>
        {/* Campo de nombre de usuario */}
        <div className="form-group">
          <label htmlFor="username">Nombre:</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>

        {/* Campo de contraseña */}
        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        {/* Enlace para recuperar contraseña */}
        <Link to="/admin-message" className="password-link">¿Cuál es mi Contraseña?</Link>
        
        {/* Botón de enviar */}
        <button type="submit" className="back-button">Iniciar Sesión</button>
      </form>
    </div>
  );
}

export default InicioSesion;