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
        if (_.isUndefined(starDestroyer)) {
            throw exceptions.buildNotFoundException('Pool not found');
        }
        return starDestroyer.getOneFighter();
    }

    function getScrapYardFromDestroyer(starDestroyer) {
        if (_.isUndefined(starDestroyer)) {
            throw exceptions.buildNotFoundException('Pool not found');
        }
        return starDestroyer.getScrapYard();
    }

    function getFightersOnDeckFromDestroyer(starDestroyer) {
        if (_.isUndefined(starDestroyer)) {
            throw exceptions.buildNotFoundException('Pool not found');
        }
        return starDestroyer.getFightersOnDeck();
    }

    function getFightersInRepairFromDestroyer(starDestroyer) {
        if (_.isUndefined(starDestroyer)) {
            throw exceptions.buildNotFoundException('Pool not found');
        }
        return starDestroyer.getFightersInRepair();
    }

    function getFightersInInspectionFromDestroyer(starDestroyer) {
        if (_.isUndefined(starDestroyer)) {
            throw exceptions.buildNotFoundException('Pool not found');
        }
        return starDestroyer.getFightersInInspection();
    }

    function recallUsedFromDestroyer(starDestroyer, fighterAttr, fighterValue) {
        if (_.isUndefined(starDestroyer)) {
            throw exceptions.buildNotFoundException('Pool not found');
        }
        return starDestroyer.recallFighter(fighterAttr, fighterValue);
    }

    function tryToRecoverABrokenFighter(starDestroyer) {
        if (_.isUndefined(starDestroyer)) {
            throw exceptions.buildNotFoundException('Pool not found');
        }

        var recovered = starDestroyer.putOneFromScrapYardIntoRepair();
        if (_.isUndefined(recovered)) {
            throw exceptions.buildNotFoundException('Pool not found');
        }
        return recovered;
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
        },

        getTrashForPool: function (poolName) {
            var starDestroyer = fleetRegistry.getStarDestroyerByName(poolName);
            return getScrapYardFromDestroyer(starDestroyer);
        },

        getFreeForPool: function (poolName) {
            var starDestroyer = fleetRegistry.getStarDestroyerByName(poolName);
            return getFightersOnDeckFromDestroyer(starDestroyer);
        },

        getBrokenForPool: function (poolName) {
            var starDestroyer = fleetRegistry.getStarDestroyerByName(poolName);
            return getFightersInRepairFromDestroyer(starDestroyer);
        },

        recoverOneBrokenFromPool: function (poolName) {
            var starDestroyer = fleetRegistry.getStarDestroyerByName(poolName);
            return tryToRecoverABrokenFighter(starDestroyer);
        },

        getManagedForPool: function (poolName) {
            var starDestroyer = fleetRegistry.getStarDestroyerByName(poolName);
            return getFightersInInspectionFromDestroyer(starDestroyer);
        },

        recallFromUsed: function (poolName, attribute, value) {
            var starDestroyer = fleetRegistry.getStarDestroyerByName(poolName);
            return recallUsedFromDestroyer(starDestroyer, attribute, value);
        }
    };
};
darthVader.$inject = ['fleet-plans', 'fleet-registry', 'star-destroyer-factory'];
module.exports = darthVader;
