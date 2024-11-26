import React, { useState } from 'react';
import authService from '../services/authService';

const Login = ({setToken}) => {
    //formData será la data que se enviará mediante el método post
  const [formData, setFormData] = useState({
    email: '',
    contrasenia: '',
  });

  //Esta función se encargará de ir actualizando formData a medida que el usuario ingrese o quite valores en el formulario
  //Es decir, esta función manejadora de eventos se llamará cuando ocurra una interación del cliente con el formulario
  const handleChange = (e) => {
    //Se va actualizando formData a medida que el usuario interactúe con el formulario
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //Esta función manejadora de eventos se llamará cuando el usuario hace click en el botón
  //Esta función realizará una solicitud POST al servidor, enviándole la data almacenada en formData
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        //Se llama a la función "login" de authService, que es la que se encargará de enviar una solicitud POST con la data almacenada en el form
        const response = await authService.login(formData);
        alert('Inicio de sesión exitoso');

        //Como el servidor lo que envía es el token, entonces se accede al token mediante response.data.token y este es guardado en el localStorage
        localStorage.setItem('token', response.data.token);

        
        //Se actualiza el token con la prop "setToken" pasada por parámetro desde el componente padre, para que la variable 'token' que
        //lo almacena sea diferente de "null" y se muestre el componente dashboard.
        setToken(response.data.token);


    } catch (error) {
        alert(error.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required/>
      <input type="password" name="contrasenia" placeholder="Contraseña" value={formData.contrasenia} onChange={handleChange} required/>
      <button type="submit">Iniciar sesión</button>
    </form>
  );
};

export default Login;