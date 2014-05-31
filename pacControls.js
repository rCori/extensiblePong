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

/* PacMan needs to lose whatever active nextDirection he has
 * when no button is pressed. Without this the nextDirection
 * gets "saved" when it shouldn't. PacMan should only respond
 * to current keypresses, not old ones.
 */
window.addEventListener('keyup', function (e) {
	pacman.nextDirection = 0;

}, false);


window.addEventListener('keypress', function (e) {

	switch(e.charCode){

		/* The keycode for p is 122 for keypress
		 * This is the pause button. When the button
		 * is pressed it stops all movement and updating
		 * on the game and updates the time slider to
		 * make all the currently saved time steps available
		 * If the game was already paused, this unpauses it.
		 * It will also remove any time steps saved later
		 * in the array than the current frame we are on.
		 * This prevents saving future moves that the player chose
		 * to rewind on.
		 */
		case 112:
			//Change the gamePaused state
			gamePaused = !gamePaused;
			//If we were already paused
			if(!gamePaused){
				//Slice out time steps beyond the point where we are resuming play
				timeSnaps = timeSnaps.slice(0,$( "#timeSlider" ).slider('value')+1);
			}

			//Update the time slider to set the max value to the current time step
			$("#timeSlider").slider("option","max",timeSnaps.length);
			//Update the UI readout on what number time step it should display
			$( "#timeAmount" ).val(timeSnaps.length);
			//Update the time slider to set the current value to the current time step
			$("#timeSlider").slider("value",timeSnaps.length);
			/*The time steps don't record these pacman directional values, so when
			 * we unpause and he can move, we need to figure this all out again
			 */
			pacman.left = myTileset.checkLeft(pacman.xTile,pacman.yTile);
			pacman.right = myTileset.checkRight(pacman.xTile,pacman.yTile);
			pacman.up = myTileset.checkUp(pacman.xTile,pacman.yTile);
			pacman.down = myTileset.checkDown(pacman.xTile,pacman.yTile);
		break;

		/* The keycode for spacebar is 32 for keypress
		 * This button just starts the simulation up when
		 * the game is over and that spashscreen is up 
		 */
		case 32:
			if(gameOver){
				gameOver = false;
				//Put everything in it's initual place
				initValues(true);
				//Get another initial time step
				snapTime(saveData);
			}
		break;
	}
}, false);