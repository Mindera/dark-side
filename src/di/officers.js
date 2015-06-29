'use strict';

var container = require('./container');
var commander = require('../star-destroyer/officers/commander');
var chiefMechanic = require('../star-destroyer/officers/chief-mechanic');
var deckOfficer = require('../star-destroyer/officers/deck-officer');
var rolesDelegator = require('../death-star/roles-delegator');
var officersTraining = require('../death-star/officers-training');

container.register('commander', commander, 'unique');
container.register('chief-mechanic', chiefMechanic, 'unique');
container.register('deck-officer', deckOfficer, 'unique');
container.register('roles-delegator', rolesDelegator);
container.register('officers-training', officersTraining);