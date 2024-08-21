FROM node:22


WORKDIR /app

COPY . /app

RUN npm install
RUN npm i -g nodemon

EXPOSE 3000

ENV NAME ssa-api

CMD ["nodemon", "./dist/index.js"]