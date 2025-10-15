# Etapa 1: Construcción (build)
FROM node:20 AS builder
WORKDIR /app

# Copiar dependencias y hacer instalación limpia
COPY package*.json ./
RUN npm i

# Copiar el resto del proyecto y compilar
COPY . .
RUN npm run build -- --configuration=production

# Etapa 2: Servir la app con Nginx
FROM nginx:alpine
# Copiamos el resultado del build de Angular
COPY --from=builder /app/dist/setup/browser /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
