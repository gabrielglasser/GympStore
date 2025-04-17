import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw error;
  }
};

export const deleteImage = async (publicId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/upload/${publicId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar imagem:', error);
    throw error;
  }
}; 