FROM node:8

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app
RUN npm install
#RUN npm run compile

# Bundle app source
COPY . /usr/src/app

EXPOSE 4200
CMD ["npm", "start"]
