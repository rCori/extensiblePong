//pacControls.js

//I need this to handle input
window.addEventListener('keydown', function (e) {
	switch(e.keyCode){
		//If left is pressed
		case 37:
			pacman.nextDirection = 1;

		break;
		//If right is pressed
		case 39:
			pacman.nextDirection = 2;
		break;
		//If up is pressed
		case 38:
			pacman.nextDirection = 3;
		break;
		//If down is pressed
		case 40:
			pacman.nextDirection = 4;
		break;
	}
}, false);
//I need this to handle input
window.addEventListener('keyup', function (e) {
	pacman.nextDirection = 0;

}, false);
window.addEventListener('keypress', function (e) {
	//the keycode for p is 122 for keypress
	if(e.charCode == 112){
		gamePaused = !gamePaused;
		if(!gamePaused){
			timeSnaps = timeSnaps.slice(0,$( "#timeSlider" ).slider('value'));
		}
		$("#timeSlider").slider("option","max",timeSnaps.length-1);
		$( "#timeAmount" ).val(timeSnaps.length-1);
		$("#timeSlider").slider("value",timeSnaps.length-1);
		//How you like them apples
		pacman.left = myTileset.checkLeft(pacman.xTile,pacman.yTile);
		pacman.right = myTileset.checkRight(pacman.xTile,pacman.yTile);
		pacman.up = myTileset.checkUp(pacman.xTile,pacman.yTile);
		pacman.down = myTileset.checkDown(pacman.xTile,pacman.yTile);

	}

	if(e.charCode == 32){
		if(gameOver){
			gameOver = false;
			pacman.lives = 3;
		}
	}
}, false);