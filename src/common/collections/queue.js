var queue = function () {

    var data = [];

    return {
        values: function () {
            return data;
        },

        pop: function () {
            return data.pop();
        },

        push: function (element) {
            data.splice(0, 0, element);
        },

        getAt: function (index) {
            return data[index];
        },

        removeAt: function (index) {
            data.splice(index, 1);
        },

        length: function () {
            return data.length;
        }
    };
};
module.exports = queue;