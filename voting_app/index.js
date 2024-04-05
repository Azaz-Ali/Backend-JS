const express = require('express');
const app = express();
const db = require('./db');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8000;
require('dotenv').config()

app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  