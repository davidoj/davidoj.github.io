// Attacking abilities

Game.Attacks = {};

// Basic forward attack
Game.Attacks.AttackForward = {

	name : 'AttackForward',
	balance_cost : 2,
	getTargets : function(user) {
		targets = [];
		var dir_v = d2v(user._direction);
		var target_x = user.getX()+dir_v[0];
		var target_y = user.getY()+dir_v[1];
		targets.push([target_x,target_y]);
		return targets;
	},
	missMessage : "You powerfully swing at the air but, sadly, you miss",
	weakMissMessage : "From the ground, you ineffectually swing at the air and miss",
	doHitMessage : "You whack the %s right in its face!",
	takeHitMessage : "The %s whomps you right on your beautiful nose!",
	doWeakHitMessage : "From the ground, you ineffectually flail in the %s's direction",
	takeWeakHitMessage : "The sprawled %s swipes at you menacingly"
}
