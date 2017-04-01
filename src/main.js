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
    log.debug({
      _fkt: 'spawnCreeps',
      creepType: creepType,
      currentlyAvailable: currentlyAvailableCreepTypes[creepType],
      requirement: config.creepRequirements[creepType],
      canSpawn: spawn.canCreateCreep(config.creepRequirements[creepType].body) == OK,
    });

    if ((
        currentlyAvailableCreepTypes[creepType] == undefined || currentlyAvailableCreepTypes[creepType] < config.creepRequirements[creepType].count
      ) && spawn.canCreateCreep(config.creepRequirements[creepType].body) == OK) {
      spawn.createCreep(config.creepRequirements[creepType].body, uuid(), {
        mode: 'harvest',
        role: creepType,
        bindingRoom: spawn.room,
      });
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
