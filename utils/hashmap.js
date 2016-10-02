var size = function (hashmap) {
    return Object.keys(hashmap).length;
};

var getKeys = function (hashmap) {
    return Object.keys(hashmap);
};

var getValues = function (hashmap) {
    return getKeys(hashmap).map(function (key) {
        return hashmap[key];
    });
};

module.exports = {
    size: size,
    getKeys: getKeys,
    getValues: getValues
};
