'use strict';

/*jshint -W079 */
var expect = require('chai').expect;
var container = require('../../src/di/container');

var OfficersTraining = require('../../src/death-star/officers-training');

var victim;

describe('Officers Training', function () {

    var mockedCommander = function (creator, recoverer, shipSize) {
        return {
            creator: creator,
            recoverer: recoverer,
            shipSize: shipSize
        };
    };

    var mockedChiefMechanic = function (healthChecker) {
        return {
            healthChecker: healthChecker
        };
    };

    container.register('commander', mockedCommander, 'unique');
    container.register('chief-mechanic', mockedChiefMechanic, 'unique');
    container.register('deck-officer', {'whoAmI': 'a deck officer'}, 'unique');

    beforeEach(function () {
        var mockedRolesDelegator = {
            getCreator: function (profileName) {
                return profileName;
            },
            getRecoverer: function (profileName) {
                return profileName;
            },
            getHealthChecker: function (profileName) {
                return profileName;
            }
        };

        victim = new OfficersTraining(mockedRolesDelegator);
    });

    it('should train Commanders', function () {
        var commander = victim.trainCommander('default', 2);

        expect(commander).to.not.equal(undefined);
        expect(commander.creator).to.equal('default');
        expect(commander.recoverer).to.equal('default');
        expect(commander.shipSize).to.equal(2);
    });

    it('should train Chief Mechanics', function () {
        var commander = victim.trainChiefMechanic('default');

        expect(commander).to.not.equal(undefined);
        expect(commander.healthChecker).to.equal('default');
    });

    it('should trains Deck Officers', function () {
        var deckOfficer = victim.trainDeckOfficer();

        expect(deckOfficer).to.not.equal(undefined);
        expect(deckOfficer).to.include.keys('whoAmI');
        expect(deckOfficer.whoAmI).to.equal('a deck officer');
    });
});