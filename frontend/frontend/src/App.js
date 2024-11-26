//Se usa el hook useState para el token
import {useState} from "react";

//Se importan los componentes para la UI
import Register from "./components/Register";
import Login from './components/Login';
import Dashboard from './components/Dashboard';


const App = () => {
  const [token, setToken] = useState(null);

  const handleLogout = () => {
      setToken(null);
      alert('Sesión cerrada');
  };

  //Se usa el operador ternario para mostrar los componentes de register y login cuando NO se realiza la autenticación con el token
  //En caso sí se realice la autenticación, se mostrará el componente "Dashboard", que hará una solitud GET al servidor para listar todos los recursos
  return (
      <div>
          {!token ? (
            <>
            <Register/>
            <Login setToken={setToken}/>
            </>
          ):(
            <Dashboard token={token} onLogout={handleLogout}/>
          )}
      </div>
  );
};

export default App;