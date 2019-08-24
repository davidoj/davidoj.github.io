

Game.Tile = function(properties) {
	properties = properties || {};
	Game.Glyph.call(this,properties);
	this._walkable = properties['walkable'] || false;
}

Game.Tile.extend(Game.Glyph)

Game.Tile.prototype.isWalkable = function() {
	return this._walkable;
}


Game.Tile.nullTile = new Game.Tile({});

Game.Tile.floorTile = new Game.Tile({
	character: '.',
	walkable: true
});

Game.Tile.wallTile = new Game.Tile({
	character: '#',
});
