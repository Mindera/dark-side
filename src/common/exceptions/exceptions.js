var exceptionsFactory = function () {

    function InvalidArgumentsException(message) {
        this.name = 'Invalid arguments exception';
        this.message = (message || "");
        this.type = 'INVALID_ARGUMENTS';
    }
    InvalidArgumentsException.prototype = Error.prototype;


    function NotFoundException(message) {
        this.name = 'Not found exception';
        this.message = (message || "");
        this.type = 'NOT_FOUND';
    }
    NotFoundException.prototype = Error.prototype;

    return {
        buildInvalidArgumentsException: function (message) {
            return new InvalidArgumentsException(message);
        },

        buildNotFoundException: function (message) {
            return new NotFoundException(message);
        },

        InvalidArgumentsException: InvalidArgumentsException,
        NotFoundException: NotFoundException

    };
};
module.exports = exceptionsFactory();