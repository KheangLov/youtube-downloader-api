FROM node:14-slim

ADD package.json .
ADD okteto-stack.yaml /okteto-stack.yaml
RUN npm install

EXPOSE 3000

COPY index.js .

CMD npm start