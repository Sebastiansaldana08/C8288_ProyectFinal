import React, { useState } from 'react';
import recursoService from '../services/recursoService';

const RecursoForm = () => {
  const [formData, setFormData] = useState({
    tipo_recurso: '',
    configuracion: '',
    estado: 'Activo', //Estado por defecto del recurso será "Activo"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado. Inicia sesión.');
      window.location.href = '/login';
      return;
    }

    try {
      await recursoService.createRecurso(formData, token);
      alert('Recurso creado exitosamente!');
      window.location.href = '/dashboard'; //Redirección a /dashboard
    } catch (error) {
      alert('Error al crear el recurso.');
    }
  };

  return (
    <div>
      <h2>Crear Recurso</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="tipo_recurso">Tipo de Recurso:</label>
          <input
            type="text"
            name="tipo_recurso"
            id="tipo_recurso"
            value={formData.tipo_recurso}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="configuracion">Configuración:</label>
          <textarea
            name="configuracion"
            id="configuracion"
            value={formData.configuracion}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="estado">Estado:</label>
          <select
            name="estado"
            id="estado"
            value={formData.estado}
            onChange={handleChange}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
        <button type="submit">Crear Recurso</button>
      </form>
    </div>
  );
};

export default RecursoForm;