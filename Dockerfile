FROM node
MAINTAINER felinae
RUN mkdir /home/app
WORKDIR /home/app
ADD . /home/app
RUN npm install
CMD ["nodejs", "index.js"]
