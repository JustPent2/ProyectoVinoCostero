import React, { useState } from 'react';
// Componentes a Utilizar
import GestionUsuarios from '../Components/ComGestionUsuarios';
import Header from '../Components/Header';
import GestionRoles from '../Components/ComGestionRoles';
// Estilos a Utilizar
import '../Styles/GeneralStyle.css';
import '../Styles/Tabbar.css';
// Imagenes a Utilizar
//import ImagenDefault from '../Images/FaltaImagen.png';

function Seguridad() {

    // Estado para gestionar la pestaña activa
    const [activeTab, setActiveTab] = useState('Usuarios');

    // Función para cambiar entre pestañas
    const handleTabClick = (tabName) => {
      setActiveTab(tabName);
    };

  return (
    <main className='inicio'>
        <Header/>
        <div className="tab-bar">
          <button 
            className={activeTab === 'Usuarios' ? 'active' : ''} 
            onClick={() => handleTabClick('Usuarios')}>
            Gestión de Usuarios
          </button>
          <button 
            className={activeTab === 'Roles' ? 'active' : ''} 
            onClick={() => handleTabClick('Roles')}>
            Roles de Seguridad
          </button>
        </div>

        {/* Contenido de las pestañas */}
        <div className="tab-content">
          {activeTab === 'Usuarios' && (
            <div>
              <GestionUsuarios/>
            </div>
          )}
          {activeTab === 'Roles' && (
            <div>
              <GestionRoles/>
            </div>
          )}
        </div>
    </main>
);
}

export default Seguridad;