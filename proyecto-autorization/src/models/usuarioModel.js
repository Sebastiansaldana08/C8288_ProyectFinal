//Se importa el cliente de la base de datos que fue importado
const pool=require("../config/dbConfig");

//Se crea la función que agregará los usuarios a la BD
const crearUsuario=async(nombre,email,contrasenia,rol)=>{
 
    //Se realiza la consulta a la BD para introducir usuarios
    const resultado=await pool.query(
        'INSERT INTO usuarios (nombre,email,contrasenia,rol) VALUES ($1,$2,$3,$4) RETURNING *',
        [nombre,email,contrasenia,rol]
    );

    //Se devuelve el usuario introducido
    return resultado.rows[0];
};

//Función que encontrará un usuario por un email dado
const encontrarUsuarioPorEmail = async (email) => {
    //Se selecciona al usuario con un email específico pasado por parámetro
    const resultado = await pool.query(
      'SELECT * FROM usuarios WHERE email = $1',
      [email]
    );

    //Se devuelve ese usuario
    return resultado.rows[0];
  };
  
  //Se exportan ambas funciones que se encargarán de introducir y devolver datos de la BD
  module.exports={crearUsuario,encontrarUsuarioPorEmail};

