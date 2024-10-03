// Componentes a Utilizar
import Header from '../Components/Header';
import GesCompradores from '../Components/ComGestionCompradores';
// Estilos a Utilizar
import '../Styles/GeneralStyle.css';
// Imagenes a Utilizar
//import ImagenDefault from '../Images/FaltaImagen.png';

function Seguridad() {
  return (
    <main className='inicio'>
        <Header/>
        <GesCompradores/>
    </main>
);
}

export default Seguridad;