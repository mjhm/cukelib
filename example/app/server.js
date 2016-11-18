const express = require('express');
const exprestive = require('exprestive');

const app = express();
app.use(exprestive());
app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server in ${process.env.NODE_ENV} mode listening on ${process.env.PORT}`);
});
