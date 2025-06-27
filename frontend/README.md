# Parcial_2
PrePaga Salud

# 🏥 PrePagaSalud

Aplicación web para cotizar y administrar planes de medicina prepaga en Argentina. Desarrollada con React y Bootstrap, ofrece una interfaz intuitiva tanto para usuarios que buscan planes de salud como para administradores que gestionan el contenido.

---

## 🚀 Características principales

### 👤 Usuario público
- Formulario de cotización de planes según:
  - Edad
  - Grupo familiar
  - Prepaga (proximamente)
- Resultados dinámicos con lista de planes disponibles.
- Validaciones de campos requeridos (nombre, email).

### 🔐 Panel de administración
- Login de administradores.
- ABM de:
  - Planes de salud
  - Prepagas
  - Usuarios administradores
- Validaciones de formularios.

---

## 🛠️ Tecnologías utilizadas

- **Frontend:**
  - React
  - React Router
  - React Bootstrap
  - Context API (para autenticación)
- **Backend:**
  - Node.js + Express
  - MongoDB (según estructura de datos)
- **Estilos:**
  - Bootstrap 5

---

## 🧪 Validaciones y UX

- Validación nativa de formularios con Bootstrap (`Form.Control.Feedback`)
- Validación adicional en JavaScript (por ejemplo, campos vacíos, edad numérica, etc.)
- Manejo de estado con `useState`, `useEffect`, y `useContext`.

---


# Datos del autor
- Alumno: Herminia G. Bento
- Materia: Aplicaciones Híbridas
- Docente: Jonathan Emanuel Cruz
- Comisión: DW4TAV