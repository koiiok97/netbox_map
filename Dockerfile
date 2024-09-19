FROM node:18.19.1-alpine3.19
WORKDIR /app
COPY . /app

EXPOSE 5173

CMD ["npm", "run", "dev"]