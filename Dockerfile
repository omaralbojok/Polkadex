FROM node:latest

WORKDIR /node

COPY ["package.json", "package-lock.json", "./node/"]

RUN npm install --production

COPY . .

CMD [ "npm", "run", "build" ]