// TODO -  maybe to get the pool size from the registry? This way we can dynamically change the size
var commander = function (appConfig, creator, recoverer, shipSize) {

    var checkCycleMs = appConfig['managerCheckPeriodMs'];
    var populationSize = shipSize;

    var self = this;

    function getPopulationSize() {
        console.info('pool size: ' + self.fightersOnDeck.length() + ' (used: ' + self.fightersInMission.length() + ', managed: ' + self.fightersInInspection.length + ')');
        return self.fightersOnDeck.length() + self.fightersInMission.length() + self.fightersInInspection.length;
    }

    function checkDeck() {
        console.log('Start checking');
        adjustPopulation();
        tryToRecover();
    }

    function adjustPopulation() {
        var size = getPopulationSize();
        if (size < populationSize) {
            createAndAdd(populationSize - size);
        }
    }

    function createAndAdd(numberOfFighters) {
        for (var i = 0; i < numberOfFighters; i++) {
            createFighter();
        }
    }

    function createFighter() {
        var created = creator.create();
        created.then(function (value) {
            console.info('Created');
            self.fightersOnDeck.push(value);
        }, function (error) {
            console.error('An error while creating: ' + error);
        });
    }

    function tryToRecover() {
        if (recoverer) {
            while (self.fightersInRepair.length() > 0) {
                var fighter = self.fightersInRepair.pop();
                recoverFighter(fighter);
            }
        }
    }

    function recoverFighter(fighter) {
        var recovered = recoverer.recover(fighter);
        recovered.then(function (value) {
            self.fightersOnDeck.push(value);
        }, function (error) {
            console.error('An error while recovering, adding to trash: ' + error);
            self.scrapYard.push(fighter);
        });
    }

    function _manageFighters(fightersOnDeck, fightersInMission, fightersInInspection, fightersInRepair, scrapYard) {
        self.fightersOnDeck = fightersOnDeck;
        self.fightersInMission = fightersInMission;
        self.fightersInInspection = fightersInInspection;
        self.fightersInRepair = fightersInRepair;
        self.scrapYard = scrapYard;

        setInterval(checkDeck, checkCycleMs);
    }

    return {
        manageFighters: _manageFighters
    };

};
commander.$inject = ['app-config'];
module.exports = commander;