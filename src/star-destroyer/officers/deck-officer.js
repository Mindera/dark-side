var _ = require('lodash');

var deckOfficer = function(appConfig) {

    var checkCycleMs = appConfig['poolTimeoutMs'];
    var timeoutMs = appConfig['timeoutCheckPeriodMs'];

    var self = this;

    function checkTimeouts() {
        console.info('Checking timeouts...');

        var timedOut = [];
        var now = Date.now();

        _.forEach(self.fightersInMission.values(), function (fighter, key) {
            var timeAdded = fighter.timeAdded;
            if ((now - timeAdded) >= timeoutMs) {
                timedOut.push(key);
            }
        });
        recallFighters(timedOut);
    }

    function recallFighters(timedOutElements) {
        timedOutElements.forEach(function (elementName) {
            var element = self.fightersInMission.get(elementName);
            // Remove from used
            self.fightersInMission.remove(elementName);
            // Add back to the end of the pool
            self.fightersOnDeck.push(element);
        });
    }

    function _manageFighters(fightersOnDeck, fightersInMission) {
        self.fightersOnDeck = fightersOnDeck;
        self.fightersInMission = fightersInMission;

        setInterval(checkTimeouts, checkCycleMs);
    }

    return {
        manageFighters: _manageFighters
    };
};
deckOfficer.$inject = ['app-config'];
module.exports = deckOfficer;