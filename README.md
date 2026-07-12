# 🐉 ESFOTgo — Frontend

**Aplicación de geolocalización para el campus de la ESFOT — EPN, Quito, Ecuador**

---

## 🎯 Sobre el Proyecto

**ESFOTgo** es una aplicación web de geolocalización desarrollada por y para los estudiantes de la **Escuela de Formación de Tecnólogos (ESFOT)** de la Escuela Politécnica Nacional. 

Permite explorar el campus de manera interactiva, encontrar aulas, laboratorios y oficinas, visualizar rutas de transporte, gestionar eventos académicos y solicitar tutorías con docentes.

---

## ✨ Funcionalidades

### 🗺️ Mapa Interactivo
- Visualización del campus con mapa 360°
- Rutas de transporte (Polibus)
- Ubicación en tiempo real del usuario

### 📅 Eventos
- Listado público de eventos académicos
- Creación y edición de eventos (admin/docente)
- Estado en tiempo real: Live, Próximo, Finalizado
- Imagen de portada por evento

### 🦉 Tutorías
- Publicación de tutorías por docentes
- Horarios disponibles por día
- Control de cupo máximo
- Estados: activo / inactivo

### 👤 Perfiles
- Actualización de datos personales
- Cambio de foto de perfil
- Cambio de contraseña
- Recuperación de contraseña por correo

### 💬 Chat
- Chat privado entre usuarios
- Chat general (admin y docentes)
- Notificaciones en tiempo real con Socket.io

### 🛠️ Administración
- Gestión de estudiantes (carga masiva por Excel)
- Gestión de docentes (carga masiva por Excel)
- Activar / Inactivar cuentas
- Cambio de roles
- Gestión de aulas y rutas (Carga masiva por .txt)

---

## 🛠️ Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | Framework UI |
| Vite | 7 | Bundler |
| TailwindCSS | 4 | Estilos |
| React Router | 7 | Navegación |
| Zustand | 5 | Estado global |
| Axios | 1.16 | Peticiones HTTP |
| React Hook Form | 7 | Formularios |
| Socket.io Client | 4.8 | Chat en tiempo real |
| React Leaflet | 5 | Mapas interactivos |
| Pannellum | 2.5 | Vistas 360° |
| React Toastify | 11 | Notificaciones |
| React Icons | 5 | Iconografía |

---

## 🏗️ Arquitectura

El proyecto sigue una **arquitectura limpia por capas**:

```
┌─────────────────────────────────┐
│           PÁGINAS (pages/)      │  ← Composición de componentes
├─────────────────────────────────┤
│        COMPONENTES (components/)│  ← UI reutilizable
├─────────────────────────────────┤
│           HOOKS (hooks/)        │  ← Lógica de negocio
├─────────────────────────────────┤
│         SERVICIOS (services/)   │  ← Comunicación con la API
├─────────────────────────────────┤
│         CONTEXTO (context/)     │  ← Estado global (Zustand)
└─────────────────────────────────┘
```

### Principios aplicados
- ✅ **Separación de responsabilidades** — cada capa tiene un único propósito
- ✅ **Servicio centralizado** — toda comunicación con la API pasa por `services/`
- ✅ **Hooks reutilizables** — lógica compartida extraída en hooks independientes
- ✅ **Componentes desacoplados** — los componentes no llaman a la API directamente
- ✅ **Naming consistente** — convención en español para dominio del negocio

---

## 📁 Estructura del Proyecto

```
├── 📁 public
│   ├── 🖼️ Buho_1.png
│   ├── 🖼️ Dragon_1.png
│   ├── 🖼️ Dragon_Esfot.png
│   ├── 🖼️ buho.png
│   ├── 🖼️ dragon_logo_1.png
│   ├── 🖼️ dragon_logo_2.png
│   ├── 🖼️ profile.png
│   └── 🖼️ vite.svg
├── 📁 src
│   ├── 📁 assets
│   │   ├── 🖼️ Logo.png
│   │   ├── 🖼️ buho.png
│   │   ├── 🖼️ dragon.png
│   │   ├── 🖼️ dragonc.png
│   │   ├── 🖼️ esfot.jpeg
│   │   ├── 🖼️ esfot21.jpeg
│   │   ├── 🖼️ fondo.png
│   │   ├── 🖼️ images.png
│   │   ├── 🖼️ profile.png
│   │   └── 🖼️ react.svg
│   ├── 📁 components
│   │   ├── 📁 Teacher
│   │   │   ├── 📄 DocenteCard.jsx
│   │   │   └── 📄 DocenteList.jsx
│   │   ├── 📁 Tutoring
│   │   │   ├── 📄 TutoriaCard.jsx
│   │   │   ├── 📄 TutoriaCardUpdate.jsx
│   │   │   ├── 📄 TutoriaForm.jsx
│   │   │   ├── 📄 TutoriaHorario.jsx
│   │   │   ├── 📄 TutoriaList.jsx
│   │   │   └── 📄 TutoriaStatusBadge.jsx
│   │   ├── 📁 classroom
│   │   │   ├── 📄 AulaCard.jsx
│   │   │   ├── 📄 AulaCardUpdate.jsx
│   │   │   ├── 📄 AulaForm.jsx
│   │   │   └── 📄 AulaList.jsx
│   │   ├── 📁 event
│   │   │   ├── 📄 EventoCard.jsx
│   │   │   ├── 📄 EventoCardUpdate.jsx
│   │   │   ├── 📄 EventoForm.jsx
│   │   │   ├── 📄 EventoGrid.jsx
│   │   │   └── 📄 EventoList.jsx
│   │   ├── 📁 map
│   │   │   ├── 📄 Importar.jsx
│   │   │   ├── 📄 MapComponent.jsx
│   │   │   └── 📄 Mapcreate.jsx
│   │   ├── 📁 profile
│   │   │   ├── 📄 PasswordForm.jsx
│   │   │   ├── 📄 ProfileCard.jsx
│   │   │   └── 📄 ProfileForm.jsx
│   │   ├── 📁 ruta
│   │   │   └── 📄 RutaList.jsx
│   │   └── 📁 student
│   │       └── 📄 EstudianteList.jsx
│   ├── 📁 context
│   │   ├── 📄 storeAuth.jsx
│   │   └── 📄 storeProfile.jsx
│   ├── 📁 hooks
│   │   ├── 📁 auth
│   │   │   ├── 📄 useForgot.js
│   │   │   ├── 📄 useLogin.js
│   │   │   ├── 📄 useRegister.js
│   │   │   └── 📄 useReset.js
│   │   ├── 📁 classroom
│   │   │   ├── 📄 useAulaForm.js
│   │   │   └── 📄 useAulas.js
│   │   ├── 📁 events
│   │   │   ├── 📄 useEventoForm.js
│   │   │   ├── 📄 useEventoUpdate.js
│   │   │   ├── 📄 useEventos.js
│   │   │   ├── 📄 useImageBase64.js
│   │   │   └── 📄 useUbicaciones.js
│   │   ├── 📁 profile
│   │   │   ├── 📄 usePasswordForm.js
│   │   │   └── 📄 useProfileForm.js
│   │   ├── 📁 ruta
│   │   │   └── 📄 useRutas.js
│   │   ├── 📁 student
│   │   │   └── 📄 useEstudiantes.js
│   │   ├── 📁 teacher
│   │   │   └── 📄 useDocentes.js
│   │   └── 📁 tutoring
│   │       ├── 📄 useHorarios.js
│   │       ├── 📄 useTutoriaForm.js
│   │       ├── 📄 useTutoriaUpdate.js
│   │       └── 📄 useTutorias.js
│   ├── 📁 layout
│   │   └── 📄 Dashboard.jsx
│   ├── 📁 pages
│   │   ├── 📄 Chat.jsx
│   │   ├── 📄 Classroom.jsx
│   │   ├── 📄 DashboardHome.jsx
│   │   ├── 📄 Event.jsx
│   │   ├── 📄 ExcelUpload.jsx
│   │   ├── 📄 Forgot.jsx
│   │   ├── 📄 Home.jsx
│   │   ├── 📄 List.jsx
│   │   ├── 📄 Login.jsx
│   │   ├── 📄 Map.jsx
│   │   ├── 📄 Profile.jsx
│   │   ├── 📄 Register.jsx
│   │   ├── 📄 Reset.jsx
│   │   ├── 📄 Tutoria.jsx
│   │   └── 📄 Tutoring.jsx
│   ├── 📁 routes
│   │   ├── 📄 ProtectedRoute.jsx
│   │   └── 📄 PublicRoute.jsx
│   ├── 📁 services
│   │   ├── 📄 aulaService.js
│   │   ├── 📄 authService.js
│   │   ├── 📄 docenteService.js
│   │   ├── 📄 estudianteService.js
│   │   ├── 📄 eventService.js
│   │   ├── 📄 profileServices.js
│   │   ├── 📄 rutaService.js
│   │   └── 📄 tutoriaService.js
│   ├── 📁 utils
│   │   ├── 📄 eventoUtils.js
│   │   └── 📄 tutoriaUtils.js
│   ├── 📄 App.jsx
│   ├── 🎨 index.css
│   └── 📄 main.jsx
├── ⚙️ .env.example
├── ⚙️ .gitignore
├── 📝 README.md
├── 📄 eslint.config.js
├── 🌐 index.html
├── ⚙️ package-lock.json
├── ⚙️ package.json
└── 📄 vite.config.js
```

---

## 🚀 Instalación

- Node.js >= 18
- npm >= 9

```bash
# 1. Clona el repositorio
git clone https://github.com/Katherine137/ESFOTGO_COMPONENTE_FRONTEND.git
cd ESFOTGO_COMPONENTE_FRONTEND

# 2. Instala las dependencias
npm install

# 3. Copia el archivo de variables de entorno
cp .env.example .env

# 4. Configura las variables de entorno (ver sección siguiente)

# 5. Inicia el servidor de desarrollo
npm run dev
```

---

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_BACKEND_URL=https://tu-backend.com/api
```
---

## 👥 Roles de Usuario

| Rol | Acceso |
|---|---|
| `admin` | Dashboard completo, gestión de usuarios, aulas, rutas, mapa |
| `docente` | Crear y gestionar tutorías y eventos, chat |
| `user` (estudiante) | Ver eventos, ver tutorías disponibles, perfil |

### Rutas protegidas

| Ruta | Acceso |
|---|---|
| `/` | Público |
| `/login` | Público (redirige si hay sesión) |
| `/register` | Público |
| `/map` | Público |
| `/dashboard/*` | Requiere token |
| `/dashboard/mapcreate` | Solo `admin` |
| `/dashboard/tutoring` | Solo `docente` |
| `/dashboard/tutoria` | Solo `user` |
| `/dashboard/list/*` | `admin` y `docente` |

---

## 👩‍💻 Autores

Desarrollado por estudiantes de la **ESFOT — Escuela Politécnica Nacional**

| Nombre | GitHub |
|---|---|
| Katherine Sailema | [@Katherine137](https://github.com/Katherine137) |

---

<div align="center">
  Desarrollado con ❤️ para la comunidad ESFOT
</div>