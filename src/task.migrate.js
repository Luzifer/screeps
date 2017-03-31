let log = require('log');

module.exports = function(creep) {

  // V1: All role-less creeps were initially harvesters
  if (creep.memory.role == undefined) {
    creep.memory.role = 'harvester';
  }

  // V2: Set a default log level in global memory
  if (Memory.log_level == undefined) {
    Memory.log_level = log.level.info;
  }

};
