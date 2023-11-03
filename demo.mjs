import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import {fastify}  from "fastify";
import { createOCREngine } from "tesseract-wasm";
import { loadWasmBinary } from "tesseract-wasm/node";
import sharp from "sharp";
import  fileUpload  from 'fastify-file-upload'

async function loadImage(path) {
  const image = await sharp(path).ensureAlpha();
  const { width, height } = await image.metadata();
  return {
    data: await image.raw().toBuffer(),
    width,
    height,
  };
}

/** Resolve a URL relative to the current module. */
function resolve(path) {
  return fileURLToPath(new URL(path, import.meta.url).href);
}
const wasmBinary = await loadWasmBinary();
const engine = await createOCREngine({ wasmBinary });
const model = readFileSync("chi_sim.traineddata");
engine.loadModel(model);

const app = fastify({logger: true});

app.register(fileUpload)

app.get("/", async (request, reply) => {  
  console.log(`starting index`, Date.now().toLocaleString());
  const image = await loadImage("6.png");
  engine.loadImage(image);
  const text = engine.getText((progress) => {
    process.stderr.write(`\rRecognizing text (${progress}% done)...`);
  });
  console.log(`ending`, Date.now().toLocaleString());
  reply.send({
    code:200,
    text:text,
  });
});

app.post('/ocr',  async function (req, reply) {
  // some code to handle file
  console.log(`starting index`, Date.now().toLocaleString());
  const file = req.body.file
  const image = await loadImage(file.data);
  engine.loadImage(image);
  const text = engine.getText((progress) => {
    console.log(`\rRecognizing text (${progress}% done)...`);
  });
  console.log(`ending`, Date.now().toLocaleString());
  reply.send({
    code:200,
    text:text,
  });
})

app.listen({
  port: 3000,
  host: "0.0.0.0"
}, (err, address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
  app.log.info(`server listening on ${address}`)
})
