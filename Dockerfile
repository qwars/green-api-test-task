FROM node:22-alpine as greenapi

WORKDIR /usr/src/application

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn set version stable

RUN yarn install

RUN chown -R node:node /usr/src/application/node_modules

COPY . ./

USER node

EXPOSE 3000
