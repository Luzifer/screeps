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
      let relativeSpots = [
        [-2, 0],
        [0, -2],
        [0, 2],
        [2, 0],
        [-2, -2],
        [-2, 2],
        [2, -2],
        [2, 2],
        [-4, 0],
        [0, -4],
        [0, 4],
        [4, 0],
        // TODO(kahlers): Add more coords
      ]

      let toBuild = Math.floor(CONTROLLER_STRUCTURES['extension'][room.controller.level] / 4) * 4;
      relativeSpots.slice(0, toBuild).forEach(function(relCoords) {
        ensureBuilding(room, spawn.pos.getRelativePosition(relCoords[0], relCoords[1]), STRUCTURE_EXTENSION);
      })
    });
  }

};
