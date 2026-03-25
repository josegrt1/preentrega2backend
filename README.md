# Backend Entrega Final

Proyecto final de backend desarrollado en Node.js + Express, aplicando arquitectura por capas, patrón Repository, autenticación con JWT, autorización por roles, recuperación de contraseña por correo y lógica de compra con generación de ticket.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT
- Passport
- Bcrypt
- Nodemailer
- Cookie-parser
- Dotenv

## Funcionalidades principales

- Registro e inicio de sesión de usuarios
- Autenticación con JWT
- Ruta `/current` con DTO para evitar exponer datos sensibles
- Middleware de autorización por roles
- Gestión de productos
- Gestión de carritos
- Validación de carrito propio
- Recuperación de contraseña por correo con expiración de 1 hora
- Prevención de reutilización de contraseña anterior
- Compra de carrito con generación de ticket
- Descuento de stock automático al comprar
- Arquitectura por capas:
  - Routers
  - Controllers
  - Services
  - Repositories
  - DAO
  - DTO
  - Middlewares

## Estructura general del proyecto

```bash
src/
  config/
  controllers/
  dao/
  docs/
  dto/
  middlewares/
  models/
  repositories/
  routes/
  services/
  utils/
  app.js
Instalación

Clona el repositorio:

git clone https://github.com/josegrt1/preentrega2backend.git

Entra a la carpeta del proyecto:

cd preentrega2backend

Instala las dependencias:

npm install
Variables de entorno

Crea un archivo .env en la raíz del proyecto con las siguientes variables:

PORT=8080
MONGO_URL=tu_cadena_de_conexion_mongodb
JWT_SECRET=tu_clave_secreta_jwt
MAIL_USER=tu_correo
MAIL_PASS=tu_clave_de_aplicacion
PERSISTENCE=MONGO
Ejecución

Para correr el proyecto en modo desarrollo:

npm run dev
Endpoints principales
Sessions
POST /api/sessions/register
POST /api/sessions/login
GET /api/sessions/current
POST /api/sessions/forgot-password
POST /api/sessions/reset-password
Products
GET /api/products
GET /api/products/:pid
POST /api/products
PUT /api/products/:pid
DELETE /api/products/:pid
Carts
POST /api/carts
GET /api/carts/:cid
POST /api/carts/:cid/product/:pid
PUT /api/carts/:cid
PUT /api/carts/:cid/products/:pid
DELETE /api/carts/:cid/products/:pid
DELETE /api/carts/:cid
POST /api/carts/:cid/purchase
Flujo de recuperación de contraseña
El usuario solicita recuperación desde /forgot-password
Se envía un correo con enlace de recuperación
El token expira en 1 hora
El sistema valida que la nueva contraseña no sea igual a la anterior
Luego el usuario puede iniciar sesión con la nueva contraseña
Flujo de compra
El usuario autenticado compra su carrito con POST /api/carts/:cid/purchase
Se valida que el carrito pertenezca al usuario
Se verifica stock de los productos
Se descuenta stock de los productos disponibles
Se genera un ticket con:
código
monto
comprador
Se actualiza el carrito dejando fuera los productos comprados
