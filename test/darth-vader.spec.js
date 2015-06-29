'use strict';

/*jshint -W079 */
var expect = require('chai').expect;

var exceptions = require('../src/common/exceptions/exceptions');

var DarthVader = require('../src/darth-vader');

describe('Darth Vader', function () {

    it('should throw exception when fleet plans are empty', function () {
        expect(function () { new DarthVader({}, {}, {}); }).to.throw('The pools configurations are empty!');
    });

    it('should throw exception when fleet plans are not valid', function () {
        expect(function () { new DarthVader({ 'default' : undefined }, {}, {}); }).to.throw('The pools configuration is not valid!');
        expect(function () { new DarthVader({ 'default' : null }, {}, {}); }).to.throw('The pools configuration is not valid!');
        expect(function () { new DarthVader({ 'default' : {} }, {}, {}); }).to.throw('The pools configuration is not valid!');
    });

    it('should throw exception when profile name is invalid', function () {
        var fleetPlans = {
            'default' : {
                '' : 'default'
            }
        };
        expect(function () { new DarthVader(fleetPlans, {}, {}); }).to.throw('The profile name is invalid!');
    });

    it('should throw exception when fleet size is invalid', function () {
        var fleetPlans = {
            'default' : {
                'profile' : 'default',
                'size' : 'a'
            }
        };
        expect(function () { new DarthVader(fleetPlans, {}, {}); }).to.throw('The size is invalid!');
    });

    it('should pick a fighter from star destroyer fleet', function () {
        var fleetPlans = {
            'default' : {
                'profile' : 'default',
                'size' : 1
            }
        };

        var fleetRegistryMock = {
            registerStarDestroyer: function () {},
            getStarDestroyerByProperties: function () {
                return {
                    getOneFighter: function () {
                        return {'whoAmI' : 'a fighter'};
                    }
                };
            }
        };

        var starDestroyerFactoryMock = {
            createDestroyer: function () {}
        };

        var victim = new DarthVader(fleetPlans, fleetRegistryMock, starDestroyerFactoryMock);
        var figther = victim.pickOne({'profile' : 'default'});
        expect(figther).to.not.equal(undefined);
        expect(figther.whoAmI).to.equal('a fighter');
    });

    it('should throw exception when no fighter is found', function () {
        var fleetPlans = {
            'default' : {
                'profile' : 'default',
                'size' : 1
            }
        };

        var fleetRegistryMock = {
            registerStarDestroyer: function () {},
            getStarDestroyerByProperties: function () {}
        };

        var starDestroyerFactoryMock = {
            createDestroyer: function () {}
        };

        var victim = new DarthVader(fleetPlans, fleetRegistryMock, starDestroyerFactoryMock);

        var error = exceptions.InvalidArgumentsException('No element available on any pool');
        expect(function () { victim.pickOne({'profile' : 'default'}); }).to.throw(error);
    });
});