FROM node:18-alpine

WORKDIR /app

COPY package.json package.json
COPY tsconfig.json tsconfig.json
COPY package-lock.json package-lock.json

RUN npm install

COPY index.ts index.ts
COPY prisma prisma

RUN npm run build

ENTRYPOINT [ "npm", "start" ]