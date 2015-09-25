'use strict';

/*jshint -W079 */
var expect = require('chai').expect;
var container = require('../../src/di/container');

var StarDestroyerFactory = require('../../src/death-star/star-destroyer-factory');
var victim;

describe('Star Destroyer Factory', function () {

    beforeEach(function () {
        var mockedOfficersTraining = {
            trainCommander: function () {},
            trainChiefMechanic: function () {},
            trainDeckOfficer: function () {}
        };

        var starDestroyerMock = {
            'whoAmI': 'I\'m a star-destroyer'
        };

        container.register('star-destroyer', starDestroyerMock);
        victim = new StarDestroyerFactory(mockedOfficersTraining);
    });

    it('should create star destroyers', function () {
        var starDestroyer = victim.createDestroyer();

        expect(starDestroyer).not.to.equal(undefined);
        expect(starDestroyer).to.include.keys('whoAmI');
        expect(starDestroyer['whoAmI']).to.equal('I\'m a star-destroyer');
    });
});