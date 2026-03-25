FROM node:20-alpine AS base

WORKDIR /app
COPY package*.json ./

FROM base AS dev

ENV NODE_ENV=development
RUN npm install

COPY tsconfig.json ./
COPY src ./src

EXPOSE 3333
CMD ["npm", "run", "dev:container"]

FROM base AS build

RUN npm install
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM base AS runtime

ENV NODE_ENV=production
RUN npm install --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 3333
CMD ["npm", "start"]
