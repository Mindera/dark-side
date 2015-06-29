var _ = require('lodash');

var rolesDelegator = function (profilesConf) {

    function getProfiles() {
        // TODO - include file parsing validation
        var profilesHandler = {};

        for (var profileName in profilesConf) {
            if (profilesConf.hasOwnProperty(profileName)) {
                addToProfileHandler(profilesHandler, profileName);
            }
        }

        return profilesHandler;
    }

    function addToProfileHandler(profilesHandler, profile) {
        profilesHandler[profile] = {};
        requireCreator(profilesHandler, profile);
        requireRecoverer(profilesHandler, profile);
        requireHealthChecker(profilesHandler, profile);
    }

    function requireCreator(profilesHandler, profile) {
        if (_.isUndefined(profilesConf[profile].creator)) {
            throw new Error('A creator must be defined in profile ' + profile);
        }

        profilesHandler[profile].creator = process.mainModule.require('./' + profilesConf[profile].creator);
    }

    function requireRecoverer(profilesHandler, profile) {
        if (profilesConf[profile].recoverer) {
            profilesHandler[profile].recoverer = process.mainModule.require('./' + profilesConf[profile].recoverer);
        }
    }

    function requireHealthChecker(profilesHandler, profile) {
        if (profilesConf[profile].healthChecker) {
            profilesHandler[profile].healthChecker = process.mainModule.require('./' + profilesConf[profile].healthChecker);
        }
    }

    function getProfile(profileName) {
        if (_.has(profiles, profileName)) {
            return profiles[profileName];
        }
    }

    var profiles = getProfiles();

    return {
        getCreator: function (profileName) {
            var profile = getProfile(profileName);
            if (profile) {
                return profile.creator;
            }
        },

        getRecoverer: function (profileName) {
            var profile = getProfile(profileName);
            if (profile) {
                return profile.recoverer;
            }
        },

        getHealthChecker: function (profileName) {
            var profile = getProfile(profileName);
            if (profile) {
                return profile.healthChecker;
            }
        }
    };
};
rolesDelegator.$inject = ['profiles-conf'];
module.exports = rolesDelegator;