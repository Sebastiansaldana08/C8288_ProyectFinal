import axios from 'axios';

const API_URL = 'http://localhost:5000/recursos';

//Función que realiza la solicitud POST al servidor para crear un recurso
const createRecurso = (data, token) => {
  return axios.post(`${API_URL}/crear`, data, {
    //En el header se envía el token almacenado en el localStorage para poder realizar la autenticación
    headers: { Authorization: `Bearer ${token}` },
  });
};

//Función que realiza una solicitud GET al servidor para obtener todos los recursos
const getRecursos = (token) => {
  return axios.get(`${API_URL}/listar`, {
    //Se usa el token para la autenticación
    headers: { Authorization: `Bearer ${token}` },
  });
};

//Función que realiza una solicitud PUT al servidor para modificar el recurso
const updateRecurso = (id, data, token) => {
  //Se usa el token para la autenticación
  return axios.put(`${API_URL}/actualizar/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//Función que realiza una solicitud DELETE al servidor para eliminar el recurso de la BD
const deleteRecurso = (id, token) => {
  console.log("id del recurso a eliminar AXIOS DELETE:",id);
  return axios.delete(`${API_URL}/eliminar/${id}`, {
    //Se usa el token para la autenticación
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default { createRecurso, getRecursos, updateRecurso, deleteRecurso };