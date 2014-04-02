//Taken directly from
//http://www.html5rocks.com/en/tutorials/canvas/notearsgame/

//Monkeypatches the Number object
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

//Simple collision function
//The objects a and b need to have height and width components
function collides(a, b){
  return a.x < b.x + b.width &&
         a.x + a.width >b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

//Normalize speed vector
function vec2_norm(x,y){
	var length = Math.sqrt((x*x) + (y*y));
	if(length != 0.0){
		legnth = 1.0 / length;
		x *= length;
		y *= length;
	}
	console.log({x:x,y:y});
	return {x:x, y:y};
}

