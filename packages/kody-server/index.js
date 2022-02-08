// index.js
import dotenv from 'dotenv'
import express from 'express'
import { Package } from "kodyfire-core";

dotenv.config()
const PORT = process.env.PORT || 3555;
const app = express();
var router = express.Router();


app.use('/api', router);
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

router.get('/', function (req, res) {
    res.send('Hello World!');
  });
  router.get('/kodies', async (req, res) =>{
    const {LERNA_ROOT_PATH:path} = process.env;
    console.log(path)
    const packages = await Package.getInstalledKodiesFromPath(path);
    res.send(packages);
  })