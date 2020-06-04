const { Router } = require('express');

// Routes
const index = require('./index');
const users = require('./users');

const apiRoutes = Router();

apiRoutes.use('/', index);
apiRoutes.use('/users', users);

module.exports = apiRoutes;