FROM node:20-alpine3.16 as build-step
RUN mkdir -p /app
WORKDIR /app
COPY package.json /app
#RUN npm install -g npm@9.6.7
RUN npm install
COPY . /app
RUN npm run build --prod

FROM nginx:stable-alpine
COPY --from=build-step /app/dist/eFirma-front /usr/share/nginx/html
EXPOSE 4200:80