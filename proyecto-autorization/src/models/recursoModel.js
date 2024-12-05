//Se importa el cliente de la BD para insertar valores
const { pool } = require("../config/dbConfig");

//Esta función se encargará de insertar recursos a la BD
const crearRecurso=async (tipo_recurso,configuracion,estado,id_usuario)=>{
    
    //Se hace la consulta de insertar recursos a la tabla
    const resultado=await pool.query(
        'INSERT INTO recursos (tipo_recurso,configuracion,estado,id_usuario) VALUES ($1,$2,$3,$4) RETURNING *',
        [tipo_recurso,configuracion,estado,id_usuario]
    );

    
    //Se retorna el recurso creado
    return resultado.rows[0];
}

//Función para obtener todos los recursos
const obtenerRecurso = async () => {
    try {
        const resultado = await pool.query('SELECT * FROM recursos');
        console.log('Recursos obtenidos desde la BD:', resultado.rows);
        return resultado.rows;
    } catch (error) {
        console.error('Error al obtener los recursos:', error);
        throw error;
    }
};


//Función para obtener un recurso determinado
const obtenerRecursoID=async(id)=>{
    //Realizo la consulta
    const resultado=await pool.query(
        'SELECT * FROM recursos WHERE id=$1',
        [id]
    );

    //Retorno ese recurso
    return resultado.rows[0];
}

const actualizarRecurso = async (id, tipo_recurso, configuracion, estado) => {
    // Log de entrada de datos
    console.log('Iniciando actualización en recursoModel.js...');
    console.log('Datos recibidos:', { id, tipo_recurso, configuracion, estado });
  
    try {
      // Ejecutamos la consulta para actualizar el recurso
      const recursoActualizado = await pool.query(
        'UPDATE recursos SET tipo_recurso = $1, configuracion = $2, estado = $3 WHERE id = $4 RETURNING *',
        [tipo_recurso, configuracion, estado, id]
      );
  
      // Verificamos si se actualizo algun recurso
      if (recursoActualizado.rows.length === 0) {
        console.error('Error: No se encontró un recurso con el ID proporcionado.');
        return null;
      }
  
     
      console.log('Recurso actualizado en la base de datos:', recursoActualizado.rows[0]);
  
      return recursoActualizado.rows[0];
    } catch (error) {

      console.error('Error al actualizar el recurso en la base de datos:', error);
      throw error;
    }
};
  


// funcion para eliminar un recurso (por ID)
const eliminarRecurso=async(id)=>{
    //Se eliminar ese recurso de la BD
    const resultado=await pool.query(
        'DELETE FROM recursos WHERE id=$1 RETURNING *',
        [id]
    );

    return `Recurso de ID ${id} eliminado`;
}

//Exporto las funciones, pues servirán para realizar las llamadas cuando el usuario se autentifica y/o tiene permisos para realizar ciertas tareas
module.exports={crearRecurso,obtenerRecurso,obtenerRecursoID,actualizarRecurso,eliminarRecurso};