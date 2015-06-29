var _ = require('lodash');

var appConfig = function (appConfigYml) {

    function validateAppConfigurations() {

        if (_.isUndefined(appConfigYml) || _.isNull(appConfigYml)) {
            throw new Error('Please configure application using app-conf.yml');
        }

        if (!_.isNumber(appConfigYml.managerCheckPeriodMs)) {
            throw new Error('Please configure the manager check period');
        }

        if (!_.isNumber(appConfigYml.poolTimeoutMs)) {
            throw new Error('Please configure the pool timeout');
        }

        if (!_.isNumber(appConfigYml.timeoutCheckPeriodMs)) {
            throw new Error('Please configure timeout check period');
        }

        if (!_.isNumber(appConfigYml.healthCheckPeriodMs)) {
            throw new Error('Please configure the health check period');
        }
    }

    validateAppConfigurations();

    return appConfigYml;
};
appConfig.$inject = ['app-config-yml'];
module.exports = appConfig;