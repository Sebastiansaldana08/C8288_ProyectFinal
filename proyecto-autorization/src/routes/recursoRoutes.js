//Acá es donde se crean las rutas con los middlewares de autenticación
const express=require("express");

const router=express.Router();

//Importo los middlewares y las handler functions definidas en recursoController
const recursoController=require("../controllers/recursoController");

const {autenticar,autorizar}=require("../middlewares/authMiddleware");

//Crear un recurso (solo admins y operadores pueden realizar ello)
router.post("/crear",autenticar,autorizar(['Administrador','Operador']),recursoController.crear);

//Para obtener TODOS los recursos (TODOS LOS USUARIOS PUEDEN HACER ESTA ACCIÓN)
router.get("/listar",autenticar,autorizar(), recursoController.obtenerRecTodo);

//Para obtener un solo recurso específico
router.get("/listar/:id",autenticar,autorizar(),recursoController.obtenerRecID);

//Actualizar un recurso por ID--> SOLO administradores
router.put("/actualizar/:id",autenticar,autorizar(['Administrador']),recursoController.actualizar);

//Eliminar recurso por ID --> SOLO administradores
router.delete("/eliminar/:id",autenticar,autorizar(['Administrador']),recursoController.eliminar);

//Se exporta el router
module.exports=router;