import React, { useEffect, useState } from 'react';
import recursoService from '../services/recursoService';

const RecursoList = () => {
  const [recursos, setRecursos] = useState([]);

  useEffect(() => {
    const fetchRecursos = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No estás autenticado. Inicia sesión.');
        window.location.href = '/login';
        return;
      }

      try {
        const response = await recursoService.getRecursos(token);
        setRecursos(response.data);
      } catch (error) {
        alert('Error al obtener los recursos.');
      }
    };

    fetchRecursos();
  }, []);

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado. Inicia sesión.');
      window.location.href = '/login';
      return;
    }

    try {
      await recursoService.deleteRecurso(id, token);
      alert('Recurso eliminado exitosamente!');
      setRecursos(recursos.filter((recurso) => recurso.id !== id));
    } catch (error) {
      alert('Error al eliminar el recurso.');
    }
  };

  return (
    <div>
      <h2>Lista de Recursos</h2>
      {recursos.length === 0 ? (
        <p>No hay recursos disponibles.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Configuración</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {recursos.map((recurso) => (
              <tr key={recurso.id}>
                <td>{recurso.id}</td>
                <td>{recurso.tipo_recurso}</td>
                <td>{recurso.configuracion}</td>
                <td>{recurso.estado}</td>
                <td>
                  <button onClick={() => handleDelete(recurso.id)}>Eliminar</button>
                  <button
                    onClick={() =>
                      window.location.href = `/recurso-form/${recurso.id}`
                    }
                  >
                    Actualizar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecursoList;