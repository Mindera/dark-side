'use strict';

var container = require('./container');
var YAML = require('yamljs');
var fleetPlans = YAML.load('./conf/pools-conf.yml');
var profilesConf = YAML.load('./conf/profiles-conf.yml');
var appConfigYml = YAML.load('./conf/app-conf.yml');
var appConfig = require('../conf/app-config');

container.register('fleet-plans', fleetPlans);
container.register('profiles-conf', profilesConf);
container.register('app-config-yml', appConfigYml);
container.register('app-config', appConfig);