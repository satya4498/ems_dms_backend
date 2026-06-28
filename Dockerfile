FROM node:20.11.1-alpine AS builder

# install dependencies needed for native modules (bcrypt) and build
RUN apk add --no-cache git build-base gcc abuild make bash postgresql-client tini python3

RUN mkdir -p /home/node/app && chown node:node /home/node/app

USER node

WORKDIR /home/node/app

ENV DEBIAN_FRONTEND=noninteractive

ARG PORT=8080
EXPOSE 8080 9229 9230

COPY --chown=node:node ./package*.json ./

RUN npm install

COPY --chown=node:node . .

RUN make build

FROM node:20.11.1-alpine AS production

RUN apk add --no-cache tini postgresql-client

RUN mkdir -p /home/node/app && chown node:node /home/node/app

USER node

WORKDIR /home/node/app

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

COPY --from=builder --chown=node:node /home/node/app/package*.json ./
COPY --from=builder --chown=node:node /home/node/app/node_modules ./node_modules/
COPY --from=builder --chown=node:node /home/node/app/dist ./dist
COPY --from=builder --chown=node:node /home/node/app/.sequelizerc ./

EXPOSE 8080

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["npm", "run", "start"]
