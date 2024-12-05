// Importo los módulos necesarios
const recursoModel = require("../models/recursoModel");
const { pool, redisClient } = require("../config/dbConfig"); // Incluimos Redis desde dbConfig

// Handler function para crear un recurso
const crear = async (req, res) => {
  const { tipo_recurso, configuracion, estado } = req.body;
  const id_usuario = req.usuario.id; // Se obtiene el ID del usuario autenticado

  try {
    console.log("Datos recibidos para crear recurso:", { tipo_recurso, configuracion, estado, id_usuario });
    
    const nuevoRecurso = await recursoModel.crearRecurso(tipo_recurso, configuracion, estado, id_usuario);

    // Eliminar la caché de Redis
    redisClient.del("recursos", (err) => {
      if (err) console.error("Error al eliminar la caché de Redis tras crear recurso:", err);
      else console.log("Caché de Redis eliminada tras creación de recurso.");
    });

    res.status(201).json(nuevoRecurso);
  } catch (error) {
    console.error("Error al crear el recurso:", error);
    res.status(500).json({ error: "No se pudo crear el recurso" });
  }
};

// Handler function para obtener TODOS los recursos con Redis Cache
const obtenerRecTodo = async (req, res) => {
  try {
    console.log("Iniciando función obtenerRecTodo...");
    redisClient.get("recursos", async (err, data) => {
      if (err) {
        console.error("Error al acceder a Redis:", err);
        throw err;
      }

      if (data) {
        console.log("Recursos obtenidos desde Redis Cache:", JSON.parse(data));
        return res.json(JSON.parse(data));
      } else {
        console.log("Recursos no están en Redis. Consultando la base de datos...");
        const recursos = await recursoModel.obtenerRecurso();
        console.log("Recursos obtenidos desde la base de datos:", recursos);

        if (!recursos || recursos.length === 0) {
          return res.status(404).json({ error: "No hay recursos disponibles." });
        }

        redisClient.setex("recursos", 3600, JSON.stringify(recursos), (err) => {
          if (err) console.error("Error al almacenar datos en Redis:", err);
          else console.log("Datos almacenados en Redis Cache.");
        });

        res.json(recursos);
      }
    });
  } catch (error) {
    console.error("Error al obtener los recursos:", error);
    res.status(500).json({ error: "No se pudo obtener los recursos" });
  }
};

// Handler function para obtener un recurso por ID
const obtenerRecID = async (req, res) => {
  try {
    console.log("Solicitud para obtener recurso por ID:", req.params.id);

    const { id } = req.params;
    const recurso = await recursoModel.obtenerRecursoID(id);
    if (!recurso) {
      return res.status(404).json({ error: "Recurso no encontrado." });
    }

    console.log("Recurso obtenido:", recurso);
    res.json(recurso);
  } catch (error) {
    console.error("Error al obtener el recurso especificado:", error);
    res.status(500).json({ error: "Error al obtener el recurso especificado" });
  }
};

// Handler function para actualizar un recurso
const actualizar = async (req, res) => {
  console.log("Iniciando controlador de actualización...");
  try {
    const { id } = req.params;
    const { tipo_recurso, configuracion, estado } = req.body;

    console.log("Datos recibidos para actualizar recurso:", { id, tipo_recurso, configuracion, estado });

    const recursoActualizado = await recursoModel.actualizarRecurso(
      id,
      tipo_recurso,
      configuracion,
      estado
    );

    if (!recursoActualizado) {
      return res.status(404).json({ error: "Recurso no encontrado." });
    }

    // Eliminar la caché para reflejar los cambios
    redisClient.del("recursos", (err) => {
      if (err) console.error("Error al eliminar la caché de Redis tras actualizar recurso:", err);
      else console.log("Caché de Redis eliminada tras actualización de recurso.");
    });

    console.log("Recurso actualizado correctamente:", recursoActualizado);
    res.json(recursoActualizado);
  } catch (error) {
    console.error("Error al actualizar el recurso:", error);
    res.status(500).json({ error: "Error al actualizar el recurso. Revisa los logs del servidor." });
  }
};

// Handler function para eliminar un recurso
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Solicitud para eliminar recurso con ID:", id);

    const respuesta = await recursoModel.eliminarRecurso(id);

    // Eliminar la caché después de la operación
    redisClient.del("recursos", (err) => {
      if (err) console.error("Error al eliminar la caché de Redis tras eliminar recurso:", err);
      else console.log("Caché de Redis eliminada tras eliminación de recurso.");
    });

    console.log("Recurso eliminado correctamente:", respuesta);
    res.json(respuesta);
  } catch (error) {
    console.error("Error al eliminar el recurso:", error);
    res.status(500).json({ error: "No se puede eliminar el recurso" });
  }
};

// Exporto estas funciones
module.exports = { crear, obtenerRecTodo, obtenerRecID, actualizar, eliminar };
