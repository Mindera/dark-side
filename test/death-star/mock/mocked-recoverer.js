var mockedRecoverer = function () {
    return {
        recover: function () {
            return 'recovered-mock';
        }
    };
};
module.exports = mockedRecoverer();