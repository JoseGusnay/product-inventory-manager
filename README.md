# Product Inventory Manager

Este proyecto es una solución integral para la gestión de productos financieros, construida utilizando las funcionalidades más modernas de **Angular v21**.

---

## 🛠️ Requisitos Previos

Para ejecutar este proyecto de forma local, asegúrate de tener instalado:

- **Node.js**: `v22.x` o `v24.x` (LTS recomendadas) o `v20.19.0+`.
- **Yarn** o **npm** (Se usó Yarn durante el desarrollo).
- **Angular CLI**: `v21.x` (Opcional, se puede ejecutar vía scripts de npm).

---

## 📦 Instalación y Ejecución

El proyecto se divide en dos partes: el **Servidor de API** (Backend) y la **Aplicación Angular** (Frontend).

### 1. Levantar el Backend (API)

Ubicado en la carpeta `repo-interview-main`.

```bash
# Entrar a la carpeta del backend
cd repo-interview-main

# Instalar dependencias
yarn install  # o npm install

# Iniciar servidor en modo desarrollo
yarn start:dev  # o npm run start:dev
```

_El servidor correrá en `http://localhost:3002`._

### 2. Levantar el Frontend (Angular)

Desde la raíz del proyecto.

```bash
# Instalar dependencias
yarn install  # o npm install

# Iniciar aplicación Angular
yarn start  # o npm start
```

_La aplicación se abrirá en `http://localhost:4200`._

---

## 🧪 Testing y Calidad

Hemos implementado una suite de pruebas rigurosa asegurando que cada pieza clave del sistema funcione correctamente.

### Ejecutar Pruebas

```bash
# Ejecutar todos los tests
yarn test

# Ejecutar tests con reporte de cobertura (Coverage)
yarn test:coverage
```

---

## 🐳 Ejecución con Docker

Para una experiencia más rápida y sin necesidad de instalar dependencias locales, puedes usar Docker Compose:

```bash
# Construir y levantar ambos contenedores (Back y Front)
docker-compose up --build
```

- **Frontend**: `http://localhost:4200`
- **Backend**: `http://localhost:3002`

---
