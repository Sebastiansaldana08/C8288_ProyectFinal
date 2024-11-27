//Acá uso las funciones definidas en recursoModel!!!

//Importo el recursoModel que tendrá las funciones definidas para realizar las acciones definidas allí
const recursoModel=require("../models/recursoModel");

//Acá se crea la handler function para crear un recurso
const crear=async(req,res)=>{
    
    //Obtengo los datos pasados por parámetros
    const {tipo_recurso,configuracion,estado}=req.body; //,id_usuario       //req.body.recurso
    const id_usuario=req.usuario.id; //Se obtiene el id del usuario ya autenticado
    console.log(tipo_recurso,configuracion,estado,id_usuario);

    try{
        
        //Se realiza la consulta a la BD y se obtiene el recurso creado (puesto que este es devuelto en la función crearRecurso de recursoModel)
        const nuevoRecurso=await recursoModel.crearRecurso(tipo_recurso,configuracion,estado,id_usuario);

 
        //Si no hay errores, se devuelve al usuario el recurso que se acaba de crear
        res.status(201).json(nuevoRecurso);
    }catch(error){
        //En caso haya algún error al crear el recurso, se envía el status code 500 al cliente
        res.status(500).json({error:"No se pudo crear el recurso"});
    }
};

//Handler function para obtener TODOS los recursos
const obtenerRecTodo=async(req,res)=>{
    try{
        
        const recursos=await recursoModel.obtenerRecurso();
        res.json(recursos);
    }catch(error){
        res.status(500).json({error:"No se pudo obtener los recursos"});
    }
}

//Handler function para obtener un recurso por ID
const obtenerRecID=async(req,res)=>{
    //Obtengo el id (este será una ruta dinámica), por lo que accederé mediante .params
    try{
        //Obtengo el id que se coloca en la url dinámica (el parámetro de ruta)
        const {id}=req.params;

        //Realizo la consulta a la BD para ese recurso usando la func. definida para ello
        const recurso=await recursoModel.obtenerRecursoID(id);

        //Envío ese recurso al cliente
        res.json(recurso);
    }catch(error){
        res.status(500).json({error:"Error al obtener el recurso especificado"});
    }
}

const actualizar = async (req, res) => {
    console.log('Iniciando controlador de actualización...');
    try {
      // Obtener ID desde los parámetros de la ruta
      const { id } = req.params;
      console.log('ID del recurso recibido desde la URL:', id);
  
      // Obtener datos desde el body de la solicitud
      const { tipo_recurso, configuracion, estado } = req.body.recurso || req.body;
      console.log('Datos recibidos en el body:', { tipo_recurso, configuracion, estado });
  
      // Actualizar recurso usando el modelo
      const recursoActualizado = await recursoModel.actualizarRecurso(id, tipo_recurso, configuracion, estado);
  
      // Validar si el recurso fue encontrado
      if (!recursoActualizado) {
        console.error('Recurso no encontrado para el ID proporcionado:', id);
        return res.status(404).json({ error: 'Recurso no encontrado.' });
      }
  
      // Log de éxito
      console.log('Recurso actualizado correctamente en el controlador:', recursoActualizado);
  
      // Enviar respuesta al frontend
      res.json(recursoActualizado);
    } catch (error) {
      // Log de error
      console.error('Error en el controlador al intentar actualizar el recurso:', error);
  
      // Enviar error al frontend
      res.status(500).json({ error: 'Error al actualizar el recurso. Revisa los logs del servidor.' });
    }
};

const eliminar=async(req,res)=>{
    try{
        //Obtengo el id del producto a eliminar (parámetro de la ruta dinámica)
        const {id}=req.params;

        console.log("id:",id);

        //Ahora, hago la consulta a la base de datos mediante la función definida en recursoModel
        const respuesta=await recursoModel.eliminarRecurso(id);

        //Envío esa respuesta al cliente (que es solo un mensaje)
        res.json(respuesta);
    }catch(error){
        res.status(500).json({error:"No se puede eliminar el recurso"});
    }
}


//Exporto estas funciones
module.exports={crear,obtenerRecTodo,obtenerRecID,actualizar,eliminar};