FROM node:20-alpine

WORKDIR /app

# Instala dependencias primero
COPY package*.json ./
RUN npm install
RUN npm install -g @nestjs/cli@latest

# Copia solo configuraciones que no cambian
COPY .env tsconfig*.json ./

EXPOSE 3000
CMD ["npm", "run", "start:dev"]
