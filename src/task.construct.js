let log = require('log');

let ensureBuilding = function(room, pos, structureType) {
  let found = room.lookAt(pos);
  for (let i = 0; i < found.length; i++) {
    if (found[i].type == LOOK_STRUCTURES || found[i].type == LOOK_CONSTRUCTION_SITES) {
      return;
    }
  }

  log.debug({
    _fkt: 'ensureBuilding',
    construct: room.createConstructionSite(pos, structureType),
  });
}

module.exports = function(room) {

  // Construct extensions around the spawn
  if (room.controller.level > 1) {
    room.find(FIND_MY_STRUCTURES, {
      filter: {
        structureType: STRUCTURE_SPAWN
      }
    }).forEach(function(spawn, idx) {
      ensureBuilding(room, spawn.pos.getRelativePosition(-2, 0), STRUCTURE_EXTENSION);
      ensureBuilding(room, spawn.pos.getRelativePosition(0, -2), STRUCTURE_EXTENSION);
      ensureBuilding(room, spawn.pos.getRelativePosition(0, 2), STRUCTURE_EXTENSION);
      ensureBuilding(room, spawn.pos.getRelativePosition(2, 0), STRUCTURE_EXTENSION);
      if (room.controller.level > 2) {
        ensureBuilding(room, spawn.pos.getRelativePosition(-2, -2), STRUCTURE_EXTENSION);
        ensureBuilding(room, spawn.pos.getRelativePosition(-2, 2), STRUCTURE_EXTENSION);
        ensureBuilding(room, spawn.pos.getRelativePosition(2, -2), STRUCTURE_EXTENSION);
        ensureBuilding(room, spawn.pos.getRelativePosition(2, 2), STRUCTURE_EXTENSION);
      }
    });
  }

};
