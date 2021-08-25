FROM node

WORKDIR /home/node/app

COPY src/package*.json ./
RUN npm install
