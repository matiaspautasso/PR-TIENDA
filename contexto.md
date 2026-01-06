se va a implementar una bd postgresSQL
desarrollar una api para crud de prod, para que sea independiente de la interfaz de gestion
implementar un un front para trabajar con la api de crud
separar la api de la tienda online, de la api de gestion crud, permitiendo independizar y modulurizar morando el mantenimiento y escalado 

/configuraciones estará el o los archivos o módulos “mjs” de configuración,
como la conexión a la base de datos entre otros.
● /modulos estarán los distintos módulos que se encargan del CRUD. Por ahora
tenemos solamente /productos.
● /rutas la lógica de enrutamiento intermedio. Esto significa que las rutas del
CRUD estarán aquí, para luego importarlas desde el archivo “servidor.mjs”
que dará inicio a la aplicación.
● /utilidades estarán los archivos que contendrán funcionalidades diversas.
● servidor.mjs será el punto de entrada a la aplicación.

paquetes:
Una vez creada la estructura, vamos a inicializar el proyecto con NPM e instalar todos
los paquetes necesarios:
● express
● pg
ors paquete que trabaja con las cabeceras de control de acceso. Lo
utilizaremos en la API que consuma la tienda virtual.
● compression instalaremos este paquete que se ocupa de la compresión de los
datos enviados al cliente (ver cabeceras Content-Encoding y Accept-Encoding).
Este paquete optimiza la carga entre peticiones.
● multer
141 este paquete nos va a posibilitar gestionar de manera sencilla la
subida de imágenes de los productos al servidor.

endpoints :
GET /api-crud/productos Obtiene todos los productos
GET /api-crud/productos/{id} Obtiene un producto por su ID
POST /api-crud/productos Crea un nuevo producto (ver tabla de
campos)
PUT /api-crud/productos/{id} Modifica un producto (ver tabla de
campos)
DELETE /api-crud/productos/{id} Elimina un producto por su ID

Rutas de la API para la tienda v1
Documentamos las rutas de la versión 1 de la API de la tienda.
GET /api/v1/productos Obtiene todos los productos
GET /api/v1/productos/{id} Obtiene un producto por su ID
● En caso de éxito devuelve un ARRAY en formato JSON
● En caso de error, todaslasrutas devuelven un JSON con la propiedad “mensaje”

funcionamiento del proyecto : 
Descripción general
El proyecto implementa una aplicación web para la gestión y consulta de productos de una tienda, utilizando una arquitectura modular y separando la API de gestión (CRUD) de la API pública de la tienda. Utiliza Node.js con Express, una base de datos PostgreSQL, y un frontend sencillo en HTML, CSS y JS.

Estructura principal
servidor.mjs:
Es el punto de entrada. Configura Express, aplica middlewares, define rutas principales y levanta el servidor en el puerto 3000.

api-crud/:
Contiene la lógica de la API CRUD para administración de productos (alta, baja, modificación, consulta).

api/:
Contiene la API pública (por ejemplo, para la tienda online) que expone los productos para consumo externo.

vistas/crud/:
Contiene los archivos HTML, CSS y JS del frontend de administración.

Funcionamiento de las rutas
1. API CRUD de productos (Administración)
Endpoints principales (ver contexto.md):

GET /api-crud/productos — Lista todos los productos.
GET /api-crud/productos/:id — Obtiene un producto por ID.
POST /api-crud/productos — Crea un nuevo producto (con imagen).
PUT /api-crud/productos/:id — Modifica un producto.
DELETE /api-crud/productos/:id — Elimina un producto.
Rutas y controladores:

Definidas en rutas.productos.mjs y controlador.producto.mjs.
Usan middlewares como multer para la subida de imágenes (util.multer.mjs).
Base de datos:

Conexión y consultas en baseDeDatos.mjs y modelo.productos.mjs.
2. API pública de la tienda (v1)
Endpoints principales:

GET /api/v1/productos — Lista todos los productos.
GET /api/v1/productos/:id — Obtiene un producto por ID.
Rutas y controladores:

Definidas en api.rutas.mjs y api.controlador.mjs.
3. Frontend de administración
Acceso:
Los archivos HTML para la administración se sirven en /api-crud/admin/, por ejemplo:

/api-crud/admin/inicio.html
listado.html
altaProducto.html
modificarProducto.html
Funcionalidad:

Los JS del frontend consumen la API CRUD para mostrar, crear, modificar y eliminar productos.
Ejemplo: productos.js carga productos usando fetch('/api-crud/productos').
Imágenes:

Las imágenes de productos se sirven desde /api/imagenes/.
Resumen del flujo
El usuario accede al frontend de administración en /api-crud/admin/....
El frontend realiza peticiones AJAX a la API CRUD (/api-crud/productos) para gestionar productos.
La API CRUD interactúa con la base de datos y gestiona imágenes.
La API pública (/api/v1/productos) expone los productos para la tienda online o apps externas.
Puedes ver la configuración de rutas en servidor.mjs, la lógica de administración en rutasAdmin.mjs, y la API pública en rutasApi.mjs.

