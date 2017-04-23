(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define('querybase', ['exports'], factory) :
    (factory((global.querybase = global.querybase || {})));
}(this, (function (exports) { 'use strict';

var _ = {
    indexKey: function () {
        return '~~';
    },
    isCommonJS: function () {
        return typeof module != 'undefined';
    },
    isString: function (value) {
        return typeof value === 'string' || value instanceof String;
    },
    isObject: function (value) {
        return value !== null && typeof value === 'object';
    },
    hasMultipleCriteria: function (criteriaKeys) {
        return criteriaKeys.length > 1;
    },
    createKey: function (propOne, propTwo) {
        return "" + propOne + _.indexKey() + propTwo;
    },
    getPathFromRef: function (ref) {
        var PATH_POSITION = 3;
        var pathArray = ref.toString().split('/');
        return pathArray.slice(PATH_POSITION, pathArray.length).join('/');
    },
    merge: function (obj1, obj2) {
        var mergedHash = {};
        for (var prop in obj1) {
            mergedHash[prop] = obj1[prop];
        }
        for (var prop in obj2) {
            mergedHash[prop] = obj2[prop];
        }
        return mergedHash;
    },
    keys: function (obj) {
        return Object.keys(obj);
    },
    values: function (obj) {
        return Object.keys(obj).map(function (key) { return obj[key]; });
    },
    encodeBase64: function (data) {
        if (this.isCommonJS()) {
            return new Buffer(data).toString('base64');
        }
        else {
            return window.btoa(data);
        }
    },
    arraysToObject: function (keys, values) {
        var indexHash = {};
        var count = 0;
        keys.forEach(function (key) {
            var value = values[count];
            indexHash[key] = value;
            count++;
        });
        return indexHash;
    },
    lexicographicallySort: function (a, b) {
        return a.localeCompare(b);
    },
    getKeyIndexPositions: function (arr) {
        var indexOfKeys = {};
        arr.forEach(function (key, index) { return indexOfKeys[key] = index; });
        return indexOfKeys;
    },
    createSortedObject: function (keys, values) {
        var sortedRecord = {};
        var indexOfKeys = this.getKeyIndexPositions(keys);
        var sortedKeys = keys.sort(this.lexicographicallySort);
        sortedKeys.forEach(function (key) {
            var index = indexOfKeys[key];
            sortedRecord[key] = values[index];
        });
        return sortedRecord;
    },
    sortObjectLexicographically: function (obj) {
        var keys = this.keys(obj);
        var values = this.values(obj);
        return this.createSortedObject(keys, values);
    }
};

var QuerybaseQuery = (function () {
    function QuerybaseQuery(query) {
        this.query = function () { return query; };
    }
    QuerybaseQuery.prototype.lessThan = function (value) {
        return this.query().endAt(value);
    };
    QuerybaseQuery.prototype.greaterThan = function (value) {
        return this.query().startAt(value);
    };
    QuerybaseQuery.prototype.equalTo = function (value) {
        return this.query().equalTo(value);
    };
    QuerybaseQuery.prototype.startsWith = function (value) {
        return this.query().startAt(value).endAt(value + "\uF8FF");
    };
    QuerybaseQuery.prototype.between = function (valueOne, valueTwo) {
        return this.query().startAt(valueOne).endAt(valueTwo);
    };
    return QuerybaseQuery;
}());

var Querybase = (function () {
    function Querybase(ref, indexOn) {
        var _this = this;
        this.INDEX_LENGTH = 3;
        this._assertFirebaseRef(ref);
        this._assertIndexes(indexOn);
        this._assertIndexLength(indexOn);
        this.ref = function () { return ref; };
        this.indexOn = function () { return indexOn.sort(_.lexicographicallySort); };
        this.key = this.ref().key;
        this.encodedKeys = function () { return _this.encodeKeys(_this.indexOn()); };
    }
    Querybase.prototype._assertFirebaseRef = function (ref) {
        if (ref === null || ref === undefined || !ref.on) {
            throw new Error("No Firebase Database Reference provided in the Querybase constructor.");
        }
    };
    Querybase.prototype._assertIndexes = function (indexes) {
        if (indexes === null || indexes === undefined) {
            throw new Error("No indexes provided in the Querybase constructor. Querybase uses the indexOn() getter to create the composite queries for the where() method.");
        }
    };
    Querybase.prototype._assertIndexLength = function (indexes) {
        if (indexes.length > this.INDEX_LENGTH) {
            throw new Error("Querybase supports only " + this.INDEX_LENGTH + " indexes for multiple querying.");
        }
    };
    Querybase.prototype.set = function (data, onComplete) {
        var dataWithIndex = this.indexify(data);
        return this.ref().set(dataWithIndex, onComplete);
    };
    Querybase.prototype.update = function (data, onComplete) {
        var dataWithIndex = this.indexify(data);
        return this.ref().update(dataWithIndex);
    };
    Querybase.prototype.push = function (data, onComplete) {
        if (!data) {
            return this.ref().push();
        }
        if (_.keys(data).length === 1) {
            return this.ref().push(data);
        }
        var dataWithIndex = this.indexify(data);
        var indexesAndData = _.merge(dataWithIndex, data);
        var firebaseRef = this.ref().push();
        firebaseRef.set(indexesAndData, onComplete);
        return firebaseRef;
    };
    Querybase.prototype.remove = function (onComplete) {
        return this.ref().remove(onComplete);
    };
    Querybase.prototype.child = function (path, indexOn) {
        return new Querybase(this.ref().child(path), indexOn);
    };
    Querybase.prototype._createQueryPredicate = function (criteria) {
        var sortedCriteria = _.sortObjectLexicographically(criteria);
        var keys = _.keys(sortedCriteria);
        var values = _.values(sortedCriteria);
        this._warnAboutIndexOnRule();
        if (!_.hasMultipleCriteria(keys)) {
            return {
                predicate: keys[0],
                value: values[0]
            };
        }
        var criteriaIndex = this.encodeKey(keys.join(_.indexKey()));
        var criteriaValues = this.encodeKey(values.join(_.indexKey()));
        return {
            predicate: criteriaIndex,
            value: criteriaValues
        };
    };
    Querybase.prototype._createChildOrderedQuery = function (stringCriteria) {
        return new QuerybaseQuery(this.ref().orderByChild(stringCriteria));
    };
    Querybase.prototype._createEqualToQuery = function (criteria) {
        return this.ref().orderByChild(criteria.predicate).equalTo(criteria.value);
    };
    Querybase.prototype.where = function (criteria) {
        if (_.isString(criteria)) {
            return this._createChildOrderedQuery(criteria);
        }
        var queryPredicate = this._createQueryPredicate(criteria);
        return this._createEqualToQuery(queryPredicate);
    };
    Querybase.prototype._createCompositeIndex = function (indexes, data, indexHash) {
        if (!Array.isArray(indexes)) {
            throw new Error("_createCompositeIndex expects an array for the first parameter: found " + indexes);
        }
        if (indexes.length === 0) {
            throw new Error("_createCompositeIndex expect an array with multiple elements for the first parameter. Found an array with length of " + indexes.length);
        }
        if (!_.isObject(data)) {
            throw new Error("_createCompositeIndex expects an object for the second parameter: found " + data);
        }
        var propCop = indexes.slice();
        var mainProp = propCop.shift();
        indexHash = indexHash || {};
        propCop.forEach(function (prop) {
            var propString = "";
            var valueString = "";
            indexHash[_.createKey(mainProp, prop)] =
                _.createKey(data[mainProp], data[prop]);
            propCop.forEach(function (subProp) {
                propString = _.createKey(propString, subProp);
                valueString = _.createKey(valueString, data[subProp]);
            });
            indexHash[mainProp + propString] = data[mainProp] + valueString;
        });
        if (propCop.length !== 0) {
            this._createCompositeIndex(propCop, data, indexHash);
        }
        return indexHash;
    };
    Querybase.prototype._encodeCompositeIndex = function (indexWithData) {
        if (!_.isObject(indexWithData)) {
            throw new Error("_encodeCompositeIndex expects an object: found " + indexWithData.toString());
        }
        var values = _.values(indexWithData);
        var keys = _.keys(indexWithData);
        var encodedValues = this.encodeKeys(values);
        var encodedKeys = this.encodeKeys(keys);
        return _.arraysToObject(encodedKeys, encodedValues);
    };
    Querybase.prototype.indexify = function (data) {
        var compositeIndex = this._createCompositeIndex(this.indexOn(), data);
        var encodedIndexes = this._encodeCompositeIndex(compositeIndex);
        return encodedIndexes;
    };
    Querybase.prototype.encodeKey = function (value) {
        return "querybase" + _.indexKey() + _.encodeBase64(value);
    };
    Querybase.prototype.encodeKeys = function (values) {
        var _this = this;
        return values.map(function (value) { return _this.encodeKey(value); });
    };
    Querybase.prototype._warnAboutIndexOnRule = function () {
        var indexKeys = this.encodedKeys();
        var _indexOnRule = "\n\"" + _.getPathFromRef(this.ref()) + "\": {\n  \".indexOn\": [" + _.keys(indexKeys).map(function (key) { return "\"" + indexKeys[key] + "\""; }).join(", ") + "]\n}";
        console.warn("If you haven't yet, add this rule to drastically improve performance of your Realtime Database queries: \n " + _indexOnRule);
    };
    return Querybase;
}());

function ref(ref, indexes) {
    return new Querybase(ref, indexes);
}

exports.ref = ref;
exports.Querybase = Querybase;
exports.QuerybaseQuery = QuerybaseQuery;
exports.QuerybaseUtils = _;

Object.defineProperty(exports, '__esModule', { value: true });

})));
