const minimist = require('minimist');

const parsedArgs = minimist(process.argv);

const port = parsedArgs.port || process.env.SERVER_PORT || 3000;

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.use((req, res) => {
  // eslint-disable-next-line no-console
  console.log('got req');
  res.json(req.body);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}!`);
});
