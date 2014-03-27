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


