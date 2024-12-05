// Se importa el cliente de la base de datos que fue configurado en dbConfig.js
const { pool } = require("../config/dbConfig");

// Función para agregar un nuevo usuario a la base de datos
const crearUsuario = async (nombre, email, contrasenia, rol) => {
  // Consulta SQL para insertar un nuevo usuario en la tabla 'usuarios'
  const resultado = await pool.query(
    "INSERT INTO usuarios (nombre, email, contrasenia, rol) VALUES ($1, $2, $3, $4) RETURNING *",
    [nombre, email, contrasenia, rol]
  );

  // Retorna el usuario recién creado
  return resultado.rows[0];
};

// Función para buscar un usuario por su email
const encontrarUsuarioPorEmail = async (email) => {
  // Consulta SQL para seleccionar al usuario cuyo email coincide con el parámetro
  const resultado = await pool.query(
    "SELECT * FROM usuarios WHERE email = $1",
    [email]
  );

  // Retorna el usuario encontrado
  return resultado.rows[0];
};

// Exporta ambas funciones para ser usadas en otras partes de la aplicación
module.exports = { crearUsuario, encontrarUsuarioPorEmail };
