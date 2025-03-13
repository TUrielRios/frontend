// constants.js
import axios from 'axios';

// Función para obtener los textos desde el backend
const fetchTextos = async () => {
  try {
    const response = await axios.get('https://lacocina-backend-deploy.vercel.app/textos');
    const textos = response.data.reduce((acc, texto) => {
      acc[texto.key] = texto.value; // Crear un objeto con las claves y valores
      return acc;
    }, {});
    return textos;
  } catch (error) {
    console.error("Error fetching textos:", error);
    return {}; // Retornar un objeto vacío en caso de error
  }
};

// Exportar los textos
const textos = await fetchTextos();
export default textos;