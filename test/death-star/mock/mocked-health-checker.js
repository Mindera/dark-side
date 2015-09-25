var mockedHealthChecker = function () {
    return {
        isHealthy: function () {
            return 'mocked-health';
        }
    };
};
module.exports = mockedHealthChecker();