# 💰 Chespirito - Gestión de Monedas y Billetes Antiguos

**Chespirito** es una plataforma completa para la compra y venta de monedas y billetes antiguos. El sistema cuenta con una API REST construida en Node.js que gestiona toda la lógica de negocio, y una segunda aplicación frontend desarrollada en Nuxt.js que permite a los clientes explorar y comprar productos con redirección directa a WhatsApp para concretar la compra.

---

## 🚀 Tecnologías utilizadas

**Backend**
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT / Passport.js
- Multer (para manejo de imágenes)
- Joi (validación de datos)
- AWS SDK (almacenamiento de imágenes)
- Docker (opcional para contenedores)

**Frontend**
- Vue 3
- Nuxt.js
- Pinia (gestión de estado)
- SweetAlert2 (notificaciones)
- use-http (para consumo de API)

---

## 🧩 Funcionalidades principales

🔐 **Panel administrativo (API)**
- Autenticación con JWT
- Gestión de usuarios
- CRUD de productos, categorías e inventario
- Registro de ventas
- Control de stock y productos disponibles
- Gestión de imágenes con AWS S3
- Filtros por categoría, fecha o nombre
- Middleware de autenticación y validación

🛒 **Frontend para compradores**
- Visualización de productos por categoría
- Filtros dinámicos
- Información detallada del producto
- Botón de compra que redirige automáticamente al vendedor vía WhatsApp
- Diseño responsivo

---

## 📂 Estructura del proyecto

chespirito/
├── controllers/
├── models/
├── routes/
├── services/
├── middlewares/
├── config/
├── uploads/
├── index.js


---

## ⚙️ Instalación del backend

1. Clona el repositorio:

```bash
git clone https://github.com/AndresRojo12/chespirito.git
cd chespirito
PORT=3000
DB_HOST=localhost
DB_NAME=chespirito_db
DB_USER=postgres
DB_PASSWORD=yourpassword
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

npm run migrations:run
npm run dev
