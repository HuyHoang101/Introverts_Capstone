FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install -g nodemon
RUN npm install

COPY . .

EXPOSE 5000
CMD ["npx", "nodemon", "index.js"]
