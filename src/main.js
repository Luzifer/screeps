'use strict';

require('proto');

let config = require('config');
let construct = require('task.construct');
let log = require('log');
let migrate = require('task.migrate');
let uuid = require('uuid');

let behaviours = {
  'builder': require('role.builder'),
  'harvester': require('role.harvester'),
  'tower': require('role.tower'),
};

let minAmountOfBots = 4;
let creepPreset = [WORK, MOVE, MOVE, CARRY, CARRY];

let cleanMemory = function() {
  for (var i in Memory.creeps) {
    if (!Game.creeps[i]) {
      delete Memory.creeps[i];
    }
  }
}

let bodyPartSum = function(parts) {
  let sum = 0;
  for (let i = 0; i < parts.length; i++) {
    sum += BODYPART_COST[parts[i]];
  }
  return sum;
}

module.exports.loop = function() {
  let spawn = Game.spawns['Gate to Hell']; // TODO(kahlers): Replace with better searching logic
  let currentlyAvailableCreepTypes = {};

  Object.keys(Game.creeps).forEach(function(creepName, idx) {
    let creep = Game.creeps[creepName];
    migrate(creep);

    if (currentlyAvailableCreepTypes[creep.memory.role] == null) {
      currentlyAvailableCreepTypes[creep.memory.role] = 0;
    }
    currentlyAvailableCreepTypes[creep.memory.role]++;

    if (creep.spawning) {
      // Don't bother with unfinished creeps
      return;
    }

    behaviours[creep.memory.role](spawn, creep);
  });

  Object.keys(Game.structures).forEach(function(structureName) {
    let structure = Game.structures[structureName];
    if (structure.structureType != STRUCTURE_TOWER) {
      return;
    }

    behaviours['tower'](structure);
  });

  Object.keys(config.creepRequirements).forEach(function(creepType, idx) {
    if (currentlyAvailableCreepTypes[creepType] == undefined || currentlyAvailableCreepTypes[creepType] < config.creepRequirements[creepType].count) {
      let body = [];
      for (let i = 0; i < config.creepRequirements[creepType].body.length; i++) {
        if (bodyPartSum(config.creepRequirements[creepType].body[i]) < spawn.room.energyCapacityAvailable) {
          body = config.creepRequirements[creepType].body[i];
          break;
        }
      }

      if (spawn.canCreateCreep(body) == OK) {
        log.debug({
          _fkt: 'spawnCreep',
          creepType: creepType,
          body: body,
          partCost: bodyPartSum(body),
          ok: spawn.createCreep(body, uuid(), {
            mode: 'harvest',
            role: creepType,
            bindingRoom: spawn.room,
          }),
        });
      }
    }
  });

  // Construct things in rooms belonging to us
  Object.keys(Game.rooms).forEach(function(roomName) {
    let room = Game.rooms[roomName];
    if (room.find(FIND_MY_STRUCTURES).length < 1) {
      // Obviously we found a room we don't possess
      return;
    }

    construct(room);
  });

  // Global cleanup tasks
  cleanMemory();
};
