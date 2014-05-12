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
	}

}, false);