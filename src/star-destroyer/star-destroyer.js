var _ = require('lodash');
var TimedMap = require('../common/collections/timed-map');
var Queue = require('../common/collections/queue');
var Quarantine = require('../common/collections/quarantine-queue');

var starDestroyer = function (commander, chiefMechanic, deckOfficer) {

    var fightersOnDeck = new Queue();
    var fightersInMission = new TimedMap();
    var fightersInRepair = new Quarantine();
    var fightersInInspection = [];
    var scrapYard = new Queue();

    function initOfficers() {
        commander.manageFighters(fightersOnDeck, fightersInMission, fightersInInspection, fightersInRepair, scrapYard);
        chiefMechanic.manageFighters(fightersOnDeck, fightersInRepair, fightersInInspection);
        deckOfficer.manageFighters(fightersOnDeck, fightersInMission);
    }

    initOfficers();

    return {
        getFightersOnDeck: function () {
            return fightersOnDeck.values();
        },

        getOneFighter: function () {
            var ship = fightersOnDeck.pop();

            if (!_.isUndefined(ship)) {
                fightersInMission.put('name-' + Date.now(), ship);
                return ship;
            }
            return undefined;
        },

        getScrapYard: function () {
            return scrapYard;
        },

        isCombatReady: function () {
            return fightersOnDeck.length() > 0;
        }
    };
};
module.exports = starDestroyer;