
// Strictly positive modulus
function mod(n, m) {
        return ((n % m) + m) % m;
}

// Get an "eighthian" direction from a vector
function v2d(x,y) {
	return mod(Math.round(4*Math.atan2(y,x)/Math.PI),8);
}


// Get a unit vector from a direction
function d2v(direction) {
	var dir_array = [[1,0],
					 [1,-1],
					 [0,-1],
					 [-1,-1],
					 [-1,0],
					 [-1,1],
					 [0,1],
					 [1,1]];
	
	return dir_array[direction];
}

// Calculate the amount of turn between two directions
function degree(dir1, dir2) {
	return Math.max(0,mod(Math.abs(dir2-dir1),7)-1);
}
