module.exports = {

  debug: function(obj) {
    obj._level = 'DBG';
    console.log(JSON.stringify(obj))
  },

}
