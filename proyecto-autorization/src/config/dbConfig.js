//Mediante 'path', indico la ruta en que se encuentra el archivo .env
require("dotenv").config({path:"../../.env"});

//Con este cliente de la base de datos podré conectarme
const {Pool}=require("pg");

//Creo un objeto pool para realizar la conexión
const pool=new Pool({
    user:process.env.DATABASE_USER,
    host:process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: process.env.DATABASE_PORT,
});

//Exporto el cliente de la base de datos, mediante el cual se realizarán las consultas
module.exports=pool;