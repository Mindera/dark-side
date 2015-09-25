//var StarDestroyer = require('../star-destroyer/star-destroyer');
var container = require('../di/container');

var starDestroyerFactory = function (officersTraining) {
    return {
        createDestroyer: function (profileName, shipSize) {
            var commander = officersTraining.trainCommander(profileName, shipSize);
            var chiefMechanic = officersTraining.trainChiefMechanic(profileName);
            var deckOfficer = officersTraining.trainDeckOfficer();

            //return new StarDestroyer(commander, chiefMechanic, deckOfficer);
            return container.get('star-destroyer', commander, chiefMechanic, deckOfficer);
        }
    };
};
starDestroyerFactory.$inject = ['officers-training'];
module.exports = starDestroyerFactory;