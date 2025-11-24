FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm install

RUN npm rebuild sqlite3

ENV PATH=/app/node_modules/.bin:$PATH

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
