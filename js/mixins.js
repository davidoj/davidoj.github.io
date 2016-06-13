// Entity mixins


Game.Mixins = {};

//Movement

//Entity can move to unblocked squares
//Takes argument in absolute coordinates to current position
Game.Mixins.AbsMoveable = {
	name : 'AbsMoveable',
	groupName : 'Moveable',
	tryMove: function(x,y,map) {
		var tile = map.getTile(x,y);
		if (tile.isWalkable() && !this._map.getEntityAt(x,y)) {
			this._x = x;
			this._y = y;

			if (this._playercontrolled) {
				this._map.getEngine().unlock();
			}

			return true;
		}
		else { return false;}
	}
}

//Has balance statistic that governs whether various actions can be used
Game.Mixins.Balanced = {
	name : 'Balanced',
	groupName : 'Balanced',
	init : function(properties) {
		this._mbal = properties['mbal'] || 5; //Max balance
		this._cbal = properties['cbal'] || 5; //Current balance
	},
	getBalance : function() {
		return this._cbal;
	},
	setBalance : function(balance) {
		this._cbal = balance;
	},
	reduceBalance : function(reduction) {
		this._cbal = Math.max(0,this._cbal-reduction);
		if (this._cbal == 1) {
			Game.sendMessage(this, "Your intricate dance is getting your legs into quite a tangle");
		}
		if (this._cbal == 0) {
			Game.sendMessage(this, "You fall over");
		}
	},
	increaseBalance : function(increase) {
		this._cbal = Math.min(this._mbal,this._cbal+increase);
	}
}


//Coordinates are relative to current position and direction
//'Fpsmove' direction is relative to current directin
//'RogueMove' direction is absolute
Game.Mixins.DirectionMoveable = {
	name : 'DirectionMoveable',
	groupName : 'Moveable',
	init : function(properties) {
		var x = properties['x_dir'] || 1;
		var y = properties['y_dir'] || -1;

		this._direction = v2d(x,-y);
		this._olddirection = this._direction;
		this._chararray = properties['chararray'] || Game.Chars.SingleArrows;
		this._char = this._chararray[this._direction];
	},
	getChar : function() {
		return this._chararray[this._direction];
	},
	turn : function(x,y) {
		this._direction = v2d(x,-y);
	},

	fpsMove : function(dx,dy,map) {

		if (dx == 0 && dy == 0) {
			this.increaseBalance(2);
			this._olddirection = this._direction;
			return true;
		}

		var movedir = v2d(dx,dy);
		var absdir = mod(this._direction-movedir,8);
		var movevec = d2v(absdir);
		var x = movevec[0]+this.getX();
		var y = movevec[1]+this.getY();
		var tile = map.getTile(x,y);
		var target = this._map.getEntityAt(x,y);

		if (tile.isWalkable() && (!target || target == this)) {

			this._olddirection = this._direction;

			if (!this.getBalance()) {
				Game.sendMessage(this,'You stand on shaking legs, steadying yourself to step once more.');
				this.setBalance(2);
				return true;
			} else {
				var bal_loss = Math.min(1,movedir);
				this.reduceBalance(bal_loss);
				this._x = x;
				this._y = y;
			}
			
		} else {
			return false;
		}
	},


	kbMove: function(dx,dy,noturn,map) {
		var x = this.getX() + dx;
		var y = this.getY() + dy;
		var tile = map.getTile(x,y);
		var target = this._map.getEntityAt(x,y);
		
		if (tile.isWalkable() && (!target || target == this)) {
			
			if (!this.getBalance()) {
				Game.sendMessage(this,'You stand on shaking legs, steadying yourself to step once more.');
				this.setBalance(2);
				return true;
			} else {

				this._x = x;
				this._y = y;
				if (!noturn) {
					this.turn(dx,dy);
				} else {
					var movedir = v2d(dx,dy);
					var absdir = mod(this._direction-movedir,8);
					var bal_loss = Math.min(1,absdir);
					this.reduceBalance(bal_loss);
			}
				return true;
			}
		} else { return false;}
	}
}


//Actor

//Player version of the Actor mixin
Game.Mixins.PlayerActor = {
	name : 'PlayerActor',
	groupName : 'Actor',
	act : function() {
		Game.refresh();
		this.getMap().getEngine().lock();
	},
	getControl : function(ch) {
		return this.controls[ch];
	},
	setControls : function(controls) {
		this.controls = controls;
	}
}

//Combat


//Use attacking abilities
Game.Mixins.Attacker = {
	name : 'Attacker',
	init : function(properties) {
		this._dmg = properties['dmg'] || 1; //Attack damage
		var abilities = properties['abilities'] || [Game.Attacks.AttackForward];

		this._abilities = {};
		this._currentability = properties['currentability'] || ['AttackForward'];
		for (var i=0; i<abilities.length; i++) {
			this.addAbility(abilities[i]);
		}
	},
	setDamage : function(damage) {
		this._dmg = damage;
	},
	getDamage : function() {
		if (this.getBalance() + 0.5 > Math.random()) {
			return this._dmg;
		} else {
			return 0;
		}
	},
	addAbility : function(ability) {
		this._abilities[ability.name] = ability;
	},
	hasAbility : function(obj) {
		if (typeof obj === 'object' && this._abilities[obj.name]) {
			return true;
		}
		else if (this._abilities[obj]) {
			return true;
		}
		else {
			return false;
		}
	},
	useCurrentAbility : function() {
		var ability = this._abilities[this._currentability];
		var targets = ability.getTargets(this);
		var hit = false;

		var damage = this.getDamage();
		var bal_damage = damage;
		if (damage) {
			var doMessage = ability.doHitMessage;
			var takeMessage = ability.takeHitMessage;
			var missMessage = ability.missMessage;
		} else {
			var doMessage = ability.doWeakHitMessage;
			var takeMessage = ability.takeWeakHitMessage;
			var missMessage = ability.weakMissMessage;
		}

		this.reduceBalance(ability.balance_cost);
		
		for (i=0; i<targets.length; i++) {
			target = this.getMap().getEntityAt(targets[i][0],targets[i][1]);
			if (target && target.hasMixin('Destructible')) {
				Game.sendMessage(this, doMessage, [target.getName()]);
				Game.sendMessage(target, takeMessage, [this.getName()]);
				target.takeDamage(damage);
				if (target.hasMixin('Balanced') {
					target.reduceBalance(bal_damage);
				}
				hit = true;
				}
			}
		
		if (!hit) {
			Game.sendMessage(this, missMessage);
		}
		
	}
}

//Take damage
Game.Mixins.Destructible = {
	name : 'Destructible',

	init : function(properties) {
		this._mhp = properties['mhp'] || 1; //Max hitpoints
		this._chp = properties['chp'] || this._mhp; //Current hitpoints
	},
	takeDamage : function(damage) {
		this._chp -= damage;
		if (this._chp <= 0) {
			this.die();
		}
		
	},
	die : function() {
		this.getMap().removeEntity(this);
	}
}




//Messaging


Game.Mixins.MessageRecipient = {
	name : "MessageRecipient",
	groupName : "MessageRecipient",

	init : function(properites) {
		this._messages = [];
	},
	receiveMessage : function(message) {
		this._messages.push(message);
	},
	getMessages : function() {
		return(this._messages);
	},
	clearMessages : function() {
		this._messages = [];
	}
}







