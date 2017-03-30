module.exports = function(spawn, creep) {
  if (creep.carry[RESOURCE_ENERGY] < creep.carryCapacity && creep.memory.mode == 'harvest') {
    // Temporary behaviour to utilize the second energy source
    let source = creep.room.getPositionAt(38, 46).findClosestByRange(FIND_SOURCES);

    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  } else {
    if (spawn.energy < spawn.energyCapacity) {
      if (creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn);
      }
    } else {
      creep.memory.mode = (creep.carry[RESOURCE_ENERGY] > 0 ? 'upgrade' : 'harvest');
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    }
  }
};
