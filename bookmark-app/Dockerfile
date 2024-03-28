FROM node:20

RUN npm install -g prisma

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

COPY prisma ./

RUN prisma generate

RUN prisma migrate deploy  

RUN npm run build

CMD [ "npm", "run", "start:prod" ]