# LTS version of Node.js
FROM node:20.9.0-alpine

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build 

EXPOSE 4455

# Start the app on port 4455 as recommended by ory
CMD ["npm", "start", "--", "-p", "4455"]