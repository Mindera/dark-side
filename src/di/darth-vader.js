'use strict';

var container = require('./container');
var fleetRegistry = require('../fleet-registry');
var starDestroyerFactory = require('../death-star/star-destroyer-factory');
var darthVader = require('../darth-vader');
var starDestroyer = require('../star-destroyer/star-destroyer');

container.register('fleet-registry', fleetRegistry);
container.register('star-destroyer-factory', starDestroyerFactory);
container.register('darth-vader', darthVader);
container.register('star-destroyer', starDestroyer);