import React, { useState, useEffect } from 'react';
import recursoService from '../services/recursoService';

import RecursoList from './RecursoList';

const RecursoForm = ({ recursoId }) => {
  const [formData, setFormData] = useState({
    tipo_recurso: '',
    configuracion: '',
    estado: 'Activo', 
  });

  const [mostrarRecursoList, setMostrarRecursoList] = useState(false);

  useEffect(() => {
    // Si recibimos un recursoId, cargamos los datos del recurso existente
    if (recursoId) {
      const fetchRecurso = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('No estás autenticado. Inicia sesión.');
          window.location.href = '/login';
          return;
        }

        try {
          const response = await recursoService.getRecursoById(recursoId, token);
          setFormData(response.data);
        } catch (error) {
          alert('Error al cargar el recurso.');
        }
      };
      fetchRecurso();
    }
  }, [recursoId]);

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
  
    console.log('Token obtenido:', token);
    console.log('Formulario enviado:', formData);
  
    try {
      if (recursoId) {
        // Actualizar recurso existente
        console.log('Intentando actualizar recurso con ID:', recursoId); 
        await recursoService.updateRecurso(recursoId, formData, token);
        alert('Recurso actualizado exitosamente!');
        console.log('Recurso actualizado con éxito.');
      } else {
        // Crear nuevo recurso
        console.log('Creando nuevo recurso con datos:', formData);
        await recursoService.createRecurso(formData, token);
        alert('Recurso creado exitosamente!');
        console.log('Recurso creado con éxito.');
      }
  
      setMostrarRecursoList(true);
    } catch (error) {
      console.error('Error al guardar el recurso:', error); 
      alert('Los operadores no pueden actualizar recursos.');
    }
  };
  

  return (
    <div>
      <h2>{recursoId ? 'Actualizar Recurso' : 'Crear Recurso'}</h2>
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

        <button type="submit">{recursoId ? 'Actualizar' : 'Crear'} Recurso</button>
      </form>
      {mostrarRecursoList && <RecursoList />}
    </div>
  );
};

export default RecursoForm;
