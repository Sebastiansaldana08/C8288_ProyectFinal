const redis = require("redis");
const { Pool } = require("pg");
require("dotenv").config({ path: "../../.env" });

const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

// Configuración del cliente Redis
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${process.env.REDIS_PORT || 6379}`,
});

// Manejando eventos de Redis
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

// Conecta Redis al inicializar
(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("Redis conectado correctamente");
    }
  } catch (err) {
    console.error("Error al conectar a Redis:", err);
  }
})();

module.exports = { pool, redisClient };
