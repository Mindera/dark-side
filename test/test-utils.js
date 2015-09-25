var Q = require('q');

var testUtils = function () {

    function tickClock(clock, ms) {
        return Q.fcall(function () {
            clock.tick(ms);
        });
    }

    function waitForUpdate(clock) {
        clock.tick(1);
    }

    return {
        tickAndWait: function(clock, ms, fn) {
            return tickClock(clock, ms)
                .then(waitForUpdate(clock))
                .then(fn);
        }
    };
};
module.exports = testUtils();