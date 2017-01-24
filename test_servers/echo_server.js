
const express = require('express');
const bodyParser = require('body-parser');
const minimist = require('minimist');

const parsedArgs = minimist(process.argv);

const port = parsedArgs.port || process.env.SERVER_PORT || 3000;

const app = express();

app.use((req, res, next) => {
  if (req.query.statusCode) {
    res.status(req.query.statusCode);
  }
  next();
});

app.all('/text/*', bodyParser.text({ type: '*/*' }), (req, res) => {
  res.send(req.body);
});

app.use(bodyParser.json());

app.post('/set_cookie', (req, res) => {
  const [name, value, options] = req.body;
  res.cookie(name, value, options);
  res.sendStatus(200);
});

app.post('/set_cookies', (req, res) => {
  req.body.forEach((cookieParams) => {
    const [name, value, options] = cookieParams;
    res.cookie(name, value, options);
  });
  res.sendStatus(200);
});

app.use((req, res) => {
  res.json(req.body);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}!`);
});
