const express = require('express');
const path = require('path');
console.log('Hello everyone!');
const configPath = path.join(__dirname, '..', 'config', '.env');
require('dotenv').config({ path: configPath });
require('colors');
const errorHandler = require('./middlewares/errorHandler');

const conectDb = require('../config/conectDb');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api/v1', require('./routes/carsRoute'));

app.use(errorHandler);

conectDb();

app.listen(process.env.PORT, () => {
  console.log(`Server running. Use port: ${process.env.PORT}`.green.italic.bold);
});
