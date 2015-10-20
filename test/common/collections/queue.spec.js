'use strict';

/*jshint -W079 */
var expect = require('chai').expect;
var queue = require('../../../src/common/collections/queue');

describe('Queue', function () {
    it('should add elements to the queue', function () {
            var valuesQueue = queue();
            var element = {yoda:"May the Force be with you"};
            valuesQueue.push(element);

            expect(valuesQueue.length()).to.equal(1);
            expect(valuesQueue.values()[0]).to.equal(element);
    });

    it('should remove elements by index to the queue', function () {
        // add items
        var valuesQueue = queue();

        var element = {yoda:"May the Force be with you"};
        var element2 = {darth:"I find your lack of faith disturbing."};
        var element3 = {admiral:"It’s a trap!"};

        valuesQueue.push(element);
        valuesQueue.push(element2);
        valuesQueue.push(element3);

        expect(valuesQueue.length()).to.equal(3);
        expect(valuesQueue.values()[0]).to.equal(element3);
        expect(valuesQueue.values()[1]).to.equal(element2);
        expect(valuesQueue.values()[2]).to.equal(element);

        // remove the middle one
        valuesQueue.removeAt(1);
        expect(valuesQueue.length()).to.equal(2);
        expect(valuesQueue.values()[0]).to.equal(element3);
        expect(valuesQueue.values()[1]).to.equal(element);

        // remove all
        valuesQueue.removeAt(0);
        valuesQueue.removeAt(0);
        expect(valuesQueue.length()).to.equal(0);

    });
});