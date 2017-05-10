module.exports = function(target, key, descriptor) {
  var type  = descriptor.get ? 'get' : 'value';
  var fn    = descriptor[type];
  var char0 = String.fromCharCode(0);

  descriptor[type] = function(){
    var keyAry = [];

    if (!this.hasOwnProperty("__memoized__")) {
      this.__memoized__ = {};
    }

    for (let i=0, l=arguments.length; i<l; i++) {
      let arg  = arguments[i];
      let type = typeof arg;

      keyAry.push(
        (arg  === null)       ? char0 + 'null'      :
        (arg  === void 0)     ? char0 + 'undefined' :
        (type === 'function') ? char0 + arg         :
        (type === 'object')   ? char0 + JSON.stringify(arg) :
        arg
      );
    }

    var cacheKey = key + keyAry.join(String.fromCharCode(0));

    if (!this.__memoized__.hasOwnProperty(cacheKey)) {
        this.__memoized__[cacheKey] = fn.apply(this, arguments);
    }

    return this.__memoized__[cacheKey];
  };

  return descriptor;
};
