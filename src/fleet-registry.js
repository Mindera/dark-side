var _ = require('lodash');
var argumentValidator = require('./common/validation/argument-validator');

var fleetRegistry = function () {

    var dictionary = {};
    var registeredStarDestroyers = {};

    function addToRegistry (configuration, key, poolName, pool) {
        var registry = getRegistry(configuration);
        var values = getValues(registry, key);

        values.push(poolName);
        registerIfNotRegistered(poolName, pool);
    }

    function getRegistry(configuration) {
        if (!_.has(dictionary, configuration)) {
            dictionary[configuration] = {};
        }
        return dictionary[configuration];
    }

    function getValues(registry, key) {
        if (!_.has(registry, key)) {
            registry[key] = [];
        }
        return registry[key];
    }

    function registerIfNotRegistered(name, starDestroyer) {
        if (!_.has(registeredStarDestroyers, name)) {
            registeredStarDestroyers[name] = starDestroyer;
        }
    }

    function getDestroyersByProperty(configuration, key) {
        var registry = getRegistry(configuration);
        return getValues(registry, key);
    }

    function getAnActiveStarDestroyer(configurations) {
        var foundDestroyers = getDestroyersforConfigurtions(configurations);
        var names = pickRepeated(foundDestroyers);
        if (!_.isEmpty(names)) {
            return pickFirstActive(names);
        }
    }

    function getDestroyersforConfigurtions(configurations) {
        var foundStarDestroyers = [];
        _.forOwn(configurations, function (configuration, configurationName) {
            var destroyers = getDestroyersByProperty(configurationName, configuration);
            if (!_.isEmpty(destroyers)) {
                foundStarDestroyers.push(destroyers);
            }
        });
        return foundStarDestroyers;
    }

    function pickRepeated(matchedElements) {
        var matches = [];
        if (matchedElements.length === 1) {
            matches = _.first(matchedElements);
        } else if (matchedElements.length > 1) {
            matches = matchedElements.reduce(function (prev, curr) {
                return _.union(prev, curr);
            }, []);
        }
        return matches;
    }

    function pickFirstActive(destroyerNames) {
        var destroyer = {};
        destroyerNames.forEach(function (poolName) {
            if (registeredStarDestroyers[poolName].isCombatReady()) {
                destroyer = registeredStarDestroyers[poolName];
            }
        });
        return destroyer;
    }

    function mergeProfile(characteristics, profileName) {
        return _.merge({
            'profile' : profileName
        }, characteristics);
    }

    return {
        registerStarDestroyer: function (profileName, characteristics, name, starDestroyer) {

            argumentValidator.validateStringArg(profileName, 'Invalid profile name: ' + profileName);
            argumentValidator.validateStringArg(name, 'Invalid pool name: ' + name);
            argumentValidator.validateObjectArg(starDestroyer, 'Invalid pool: ' + starDestroyer);

            var poolCharacteristics = mergeProfile(characteristics, profileName);

            _.forOwn(poolCharacteristics, function (characteristic, characteristicName) {
                addToRegistry(characteristicName, characteristic, name, starDestroyer);
            });
        },

        getStarDestroyerByProperties: function (configurations) {
            argumentValidator.validateObjectArg(configurations, 'Invalid configurations: ' + configurations);

            return getAnActiveStarDestroyer(configurations);
        },

        getStarDestroyerByName: function (starDestroyerName) {
            argumentValidator.validateStringArg(starDestroyerName, 'Invalid pool name: ' + starDestroyerName);

            return registeredStarDestroyers[starDestroyerName];
        },

        getADestroyer: function () {
            var activeDestroyers = _.filter(registeredStarDestroyers, function (starDestroyer) {
                return starDestroyer.isCombatReady();
            });
            return _.sample(activeDestroyers);
        }
    };
};
module.exports = fleetRegistry;