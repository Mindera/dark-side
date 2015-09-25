'use strict';

/*jshint -W079 */
var expect = require('chai').expect;
var appConfig = require('../../src/conf/app-config.js');

describe('Application configuration', function () {
    it('should have application configuration', function () {
        expect(appConfig).to.throw(Error);
    });

    it('should have manager check period period configured', function () {
        var appConfigYml = {
            //managerCheckPeriodMs: 1000,
            poolTimeoutMs: 1000,
            timeoutCheckPeriodMs: 1000,
            healthCheckPeriodMs: 1000
        };

        expect(function () { appConfig(appConfigYml); }).to.throw(Error);
    });

    it('should have pool timeout configured', function () {
        var appConfigYml = {
            managerCheckPeriodMs: 1000,
            //poolTimeoutMs: 1000,
            timeoutCheckPeriodMs: 1000,
            healthCheckPeriodMs: 1000
        };

        expect(function () { appConfig(appConfigYml); }).to.throw(Error);
    });

    it('should have the period to check timeouts configured', function () {
        var appConfigYml = {
            managerCheckPeriodMs: 1000,
            poolTimeoutMs: 1000,
            //timeoutCheckPeriodMs: 1000,
            healthCheckPeriodMs: 1000
        };

        expect(function () { appConfig(appConfigYml); }).to.throw(Error);
    });

    it('should have health-check period configured', function () {
        var appConfigYml = {
            managerCheckPeriodMs: 1000,
            poolTimeoutMs: 1000,
            //timeoutCheckPeriodMs: 1000,
            healthCheckPeriodMs: 1000
        };
        expect(function () { appConfig(appConfigYml); }).to.throw(Error);
    });

    it('should return configuration from YAML', function () {
        var appConfigYml = {
            managerCheckPeriodMs: 1000,
            poolTimeoutMs: 1000,
            timeoutCheckPeriodMs: 1000,
            healthCheckPeriodMs: 1000
        };
        expect(appConfig(appConfigYml)).to.equal(appConfigYml);
    });
});
