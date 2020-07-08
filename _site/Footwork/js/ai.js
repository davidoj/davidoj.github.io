


//Takes random steps around the map
//Attack player if adjacent
Game.Mixins.RandomWalkerActor = {
	name : 'MonsterActor',
	groupName : 'NPActor',
	act : function() {
		console.log("I'm an actor");
		var ents = this.getMap().getEntitiesWithinRadius(this.getX(),this.getY(),1);
		for (var i=0;i<ents.length;i++) {
			if (ents[i].hasMixin('PlayerActor')) {
				this.turn(ents[i].getX()-this.getX(),ents[i].getY()-this.getY());
				this.useCurrentAbility();
				return;
			}
		}
		var x = Math.round(2*Math.random())-1;
		var y = Math.round(2*Math.random())-1;
		this.fpsMove(x,y,this._map);
	}
}

//Charge towards the player if close enough
//Attak player if adjacent
Game.Mixins.ChargerActor = {
	name: 'ChargerActor',
	groupName: 'NPActor',
	act: function() {
		var ents = this.getMap().getEntitiesWithinRadius(this.getX(),this.getY(),6);
		for (var i=0;i<ents.length;i++) {
			if (ents[i].hasMixin('PlayerActor')) {
				this.turn(ents[i].getX()-this.getX(),ents[i].getY()-this.getY());
				if (this.getDist(ents[i]) > 1) {
					this.fpsMove(1,0,this._map);
				} else {
					this.useCurrentAbility();
				}
			}
		}
	}
}
