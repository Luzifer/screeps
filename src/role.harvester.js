module.exports = function(spawn, creep) {
  if (creep.carry[RESOURCE_ENERGY] < creep.carryCapacity && creep.memory.mode == 'harvest') {
    let source = creep.pos.findClosestByRange(FIND_SOURCES);

    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  } else {
    let extensions = spawn.room.find(FIND_MY_STRUCTURES, {
      filter: function(o) {
        return o.structureType == STRUCTURE_EXTENSION && o.energy < o.energyCapacity
      }
    });

    if (spawn.energy < spawn.energyCapacity) {
      creep.memory.mode = (creep.carry[RESOURCE_ENERGY] > 0 ? creep.memory.mode : 'harvest');
      if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn);
      }
    } else if (extensions.length > 0) {
      creep.memory.mode = (creep.carry[RESOURCE_ENERGY] > 0 ? creep.memory.mode : 'harvest');
      if (creep.transfer(extensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(extensions[0]);
      }
    } else {
      creep.memory.mode = (creep.carry[RESOURCE_ENERGY] > 0 ? 'upgrade' : 'harvest');
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    }
  }
};
