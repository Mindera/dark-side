var _ = require('lodash');
var exceptions = require('./common/exceptions/exceptions');

var darthVader = function (fleetPlans, fleetRegistry, starDestroyerFactory) {

    function initFleet() {
        validateFleetPlans(fleetPlans);

        _.forOwn(fleetPlans, function (config, configName) {
            validateDestroyerPlans(config);

            var destroyerPlans = fleetPlans[configName];
            var profileName = destroyerPlans.profile;
            var size = destroyerPlans.size;

            var destroyer = starDestroyerFactory.createDestroyer(profileName, size);
            fleetRegistry.registerStarDestroyer(profileName, destroyerPlans.characteristics, configName, destroyer);
        });
    }

    function validateFleetPlans(poolsConfig) {
        if (_.size(poolsConfig) === 0) {
            throw new Error('The pools configurations are empty!');
        }
    }

    function validateDestroyerPlans(poolConfig) {
        if (_.isUndefined(poolConfig) || _.isNull(poolConfig) || _.isEmpty(poolConfig)) {
            throw new Error('The pools configuration is not valid!');
        }

        if (!_.isString(poolConfig.profile) && _.isEmpty(poolConfig.profile)) {
            throw new Error('The profile name is invalid!');
        }

        if (!_.isNumber(poolConfig.size)) {
            throw new Error('The size is invalid!');
        }
    }

    function getOneFighterFromDestroyer(starDestroyer) {
        if (!_.isUndefined(starDestroyer)) {
            return starDestroyer.getOneFighter();
        } else {
            throw new exceptions.NotFoundException('No element available on any pool');
        }
    }

    initFleet();

    return {
        pickOne: function (properties) {
            var starDestroyer = fleetRegistry.getStarDestroyerByProperties(properties);
            return getOneFighterFromDestroyer(starDestroyer);
        },

        pickOneRandomly: function () {
            var starDestroyer = fleetRegistry.getADestroyer();
            return getOneFighterFromDestroyer(starDestroyer);
        }
    };
};
darthVader.$inject = ['fleet-plans', 'fleet-registry', 'star-destroyer-factory'];
module.exports = darthVader;
