RoomPosition.prototype.getRelativePosition = function(x, y) {
  return new RoomPosition(this.x + x, this.y + y, this.roomName);
}
