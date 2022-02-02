// index.js
require('dotenv').config()
const express = require("express");

const PORT = process.env.PORT || 3555;
console.log(process.env);
const app = express();
var router = express.Router();
app.use('/api', router);
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

router.get('/', function (req, res) {
    res.send('Hello World!');
  });