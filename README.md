# Backend II - Entrega Final

Proyecto final de backend para e-commerce desarrollado con **Node.js, Express, MongoDB y Mongoose**, aplicando **arquitectura por capas**, **patrón Repository**, **autenticación con Passport y JWT**, **autorización por roles**, **recuperación de contraseña por correo** y **lógica de compra con generación de ticket**.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Passport
- JWT
- Bcrypt
- Nodemailer
- Cookie-parser
- Dotenv

## Arquitectura implementada

El proyecto fue reorganizado utilizando una estructura por capas para separar responsabilidades y mejorar la mantenibilidad:

- **Routers**: definen los endpoints
- **Controllers**: reciben la request y delegan la lógica
- **Services**: contienen la lógica de negocio
- **Repositories**: encapsulan el acceso a datos
- **DAO / Models**: interacción con MongoDB y Mongoose
- **DTO**: evita exponer información sensible del usuario en `/current`

## Funcionalidades principales

### Autenticación y usuarios
- Registro de usuarios
- Login con Passport
- Generación de JWT
- Persistencia del token en cookie HTTP-only
- Creación automática de carrito al registrar un usuario
- Ruta `/api/sessions/current` protegida con Passport
- Uso de `CurrentUserDTO` para no exponer datos sensibles

### Recuperación de contraseña
- Endpoint para solicitar recuperación por email
- Envío de correo con enlace de restablecimiento
- Token JWT de recuperación con expiración de **1 hora**
- Validación para impedir reutilizar la contraseña anterior

### Productos
- Listado de productos con:
  - paginación
  - filtros
  - ordenamiento
- Obtención de producto por ID
- Crear, actualizar y eliminar productos
- Restricción por rol: solo **admin** puede hacer `POST`, `PUT` y `DELETE`

### Carritos
- Crear carrito
- Obtener carrito por ID
- Agregar producto al carrito
- Eliminar producto del carrito
- Vaciar carrito
- Middleware `validateCartOwner` para garantizar que cada usuario solo opere sobre su propio carrito

### Compra y ticket
- Endpoint `POST /api/carts/:cid/purchase`
- Validación de carrito vacío
- Validación de stock
- Descuento de stock al comprar
- Generación de ticket de compra
- Los productos sin stock suficiente quedan en el carrito como no procesados

---

## Endpoints principales

## Sessions
- `POST /api/sessions/register` → registrar usuario
- `POST /api/sessions/login` → iniciar sesión
- `GET /api/sessions/current` → obtener usuario actual autenticado
- `POST /api/sessions/forgot-password` → solicitar recuperación de contraseña
- `POST /api/sessions/reset-password` → restablecer contraseña

## Products
- `GET /api/products` → obtener productos con paginación/filtros/sort
- `GET /api/products/:pid` → obtener producto por ID
- `POST /api/products` → crear producto (**admin**)
- `PUT /api/products/:pid` → actualizar producto (**admin**)
- `DELETE /api/products/:pid` → eliminar producto (**admin**)

## Carts
- `POST /api/carts` → crear carrito
- `GET /api/carts` → obtener carritos
- `GET /api/carts/:cid` → obtener carrito por ID
- `POST /api/carts/:cid/products/:pid` → agregar producto al carrito
- `DELETE /api/carts/:cid/products/:pid` → eliminar producto del carrito
- `DELETE /api/carts/:cid` → vaciar carrito
- `POST /api/carts/:cid/purchase` → finalizar compra y generar ticket

---

## Middlewares implementados

### `passport.authenticate("current", { session: false })`
Protege rutas que requieren usuario autenticado.

### `authorize("admin")`
Permite acceso solo a usuarios con rol `admin` en operaciones sobre productos.

### `validateCartOwner`
Valida que el carrito pertenezca al usuario autenticado antes de permitir operaciones sobre él.

---

## DTO implementado

La ruta `/api/sessions/current` devuelve un `CurrentUserDTO` con los siguientes campos:

- `id`
- `first_name`
- `last_name`
- `email`
- `age`
- `role`
- `cart`


---

## Variables de entorno

```env
PORT=8080
MONGO_URL=tu_conexion_mongodb
JWT_SECRET=tu_secreto_jwt
JWT_COOKIE_NAME=authToken
MAIL_USER=tu_correo
MAIL_PASS=tu_clave_o_password_de_aplicacion
FRONTEND_URL=http://localhost:8080


- Instalación y ejecución

Clonar el repositorio
Instalar dependencias:

npm install

Crear archivo .env
Ejecutar el proyecto:

npm run dev

Servidor por defecto:

http://localhost:8080


- Estructura general del proyecto

src/
  controllers/
  dao/
  dto/
  middlewares/
  models/
  repositories/
  routes/
  services/
  utils/

