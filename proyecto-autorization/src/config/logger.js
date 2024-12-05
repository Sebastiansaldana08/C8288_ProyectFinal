const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.json() // Formato JSON para registros estructurados
  ),
  transports: [
    new transports.File({ filename: "logs/error.log", level: "error" }), // Log de errores
    new transports.File({ filename: "logs/combined.log" }), // Todos los logs
  ],
});

// Si no está en producción, agregar salida a consola para desarrollo
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(), // Logs simples para consola
    })
  );
}

module.exports = logger;
