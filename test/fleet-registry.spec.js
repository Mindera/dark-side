'use strict';

/*jshint -W079 */
var expect = require('chai').expect;

var exceptions = require('../src/common/exceptions/exceptions');
var FleetRegistry = require('../src/fleet-registry');
var victim;

describe('Fleet Registry', function () {

    beforeEach(function () {
        victim = new FleetRegistry();
    });

    it('should register star destroyer', function () {
        victim.registerStarDestroyer('default', null, 'destroyer 1', buildMockedStarDestroyer('a star destroyer', true));

        var destroyer = victim.getStarDestroyerByName('destroyer 1');
        expect(destroyer).not.equal(undefined);
        expect(destroyer.whoAmI).to.equal('a star destroyer');
    });

    it('should register star destroyer with characteristics', function () {
        victim.registerStarDestroyer('default', {'leftGun' : 'laser', 'rightGun' : 'laser'}, 'destroyer 1', buildMockedStarDestroyer('a star destroyer', true));

        var destroyer = victim.getStarDestroyerByProperties({ 'leftGun' : 'laser' });
        expect(destroyer).not.equal(undefined);
        expect(destroyer.whoAmI).to.equal('a star destroyer');
    });

    it('should throw exception when profile name is invalid while registering star destroyer', function () {
        var error = exceptions.InvalidArgumentsException('Invalid profile name: ');
        expect(function () { victim.registerStarDestroyer('', null, 'destroyer 1', buildMockedStarDestroyer('a star destroyer', true)); }).to.throw(error);
    });

    it('should throw exception when destroyer name is invalid while registering star destroyer', function () {
        var error = exceptions.InvalidArgumentsException('Invalid pool name: ');
        expect(function () { victim.registerStarDestroyer('default', null, '', buildMockedStarDestroyer('a star destroyer', true)); }).to.throw(error);
    });

    it('should throw exception when star destroyer is invalid while registering star destroyer', function () {
        var error = exceptions.InvalidArgumentsException('Invalid pool: ');
        expect(function () { victim.registerStarDestroyer('default', null, 'destroyer 1', ''); }).to.throw(error);
    });

    it('should get destroyer by properties', function () {
        victim.registerStarDestroyer('default', {'leftGun' : 'laser', 'rightGun' : 'laser'}, 'destroyer 1', buildMockedStarDestroyer('a star destroyer', true));

        var destroyer = victim.getStarDestroyerByProperties({ 'profile' : 'default' });
        expect(destroyer).not.equal(undefined);
        expect(destroyer.whoAmI).to.equal('a star destroyer');

        destroyer = victim.getStarDestroyerByProperties({ 'leftGun' : 'laser' });
        expect(destroyer).not.equal(undefined);
        expect(destroyer.whoAmI).to.equal('a star destroyer');

        destroyer = victim.getStarDestroyerByProperties({ 'profile' : 'default', 'rightGun' : 'laser', 'leftGun' : 'laser'});
        expect(destroyer).not.equal(undefined);
        expect(destroyer.whoAmI).to.equal('a star destroyer');
    });

    it('should throw exception when properties are invalid while getting by properties', function () {
        var error = exceptions.InvalidArgumentsException('Invalid configurations: ');
        expect(function () { victim.getStarDestroyerByProperties(''); }).to.throw(error);
    });

    it('should not return a star destroyer that is not active', function () {
        victim.registerStarDestroyer('default', null, 'destroyer 1', buildMockedStarDestroyer('a star destroyer', false));
        victim.registerStarDestroyer('default', null, 'destroyer 2', buildMockedStarDestroyer('another star destroyer', true));

        var destroyer = victim.getStarDestroyerByProperties({'profile' : 'default'});
        expect(destroyer).not.equal(undefined);
        expect(destroyer.whoAmI).to.equal('another star destroyer');
    });

    it('should return undefined when destroyer is not found', function () {
        victim.registerStarDestroyer('default', null, 'destroyer 1', buildMockedStarDestroyer('a star destroyer', false));
        victim.registerStarDestroyer('default', null, 'destroyer 2', buildMockedStarDestroyer('another star destroyer', true));

        var destroyer = victim.getStarDestroyerByProperties({'profile' : 'not-default'});
        expect(destroyer).equal(undefined);
    });

    it('should get destroyer by name', function () {
        victim.registerStarDestroyer('default', null, 'destroyer 1', buildMockedStarDestroyer('a star destroyer', false));
        victim.registerStarDestroyer('default', null, 'destroyer 2', buildMockedStarDestroyer('another star destroyer', true));


        var destroyer = victim.getStarDestroyerByName('destroyer 1');
        expect(destroyer).not.equal(undefined);
        expect(destroyer.whoAmI).to.equal('a star destroyer');


        destroyer = victim.getStarDestroyerByName('destroyer 2');
        expect(destroyer).not.equal(undefined);
        expect(destroyer.whoAmI).to.equal('another star destroyer');
    });

    it('should return undefined when destroyer name is not found', function () {
        var destroyer = victim.getStarDestroyerByName('destroyer 1');
        expect(destroyer).equal(undefined);
    });

    it('should throw exception when destroyer name is invalid', function () {
        var error = exceptions.InvalidArgumentsException('Invalid pool name: ');
        expect(function () { victim.getStarDestroyerByName(''); }).to.throw(error);
    });

    it('should get a destroyer', function () {
        victim.registerStarDestroyer('default', null, 'destroyer 1', buildMockedStarDestroyer('a star destroyer', false));
        victim.registerStarDestroyer('default', null, 'destroyer 2', buildMockedStarDestroyer('another star destroyer', true));

        var destroyer = victim.getADestroyer();
        expect(destroyer).not.equal(undefined);
        expect(destroyer.whoAmI).to.equal('another star destroyer');
    });

    function buildMockedStarDestroyer(name, active) {
        return {
            'whoAmI' : name,
            isCombatReady : function () {
                return active;
            }
        };
    }
});