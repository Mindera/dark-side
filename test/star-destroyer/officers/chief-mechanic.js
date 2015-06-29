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

var Queue = require('../../../src/common/collections/queue');
var Quarantine = require('../../../src/common/collections/quarantine-queue');
var ChiefMechanic = require('../../../src/star-destroyer/officers/chief-mechanic');

describe('Star Destroyer Chief Mechanic', function () {

    beforeEach(function () {
        clock = sinon.useFakeTimers();
    });

    afterEach(function () {
        clock.restore();
    });

    it('should inspect Tie Fighters', function () {
        var fightersOnDeck = new Queue();
        var fightersInInspection = [];

        // Add a fighter
        fightersOnDeck.push({'whoAmI': 'a fighter'});

        // Mock the health checker
        var healthCheckerMock = mockHealthyFighter();

        // Create the subject
        var victim = new ChiefMechanic({healthCheckPeriodMs: 100}, healthCheckerMock);

        // Spy mocks
        var spy = sinon.spy(healthCheckerMock, 'check');
        var inspectionSpy = sinon.spy(fightersInInspection, 'push');

        victim.manageFighters(fightersOnDeck, new Quarantine(), fightersInInspection);

        return testUtils.tickAndWait(clock, 100, function () {
            // Check if the health-check was called
            expect(spy.calledOnce).to.equal(true);

            // Check if the fighter was put into inspection
            expect(inspectionSpy.calledOnce).to.equal(true);

            // The fighter should be recovered
            expect(fightersOnDeck.length()).to.equal(1);
        });
    });

    it('should put Tie Fighters into repair', function () {
        var fightersOnDeck = new Queue();
        var fightersInRepair = new Quarantine();
        var fightersInInspection = [];

        // Add a fighter
        fightersOnDeck.push({'whoAmI': 'a fighter'});

        // Mock the health checker
        var healthCheckerMock = mockUnhealthyFighter();

        // Create the subject
        var victim = new ChiefMechanic({healthCheckPeriodMs: 100}, healthCheckerMock);

        // Spy mocks
        var spy = sinon.spy(healthCheckerMock, 'check');
        var repairSpy = sinon.spy(fightersInRepair, 'pushToQuarantine');
        var inspectionSpy = sinon.spy(fightersInInspection, 'push');

        victim.manageFighters(fightersOnDeck, fightersInRepair, fightersInInspection);

        return testUtils.tickAndWait(clock, 100, function () {
            // Check if the health-check was called
            expect(spy.calledOnce).to.equal(true);

            // Check if the fighter was put into inspection
            expect(inspectionSpy.calledOnce).to.equal(true);

            // Check if the fighter was put into repair
            expect(repairSpy.calledOnce).to.equal(true);

            // The fighter should be in repair
            expect(fightersInRepair.length()).to.equal(1);
            expect(fightersOnDeck.length()).to.equal(0);
        });
    });

    it('should put Tie Fighters into repair when health-check fails', function () {
        var fightersOnDeck = new Queue();
        var fightersInRepair = new Quarantine();
        var fightersInInspection = [];

        // Add a fighter
        fightersOnDeck.push({'whoAmI': 'a fighter'});

        // Mock the health checker
        var healthCheckerMock = mockFaultyHealthChecker();

        // Create the subject
        var victim = new ChiefMechanic({healthCheckPeriodMs: 100}, healthCheckerMock);

        // Spy mocks
        var spy = sinon.spy(healthCheckerMock, 'check');
        var repairSpy = sinon.spy(fightersInRepair, 'pushToQuarantine');
        var inspectionSpy = sinon.spy(fightersInInspection, 'push');

        victim.manageFighters(fightersOnDeck, fightersInRepair, fightersInInspection);

        return testUtils.tickAndWait(clock, 100, function () {
            // Check if the health-check was called
            expect(spy.calledOnce).to.equal(true);

            // Check if the fighter was put into inspection
            expect(inspectionSpy.calledOnce).to.equal(true);

            // Check if the fighter was put into repair
            expect(repairSpy.calledOnce).to.equal(true);

            // The fighter should be in repair
            expect(fightersInRepair.length()).to.equal(1);
            expect(fightersOnDeck.length()).to.equal(0);
        });
    });

    function mockHealthyFighter() {
        return {
            check: function (element) {
                return Q.fcall(function () {
                    return {
                        isOk: function () { return true; },
                        getReason: function () { return 'no reason to be healthy'; },
                        getElement: function () { return element; }
                    };
                });
            }
        };
    }

    function mockUnhealthyFighter() {
        return {
            check: function (element) {
                return Q.fcall(function () {
                    return {
                        isOk: function () { return false; },
                        getReason: function () { return 'a reason'; },
                        getElement: function () { return element; }
                    };
                });
            }
        };
    }

    function mockFaultyHealthChecker() {
        return {
            check: function () {
                return Q.fcall(function () {
                    throw new Error('An error as occurred!');
                });
            }
        };
    }
});