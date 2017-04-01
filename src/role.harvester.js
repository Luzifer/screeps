let log = require('log');

module.exports = function(spawn, creep) {
  log.debug({
    _fkt: 'harvest',
    creep: creep,
    memory: creep.memory,
  })

  if (creep.memory.target == undefined) {
    if (creep.memory.mode == 'harvest') {
      // In case we're new to harvest mode lets choose a target
      let droppedEnergyPile = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
      if (droppedEnergyPile) {
        creep.memory.target = {
          id: droppedEnergyPile.id,
          type: 'droppedEnergyPile'
        }
      } else {
        let source = creep.pos.findClosestByRange(FIND_SOURCES);
        creep.memory.target = {
          id: source.id,
          type: 'source'
        }
      }

    } else {
      let extensions = spawn.room.find(FIND_MY_STRUCTURES, {
        filter: function(o) {
          return o.structureType == STRUCTURE_EXTENSION && o.energy < o.energyCapacity
        }
      });

      let towers = spawn.room.find(FIND_MY_STRUCTURES, {
        filter: function(o) {
          return o.structureType == STRUCTURE_TOWER && o.energy < o.energyCapacity
        }
      });

      if (spawn.energy < spawn.energyCapacity) {
        creep.memory.target = {
          id: spawn.id,
          type: 'spawn'
        }
      } else if (extensions.length > 0) {
        creep.memory.target = {
          id: extensions[0].id,
          type: 'extension'
        }
      } else if (towers.length > 0) {
        creep.memory.target = {
          id: towers[0].id,
          type: 'tower'
        }
      } else {
        creep.memory.target = {
          id: creep.room.controller.id,
          type: 'controller'
        }
      }
    }
  }

  let target = Game.getObjectById(creep.memory.target.id);
  if (target == null) {
    log.error({
      _fkt: 'harvest',
      error: 'Was assigned unkown target',
      target: creep.memory.target,
    })
    creep.memory.target = undefined;
    return;
  }

  // Decide what action to take on our target
  let action = creep.transfer;
  let args = [target, RESOURCE_ENERGY];
  let _action = 'transfer';
  if (creep.memory.target.type == 'controller') {
    action = creep.upgradeController;
    args = [target];
    _action = 'upgrade';
  } else if (creep.memory.target.type == 'droppedEnergyPile') {
    action = creep.pickup;
    args = [target];
    _action = 'pickup';
  } else if (creep.memory.target.type == 'source') {
    // From those in this list only a source should regenerate
    action = creep.harvest;
    args = [target];
    _action = 'harvest';
  }

  log.debug({
    _fkt: 'harvest',
    creep: creep,
    action: _action,
    target: creep.memory.target,
  })

  let result = action.apply(creep, args);
  switch (result) {
    case ERR_NOT_IN_RANGE:
      creep.moveTo(target);
      break;
    case ERR_NOT_FOUND:
    case ERR_INVALID_TARGET:
      creep.memory.target = undefined
      break;
    case ERR_NOT_ENOUGH_ENERGY:
    case ERR_NOT_ENOUGH_RESOURCES:
      creep.memory.mode = 'harvest';
      creep.memory.target = undefined;
      break;
    case ERR_FULL:
      creep.memory.mode = 'move';
      creep.memory.target = undefined;
      break;

    case OK:
      break;

    default:
      log.error({
        _fkt: 'harvest',
        error: 'Got unknown error code',
        code: result,
      })
  }
};
