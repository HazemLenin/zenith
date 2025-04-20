const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/', require('./routes/pages'));

app.listen(3000, () => {
  console.log('server is running');
});
