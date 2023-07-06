# Use a imagem base do Node.js
FROM node:20-alpine

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie o arquivo package.json e o package-lock.json (se existir)
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o código-fonte da API para o contêiner
COPY . .

RUN npm run build


EXPOSE 3000

# CMD [ "node", "dist/src/main.js" ]
