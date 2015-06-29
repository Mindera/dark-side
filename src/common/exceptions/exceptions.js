module.exports = {
    InvalidArgumentsException: function (message) {
        return {
            name: 'Invalid arguments exception',
            message: message
        };
    },

    NotFoundException: function (message) {
        return {
            name: 'Not found exception',
            message: message
        };
    }
};