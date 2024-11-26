import React, { useEffect, useState } from 'react';
import recursoService from '../services/recursoService';

//Importo el formulario para los recursos
import RecursoForm from './RecursoForm';

const Dashboard = () => {
    //En un arreglo se almacenarán los recursos
    const [recursos, setRecursos] = useState([]);

    //Se crea la variable token (inicialmente vacía) donde se almacenará el token que se guardó en el localStorage
    const [token, setToken] = useState('');




    //Crearé una variable que almacenará el estado del botón (cuando se le da click, se mostrará el componente)
    const [mostrarFormulario,setMostrarFormulario]=useState(false); //Inicialmente será false, pero cuando dé click en el botón, se mostrará el componente

    //Defino una función manejadora de eventos que se activiará cuando se dé click sobre el botón
    const click=()=>{
      //Acá cambio el valor de mostrarFormulario (actualmente en false) a true para mostrar el componente
      setMostrarFormulario(true);
    };



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

    //Acá es donde muestro el componente, pero de FORMA CONDICIONAL (solo cuando se le dé click)
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={click}>Crear Recurso</button>
      <ul>
        {recursos.map((recurso) => (
          <li key={recurso.id}>
            <h3>{recurso.tipo_recurso}</h3>
            <p>{recurso.estado}</p>
          </li>
        ))}
      </ul>
      {mostrarFormulario && <RecursoForm/>}
    </div>
  );
};

export default Dashboard;