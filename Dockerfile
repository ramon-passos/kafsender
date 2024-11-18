FROM node:18.15.0-alpine

RUN mkdir -p /kafsender

WORKDIR /kafsender

RUN apk add make

COPY . .

RUN npm install

CMD ["npm", "run", "serve"]
