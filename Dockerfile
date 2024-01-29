FROM node:20.11.0-buster-slim as base

# Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl

FROM base as development

WORKDIR /usr/src/app

COPY package.*json .

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

CMD ["npm","run","dev"]
