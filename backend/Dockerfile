FROM node

WORKDIR /app/backend

COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 9947

CMD [ "npm", "start" ]
