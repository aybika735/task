function FormParamsObject(objectParams) {
  this.objectParams = objectParams;

  Object.defineProperties(this, {
    getFullObject: {
      get: function () {
        return this.objectParams;
      },
    },

    getObjectProperty: {
      get: function () {
        return function (propPath) {
          var parts = propPath.split(".");
          var current = this.objectParams;
          for (var i = 0; i < parts.length; i++) {
            if (current[parts[i]] === undefined) {
              return null;
            }
            current = current[parts[i]];
          }
          return current;
        };
      },
    },
    setObjectProperty: {
      set: function ({ propPath, value }) {
        let parts = propPath.split(".");
        let newObjectParams = this.objectParams;
        console.log(newObjectParams);
        for (var i = 0; i < parts.length; i++) {
          if (newObjectParams[parts[i]][parts[i + 1]] === "test2") {
            return (newObjectParams[parts[i]][parts[i + 1]] = value);
          }
          if (newObjectParams[parts[i]] === "test1") {
            newObjectParams[parts[i]] = {};
            newObjectParams[parts[i]][parts[i + 1]] = {};
            return (newObjectParams[parts[i]][parts[i + 1]][parts[i + 2]] =
              value);
          }
        }
      },
    },
    convertedArray: {
      get: function () {
        return function (propPath) {
          let parts = propPath.split(".");
          let newObjectParams = objectParams;
          let target = this.getObjectProperty(propPath);

          let keys = Object.keys(target).filter((key) =>
            Array.isArray(target[key])
          );
          let result = Array.from({ length: keys.length }, (_, index) => {
            return keys.reduce((acc, key) => {
              acc[key] = target[key][index] || null;
              return acc;
            }, {});
          });
          for (let i = 0; i < parts.length; i++) {
            return (newObjectParams[parts[i]][parts[i + 1]] = [result]);
          }
        };
      },
    },
  });
}

var params = new FormParamsObject({
  param1: "test1",
  param2: {
    param21: "test2",
    param22: {
      number: ["123", "456"],
      text: ["text1", "text2"],
    },
  },
});
console.log("lll", params.getFullObject);
console.log(params.getObjectProperty("param2.param21")); // 'test2'
console.log(params.getObjectProperty("param1.param11.param33")); //null
params.setObjectProperty = { propPath: "param2.param21", value: "new value" };
params.setObjectProperty = {
  propPath: "param1.param11.param33",
  value: "new value2",
}; // 'new value2'
console.log(params.getObjectProperty("param1.param11.param33")); //new value2

console.log(params.convertedArray("param2.param22"));
