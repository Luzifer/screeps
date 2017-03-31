module.exports = function(spawn, creep) {
  if (creep.carry[RESOURCE_ENERGY] < creep.carryCapacity && creep.memory.mode == 'harvest') {
    // Temporary behaviour to utilize the second energy source
    let source = creep.room.getPositionAt(38, 46).findClosestByRange(FIND_SOURCES);

    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source);
    }
  } else {
    let constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES);

    if (constructionSites.length > 0) {
      creep.memory.mode = (creep.carry[RESOURCE_ENERGY] > 0 ? 'build' : 'harvest');
      if (creep.build(constructionSites[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(constructionSites[0]);
      }
    } else {
      creep.memory.mode = (creep.carry[RESOURCE_ENERGY] > 0 ? 'upgrade' : 'build');
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    }
  }
};
