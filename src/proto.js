RoomPosition.prototype.getRelativePosition = function(x, y) {
  return new RoomPosition(this.x + x, this.y + y, this.roomName);
}

Source.prototype.availableSpots = function() {
  let result = 0;

  this.room.lookForAtArea(LOOK_TERRAIN, this.pos.y - 1, this.pos.x - 1, this.pos.y + 1, this.pos.x + 1, true).forEach(function(t) {
    if (t.terrain == 'plain') {
      result++;
    }
  })

  return result;
}
