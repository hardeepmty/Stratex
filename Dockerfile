FROM node:slim
WORKDIR /app
COPY ./backend/package*.json ./
COPY ./backend /app
RUN npm install
EXPOSE 8000
CMD node app.js