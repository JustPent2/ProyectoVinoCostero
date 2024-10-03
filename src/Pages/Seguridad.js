// Componentes a Utilizar
import GestionUsuarios from '../Components/ComGestionUsuarios';
import Header from '../Components/Header';
// Estilos a Utilizar
import '../Styles/GeneralStyle.css';
// Imagenes a Utilizar
//import ImagenDefault from '../Images/FaltaImagen.png';

function Seguridad() {
  return (
    <main className='inicio'>
        <Header/>
        <GestionUsuarios/>
    </main>
);
}

export default Seguridad;