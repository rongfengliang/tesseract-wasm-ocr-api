FROM node:18.18.2-bullseye-slim
WORKDIR /app
COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock
COPY demo.mjs /app/demo.mjs
COPY chi_sim.traineddata /app/chi_sim.traineddata
RUN yarn
EXPOSE 3000
ENTRYPOINT [ "node","demo.mjs" ]