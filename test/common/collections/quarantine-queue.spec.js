'use strict';

/*jshint -W079 */
var expect = require('chai').expect;
var quarantineQueue = require('../../../src/common/collections/quarantine-queue');


describe('Quarantine queue', function () {
    it('should wrap a value in quarantine-queue', function () {
        var qQueue = quarantineQueue();

        expect(qQueue.length()).to.equal(0);

        var element = {darth:"Im your father"};
        var reason = "I was in love with your mother";
        qQueue.pushToQuarantine(element,reason);

        expect(qQueue.length()).to.equal(1);
    });

    it('should retrive values from the queue', function () {
        var qQueue = quarantineQueue();

        expect(qQueue.length()).to.equal(0);

        var element = {darth:"Im your father"};
        var reason = "I was in love with your mother";
        qQueue.pushToQuarantine(element, reason);
        var storedValue = qQueue.getAt(0);

        expect(storedValue.getReason()).to.equal(reason);
        expect(storedValue.getElement()).to.equal(element);
    });
});