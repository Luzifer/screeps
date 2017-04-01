module.exports = {

  creepRequirements: {
    builder: {
      body: [
        [WORK, WORK, WORK, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], // Bigger model (8 extensions) - 700E
        [WORK, WORK, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY], // Advanced model (4 extensions) - 500E
        [WORK, MOVE, MOVE, CARRY, CARRY], // Basic model - 300E
      ],
      count: 2,
    },
    harvester: {
      body: [
        [WORK, WORK, WORK, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], // Bigger model (8 extensions) - 700E
        [WORK, WORK, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY], // Advanced model (4 extensions) - 500E
        [WORK, MOVE, MOVE, CARRY, CARRY], // Basic model - 300E
      ],
      count: 4,
    },
    fighter: {
      body: [
        [], // Basic model
      ],
      count: 0,
    },
  },

};
