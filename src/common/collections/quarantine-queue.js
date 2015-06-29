var _ = require('lodash');
var Queue = require('./queue');

var quarantineQueue = function () {

    var queue = new Queue();

    function wrap(value, reason) {

        var wrapped = {
            value: value,
            reason: reason
        };

        return {
            getReason: function () {
                return wrapped.value;
            },

            getElement: function () {
                return wrapped.reason;
            }
        };
    }

    var innerSelf = {
        pushToQuarantine: function (element, reason) {
            queue.push(wrap(element, reason));
        }
    };

    return _.extend(queue, innerSelf);
};
module.exports = quarantineQueue;