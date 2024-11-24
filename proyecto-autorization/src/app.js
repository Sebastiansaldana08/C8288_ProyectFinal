//Hago referencia al directorio donde se encuentra el archivo .env. De esa manera, tendrá acceso a las variables de entorno
require("dotenv").config({path:"../.env"});

//Acá es donde se integra todo
const express=require("express");

//Exporto el objeto router definido en authRoutes
const router=require("./routes/authRoutes");

//Instancia para tener el servidor
const app=express();

//Uso el middleware para leer los datos json que se envían desde el cliente
app.use(express.json());


//Rutas web de autentización, de tal forma que se acceda como /pagina/register o /pagina/login
app.use("/auth",router);

app.listen(process.env.PUERTO_EXPRESS,()=>{
    console.log(`Puerto ${process.env.PUERTO_EXPRESS} en escucha`);
})