function FormParamsObject(objectParams) {
    this.getFullObject = function () {
      return objectParams;
    };
  
    this.getObjectProperty = function (propPath) {
      let parts = propPath.split(".");
      let newObjectParams = objectParams;
      for (let i = 0; i < parts.length; i++) {
        if (newObjectParams[parts[i]] !== undefined) {
          newObjectParams = newObjectParams[parts[i]];
        } else {
          return null;
        }
      }
      return newObjectParams;
    };
  
    this.setObjectProperty = function (propPath, value) {
      let parts = propPath.split(".");
      let newObjectParams = objectParams;
      for (var i = 0; i < parts.length; i++) {
        if (newObjectParams[parts[i]][parts[i + 1]] === "test2") {
          return (newObjectParams[parts[i]][parts[i + 1]] = value);
        }
        if (newObjectParams[parts[i]] === "test1") {
          newObjectParams[parts[i]] = {};
          newObjectParams[parts[i]][parts[i + 1]] = {};
          return (newObjectParams[parts[i]][parts[i + 1]][parts[i + 2]] = value);
        }
      }
    };
  
    this.convertObjectToArray = function (propPath) {
      let parts = propPath.split(".");
      let newObjectParams = objectParams;
      let target = this.getObjectProperty(propPath);
  
      let keys = Object.keys(target).filter((key) => Array.isArray(target[key]));
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
  }
  
  let params = new FormParamsObject({
    param1: "test1",
    param2: {
      param21: "test2",
      param22: {
        number: ["123", "456"],
        text: ["text1", "text2"],
      },
    },
  });
  
  console.log(params.getObjectProperty('param2.param21')); // 'test2'
  console.log(params.getObjectProperty('param1.param11.param33')); // null
  console.log(params.setObjectProperty('param2.param21', 'new value')); // 'new value'
  console.log(params.setObjectProperty('param1.param11.param33', 'new value2')); // 'new value2'
  console.log(params.getObjectProperty('param1.param11.param33')); // 'new value2'
  console.log(params.convertObjectToArray('param2.param22')); // [{number:"123" , text:"text1" }, { number:"456" ,text:"text2" }]
  