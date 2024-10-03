// Componentes a Utilizar
import Header from '../Components/Header';
import LotesProd from '../Components/ComGestionLotesProd';
// Estilos a Utilizar
import '../Styles/GeneralStyle.css';
// Imagenes a Utilizar
//import ImagenDefault from '../Images/FaltaImagen.png';

function Seguridad() {
  return (
    <main className='inicio'>
        <Header/>
        <LotesProd/>
    </main>
);
}

export default Seguridad;