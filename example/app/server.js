const express = require('express');
const exprestive = require('exprestive');

var app = express();
app.use(exprestive());
app.listen(process.env.PORT, () => {
  console.log(`Server in ${process.env.NODE_ENV} mode listening on ${process.env.PORT}`);
});
