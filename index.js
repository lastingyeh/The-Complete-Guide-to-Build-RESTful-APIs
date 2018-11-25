const config = require('config');
const express = require('express');
const logger = require('./startup/logging');

const app = express();

require('./startup/config')(config);
require('./startup/routers')(app);
require('./startup/db')(config);
require('./startup/validation')();

// server start
const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));
