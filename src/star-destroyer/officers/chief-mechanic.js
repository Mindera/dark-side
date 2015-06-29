var chiefMechanic = function (appConfig, healthChecker) {

    var checkCycleMs = appConfig['healthCheckPeriodMs'];

    var self = this;

    function checkHealth() {
        console.info('Checking health');

        if (self.fightersOnDeck.length() > 0) {
            var element = self.fightersOnDeck.pop();
            putIntoInspection(element);

            // Check health
            var healthy = healthChecker.check(element);
            healthy.then(function (value) {
                var element = value.getElement();
                if (value.isOk()) {
                    putIntoReadyToFight(element);
                } else {
                    var reason = value.getReason();
                    putIntoRepair(element, reason);
                }
            }, function (error) {
                console.error('An error occurred while health-checking: ' + error);
                putIntoRepair(element, 'Error while health-checking: ' + error);
            });
        }
    }

    function putIntoInspection(element) {
        // Put into managed
        self.fightersInInspection.push(element);
    }

    function putIntoReadyToFight(element) {
        removeFromInspection(element);
        self.fightersOnDeck.push(element);
    }

    function putIntoRepair(element, reason) {
        removeFromInspection(element);
        // Add to repair
        self.fightersInRepair.pushToQuarantine(element, reason);
    }

    function removeFromInspection(element) {
        var index = self.fightersInInspection.indexOf(element);
        self.fightersInInspection.splice(index, 1);
    }

    function _manageFighters(fightersOnDeck, fightersInRepair, fightersInInspection) {
        self.fightersOnDeck = fightersOnDeck;
        self.fightersInRepair = fightersInRepair;
        self.fightersInInspection = fightersInInspection;

        if (healthChecker) {
            setInterval(checkHealth, checkCycleMs);
        }
    }

    return {
        manageFighters: _manageFighters
    };
};
chiefMechanic.$inject = ['app-config'];
module.exports = chiefMechanic;