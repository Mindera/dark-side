var container = require('../di/container');

var officersTraining = function (rolesDelegator) {

    return {
        trainCommander: function (profileName, shipSize) {
            var creator = rolesDelegator.getCreator(profileName);
            var recoverer = rolesDelegator.getRecoverer(profileName);

            return container.get('commander', creator, recoverer, shipSize);
        },

        trainChiefMechanic: function (profileName) {
            var healthChecker = rolesDelegator.getHealthChecker(profileName);

            return container.get('chief-mechanic', healthChecker);
        },

        trainDeckOfficer: function () {
            return container.get('deck-officer');
        }
    };
};
officersTraining.$inject = ['roles-delegator'];
module.exports = officersTraining;