// index.js
import dotenv from 'dotenv';
import express from 'express';
import { Package } from 'kodyfire-core';
import fs from 'fs';
import bodyParser from 'body-parser';
import path, { join } from 'path';

dotenv.config();
const PORT = process.env.PORT || 3555;
const app = express();
var router = express.Router();

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);
app.use('/api', router);
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

router.get('/', function (req, res) {
  res.send('Hello World!');
});

router.post('/kodies', async (req, res) => {
  const { LERNA_ROOT_PATH: rootPath } = process.env;
  var body = req.body;
  var filePath = join(rootPath, 'kody.json');
  fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
  res.send(body);
});
router.get('/kodies/:id', async (req, res) => {
  const { LERNA_ROOT_PATH: rootPath } = process.env;
  var { id } = req.params;
  if (
    fs.existsSync(
      join(rootPath, 'node_modules', id, 'src/parser/validator/schema.json')
    )
  ) {
    let data = fs.readFileSync(
      join(rootPath, 'node_modules', id, 'src', 'parser/validator/schema.json')
    );
    res.send(JSON.parse(data.toString()));
  } else {
    res.status(404).send('Package not found');
  }
});
router.get('/kodies', async (req, res) => {
  const { LERNA_ROOT_PATH: path } = process.env;
  const packages = await Package.getInstalledKodiesFromPath(path);
  res.send(packages);
});
