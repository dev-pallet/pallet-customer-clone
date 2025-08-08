FROM node:20
WORKDIR /app
COPY package*.json ./
COPY . ./
ARG MY_ENV
ARG GEO_API_KEY
ARG NODE_ENV
ENV MY_ENV=${MY_ENV}
ENV GEO_API_KEY=${GEO_API_KEY}
ENV NODE_ENV=${NODE_ENV}
RUN echo "Hey Your ENV is : "$MY_ENV
RUN yarn
RUN yarn run build:client
RUN yarn run build:server
ENV PORT 3002
EXPOSE ${PORT}
CMD [ "yarn","run", "start" ]
