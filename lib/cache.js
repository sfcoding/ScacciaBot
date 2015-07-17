var NodeCache = require( "node-cache" );

function HelperCache (){
  var instance = null;

  this.getInstance = function(){
    if (instance)
      return instance;
    else {
      instance = new NodeCache({ stdTTL: 200 });
      return instance;
    }
  };

  /*
  cache.set(key,data);

  this.rm = function(){
    cache.del(key);
  };

  this.get = function(){
    cache.get(key);
  };

  this.update = function(newdata){
    cache.
  };*/
}

module.exports = new HelperCache().getInstance();
