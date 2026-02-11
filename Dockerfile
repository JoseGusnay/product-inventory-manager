# --- Etapa 1: Construcción ---
FROM node:22-alpine AS build

WORKDIR /app

# Copia archivos de configuración
COPY package.json package-lock.json* yarn.lock* ./

# Instala dependencias
RUN npm install

# Copia el código fuente
COPY . .

# Construye la aplicación
RUN npm run build

# --- Etapa 2: Servidor ---
FROM nginx:alpine

# Copia el build de Angular al directorio de Nginx
# El nombre de la carpeta de salida según angular.json es prueba-tecnica
COPY --from=build /app/dist/product-inventory-manager/browser /usr/share/nginx/html

# Copia una configuración básica de Nginx para manejar rutas de Angular
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
