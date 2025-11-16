# Etapa 1: Base
FROM node:18-alpine

# Creamos el directorio de trabajo
WORKDIR /usr/src/app

# Copiamos el package.json y package-lock.json
COPY package*.json ./

# Instalamos SOLO las dependencias de producción
RUN npm install --only=production

# Copiamos el resto de los archivos del proyecto
COPY . .

# Exponemos el puerto
EXPOSE 8080

# Comando para arrancar la aplicación
CMD ["node", "src/app.js"]