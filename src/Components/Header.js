import React, { useEffect, useState } from 'react';
// Estilos a Utilizar
import '../Styles/Header.css';
// Imagenes a Utilizar
import Logo from '../Images/FaltaImagen.png';
// Importar SweetAlert
import Swal from 'sweetalert2';
// Importar Axios
import Axios from 'axios';

function Header() {
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const fetchRol = () => {
      Axios.get('http://localhost:3001/rol-acceso')
        .then((response) => {
          const data = response.data;

          if (data.rol !== null) {
            setRol(data.rol);
          }
        })
        .catch((error) => {
          console.error("Error al obtener el rol:", error);
        });
    };

    fetchRol();
  }, []); // No hay dependencias, se ejecuta solo al montar el componente

  const handleAccess = (requiredRol) => {
    if (rol !== requiredRol) {
      Swal.fire({
        icon: 'error',
        title: 'Acceso denegado',
        text: `No tienes el rol necesario para acceder a esta funcionalidad.`,
      }).then(() => {
        // Redirigir a la página de inicio general
        window.location.href = '/iniciogeneral';
      });
      return false;
    }
    return true;
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={Logo} alt="Vino Costero"/>
        <h1>Vino Costero</h1>
      </div>

      <nav className="nav-menu">
        <a href="/produccion-vinos" onClick={(e) => { if (!handleAccess(2)) e.preventDefault(); }}>Producción de Vinos</a>
        <a href="/lotes-producidos" onClick={(e) => { if (!handleAccess(2)) e.preventDefault(); }}>Lotes Producidos</a>
        <a href="/registro-compradores" onClick={(e) => { if (!handleAccess(3)) e.preventDefault(); }}>Compradores</a>
        <a href="/analisis-negocios" onClick={(e) => { if (!handleAccess(3)) e.preventDefault(); }}>Análisis de Negocios</a>
        <a href="/logistica-requerimientos" onClick={(e) => { if (!handleAccess(2)) e.preventDefault(); }}>Logística</a>
        <a href="/seguridad" onClick={(e) => { if (!handleAccess(1)) e.preventDefault(); }}>Seguridad</a>
      </nav>
      <a href="/iniciosesion" className="login-button">Cerrar Sesión</a>
    </header>
  );
}

export default Header;