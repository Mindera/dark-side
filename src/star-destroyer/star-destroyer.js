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

    function putFighterInMission(fighter) {
        if (!_.isUndefined(fighter)) {
            fightersInMission.put('name-' + Date.now(), fighter);
        }
    }

    function putBustedFighterIntoRepair(busted) {
        var bustedFighter;
        if (busted) {
            bustedFighter = busted;
            fightersInRepair.pushToQuarantine(bustedFighter);
        }
        return bustedFighter;
    }

    function getFighterToRecall(fighterAttr, fighterValue) {
        var fighterToRecall = null;
        _.forEach(fightersInMission.values(), function (wrappedFighter, key) {
            var fighter = wrappedFighter.value;
            if (fighter.hasOwnProperty(fighterAttr) && fighter[fighterAttr] === fighterValue) {
                fighterToRecall = key;
                return false;
            }
        });
        return fighterToRecall;
    }

    function recallFighter(fighterToRecall) {
        var fighter;

        if (!_.isNull(fighterToRecall)) {
            fighter = fightersInMission.get(fighterToRecall);

            fightersInMission.remove(fighterToRecall);
            // Add back to the end of the pool
            fightersOnDeck.push(fighter);
        }

        return fighter;
    }

    initOfficers();

    return {
        getFightersOnDeck: function () {
            return fightersOnDeck.values();
        },

        getOneFighter: function () {
            var fighter = fightersOnDeck.pop();
            putFighterInMission(fighter);
            return fighter;
        },

        getScrapYard: function () {
            return scrapYard.values();
        },

        putOneFromScrapYardIntoRepair: function () {
            var busted = scrapYard.pop();
            return putBustedFighterIntoRepair(busted);
        },

        getFightersInRepair: function () {
            return fightersInRepair.values();
        },

        getFightersInInspection: function () {
            return fightersInInspection;
        },

        isCombatReady: function () {
            return fightersOnDeck.length() > 0;
        },

        recallFighter: function (attr, value) {
            var fighterToRecall = getFighterToRecall(attr, value);
            return recallFighter(fighterToRecall);
        }
    };
};
module.exports = starDestroyer;