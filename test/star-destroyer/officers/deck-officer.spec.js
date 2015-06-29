'use strict';

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
var DeckOfficer = require('../../../src/star-destroyer/officers/deck-officer');

var victim;
var timeoutCheckPeriodMs = 100;
var poolTimeoutMs = 200;


describe('Deck Officer', function () {
    beforeEach(function () {
        clock = sinon.useFakeTimers();

        victim = new DeckOfficer({'poolTimeoutMs': poolTimeoutMs, 'timeoutCheckPeriodMs': timeoutCheckPeriodMs});
    });

    afterEach(function () {
        clock.restore();
    });

    it('should recall fighter on timeout', function () {
        var fightersOnDeck = new Queue();
        var fightersInMission = new TimedMap();

        fightersInMission.put('1', {'whoAmI': 'a fighter'});

        victim.manageFighters(fightersOnDeck, fightersInMission);

        return testUtils.tickAndWait(clock, 200, function () {
            expect(fightersInMission.length()).to.equal(0);
            expect(fightersOnDeck.length()).to.equal(1);
        });
    });

    it('should not recall fighter', function () {
        var fightersOnDeck = new Queue();
        var fightersInMission = new TimedMap();

        fightersInMission.put('1', {'whoAmI': 'a fighter'});

        victim.manageFighters(fightersOnDeck, fightersInMission);

        return testUtils.tickAndWait(clock, 198, function () {
            expect(fightersInMission.length()).to.equal(1);
            expect(fightersOnDeck.length()).to.equal(0);
        });
    });
});