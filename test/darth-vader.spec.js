'use strict';

/*jshint -W079 */
var expect = require('chai').expect;

//var exceptions = require('../src/common/exceptions/exceptions');

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

    it('should pick a fighter from star destroyer fleet from properties', function () {
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

    it('should pick a fighter from star destroyer fleet', function () {
        var fleetPlans = {
            'default' : {
                'profile' : 'default',
                'size' : 1
            }
        };

        var fleetRegistryMock = {
            registerStarDestroyer: function () {},
            getADestroyer: function () {
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
        var fighter = victim.pickOneRandomly();
        expect(fighter).to.not.equal(undefined);
        expect(fighter.whoAmI).to.equal('a fighter');
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

        expect(function () { victim.pickOne({'profile' : 'default'}); }).to.throw(Error);
    });

    it('should get fighters in trash for pool', function () {

        var fleetPlans = {
            'default' : {
                'profile' : 'default',
                'size' : 1
            }
        };

        var fleetRegistryMock = {
            registerStarDestroyer: function () {},
            getStarDestroyerByName: function () {
                return {
                    getScrapYard: function () {
                        return [{'whoAmI' : 'a fighter'}];
                    }
                };
            }
        };

        var starDestroyerFactoryMock = {
            createDestroyer: function () {}
        };

        var victim = new DarthVader(fleetPlans, fleetRegistryMock, starDestroyerFactoryMock);

        var fighters = victim.getTrashForPool('default');

        expect(fighters.length).to.equal(1);
        expect(fighters[0]).to.not.equal(undefined);
        expect(fighters[0].whoAmI).to.equal('a fighter');
    });

    it('should throw exception when no fighters are in trash', function () {
        var fleetPlans = {
            'default' : {
                'profile' : 'default',
                'size' : 1
            }
        };

        var fleetRegistryMock = {
            registerStarDestroyer: function () {},
            getStarDestroyerByName: function () {}
        };

        var starDestroyerFactoryMock = {
            createDestroyer: function () {}
        };

        var victim = new DarthVader(fleetPlans, fleetRegistryMock, starDestroyerFactoryMock);

        expect(function () { victim.getTrashForPool({'profile' : 'default'}); }).to.throw(Error);
    });

    it('should return free fighters in pool', function () {

        var fleetPlans = {
            'default' : {
                'profile' : 'default',
                'size' : 1
            }
        };

        var fleetRegistryMock = {
            registerStarDestroyer: function () {},
            getStarDestroyerByName: function () {
                return {
                    getScrapYard: function () {
                        return [{'whoAmI' : 'a fighter'}];
                    }
                };
            }
        };

        var starDestroyerFactoryMock = {
            createDestroyer: function () {}
        };

        var victim = new DarthVader(fleetPlans, fleetRegistryMock, starDestroyerFactoryMock);

        var fighters = victim.getTrashForPool('default');

        expect(fighters.length).to.equal(1);
        expect(fighters[0]).to.not.equal(undefined);
        expect(fighters[0].whoAmI).to.equal('a fighter');
    });

    it('should return undefined when no fighters are in trash', function () {
        var fleetPlans = {
            'default' : {
                'profile' : 'default',
                'size' : 1
            }
        };

        var fleetRegistryMock = {
            registerStarDestroyer: function () {},
            getStarDestroyerByName: function () {}
        };

        var starDestroyerFactoryMock = {
            createDestroyer: function () {}
        };

        var victim = new DarthVader(fleetPlans, fleetRegistryMock, starDestroyerFactoryMock);

        expect(function () { victim.getTrashForPool({'profile' : 'default'}); }).to.throw(Error);
    });
});