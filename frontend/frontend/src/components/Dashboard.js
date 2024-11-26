import React, { useEffect, useState } from 'react';
import recursoService from '../services/recursoService';

const Dashboard = () => {
    //En un arreglo se almacenarán los recursos
    const [recursos, setRecursos] = useState([]);

    //Se crea la variable token (inicialmente vacía) donde se almacenará el token que se guardó en el localStorage
    const [token, setToken] = useState('');

    //Cuando se renderiza el componente por primera vez, se obtiene el token almacenado como 'token' en el localStorage
    useEffect(() => {
        //Se obtiene el token almacenado en el localStorage
        const storedToken = localStorage.getItem('token');

        //Si se obtiene el token, entonces
        if (storedToken) {
            //se actualiza la variable 'token' inicialmente vacía
            setToken(storedToken);

            //Se usa la función creada fetchRecursos para obtener los recursos almacenados en la BD
            fetchRecursos(storedToken);
        }
        //De lo contrario, se envía el mensaje de que el usuario no está autenticado
        else {
            alert('No estás autenticado. Inicia sesión.');
            //Se redirige al login en caso no esté el token almacenado en el localStorage
            window.location.href = '/login';
            }
        }, []);

        //Esta función mostrará 
        const fetchRecursos = async (authToken) => {
            try {
                //Una vez que el usuario se autentifique, se realiza una solicitud GET al servidor para obtener los recursos almacenados en la BD
                const response = await recursoService.getRecursos(authToken);
                setRecursos(response.data);
            } catch (error) {
                alert('Error al cargar los recursos');
            }
    };

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => window.location.href = '/recurso-form'}>Crear Recurso</button>
      <ul>
        {recursos.map((recurso) => (
          <li key={recurso.id}>
            <h3>{recurso.tipo_recurso}</h3>
            <p>{recurso.estado}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;