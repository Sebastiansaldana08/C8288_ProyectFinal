// Hago referencia al directorio donde se encuentra el archivo .env. De esa manera, tendrá acceso a las variables de entorno
require("dotenv").config({ path: "../.env" });

// Acá es donde se integra todo
const express = require("express");

//Importando Helmet para encabezados de seguridad HTTP
const helmet = require("helmet");

//Importando CORS para configurar acceso entre orígenes
const cors = require("cors");

//Importando Express Validator para sanitización de entradas
const { check, validationResult } = require("express-validator");

//Importando Compression para reducir el tamaño de las respuestas HTTP
const compression = require("compression");

//Importando Path para gestionar rutas estáticas
const path = require("path");

//Importando Morgan y Logger
const morgan = require("morgan");
const logger = require("./config/logger");

// Para las rutas de autenticación
const authRoutes = require("./routes/authRoutes");

// Para las rutas de los recursos
const recursoRoutes = require("./routes/recursoRoutes");

// Instancia para tener el servidor
const app = express();

// Middleware para Helmet.js (añade encabezados de seguridad HTTP)
app.use(helmet());

//Middleware a nivel de aplicación para configurar CORS
app.use(
  cors({
    origin: "http://localhost:3000", //Se permiten solicitudes solo de este dominio donde se está ejecutando el frontend
    optionsSuccessStatus: 200, // Para respuestas exitosas en navegadores antiguos
  })
);

// Middleware para comprimir respuestas HTTP
app.use(compression());

// Middleware para servir recursos estáticos con cache
app.use(
  express.static(path.join(__dirname, "../public"), {
    maxAge: "1d", // Cachea los archivos estáticos por 1 día
  })
);

// Middleware para leer los datos JSON que se envían desde el cliente
app.use(express.json());

// Middleware para sanitización global (pues este middleware está a nivel de aplicación) para la prevención de inyección SQL y XSS
app.use((req, res, next) => {
  Object.keys(req.body || {}).forEach((key) => {
    req.body[key] = typeof req.body[key] === "string" ? req.body[key].trim() : req.body[key];
  });
  next();
});

// Integración de Morgan con Winston
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()), //Aquí se envían logs de Morgan a Winston
    },
  })
);

// Rutas para la autenticación (register, login)
app.use("/auth", authRoutes); // /auth/register, /auth/login, etc.

// Ruta para la gestión de recursos
app.use("/recursos", recursoRoutes); // /recursos/crear, /recursos/listar, etc.

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  logger.error(
    `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
  );
  res
    .status(err.status || 500)
    .json({ error: "Ocurrió un error interno. Por favor, intenta nuevamente más tarde." });
});

// Middleware de manejo de errores de validación (express-validator)
app.use((err, req, res, next) => {
  if (!err.errors) {
    return next(err);
  }

  const errorDetails = err.errors.map((e) => ({
    field: e.param,
    message: e.msg,
  }));

  res.status(400).json({
    error: "Validación fallida",
    details: errorDetails,
  });
});

// Exportar app para que pueda ser utilizada en pruebas
module.exports = app;
