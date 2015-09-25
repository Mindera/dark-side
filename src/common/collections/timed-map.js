var _ = require('lodash');

var timedMap = function () {
    var dictionary = {};

    function addWithTimestamp(value) {
        var wrapper = {};
        wrapper.value = value;
        wrapper.timeAdded = Date.now();
        return wrapper;
    }

    return {
        values: function () {
            return dictionary;
        },

        put: function (key, value) {
            dictionary[key] = addWithTimestamp(value);
        },

        get: function (key) {
            return dictionary[key].value;
        },

        remove: function (key) {
            delete dictionary[key];
        },

        length: function () {
            return _.size(dictionary);
        }
    };
};
module.exports = timedMap;