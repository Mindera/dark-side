'use strict';

/*jshint -W079 */
var expect = require('chai').expect;
var rolesDelegator = require('../../src/death-star/roles-delegator');

describe('Ship Parts supplier', function () {

    var mockedProfile = {
        // The mainModule is './node_modules/mocha/bin'

        'default' : {
            'creator': 'test/death-star/mock/mocked-creator.js',
            'recoverer': 'test/death-star/mock/mocked-recoverer.js',
            'healthChecker': 'test/death-star/mock/mocked-health-checker.js'
        },

        'norecoverer': {
            'creator': 'test/death-star/mock/mocked-creator.js',
            'healthChecker': 'test/death-star/mock/mocked-health-checker.js'
        },

        'nohealthchecker': {
            'creator': 'test/death-star/mock/mocked-creator.js',
            'recoverer': 'test/death-star/mock/mocked-recoverer.js'
        }
    };

    it('should get creator by profile name', function () {

        var victim = rolesDelegator(mockedProfile);

        var creator = victim.getCreator('default');
        expect(creator).to.include.keys('create');
    });

    it('should return undefined no profile is found while getting creator', function () {
        var victim = rolesDelegator(mockedProfile);

        var creator = victim.getCreator('nonexistent');
        expect(creator).to.equal(undefined);
    });

    it('should return undefined no creator is found', function () {
        var mockedProfile = {
            'nocreator': {
                'recoverer': 'test/death-star/mock/mocked-recoverer.js',
                'healthChecker': 'test/death-star/mock/mocked-health-checker.js'
            }
        };

        expect(function () { rolesDelegator(mockedProfile); }).to.throw(Error);
    });

    it('should get recoverer by profile name', function () {
        var victim = rolesDelegator(mockedProfile);

        var recoverer = victim.getRecoverer('default');
        expect(recoverer).to.include.keys('recover');
    });

    it('should return undefined when no profile is found while getting recoverer', function () {
        var victim = rolesDelegator(mockedProfile);

        var recoverer = victim.getRecoverer('nonexistent');
        expect(recoverer).to.equal(undefined);
    });

    it('should return undefined when no recoverer is found', function () {
        var victim = rolesDelegator(mockedProfile);

        var recoverer = victim.getRecoverer('norecoverer');
        expect(recoverer).to.equal(undefined);
    });

    it('should get health-checker by profile name', function () {
        var victim = rolesDelegator(mockedProfile);

        var healthChecker = victim.getHealthChecker('default');
        expect(healthChecker).to.include.keys('isHealthy');
    });

    it('should return undefined no profile is found while getting health-checker', function () {
        var victim = rolesDelegator(mockedProfile);

        var healthChecker = victim.getHealthChecker('nonexistent');
        expect(healthChecker).to.equal(undefined);
    });

    it('should return undefined no health-checker is found', function () {
        var victim = rolesDelegator(mockedProfile);

        var healthChecker = victim.getHealthChecker('nohealthchecker');
        expect(healthChecker).to.equal(undefined);
    });
});
