# LTS version of Node.js
FROM node:20.9.0-alpine

RUN mkdir -p /app

WORKDIR /app

ENV NPM_CONFIG_CACHE=/home/node/.npm

COPY package*.json ./

RUN mkdir -p $NPM_CONFIG_CACHE && chown -R node:node $NPM_CONFIG_CACHE

RUN npm install

COPY . .

RUN npm run build

# Copy the env substitution script and ensure it is executable
COPY docker/30-env-subst.sh /docker-entrypoint.d/30-env-subst.sh
RUN chmod +x /docker-entrypoint.d/30-env-subst.sh

ENTRYPOINT ["/bin/sh", "-c", "/docker-entrypoint.d/30-env-subst.sh && exec \"$@\"", "--"]

EXPOSE 3000

CMD ["npm", "start", "--", "-p", "3000"]
