let log = require('log');

let ensureBuilding = function(room, pos, structureType) {
  let found = room.lookAt(pos);
  for (let i = 0; i < found.length; i++) {
    if (found[i].type == LOOK_STRUCTURES || found[i].type == LOOK_CONSTRUCTION_SITES || (found[i].type == 'terrain' && found[i].terrain != 'plain')) {
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
      let relativeSpots = []

      for (let i = 0; i < 6; i += 2) {
        for (let j = 0; j < 6; j += 2) {
          relativeSpots.push([i, j], [i * -1, j], [i * -1, j * -1], [i, j * -1])
        }
      }

      let toBuild = Math.floor(CONTROLLER_STRUCTURES['extension'][room.controller.level] / 4) * 4;
      relativeSpots.slice(0, toBuild).forEach(function(relCoords) {
        ensureBuilding(room, spawn.pos.getRelativePosition(relCoords[0], relCoords[1]), STRUCTURE_EXTENSION);
      })
    });
  }

};
