import React, { useState } from 'react';
import authService from '../services/authService';

//Esta es la data que se enviará mediante el método post al servidor
const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contrasenia: '',
    rol: 'Operador',
  });

const handleChange = (e) => {
    //console.log("e.target.name:",e.target.name);
    //console.log("e.target.value:",e.target.value);
    //Acá se actualizan los datos de la propiedad definida por e.target.name (name hace ref. al nombre del elemento), por el valor e.target.value
    setFormData({ ...formData, [e.target.name]: e.target.value });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //Acá se pasa la data con los datos introducidos en el form, haciendo uso de la función register, la cual hará una solicitud post al servidor
      const res = await authService.register(formData);
      //Se muestra el mensaje de usuario registrado exitosamente!     
      alert('Usuario registrado exitosamente!');
    }catch (error) {
        alert(error.response.data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="contrasenia" placeholder="Contraseña" onChange={handleChange} required />
      <select name="rol" onChange={handleChange}>
        <option value="Operador">Operador</option>
        <option value="Administrador">Administrador</option>
      </select>
      <button type="submit">Registrar</button>
    </form>
  );
};

export default Register;