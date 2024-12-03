//Hago referencia al directorio donde se encuentra el archivo .env. De esa manera, tendrá acceso a las variables de entorno
require("dotenv").config({path:"../.env"});



//Acá es donde se integra todo
const express=require("express");

//Para las rutas de autenticación
const authRoutes=require("./routes/authRoutes");

//Para las rutas de los recursos
const recursoRoutes=require("./routes/recursoRoutes");

//CORS
const cors=require("cors");


//Instancia para tener el servidor
const app=express();

//Middleware CORS
app.use(cors());


//Uso el middleware para leer los datos json que se envían desde el cliente
app.use(express.json());


//Rutas para la autenticación (register, login)
app.use("/auth",authRoutes);  // /recursos/register, /recursos/login, etc.

//Ruta para la gestión de recursos
app.use("/recursos",recursoRoutes); // /recursos/crear, /recursos/listar, etc.


// Exportar app para que pueda ser utilizada en pruebas
module.exports = app;