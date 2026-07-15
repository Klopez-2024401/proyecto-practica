# Kairo - Plataforma de Gestión de Tareas y Productividad

Este es un proyecto estructurado como monorepo que implementa un sistema robusto y seguro de gestión de tareas con estadísticas avanzadas de productividad.

---

## 🏗️ Arquitectura del Proyecto

El sistema está dividido en una arquitectura de microservicios e interfaz frontend:

1. **Frontend (`proyecto-practica`):** Aplicación de cliente desarrollada en React + Vite + CSS puro. Consume los tres microservicios utilizando Axios y gestiona la sesión a través de JWT.
2. **Servicio de Autenticación (`service-auth`):** Servicio independiente para el registro de usuarios, inicio de sesión, generación de JWT, hashing de contraseñas con Argon2 y envío de correos de verificación.
3. **Servicio A: Gestión de Tareas (`ms-gestion-tarea`):** API para registrar, editar, eliminar, consultar y filtrar tareas en base al usuario autenticado.
4. **Servicio B: Productividad (`ms-productividad`):** Calcula dinámicamente las estadísticas del usuario (porcentaje de completación, tareas pendientes, tareas vencidas y resumen por prioridad) consumiendo datos del Servicio A mediante comunicación HTTP interna.

---

## 🚀 Funcionalidades Paso a Paso

### 1. Autenticación y Cuentas de Usuario

* **Paso 1: Registro de Cuenta**
  * Accede a la página de registro.
  * Ingresa tu nombre, apellido, nombre de usuario, correo electrónico, teléfono (opcional) y sube una foto de perfil (opcional, integrada con Cloudinary).
  * El sistema valida que los campos sean correctos y envía un código de verificación por correo electrónico (mediante SMTP/Nodemailer).
* **Paso 2: Verificación de Cuenta**
  * La cuenta se crea en estado inactivo. Para activarla, introduce el código enviado a tu correo en la pantalla de verificación o haz clic en el enlace adjunto.
* **Paso 3: Inicio de Sesión**
  * Ingresa usando tu correo o nombre de usuario y tu contraseña.
  * El servidor valida las credenciales y devuelve un **JSON Web Token (JWT)** firmado, que el frontend almacena localmente y adjunta de forma automática en cada petición subsecuente en la cabecera `Authorization: Bearer <token>`.
  * Si intentas iniciar sesión sin verificar tu cuenta, el sistema te lo advertirá y te dará la opción de reenviar el código.

---

### 2. Gestión de Tareas (CRUD Completo)

* **Crear Tarea:**
  * Presiona el botón **"Nueva tarea"** en la sección de tareas.
  * Completa el formulario: **Título (requerido)**, **Descripción**, **Prioridad** (Baja, Media, Alta) y **Fecha Límite**.
  * Al guardar, la tarea se registra en MongoDB asociada a tu `userId` y se agrega inmediatamente a la tabla sin necesidad de recargar la página.
* **Visualizar y Filtrar:**
  * Las tareas se muestran en una tabla con badges de colores según su prioridad.
  * Puedes cambiar el estado de la tarea directamente desde el selector de la tabla (**Pendiente**, **En progreso**, **Completada**). Esto realiza una petición `PATCH /tasks/:id/status` asíncrona.
* **Editar Tarea:**
  * Presiona el botón de edición (lápiz) en la fila de la tarea.
  * Se abre el modal reutilizando el formulario con la información precargada. Al modificar los campos y guardar, la interfaz refleja los cambios en tiempo real (`PUT /tasks/:id`).
* **Eliminar Tarea:**
  * Presiona el botón de eliminar (basura).
  * Se muestra un cuadro de diálogo para confirmar la acción antes de borrar la tarea definitivamente (`DELETE /tasks/:id`).

---

### 3. Dashboard de Productividad (Servicio B)

* **Estadísticas de Tareas (Hot Metrics):**
  * El dashboard lee tus tareas y calcula cuatro métricas principales en tiempo real:
    1. **Tareas Totales** registradas.
    2. **Completadas** y su porcentaje relativo.
    3. **Pendientes** y su porcentaje relativo.
    4. **Vencidas:** Tareas cuya fecha límite ya pasó y su estado no es "Completada".
* **Gráfico de Completación Circular:**
  * Muestra de manera visual y premium el porcentaje de progreso de tus tareas completadas mediante un círculo de gradiente dinámico.
* **Actividad de Tareas (Últimos 7 días):**
  * Grafica mediante barras dinámicas la cantidad de tareas que has creado en cada uno de los últimos 7 días.
* **Listas de Análisis:**
  * **Actividad Reciente:** Listado dinámico de las 3 tareas completadas más recientemente.
  * **Próximos Vencimientos:** Listado dinámico de las 3 tareas pendientes más próximas a vencer (mostrando los días restantes o si ya han expirado).

---

## 🛠️ Cómo Ejecutar el Proyecto

### Requisitos Previos
* Tener **Node.js** instalado (versión LTS recomendada).
* Tener **pnpm** instalado globalmente (`npm install -g pnpm`).
* Tener una instancia activa de **MongoDB** local en `mongodb://127.0.0.1:27017/Kairo` o configurada según el archivo `.env` de cada servicio.

### Pasos para iniciar el sistema completo:

1. **Instalar Dependencias:**
   Ejecuta lo siguiente en el directorio raíz del monorepo para instalar las dependencias de todas las carpetas:
   ```bash
   pnpm install
   ```

2. **Sección de Base de Datos / Semilla:**
   Si es tu primera vez iniciando el proyecto, puedes poblar MongoDB con un usuario de prueba verificado ejecutando el seed en `service-auth`:
   ```bash
   cd service-auth
   pnpm run seed
   cd ..
   ```
   *Credenciales del usuario semilla:*
   * **Usuario / Correo:** `usuario_prueba` / `test@kairo.com`
   * **Contraseña:** `Test1234!`

3. **Iniciar los Servicios y Frontend:**
   Abre terminales independientes para cada componente e inicia el servidor de desarrollo:
   
   * **Servicio de Autenticación (Puerto 4001):**
     ```bash
     cd service-auth
     pnpm run dev
     ```
   * **Servicio de Tareas (Servicio A - Puerto 3003):**
     ```bash
     cd ms-gestion-tarea
     pnpm run dev
     ```
   * **Servicio de Productividad (Servicio B - Puerto 3002):**
     ```bash
     cd ms-productividad
     pnpm run dev
     ```
   * **Frontend React (Vite - Puerto 5173):**
     ```bash
     cd proyecto-practica
     pnpm run dev
     ```

4. **Acceso al Sistema:**
   Abre tu navegador e ingresa a `http://localhost:5173` para empezar a usar la aplicación.
