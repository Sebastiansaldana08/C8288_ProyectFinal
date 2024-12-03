const app = require("./app");

const PORT = process.env.PUERTO_EXPRESS;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
