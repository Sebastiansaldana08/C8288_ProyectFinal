import axios from 'axios';

// URL base para las solicitudes de autenticación
const API_URL = 'http://localhost:5000/auth';

// funcionn para registrar un nuevo usuario
//Acá se realiza una solicitud con  el método post, donde se pasa los datos enviados del formulario, al endpoint de la API para el registro
const register = (data) => {
  return axios.post(`${API_URL}/register`, data);
};

// iniciar sesión de un usuario
const login = (data) => {
  return axios.post(`${API_URL}/login`, data);
};

// Exportar las funciones para usarlas en otros componentes
export default { register, login };