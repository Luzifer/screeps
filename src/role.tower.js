let log = require('log');

module.exports = function(tower) {

  // Heal own units
  tower.room.find(FIND_MY_CREEPS, {
    filter: function(c) {
      return c.hits < c.hitsMax
    },
  }).forEach(function(creep) {
    tower.heal(creep);
  });

  // Kill enemies
  tower.room.find(FIND_HOSTILE_CREEPS).forEach(function(c) {
    log.debug({
      _fkt: 'attack_hostile_creep',
      creep: c.name
    })

    tower.attack(c);
  });

  // Repair broken structures
  tower.room.find(FIND_MY_STRUCTURES, {
    filter: function(obj) {
      return obj.hits < obj.hitMax;
    },
  }).forEach(function(s) {
    log.debug({
      _fkt: 'repair_damaged_structure',
      structure: s.name
    })

    tower.repair(s);
  });

};
