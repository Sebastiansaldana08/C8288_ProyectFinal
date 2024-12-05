# Proyecto 5: Sistema Automatizado de Autorización Segura para Aplicaciones Web

## Introducción

En el panorama actual de la tecnología, las aplicaciones web han evolucionado significativamente, convirtiéndose en herramientas esenciales para la operación de organizaciones de diversos sectores. Sin embargo, el incremento de la complejidad y la interconexión de sistemas genera desafíos de seguridad, en especial para el control de acceso a recursos.

El proyecto consiste en desarrollar un **sistema automatizado de autorización segura** diseñado para aplicaciones web. Este sistema permite gestionar usuarios y recursos, implementando niveles de acceso controlados mediante roles predefinidos. Además, el proyecto está diseñado para ser portable y escalable gracias al uso de contenedores como **Docker**.

Asimismo, este proyecto aborda estos desafíos mediante la implementación de un sistema automatizado de autorización segura para aplicaciones web, el cual se enfocará, específicamente, en lo siguiente:

- **Autenticación:** Verificar la identidad de los usuarios.
- **Autorización:** Controlar los permisos de acceso según el rol del usuario.
- **Gestión de recursos:** Crear, consultar, actualizar y eliminar recursos bajo un control seguro.

### Objetivo

Crear una aplicación web funcional que permita:

1. La gestión básica de usuarios y recursos.
2. Implementar mecanismos esenciales de autenticación y autorización.
3. Facilitar el despliegue del backend mediante contenerización con **Docker**.

La solución integra:

- **Autenticación segura:** Usando tokens JWT y contraseñas encriptadas.
- **Autorización basada en roles:** Restringiendo el acceso a recursos según permisos asignados (Administrador, Operador, Usuario autenticado).
- **Gestión eficiente de recursos:** Capacidad de los usuarios autenticados para interactuar con recursos siguiendo las políticas de seguridad.
- **Contenerización:** Preparación para desplegar el backend en un entorno portátil y reproducible.

### Tecnologías Utilizadas

- **Backend:** Node.js con Express.js.
- **Base de datos:** PostgreSQL.
- **Seguridad:** Autenticación con tokens JWT y contraseñas encriptadas.
- **Contenerización:** Docker

---
## Configuración del Entorno y Comandos Iniciales para el Backend

### Paso 1: Creación de la Estructura del Proyecto

1. Crear el directorio principal del proyecto:
    ```bash
    mkdir proyecto-autorization
    cd proyecto-autorization
    ```
2. Inicializar el proyecto con Node.js:
    ```bash
    npm init -y
    ```

### Paso 2: Instalación de Dependencias

Instalamos las dependencias necesarias para el desarrollo del backend:
```bash
npm install bcrypt dotenv express jsonwebtoken pg
```
### Paso 3: Configuración del Proyecto

1. Crear la estructura del proyecto:
    ```bash
    mkdir -p src/{controllers,models,routes,middlewares,config}
    touch src/app.js
    ```
2. Configurar el archivo `.gitignore` para excluir carpetas no relevantes:
    ```bash
    node_modules/
    .env
    ```
3. Crear el archivo `.env` para configurar las variables de entorno:
    ```bash
    DATABASE_USER=tu_usuario
    DATABASE_PASSWORD=tu_password
    DATABASE_NAME=tu_base_de_datos
    DATABASE_HOST=localhost
    DATABASE_PORT=5432
    JWT_SECRET=clave_super_secreta
    PUERTO_EXPRESS=3000
    ```
### Paso 4: Configuración de la Base de Datos

Crear las tablas necesarias en PostgreSQL utilizando las consultas SQL:

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recursos (
    id SERIAL PRIMARY KEY,
    tipo_recurso VARCHAR(100) NOT NULL,
    configuracion TEXT NOT NULL,
    estado VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_usuario INTEGER REFERENCES usuarios(id)
);
```
### Paso 5: Ejecutar el Servidor
1. Iniciar PostgreSQL y asegurarse de que la base de datos está corriendo.
2. Ejecutar el servidor en modo producción:
    ```bash
    node src/app.js
    ```
    Si la configuración es correcta, deberías ver un mensaje similar:
    ```bash
    Servidor corriendo en http://localhost:3000
    ```
---

### Flujo del Backend: Autenticación y Autorización (Auth)

El proceso de autenticación y autorización en el backend fue implementado siguiendo un flujo lógico que conecta la gestión de usuarios, la validación de credenciales y el control de acceso a los recursos protegidos.

1. **Inicio con el Modelo de Usuario** (`usuarioModelo.js`)
El modelo de usuario fue la base para interactuar con la tabla `usuarios` en la base de datos. Este modelo se encargó de definir las acciones principales relacionadas con los usuarios:
   - Crear un nuevo usuario (`crearUsuario`): Inserta un registro en la tabla `usuarios` con datos como nombre, email, contraseña encriptada y rol.
   - Buscar un usuario por email (`encontrarUsuarioPorEmail`): Consulta la base de datos para verificar si existe un usuario registrado con un email específico.

    Este paso sentó las bases para manejar las operaciones relacionadas con usuarios en las siguientes partes del sistema.

2. **Controlador de Autenticación** (`authController.js`)
El controlador implementó la lógica de negocio para las operaciones principales de autenticación:
   - Registro(`registrar`): 
     - Recibe datos como nombre, email, contraseña y rol desde el cliente.
     - Encripta la contraseña usando bcrypt para almacenarla de manera segura.
     - Inserta al usuario en la base de datos utilizando el modelo.
   - Inicio de sesión (`login`): 
     - Recibe las credenciales del usuario.
     - Busca al usuario en la base de datos y verifica que las credenciales coincidan.
     - Genera un **JSON Web Token (JWT)** que contiene información sobre el usuario (ID y rol). Este token permite el acceso a recursos protegidos.

3. **Rutas de Autenticación** (`authRoutes.js`)
Se definieron las rutas específicas para la autenticación:
   - `POST /auth/register`: Endpoint para registrar un nuevo usuario. Invoca la función registrar del controlador.
   - `POST /auth/login`: Endpoint para iniciar sesión. Invoca la función login del controlador.
  
    Estas rutas actúan como puntos de entrada para las solicitudes relacionadas con usuarios.

4. **Middleware de Autenticación y Autorización** (`authMiddleware.js`)
El middleware asegura que solo los usuarios autenticados y autorizados puedan acceder a ciertos endpoints:
   - Autenticación (`autenticar`):
     - Valida que el cliente envíe un token válido en el encabezado Authorization.
     - Verifica el token utilizando la clave secreta definida en las variables de entorno (`JWT_SECRET`).
     - Si el token es válido, agrega los datos del usuario al objeto `req` para que puedan ser utilizados en las siguientes funciones del flujo.
   - Autorización (`autorizar`):
     - Controla el acceso a los endpoints según los roles permitidos.
     - Solo permite continuar el flujo si el rol del usuario coincide con los roles autorizados para esa acción específica.

    El middleware se aplicó como una capa adicional en las rutas donde era necesario proteger recursos, como la gestión de recursos (recursos protegidos por roles específicos).
---

### Flujo del Backend: Gestión de Recursos

El proceso de gestión de recursos en el backend sigue un flujo lógico que conecta la manipulación de datos relacionados con los recursos de infraestructura y la validación de permisos de los usuarios mediante roles específicos.

1. **Modelo de Recursos** (`recursoModel.js`)
El modelo de recursos se encargó de manejar las operaciones directamente relacionadas con la base de datos para la tabla `recursos`. Este modelo permitió realizar las siguientes acciones:
   - Crear un recurso (`crearRecurso`): Inserta un registro en la tabla recursos, incluyendo el tipo de recurso, configuración, estado y el ID del usuario que lo creó.
   - Obtener recursos(`obtenerRecursos`): Inserta un registro en la tabla recursos, incluyendo el tipo de recurso, configuración, estado y el ID del usuario que lo creó.
   - Actualizar un recurso (`actualizarRecurso`): Actualiza los campos de un recurso específico según el ID proporcionado.
   - Eliminar un recurso (`eliminarRecurso`): Borra un recurso de la base de datos utilizando su ID.

    Este paso sirvió como base para implementar las operaciones de negocio relacionadas con recursos.

2. **Controlador de Recursos** (`recursoController.js`)
El controlador de recursos implementó la lógica de negocio para gestionar recursos y definir las acciones específicas para cada operación:

   - Crear un recurso (crearRecurso):
       - Valida los datos recibidos desde el cliente.
       - Inserta el recurso en la base de datos usando el modelo de recursos.
       - Devuelve una respuesta con el recurso creado.
   - Obtener recursos (obtenerRecursos):
       - Recupera todos los recursos registrados.
       - Devuelve una lista con los datos de los recursos al cliente.
   - Actualizar un recurso (actualizarRecurso):
       - Busca un recurso específico por su ID.
       - Actualiza los datos del recurso en la base de datos.
       - Devuelve una respuesta indicando el éxito de la operación.
   - Eliminar un recurso (eliminarRecurso):
       - Busca un recurso específico por su ID.
       - Lo elimina de la base de datos.
       - Devuelve una respuesta confirmando la eliminación.
  
    El controlador delega las operaciones relacionadas con la base de datos al modelo de recursos.

3. **Rutas de Recursos** (`recursoRoutes.js`)
Se definieron las rutas que conectan las solicitudes del cliente con las funciones del controlador de recursos. Además, se integró el middleware de autenticación y autorización para proteger estas rutas:

      - POST /recursos:
        - Permite a usuarios con roles Administrador o Operador crear recursos.
        - Invoca la función crearRecurso del controlador.
      - GET /recursos:
        - Permite a cualquier usuario autenticado obtener la lista de recursos.
        - Invoca la función obtenerRecursos del controlador.
      - PUT /recursos/:id:
        - Permite a usuarios con rol Administrador actualizar un recurso específico.
        - Invoca la función actualizarRecurso del controlador.
      - DELETE /recursos/:id:
        - Permite a usuarios con rol Administrador eliminar un recurso específico.
        - Invoca la función eliminarRecurso del controlador.
  
    Cada ruta está protegida por el middleware de autenticación y autorización (autenticar, autorizar) para garantizar el acceso seguro y controlado.

---
## FRONTEND:
#### DIRECTORIO COMPONENTES:
##### USO DE HOOKS:
- **useState**: Este hook es usado en los componentes React para almacenar las respuestas que se introducen mediante los formularios definidos con la sintaxis JSX en variables que luego serán enviadas al servidor para que procese la solicitud mediante métodos HTTP.
También se está usando useState para crear variables que permitirán mostrar componentes condicionales.

- **useEffect**: Usamos el hook useEffect que nos permitió realizar efectos secundarios en los componentes funcionales. De esta manera, usamos useEffect para realizar solicitudes a la API y, por ende, interactuar con el servidor.


#### DIRECTORIO 'SERVICES':
En este directorio, se encuentran dos archivos js: authService y recursoService.
Cada uno de estos archivos contendrán las funciones que se encargarán de realizar solicitudes a la API usando el protocolo HTTP y los métodos correspondiente para realizar acciones específicas y se lleven a cabo en el lado del servidor.
**authService:** Este archivo contendrá las funciones que se encargarán de realizar las llamadas a los endpoints de la API para permitir el registro y login del usuario.
```javascript
import axios from 'axios';

// URL base para las solicitudes de autenticación
const API_URL = 'http://localhost:5000/auth';

// funcionn para registrar un nuevo usuario
//Acá se realiza una solicitud con  el método post, donde se pasa los datos enviados del formulario, al endpoint de la API para el registro
const register = (data) => {
  return axios.post(`${API_URL}/register`, data);
};

// iniciar sesión de un usuario
const login = (data) => {
  return axios.post(`${API_URL}/login`, data);
};

// Exportar las funciones para usarlas en otros componentes
export default { register, login };
```

* En el archivo authService.js usamos axios para realizar las solicitudes HTTP a la API.
* Almacenamos, en una variable (API_URL), la ruta base, sobre la cual están definidos los endpoints /register y /login de la API.
*  Las funciones register y login se encargan de enviar una solicitud al servidor a las rutas indicadas.
*  Finalmente, se exportan las funciones para usarlas en los componentes y se puedan realizar las llamadas al servidor cuando el cliente interactúa con la interfaz de usuario.

-----
**recursoService:** Este archivo contendrá las funciones que se encargarán de realizar las llamadas a los endpoints de la API para permitir la creación, obtención, actualización y eliminación de los recursos.
Es decir, aquí estarán definidas las funciones que permitirán gestionar los recursos realizando llamadas a las rutas de la API.
```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000/recursos';

//Esta de aqui es una función que realiza la solicitud POST al servidor para crear un recurso
const createRecurso = (data, token) => {
  return axios.post(`${API_URL}/crear`, data, {
    //En el header se envía el token almacenado en el localStorage para poder realizar la autenticación
    headers: { Authorization: `Bearer ${token}` },
  });
};

// funcion que realiza una solicitud GET al servidor para obtener todos los recursos
const getRecursos = (token) => {
  return axios.get(`${API_URL}/listar`, {
    //Se usa el token para la autenticación
    headers: { Authorization: `Bearer ${token}` },
  });
};

// funsion que realiza una solicitud PUT al servidor para modificar el recurso
const updateRecurso = (id, data, token) => {
  //Se usa el token para la autenticación
  return axios.put(`${API_URL}/actualizar/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// funcion que realiza una solicitud DELETE al servidor para eliminar el recurso de la BD
const deleteRecurso = (id, token) => {
  console.log("id del recurso a eliminar AXIOS DELETE:",id);
  return axios.delete(`${API_URL}/eliminar/${id}`, {
    //Se usa el token para la autenticación
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Obteneemos un recurso específico por su ID
const getRecursoById = (id, token) => {
  return axios.get(`${API_URL}/listar/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export default { createRecurso, getRecursos, getRecursoById, updateRecurso, deleteRecurso };
```
* En primer lugar, se guarda en una variable la ruta base.
* Posteriormente, se crean las funciones para realizar las solicitudes HTTP al servidor:
  - función **createRecurso**: Se encargará de realizar una solicitud HTTP mediante el método POST a la ruta específica de la API. Aquí es donde el cliente envía en la cabecera de la solicitud, el token que se le fue enviado por el servidor para que se le pueda permitir el acceso a las rutas protegidas. El token es enviado en el header de la solicitud
  - función **getRecursos**: Realizará una solicitud mediante el método GET a la API y se obtengan los recursos almacenados en la base de datos.
  - función **updateRecurso**: Recibe como parámetro el 'id' del recurso a actualizar, la 'data' que contendrán los nuevos valores por los que se desea actualizar el recurso, así como el token. Con dichos datos, se realizará una solicitud al servidor mediante el método 'put' para actualizar el recurso.
  - función **deleteRecurso**: De la misma forma, recibe el 'id' y el token que se recibió por parte del servidor para que este se envíe, posteriormente, en el encabezado de la solicitud y se realice la eliminación del recurso.
  - función **getRecursoById**: Esta función se encarga de realizar una solicitud GET al servidor para obtener un recurso específico por su ID. 


----
# Evidencias:
![](https://github.com/Sebastiansaldana08/C8288_ProyectFinal/blob/master/Imagenes/InicioDeSesionAdmin.JPG)

![](https://github.com/Sebastiansaldana08/C8288_ProyectFinal/blob/master/Imagenes/Imagen2.JPG)

![](https://github.com/Sebastiansaldana08/C8288_ProyectFinal/blob/master/Imagenes/Imagen3.JPG)

![](https://github.com/Sebastiansaldana08/C8288_ProyectFinal/blob/master/Imagenes/Imagen4.JPG)

![](https://github.com/Sebastiansaldana08/C8288_ProyectFinal/blob/master/Imagenes/Imagen5.JPG)

![](https://github.com/Sebastiansaldana08/C8288_ProyectFinal/blob/master/Imagenes/Imagen6.JPG)

![](https://github.com/Sebastiansaldana08/C8288_ProyectFinal/blob/master/Imagenes/Imagen7.JPG)


## Funcionalidades avanzadas

### Implementación de Pruebas Unitarias para el Controlador de Autenticación

El objetivo de estas pruebas unitarias es garantizar el correcto funcionamiento de las funcionalidades principales del controlador de autenticación (authController). Estas incluyen:

- Registrar usuarios: Verificar que un usuario pueda registrarse correctamente en el sistema, con la contraseña encriptada y almacenada en la base de datos.
- Iniciar sesión: Validar que un usuario existente pueda iniciar sesión, autenticarse con sus credenciales y recibir un token JWT válido.

### Proceso
1. Configuración de las pruebas
   - Simulación de dependencias:
      - Se utilizaron mocks (jest.mock) para simular el comportamiento de las dependencias externas:
        - bcrypt: Para simular la encriptación y verificación de contraseñas.
        - usuarioModel: Para simular las operaciones de la base de datos relacionadas con usuarios (creación y búsqueda).
        - jsonwebtoken: Para simular la generación de tokens JWT.
   - Esto garantiza que las pruebas sean aisladas y no dependan de la funcionalidad real de estas dependencias externas.
  
    Datos simulados:
     - Se configuraron objetos simulados para representar la solicitud (req) y la respuesta (res), permitiendo evaluar cómo el controlador maneja estos datos.
  
2. Prueba del método registrar
Flujo esperado:

   - El controlador recibe datos de un nuevo usuario a través de la solicitud (req.body).
   - La contraseña del usuario se encripta usando bcrypt.
   - Los datos del usuario, incluyendo la contraseña encriptada, se envían al modelo para ser almacenados en la base de datos.
   - El controlador responde con un código HTTP 201 y un objeto JSON con los datos del usuario registrado.
  
    Validaciones clave:

     - bcrypt.hash se llama con los parámetros correctos para encriptar la contraseña.
     - usuarioModel.crearUsuario se llama con los datos adecuados, incluyendo la contraseña encriptada.
     - La respuesta incluye un código HTTP 201 y un objeto JSON con el usuario registrado.
3. Prueba del método login
   Flujo esperado:

      - El controlador recibe las credenciales del usuario a través de la solicitud (req.body).
      - Se busca al usuario en la base de datos utilizando el modelo.
      - La contraseña proporcionada se compara con la contraseña almacenada encriptada utilizando bcrypt.
      - Si las credenciales son correctas, se genera un token JWT utilizando jsonwebtoken.
      - El controlador responde con el token JWT generado.
  
    Validaciones clave:
      - usuarioModel.encontrarUsuarioPorEmail se llama con el correo electrónico proporcionado para buscar al usuario en la base de datos.
      - bcrypt.compare se llama con la contraseña proporcionada y la almacenada encriptada.
      - jwt.sign se llama con el payload adecuado (ID y rol del usuario) y la clave secreta (JWT_SECRET).
      - La respuesta incluye un token JWT válido y no genera errores de autenticación.
  
**Verificaciones Realizadas**
Registro de usuario:
   - La contraseña se encripta correctamente.
   - Los datos del usuario se almacenan en la base de datos con el método adecuado.
   - El controlador responde correctamente al cliente con un objeto JSON que incluye los datos del usuario registrado.
  
Inicio de sesión:
   - El usuario se busca en la base de datos utilizando su correo electrónico.
   - La contraseña proporcionada se compara correctamente con la contraseña almacenada encriptada.
   - Se genera un token JWT válido con un tiempo de expiración definido.
   - El controlador responde al cliente con el token generado.

---

### Implementación de Pruebas de Integración para las Rutas de Autenticación

El objetivo de esta sección fue implementar pruebas de integración para las rutas de autenticación. Estas pruebas verifican que múltiples componentes del sistema trabajen juntos de manera correcta, incluyendo el controlador, el modelo, la base de datos y las rutas configuradas.


### Proceso

1. Identificación de las rutas a probar

    Se seleccionaron las siguientes rutas relacionadas con la autenticación:

      - Registro de usuarios (POST /auth/register): Crea un nuevo usuario en la base de datos.
      - Inicio de sesión (POST /auth/login): Autentica al usuario y devuelve un token JWT.
2. Preparación del entorno de pruebas
Se configuró el entorno de pruebas para simular un entorno controlado:

   - Limpieza de datos previos y reinicio de contador de ID's:
     - Antes de ejecutar las pruebas, se eliminaron todos los registros dependientes en la tabla recursos y, posteriormente, en la tabla usuarios para evitar conflictos con restricciones de claves foráneas, asimismo se reinica el contador de ID's para evitar problemas con registros anteriores.
   - Finalización de recursos:
     - Después de las pruebas, se cerró la conexión a la base de datos para liberar recursos.
  
1. Implementación de las pruebas
    Prueba 1: Registro de Usuarios
   - Flujo probado:
     - Se envió una solicitud POST /auth/register con los datos de un nuevo usuario.
     - El controlador procesó los datos, encriptó la contraseña, y almacenó los datos en la base de datos.
     - La respuesta fue validada para asegurar:
       - Código HTTP 201 (creado).
       - La respuesta contiene los datos del usuario recién registrado, incluyendo su id y email.

    Prueba 2: Inicio de Sesión
   - Flujo probado:
     - Se envió una solicitud POST /auth/login con las credenciales del usuario recién registrado.
     - El controlador verificó las credenciales, generó un token JWT y devolvió una respuesta.
     - La respuesta fue validada para asegurar:
         - Código HTTP 200 (éxito).
         - La respuesta contiene un token de acceso (token).

    Uso de Herramientas
   - supertest: Se utilizó para simular solicitudes HTTP a las rutas del servidor sin necesidad de ejecutar el servidor en un puerto físico. Esto permitió probar la aplicación directamente desde el entorno de pruebas.
   - jest: Administró las pruebas, incluyendo la ejecución de configuraciones previas y el análisis de resultados.


    **Resultados Esperados**
   - Prueba de Registro:
     - Un nuevo usuario es registrado con éxito.
     - Los datos enviados coinciden con los almacenados en la base de datos.
     - La respuesta contiene un código 201 y los datos esperados del usuario.
   - Prueba de Inicio de Sesión:
     - El usuario puede iniciar sesión con las credenciales correctas.
     - El sistema genera un token JWT válido para el usuario.
     - La respuesta contiene un código 200 y el token generado.
---


### Implementación de Helmet:
Helmet va a ayudar a proteger la aplicación de algunas vulnerabilidades web mediante el establecimiento correcto de cabeceras HTTP.

En sí, Helmet es una herramienta fundamental que servirá para configurar y proteger las cabeceras HTTP en las respuestas de la aplicación web. De tal forma que al utilizar Helmet, se está añadiendo una capa extra de seguridad que ayuda a prevenir una amplia variedad de ataques comunes.

```javascript
//Importando Helmet para encabezados de seguridad HTTP
const helmet = require("helmet");

//Se usa el middleware a nivel de aplicación
app.use(helmet());
```

---

### Implementación de CORS:
El middleware CORS permitirá el acceso controlado a recursos de diferentes orígenes. En este caso, la comunicación entre el frontend y el backend, pues están en diferentes puertos:

```javascript
//Middleware a nivel de aplicación para configurar CORS
app.use(
  cors({
    origin: "http://localhost:3000", //Se permiten solicitudes solo de este dominio donde se está ejecutando el frontend
    optionsSuccessStatus: 200, //Para respuestas exitosas en los navegadores
  })
);
```

- Aquí se realiza la configuración para permitir SOLO solicitudes DESDE el dominio especificado en "origin".
- La opción **optionsSuccessStatus: 200** en el middleware CORS una directiva que especifica el código de estado HTTP que se debe enviar en respuesta a una solicitud de pre-vuelo (antes de enviar la petición real, se envía una petición de prevuelo para asegurarse de que el servidor permita esta interacción). Por lo que un código de estado 200 indica claramente que la solicitud de pre-vuelo fue exitosa y que el navegador puede proceder con la solicitud real.

---

### Optimización del rendimiento:
* **Compresión de respuesta HTTP:**
  
¿Por qué es encesaria la compresión de respuesta HTTP?
La compresión reduce el tamaño de los datos que se envían desde el servidor al cliente. Esto se logra aplicando algoritmos matemáticos que eliminan redundancias en los datos. De tal forma que al reducir el tamaño de los archivos, se disminuyen los tiempos de transferencia, lo que da como resultado páginas web que se cargan más rápido.

```javascript
//Middleware para comprimir respuestas HTTP
app.use(compression());
```

Al colocar app.use(compression()), se está indicando que se comprima automáticamente el cuerpo de todas las respuestas HTTP antes de que estas sean enviadas al cliente.

---

### Mejora de la gestión de errores y logging
* **Winston:**
Se usa winston para la gestión de logs. En sí, winston permitirá registrar todo lo que ocurre en la aplicación: desde mensajes de información hasta errores críticos. Esta información es importante, ya que servirá posteriormente para la depuración, incluso para monitorear el desempeño de la app y analizar el comportamiento de la misma.
En otras palabras, winston permitirá identificar y solucionar problemas de manera más eficiente.


```javascript
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

//Si no está en producción, agregar salida a consola para desarrollo
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(), // Logs simples para consola
    })
  );
}

module.exports = logger;
```

Inicialmente, se importan las siguientes funciones de Winston:
```javascript
 const { createLogger, format, transports } = require("winston");
```
-**createLogger**: Permitirá crear una nueva instancia de logger.

-**format**: Esta función permitirá personalizar el formato de los mensajes de log.

-**transports**: Acá se definen los destinos a donde se enviarán los logs (por ejemplo, archivos o en la consola).

Luego, se crea un logger:

```javascript
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
```

- **level: "info"** establece que solo se van a registrar mensajes con nivel de severidad "info" o superior, como warn, error, debug.
- **format: format.combine()** combina dos formatos:
  - **format.timestamp()**: Esto agregará una marca de tiempo a cada mensaje de log.
  - **format.json()**: Formatea los mensajes como objetos JSON.
- **Transports:** Define dónde se guardarán los logs:
  - **new transports.File({ filename: "logs/error.log", level: "error" })**: Esto crea un archivo error.log para guardar únicamente los mensajes de error.
  - **new transports.File({ filename: "logs/combined.log" })**: Esto crea un archivo combined.log para guardar todos los mensajes.

Posteriormente, si la aplicación se está ejecutando en un entorno de desarrollo (es decir, la variable de entorno NODE_ENV no es "production"), se agrega un transport adicional para mostrar los logs en la consola. Lo cual es útil para ver los mensajes de log en tiempo real mientras se desarrolla la aplicación:

```javascript
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      format: format.simple(), // Logs simples para consola
    })
  );
}
```
Así, aquí se está crean un logger de Winston que registra información detallada sobre la ejecución de la aplicación en archivos y, opcionalmente, en la consola. Esto va a permitir tener un mejor control sobre la aplicación y facilitará el mantenimiento.

---

### Integración de Morgan con Winston:
**Morgan**: Se encarga de registrar información detallada sobre las solicitudes HTTP que llegan a la aplicación.

¿Por qué Morgan?
1) Proporciona una visión clara de todas las solicitudes que recibe tu aplicación, incluyendo la hora, el método HTTP (GET, POST, etc.), la URL, el código de estado de la respuesta, el tiempo de respuesta y otra información relevante.
2) Depuración: Al registrar las solicitudes, se pueden identificar fácilmente errores y problemas en la aplicación. Por ejemplo, si una ruta no funciona como se espera, se podrán revisar los logs para ver qué está sucediendo.
3) Análisis: Los logs generados por Morgan pueden ser utilizados para analizar el comportamiento de la aplicación.

```javascript

//Importando Morgan y Logger
const morgan = require("morgan");
const logger = require("./config/logger");


//Integración de Morgan con Winston
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()), //Aquí se envían logs de Morgan a Winston
    },
  })
);

```
- Aquí se está utilizando el middleware de Morgan con el formato "combined". Este formato brindará una gran cantidad de información sobre cada solicitud, como el método HTTP, la URL, el código de estado, el tiempo de respuesta, etc.
* { stream: ... }:
   - Este objeto configura la salida de los logs de Morgan.
   - En lugar de enviar los logs directamente a la consola, se redirigen a un flujo personalizado.
     
- Esta línea es la que conecta Morgan con Winston.
* stream: { write: (message) => logger.info(message.trim()) }
   - **write**: Esta función se ejecuta cada vez que Morgan tiene un nuevo log.
   - **message**: Contiene el mensaje de log formateado por Morgan.
   - **logger.info(message.trim()):** El mensaje se envía al logger de Winston con el nivel de severidad "info". trim() eliminará cualquier espacio en blanco al principio o al final del mensaje.
 
Tener en cuenta lo siguiente:
- **Morgan** captura los detalles de las solicitudes HTTP, proporcionando una visión clara del tráfico de la aplicación.
- **Winston** permite personalizar y gestionar esos logs de manera eficiente, enviándolos a diferentes destinos y estableciendo diferentes niveles de detalle.

---

### Despliegue mejorado con Docker Compose
Actualización del archivo docker-compose.yml para incluir Redis:

```javascript
version: '3.8'

services:
  backend:
    build:
      context: ./proyecto-autorization
      dockerfile: Dockerfile.backend
    env_file:
      - ./proyecto-autorization/.env
    ports:
      - "5000:5000"
    depends_on:
      - db
      - redis #Se agrega Redis como dependencia del backend

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"

  db:
    image: postgres:13
    restart: always
    environment:
      POSTGRES_HOST_AUTH_METHOD: trust
    ports:
      - "5433:5432"
    volumes:
      - db-data:/var/lib/postgresql/data

  redis: # Configuración del servicio Redis
    image: redis:6-alpine
    restart: always
    ports:
      - "6379:6379"

volumes:
  db-data:
```

---

### Integración de redis en el Backend:
Aquí se está implementando redis como caché. Se almacenan los datos de acceso frecuente para reducir la carga en la base de datos y acelerar las respuestas. Para ello, se almacenan los resultados de consultas a la base de datos que se realizan con frecuencia, con el objetivo de proporcionar un almacenamiento en memoria rápido y flexible.

```javascript
//Mediante 'path', indico la ruta en que se encuentra el archivo .env
require("dotenv").config({ path: "../../.env" });

//Con este cliente de la base de datos podré conectarme
const { Pool } = require("pg");
const redis = require("redis");

//Creo un objeto pool para realizar la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  port: process.env.DATABASE_PORT,
});

//Se configura el cliente de Redis
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || "redis", //Se usa el host configurado o el nombre del servicio en Docker
  port: process.env.REDIS_PORT || 6379,    //Se usa el puerto configurado o el puerto por defecto 6379
});

//Manejo de errores en Redis
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

//Exporto tanto el cliente de la base de datos como el cliente Redis
module.exports = { pool, redisClient };
```

---

### Uso en controladores para cachear datos 

```javascript
// Handler function para obtener TODOS los recursos con Redis Cache
const obtenerRecTodo = async (req, res) => {
  try {
    // Verifico si los recursos están en la caché de Redis
    redisClient.get("recursos", async (err, data) => {
      if (err) {
        console.error("Error al acceder a Redis:", err);
        throw err;
      }

      if (data) {
        // Si los recursos están en Redis, los envío directamente al cliente
        console.log("Recursos obtenidos desde Redis Cache");
        return res.json(JSON.parse(data));
      } else {
        // Si no están en Redis, los obtengo desde la base de datos
        console.log("Recursos no están en Redis. Consultando la base de datos...");
        const recursos = await recursoModel.obtenerRecurso();

        // Almaceno los recursos en Redis con un tiempo de expiración de 1 hora
        redisClient.setex("recursos", 3600, JSON.stringify(recursos));

        // Envío los recursos al cliente
        res.json(recursos);
      }
    });
  } catch (error) {
    console.error("Error al obtener los recursos:", error);
    res.status(500).json({ error: "No se pudo obtener los recursos" });
  }
};
```

Aquí primero se verifica si los datos solicitados se encuentran en la caché de Redis.
Si está, entonces se envían esos datos almacenados en la caché de Redis DIRECTAMENTE al cliente (lo cual reduce la latencia).
Sin embargo, si NO lo está, entonces se consulta a la base de datos; una vez que se obtiene respuesta, se almacena en la caché de Redis y, posteriormente, se envía la respuesta al cliente.

---

```javascript
const actualizar = async (req, res) => {
  console.log("Iniciando controlador de actualización...");
  try {
    const { id } = req.params;
    const { tipo_recurso, configuracion, estado } = req.body.recurso || req.body;

    const recursoActualizado = await recursoModel.actualizarRecurso(id, tipo_recurso, configuracion, estado);

    if (!recursoActualizado) {
      return res.status(404).json({ error: "Recurso no encontrado." });
    }

    //Actualizo la caché de Redis para reflejar los cambios
    redisClient.del("recursos"); //Se eliminan los datos almacenados en caché
    res.json(recursoActualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el recurso. Revisa los logs del servidor." });
  }
};
```

```javascript
// Handler function para eliminar un recurso
const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const respuesta = await recursoModel.eliminarRecurso(id);

    // Elimina la caché después de la operación
    redisClient.del("recursos");

    res.json(respuesta);
  } catch (error) {
    res.status(500).json({ error: "No se puede eliminar el recurso" });
  }
};
```

Para las operaciones de actualización y eliminación de recursos, se usa redis, pero para eliminar los datos anteriores almacenados en caché.

----

### INSTRUCCIONES PARA LA EJECUCIÓN DE LA APLICACIÓN

### 1) Clonar el repositorio:
Se clona el repositorio para obtener todas las carpetas y archivos necesarios para preparar el entorno de la ejecución:

git clone -b <nombre_de_la_rama> https://github.com/Sebastiansaldana08/C8288_ProyectFinal

### 2) Instalar las dependencias:
Una vez que se ha clonado el repositorio, ingresar a las siguientes carpetas: "frontend" y "proyecto_autorizacion"
- Dentro de la carpeta "frontend" (cd frontend), ejecutar el comando "npm install" (ya que allí se encuentra el package.json) para instalar las dependencias necesarias.
- Dentro de la carpeta "proyecto-autorization", de igual manera, ejecutar el comando "npm install"

### 3) Archivo .env:
Modificar las variables de entorno que se encuentran en el archivo .env de acuerdo a la configuración de la base de datos Postgres local.

### 4) Ejecución del backend y del frontend:
En 2 terminales apartes, ejecutar los siguientes comandos:
 * Backend:
   - Ingresar a "proyecto-autorization", luego a "src" y allí ejecutar "node server.js"
 * Frontend:
   - Ingresar a "frontend", y ejecutar, allí, "npm start".

### 4) Interacción con la aplicación:
- Finalmente, en el navegador, el frontend se ejecutará automáticamente y se podrá interactuar con la app. 