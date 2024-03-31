const axios = require('axios');
const FormData = require('form-data');

let customFileName;

const setCustomFileName = (newCustomFileName) => {
  customFileName = newCustomFileName;
};

const isImage = (mimeType) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  return allowedMimeTypes.includes(mimeType);
};

const sendImageToServer = async (imageBuffer, imageName, serverUrl) => {
  try {
    // Crear un objeto FormData y agregar la imagen desde el buffer
    const form = new FormData();
    form.append('img_awards', imageBuffer, {
      filename: imageName,
      contentType: `image/${imageName.split('.').pop().toLowerCase()}`,
    });

    console.log('Enviando imagen al servidor');
    // Enviar la imagen al servidor
    const response = await axios.post(serverUrl, form, {
      headers: {
        ...form.getHeaders(),
      },
    });

    console.log('Código de estado HTTP:', response.status);
    console.log('Respuesta del servidor:', response.data);

    return { success: true, message: 'Imagen enviada con éxito' };
  } catch (error) {
    console.error('Error al enviar la imagen al servidor:', error.message);
    throw new Error('Error al enviar la imagen al servidor');
  }
};

const handleCombinedUpload = async (raffle, req, res) => {
  try {
    const serverUrl = 'http://localhost:1500/receive-image';

    // Verificar si se proporcionan imágenes de premios
    if (!raffle.img_awards || raffle.img_awards.length === 0) {
      throw new Error('No se proporcionaron imágenes de premios');
    }

    // Enviar cada imagen de premio al servidor
    const promises = raffle.img_awards.map(async (image, index) => {
      // Verificar si lo que se envía es una imagen
      if (!isImage(image.mimeType)) {
        throw new Error(`El archivo ${index + 1} no es una imagen`);
      }

      // Enviar el buffer de la imagen al servidor
      const result = await sendImageToServer(Buffer.from(image.buffer), `${customFileName}_${index + 1}.png`, serverUrl);
      return result;
    });

    // Esperar a que se completen todas las promesas de envío de imágenes
    const results = await Promise.all(promises);

    // Puedes continuar con el resto de tu lógica después de enviar las imágenes al servidor
    // console.log(results);
    res.status(200).json({ message: 'Imágenes de premios enviadas con éxito' });
  } catch (error) {
    console.error('Error al procesar las imágenes de premios:', error.message);
    res.status(500).json({ error: 'Error al procesar las imágenes de premios', details: error.message });
  }
};

module.exports = { handleCombinedUpload, setCustomFileName };
