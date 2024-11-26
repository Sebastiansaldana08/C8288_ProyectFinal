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