//Se importa el módulo para controlar el acceso mediante tokens
const jwt = require('jsonwebtoken');

//Se importa el módulo para cifrar las contraseñas
const bcrypt = require('bcrypt');

//Uso dotenv para las variables de entorno
require("dotenv").config({path:"../../.env"});

//Se importan las funciones para obtener y/o agregar usuarios a la BD
const {crearUsuario,encontrarUsuarioPorEmail}=require('../models/usuarioModel');



//Esta será la función manejadora de solicitudes
const registrar = async (req, res) => {
    //console.log("Llamada a registrar desde el frontend");
    //Se realiza desestructuración, pues se pasarán dichos datos mediante POST
    const {nombre,email,contrasenia,rol}=req.body;
    /*console.log("nombre:",nombre);
    console.log("email:",email);
    console.log("email:",contrasenia);
    console.log("email:",rol);*/

    //Se encripta la contraseña, y dicha contraseña encriptada será la que se almacena en la BD, no el texto plano
    try {
        //Se encripta la contraseña y se especifica el # salt rounds (esto determinará qué tan compleja será la encriptación)
        const hash = await bcrypt.hash(contrasenia, 10);

        

        //Ahora, se inserta el usuario (con la contra encriptada) a la BD
        const nuevoUsuario = await crearUsuario(nombre, email, hash, rol);

        //Cuando se ha realizado correctamente lo anterior, se envía el cód 201, que indica "recurso creado" con un json que mostrará
        //los datos
        
        res.status(201).json({usuario:nuevoUsuario});
    }catch (error){
        //En caso haya algún error, se enviará el status code 500 con el mensaje de Error
        res.status(500).json({error:'Error al registrar el usuario.'});
    }
};

const login = async (req, res) => {
    console.log("Se llama al login desde el frontend!!");

    //Se obtienen los datos que se envían mediante el método POST
    const {email,contrasenia} = req.body;

    console.log("email:",email);
    console.log("contrasenia:",contrasenia);


    //Se busca dicho usuario en la base de datos usando la función que se definió anteriormente "encontrarUsuarioPorEmail"
    try {
        //Se busca al usuario por el email pasado en el body de la solicitud y se llama a la función que realizará la consulta
        const usuario = await encontrarUsuarioPorEmail(email);

        //Se devuelve un error en caso no se haya encontrado el usuario (pues será undefined)
        if (!usuario){
            return res.status(400).json({error:'Usuario no encontrado.'})
        };


        
        //En caso no haya error, se verifica que la contraseña pasada por parámetro, sea la misma que la que se encuentra hasheada en la BD
        const esValida = await bcrypt.compare(contrasenia, usuario.contrasenia);


        //Si no coinciden, se envía un mensaje de error al cliente
        if (!esValida){
            return res.status(400).json({ error: 'Contraseña incorrecta.' });
        };

        
        //En caso sí coincidan, se le asigna un token al usuario y se le reenvía, para que en con ese token pueda acceder a los recursos protegidos
        //Se le pasa el payload y la clave secreta para firmar el token
        
        const token = jwt.sign({id:usuario.id,rol:usuario.rol },process.env.JWT_SECRET,{ expiresIn: '1h' });
        
        
        //Se le envía el token al usuario
        res.json({ token });
    }catch (error) {
        //En caso haya un error, de que el email no es encuentra en la BD, se lanzará el error messages
        res.status(500).json({ error: 'Error al iniciar sesión.' });
    }
};

module.exports={registrar,login};