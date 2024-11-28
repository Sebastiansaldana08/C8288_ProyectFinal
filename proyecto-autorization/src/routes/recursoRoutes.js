//Acá es donde se crean las rutas con los middlewares de autenticación
const express = require("express");
const router = express.Router();

//Importo los middlewares y las handler functions definidas en recursoController
const recursoController = require("../controllers/recursoController");
const { autenticar, autorizar } = require("../middlewares/authMiddleware");

// Middleware para registrar solicitudes entrantes
router.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.originalUrl}`);
  next();
});

// Creamos un recurso (solo admins y operadores pueden realizar ello)
router.post(
  "/crear",
  autenticar,
  autorizar(["Administrador", "Operador"]),
  (req, res, next) => {
    console.log("Ruta /crear invocada. Datos recibidos:", req.body);
    next();
  },
  recursoController.crear
);

// Para obtener TODOS los recursos (TODOS LOS USUARIOS PUEDEN HACER ESTA ACCIÓN)
router.get(
  "/listar",
  autenticar,
  autorizar(),
  (req, res, next) => {
    console.log("Ruta /listar invocada. Token válido.");
    next();
  },
  recursoController.obtenerRecTodo
);

// Para obtener un solo recurso específico
router.get(
  "/listar/:id",
  autenticar,
  autorizar(),
  (req, res, next) => {
    console.log(`Ruta /listar/:id invocada. ID del recurso: ${req.params.id}`);
    next();
  },
  recursoController.obtenerRecID
);

// Actualizar un recurso por ID --> SOLO administradores
router.put(
  "/actualizar/:id",
  autenticar,
  autorizar(["Administrador"]),
  (req, res, next) => {
    console.log(`Ruta /actualizar/:id invocada. ID: ${req.params.id}`);
    console.log("Datos recibidos para actualizar:", req.body);
    next();
  },
  recursoController.actualizar
);

// Eliminar recurso por ID --> SOLO administradores
router.delete(
  "/eliminar/:id",
  autenticar,
  autorizar(["Administrador"]),
  (req, res, next) => {
    console.log(`Ruta /eliminar/:id invocada. ID: ${req.params.id}`);
    next();
  },
  recursoController.eliminar
);

//Se exporta el router
module.exports = router;
