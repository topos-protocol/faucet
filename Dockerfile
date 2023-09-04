FROM node:lts-alpine

ARG VITE_SUBNET_REGISTRATOR_CONTRACT_ADDRESS
ARG VITE_TOPOS_CORE_PROXY_CONTRACT_ADDRESS
ARG VITE_TOPOS_SUBNET_ENDPOINT
ARG VITE_TRACING_SERVICE_NAME
ARG VITE_TRACING_SERVICE_VERSION
ARG VITE_ELASTIC_APM_ENDPOINT
ARG VITE_RECAPTCHA_SITE_KEY

WORKDIR /usr/src/app

COPY package*.json ./
COPY packages/frontend/package.json ./packages/frontend/package.json
COPY packages/backend/package.json ./packages/backend/package.json

RUN npm ci

COPY . ./

RUN npm run frontend:build

CMD npm run backend:build && npm run backend:start:prod
