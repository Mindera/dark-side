'use strict';
var container = require('./di/container');

// Bootstrap DI container
require('./di/config');
require('./di/darth-vader');
require('./di/officers');

module.exports = container.get('darth-vader');