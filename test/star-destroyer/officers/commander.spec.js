'use strict';

var Q = require('q');
/*jshint -W079 */
var expect = require('chai').expect;
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var sinon = require('sinon');
var testUtils = require('../../test-utils.js');
var clock;

chai.use(chaiAsPromised);

var TimedMap = require('../../../src/common/collections/timed-map');
var Queue = require('../../../src/common/collections/queue');
var Quarantine = require('../../../src/common/collections/quarantine-queue');
var Commander = require('../../../src/star-destroyer/officers/commander');

var victim;
var managerCheckPeriodMs = 100;

var creatorMock;
var recovererMock;

describe('Star Destroyer Commander', function () {

    beforeEach(function () {
        clock = sinon.useFakeTimers();

        creatorMock = {
            create: function () {
                return Q.fcall(function () {
                    return {'whoAmI': 'a fighter'};
                });
            }
        };

        recovererMock = {
            recover: function (fighter) {
                return Q.fcall(function () {
                    return fighter;
                });
            }
        };

        victim = new Commander({'managerCheckPeriodMs': managerCheckPeriodMs}, creatorMock, recovererMock, 3);
    });

    afterEach(function () {
        clock.restore();
    });

    it('should create new Tie Fighters', function () {
        var fightersOnDeck = new Queue();
        var fightersInMission = new TimedMap();
        var fightersInRepair = new Quarantine();
        var fightersInInspection = [];
        var scrapYard = new Queue();

        victim.manageFighters(fightersOnDeck, fightersInMission, fightersInInspection, fightersInRepair, scrapYard);

        return testUtils.tickAndWait(clock, 100, function () {
            expect(fightersOnDeck.length()).to.equal(3);
        });
    });

    it('should try to recover fighters', function () {
        var fightersOnDeck = new Queue();
        var fightersInMission = new TimedMap();
        var fightersInRepair = new Quarantine();
        var fightersInInspection = [];
        var scrapYard = new Queue();

        // Put fighter in repair
        fightersInRepair.push({'whoAmI': 'a fighter to repair'});

        victim.manageFighters(fightersOnDeck, fightersInMission, fightersInInspection, fightersInRepair, scrapYard);

        return testUtils.tickAndWait(clock, 100, function () {
            expect(fightersOnDeck.length()).to.equal(4);
        });
    });

    it('should send to scrap yard when it not possible to recover', function () {
        sinon.stub(recovererMock, 'recover', function () {
            return Q.fcall(function () {
                throw new Error();
            });
        });

        var fightersOnDeck = new Queue();
        var fightersInMission = new TimedMap();
        var fightersInRepair = new Quarantine();
        var fightersInInspection = [];
        var scrapYard = new Queue();

        // Put fighter in repair
        fightersInRepair.push({'whoAmI': 'a fighter to repair'});

        victim.manageFighters(fightersOnDeck, fightersInMission, fightersInInspection, fightersInRepair, scrapYard);

        return testUtils.tickAndWait(clock, 100, function () {
            expect(fightersOnDeck.length()).to.equal(3);
            expect(fightersInRepair.length()).to.equal(0);
            expect(scrapYard.length()).to.equal(1);
        });
    });
});