### INSTRUCCIONES PARA LA EJECUCIÓN DE LA APLICACIÓN

### 1) Clonar el repositorio:
Se clona el repositorio para obtener todas las carpetas y archivos necesarios para preparar el entorno de la ejecución:

```bash
git clone -b <nombre_de_la_rama> https://github.com/Sebastiansaldana08/C8288_ProyectFinal
```

### 2) Instalar las dependencias:
Una vez que se ha clonado el repositorio, ingresar a las siguientes carpetas: "frontend" y "proyecto_autorizacion"
- Dentro de la carpeta "frontend" (cd frontend), ejecutar el comando **npm install** (ya que allí se encuentra el package.json) para instalar las dependencias necesarias.
- Dentro de la carpeta "proyecto-autorization", de igual manera, ejecutar el comando 

  ```bash
  npm install
  ```

### 3) Archivo .env:
Agregar y modificar las variables de entorno que se encuentran en el archivo .env de acuerdo a la configuración de la base de datos Postgres local.

  ```sql
  DATABASE_USER=""
  DATABASE_HOST=""
  DATABASE_NAME=""
  DATABASE_PASSWORD=""
  DATABASE_PORT=""
  JWT_SECRET=""
  PUERTO_EXPRESS="5000"
  ```


### 4) Ejecución del backend y del frontend:
En 2 terminales apartes, ejecutar los siguientes comandos:
 * Backend:
   - Ingresar a "proyecto-autorization", luego a "src" y allí ejecutar:
    ```bash
    node server.js
    ```
 * Frontend:
   - Ingresar a "frontend", y ejecutar el siguiente comando:
  
    ```bash
    npm start
    ```

### 4) Interacción con la aplicación:
- Finalmente, en el navegador, el frontend se ejecutará automáticamente y se podrá interactuar con la app.

---

### Evidencias de la interacción con la app:

![](https://github.com/Sebastiansaldana08/C8288_ProyectFinal/blob/master/Imagenes/Imagen1.png)

![](https://github.com/Sebastiansaldana08/C8288_ProyectFinal/blob/master/Imagenes/Imagen2.png)

![](https://github.com/Sebastiansaldana08/C8288_ProyectFinal/blob/master/Imagenes/Imagen3.png)
