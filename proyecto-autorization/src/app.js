//Hago referencia al directorio donde se encuentra el archivo .env. De esa manera, tendrá acceso a las variables de entorno
require("dotenv").config({path:"../.env"});



//Acá es donde se integra todo
const express=require("express");

//Para las rutas de autenticación
const authRoutes=require("./routes/authRoutes");

//Para las rutas de los recursos
const recursoRoutes=require("./routes/recursoRoutes");


//Instancia para tener el servidor
const app=express();

//Uso el middleware para leer los datos json que se envían desde el cliente
app.use(express.json());


//Rutas para la autenticación (register, login)
app.use("/auth",authRoutes);  // /recursos/register, /recursos/login, etc.

//Ruta para la gestión de recursos
app.use("/recursos",recursoRoutes); // /recursos/crear, /recursos/listar, etc.



app.listen(process.env.PUERTO_EXPRESS,()=>{
    console.log(`Puerto ${process.env.PUERTO_EXPRESS} en escucha`);
})