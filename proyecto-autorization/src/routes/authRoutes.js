//Acá es donde se definen las rutas de autenticación
const express=require("express");

const router=express.Router();



//Se importan las funciones de authController para usarlas cuando se realizan una solicitud
const {registrar,login}=require("../controllers/authController");

//Registrar un usuario
router.post("/register",registrar); //router.post


//Logearse
router.post("/login",login); //router.post


//Exporto el router
module.exports=router;