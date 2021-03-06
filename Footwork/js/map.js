

Game.Map = function(tiles, player) {
	this._tiles = tiles;
	this._width = tiles.length;
	this._height = tiles[0].length;
	
	this._entities = [];
	this._scheduler = new ROT.Scheduler.Simple();
	this._engine = new ROT.Engine(this._scheduler);

	this.addEntityAtRandomPosition(player);
	
	for (i=0;i<1;i++) {
		this.addEntityAtRandomPosition(new Game.Entity(Game.ConfusedWandererTemplate));
		this.addEntityAtRandomPosition(new Game.Entity(Game.RecklessChargerTemplate));
	}

}

Game.Map.prototype.getWidth = function() {
	return this._width;
}

Game.Map.prototype.getHeight = function() {
	return this._height;
}

Game.Map.prototype.getTile = function(x,y) {
	if (x < 0 || x >= this._width || y<0 || y >= this._height) {
		return Game.Tile.nullTile;
	} 
	else {
		return this._tiles[x][y] || Game.Tile.nullTile;
	}
}

Game.Map.prototype.getEngine = function() {
	return this._engine;
}

Game.Map.prototype.getEntities = function() {
	return this._entities;
}

Game.Map.prototype.getEntityAt = function(x,y) {
	for (var i=0; i < this._entities.length; i++) {
		if (this._entities[i].getX() == x && this._entities[i].getY() == y) {
			return this._entities[i]
		}
	}
	return false;
}

Game.Map.prototype.getEntitiesWithinRadius = function(centerX, centerY, radius) {
    results = [];
    var leftX = centerX - radius;
    var rightX = centerX + radius;
    var topY = centerY - radius;
    var bottomY = centerY + radius;
    for (var i = 0; i < this._entities.length; i++) {
        if (this._entities[i].getX() >= leftX &&
            this._entities[i].getX() <= rightX && 
            this._entities[i].getY() >= topY &&
            this._entities[i].getY() <= bottomY) {
            results.push(this._entities[i]);
        }
    }
    return results;
}



Game.Map.prototype.addEntity = function (entity) {
	
	if (entity.getX() < 0 || entity.getX() >= this._width ||
		entity.getY() < 0 || entity.getY() >= this._height) {
		throw new Error("Attempting to add entity out of bounds");
	}
	
	this._entities.push(entity);

	entity.setMap(this);

	if (entity.hasMixin('Actor') || entity.hasMixin('NPActor')) {
		this._scheduler.add(entity, true);
	}
}

Game.Map.prototype.addEntityAtRandomPosition = function (entity) {

	var valid = false;
	while (!valid) {
		var x = Math.floor(this._width*Math.random());
		var y = Math.floor(this._height*Math.random());
		valid = (!this.getEntityAt(x,y) && this.getTile(x,y).isWalkable());
	}
	entity.setX(x);
	entity.setY(y);
	this.addEntity(entity);
}

Game.Map.prototype.removeEntity = function (entity) {

	for (var i=0; i<this._entities.length; i++) {
		if (this._entities[i] == entity) {
			this._entities.splice(i,1);
		}
	}
	if (entity.hasMixin('NPActor')) {
		this._scheduler.remove(entity);
	}
	if (entity.hasMixin('PlayerActor')) {
			Game.sendMessage(entity,"Game Over");
	}

}
			
