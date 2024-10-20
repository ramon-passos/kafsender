FROM node:18.15.0-alpine

RUN mkdir -p /kafsender

WORKDIR /kafsender

COPY . .

RUN npm install

CMD ["npm", "run", "serve"]
