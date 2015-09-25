module.exports = {
    InvalidArgumentsException: function (message) {
        return {
            name: 'Invalid arguments exception',
            message: message,
            type: 'INVALID_ARGUMENTS'
        };
    },

    NotFoundException: function (message) {
        return {
            name: 'Not found exception',
            message: message,
            type: 'NOT_FOUND'
        };
    }
};