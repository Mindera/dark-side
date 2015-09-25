var mockedCreator = function () {
    return {
        create: function () {
           return 'created-mock';
        }
    };
};
module.exports = mockedCreator();