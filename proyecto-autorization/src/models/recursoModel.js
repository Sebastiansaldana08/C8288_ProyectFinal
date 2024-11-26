//Se importa el cliente de la BD para insertar valores
const pool=require("../config/dbConfig");

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
const obtenerRecurso=async ()=>{
    
    //Acá hago la consulta
    const resultado=await pool.query(
        'SELECT * FROM recursos'
    );

    //Se devuelven los recursos
    return resultado.rows; //Acá se devuelven TODOS los recursos, NO SOLO EL PRIMERO. Por eso no coloco "rows[0]"
}

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

//Función para actualizar un recurso (por ID)
const actualizarRecurso = async(id,tipo_recurso,configuracion,estado) => {
    //Se realiza la consulta a la BD para actualizar el recurso
    const resultado = await pool.query(
        //Acá es donde se hace la actualización de los recursos según los parámetros dados
        'UPDATE recursos SET tipo_recurso = $2, configuracion = $3, estado = $4 WHERE id = $1 RETURNING *',
        [id, tipo_recurso, configuracion, estado]
    );
    //Se retorna el recurso ya modificado
    return resultado.rows[0];
};


//Función para eliminar un recurso (por ID)
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