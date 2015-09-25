var _ = require('lodash');
var exceptions = require('../exceptions/exceptions');

module.exports = {
    validateStringArg: function (arg, message) {
        if (!_.isString(arg) || _.isEmpty(arg)) {
            throw new exceptions.InvalidArgumentsException(message);
        }
    },
    validateObjectArg: function (arg, message) {
        if (!_.isPlainObject(arg) || _.isEmpty(arg)) {
            throw new exceptions.InvalidArgumentsException(message);
        }
    }
};
