module.exports = function(creep) {

  // V1: All role-less creeps were initially harvesters
  if (creep.memory.role == undefined) {
    creep.memory.role = 'harvester';
  }

};
