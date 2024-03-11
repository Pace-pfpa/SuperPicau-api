FROM node:18

WORKDIR /user/src/app
COPY . .
RUN apt update && apt upgrade
RUN apt install -y python3 python3-pip



# Volte para o diretório raiz
WORKDIR /user/src/app
RUN apt-get install -y python3-requests
RUN apt-get install -y python3-bs4


RUN npm install
RUN yarn add cors morgan

CMD npm run serve
