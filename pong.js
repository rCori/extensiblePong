/* A pong game that allows the user to adjust the game's variables
 * and change the mechanics of the game. A player can also pause
 * the game and manipulate time or rewind time to a previous place
 * in the game.
 */


//Much of the code here inspirded from a tutorial by Daniel X. Moore
//http://www.html5rocks.com/en/tutorials/canvas/notearsgame/
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 500;

//Player controllable variables
var SKIPFREQUENCY = 2;
var COMPUTERSPEED = 5;
var DIRECTIONALINFLUENCE = 1;
var LATERALMOVEMENT = false;
var PROJECTION = false;

//color values 
var COLOR = ["#000","#0000FF", "#800000", "#006600","#CCCC00"];

//The number of frames we can go forward in time
var SNAPSHOTS = 500;

//The Y location of the mouse is useful because it may
//be what the players chooses to move the paddle with.
var mouseY = 0;

//This code puts the canvas we want in the browser
var canvasElement = jQuery("<canvas width='" + CANVAS_WIDTH +
                      "'height='" + CANVAS_HEIGHT + "'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");
var myCanv = canvasElement.get(0);
canvasElement.appendTo('body');

//Trying to read mouse movements
//This is getting
myCanv.addEventListener('mousemove', function(evt){
	if(!gamePaused){
		mouseY = evt.clientY;
	}
}, false);

//The framerate the game will run at.
//This determines how often the setInterval runs
var FPS = 60;

//The game needs to know at a top level if the game is paused
var gamePaused = false;

//The current index we are on in the COLOR array
var colorIndex = 0;

var positionalData = new Array();
var collisionRecords = new Array();

/*Determine if the player is moving while the game is paused
 *like some time bending future pong player
 * To shut this off comment out the Off THe Rails check in draw()
 */
var ISOFFTHERAILS = false;

setInterval(function(){
	update();
	draw();
}, 1000/FPS);

//These are all game state functions that need to run every interval
//If they don't run every interval, they don't need to run at all
function update(){
	player.update();
	updateCheckboxes();
	/* If the game is paused, don't update position or collision detection
	 * These update events should only happen if the player is manually forcing
	 * them too with the time slider.
	 */
	if(!gamePaused){
		computer.update();
		ball.update();
		player.ballCollision();
		computer.ballCollision();
		topWall.update();
		bottomWall.update();
		//Now time has stopped
		updateTimeForward();
	}
	//Only worry about awarding a point if the ball actually goes out
	if(!ball.isOut){
		ball.awardPoint();
	}
}
/* These are all the drawing routines that need to be called every fram
 * The control statements prevent things that don't need to be drawn
 * fro being drawn
 */
function draw(){
	canvas.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
	player.draw();
	computer.draw();
	if(!ball.isOut){
		ball.draw();
	}
	topWall.draw();
	bottomWall.draw();
	drawScores();
	//For drawing the trails of where the ball has been over all time
	if(gamePaused && PROJECTION){
		drawTrails();
	}
	/* This is a silly feature that displays a message when the player
	 * moves while the game is paused. Originally used for debugging I
	 * thought it was neat to keep in.
	if(ISOFFTHERAILS && gamePaused){
		oFFTHERAILS();
	}
	*/
}

function paddle(isPlayer) {
	//The object to be returned
	//We will fill it with attributes that define the ball object.
	var I = {};

	//paddle variables
	//For things that need to be different between player and computer paddle
	//Player paddle things
	if(isPlayer){
		I.isPlayer=true;
		I.x = 40;
		I.velocity = 8;
	}
	//Computer paddle things
	else{
		I.skipCount = 0;
		I.isPlayer = false;
		I.x = 760;
		//Need to keep track of this so we can go backwards -- We may not
		//I.direction = 1;
		I.velocity = COMPUTERSPEED;
	}
	I.y = 200;
	I.width = 5;
	I.height = 40;
	I.color = "#000";
	I.score = 0;

	//The drawing function for paddles
	I.draw = function(){
		canvas.fillStyle = I.color;
		canvas.fillRect(I.x, I.y, I.width, I.height);
	}

	/* Most of the state updating the paddle does here is user input or AI based
	 * For the player paddle or computer paddle respectivley.
	 */
	I.update = function(){
		//Im gonna call this the input callback but really it's just a big mess
		//And there is another one in another function.

		//User Input
		if(I.isPlayer){
			//Mouse movement
			//mouseY is handled in an evenListener above
			if(!gamePaused){
				I.y = mouseY-I.height;
			}
			if(keydown.up){
				I.y -= I.velocity;
			}
			else if(keydown.down){
				I.y += I.velocity;
			}
			if(keydown.left && LATERALMOVEMENT){
				I.x -= (I.velocity * 0.5);
				ISOFFTHERAILS = true;
			}
			else if(keydown.right && LATERALMOVEMENT){
				I.x += (I.velocity * 0.5);
				ISOFFTHERAILS = true;
			}
			else{
				if(keydown.up){
					ISOFFTHERAILS = true;
				}
				else if(keydown.down){
					ISOFFTHERAILS = true;
				}
				else{
					ISOFFTHERAILS = false;
				}
			}
			I.x = I.x.clamp(0, CANVAS_WIDTH/2);
		}

		//Computer AI
		else{
			/* In Racing the beam I read that the cpu AI in the 2600 version
			 * of pong does a thing that in order to create a random jitter to
			 * movement, the AI does not update position every 8th frame(or
			 * screen refresh talking about that platform). The SKIPFREQUENCY
			 * stuff here is me trying to emulate that. Every frame it counts up
			 * until a frame it counts to SKIPFREQUENCY(A variable the user can
			 * change). On that frame it does not update position and sets the
			 * the counter back to 0.
			 */
			I.skipCount += 1;
			//Deal with the computers movement
			if(I.skipCount < SKIPFREQUENCY){
				if((I.y+(0.5*I.height))>ball.y){
					I.y-=I.velocity;
					I.direction=0;
				}
				if((I.y+(0.5*I.height))<ball.y){
					I.y+=I.velocity;
					I.direction=1;
				}
			}
			if(I.skipCount == SKIPFREQUENCY ){
				I.skipCount = 0;
			}
		}

		//Stops the paddles from going off screen.
		I.y = I.y.clamp(0,CANVAS_HEIGHT-I.height);
	}

	//A function only for the computer
	//This is for changing he computer's speed when the user want's to do so.
	I.updateVars = function(){
		if(!I.isPlayer){
			I.velocity = COMPUTERSPEED;
			I.skipCount = 0;
		}
	}

	/* The only collision that matters for the paddles is collision with the ball
	 * The user can change how much the placement of the ball on the paddle
	 * affects it's reflecting angle.
	 */
	I.ballCollision = function(){
		if(collides(I,ball)){
			var t = (((ball.y-I.y)/I.height) - 0.5)*DIRECTIONALINFLUENCE;
			ball.yVelocity += t;
			ball.xVelocity = -ball.xVelocity;
			if(I.isPlayer){
				collisionRecords.push({frame:$( "#timeSlider" ).slider( "value" ), object:"playerPaddle"});
			}
			else{
				collisionRecords.push({frame:$( "#timeSlider" ).slider( "value" ), object:"computerPaddle"});
			}
		}
	}

	return I;
}

//Make the only two paddles we actually ever want.
var player = paddle(true);
var computer = paddle(false);

/* This could be a constructor, but I would be making a singleton
 * I just made a really big object instead.
 */
var ball = {
	/* This is useful for knowing wether we should draw the
	 * ball or not. I could jsut record weather it's off the screen
	 * and just store it there or not, but this is more straightforward.
	 */
	isOut: true,
	//Location
	x: 0,
	y: 0,
	//size
	width: 5,
	height: 5,
	//Speed. 0 is the default, it is never really that during the game
	//That's a really boring game of pong
	xVelocity: 0,
	yVelocity: 0,
	//Color is black but of course that can be reset by the user.
	color: "#000",

	//How to draw the ball, it's just a rectangle of set height and width
	draw: function(){
		canvas.fillStyle = ball.color;
		canvas.fillRect(ball.x, ball.y, ball.width, ball.height);
	},

	/* Update the ball's information
	 * Also handles the keyboard even of pressing the space bar to serve
	 * Only works if the ball is out of course
	 */
	update: function(){
		ball.x += ball.xVelocity;
		ball.y += ball.yVelocity;
		if(ball.isOut && keydown.space){
			ball.x = Math.floor((Math.random()*(CANVAS_WIDTH/3))+CANVAS_WIDTH/3);
			ball.y = Math.floor((Math.random()*(CANVAS_HEIGHT/3))+CANVAS_HEIGHT/3);
			ball.xVelocity = Math.floor(((Math.random() < 0.5 ? -1 : 1)*2)+1);
			ball.yVelocity = Math.floor(((Math.random() < 0.5 ? -1 : 1)*2)+1);
			ball.isOut = false;
		}
	},

	// Keep checking if a point needs to be given to a player.
	awardPoint: function(){
		if(ball.x<=0){
			ball.isOut=true;
			computer.score += 1;
		}
		if(ball.x>=CANVAS_WIDTH){
			ball.isOut=true;
			player.score += 1;
		}
	}
};

/* A constructor for walls
 * All it nees to do is be still and defelct the ball.
 * Need a top and bottom wall which we create right underneath this
 * We don't provide the position or size variables, those are expected
 * to be provided when the function is called.
 */
function wall(I){
	//default color, user can change this
	I.color = "#000";
	//Only have to draw it in one place ever
	I.draw = function(){
		canvas.fillStyle = I.color;
		/* Here we are relying that x, y, width, and height
		 * were provided when the constructor was called 
		 */
		canvas.fillRect(I.x, I.y, I.width, I.height);
	};
	//All we do here is reflect the ball
	I.update = function(){
		//this will deal with ball collision.
		if(collides(I, ball)){
			ball.yVelocity = -ball.yVelocity;
			//We are going to hack how we determine which wall is which
			if(I.y == CANVAS_HEIGHT-6){
				collisionRecords.push({frame:$( "#timeSlider" ).slider( "value" ), object:"bottomWall"});
			}
			
			if(ball.y > I.y){
				collisionRecords.push({frame:$( "#timeSlider" ).slider( "value" ), object:"topWall"});
			}
			
		}
	}
	return I;

}

//Note here we pass in a var with an x, y, width and height
//The constructor needs these and does not initialize them itself.
var topWall = wall({x:0,y:0,width:CANVAS_WIDTH, height:6});
var bottomWall = wall({x:0,y:CANVAS_HEIGHT-6,width:CANVAS_WIDTH, height:6});

//Get a snapshot of locational data at this moment
function timeShot(I){
	var I = {};
	I.ballX = ball.x;
	I.ballY = ball.y;
	I.ballXVel = ball.xVelocity;
	I.ballYVel = ball.yVelocity;
	I.computerY = computer.y;
	I.ballIsOut = ball.isOut;
	I.computerScore = computer.score;
	I.playerScore = player.score;
	return I;
}

/*draw out trails that trace all the stored
 *positional data currently available
 */
function drawTrails(){
	for(pos in positionalData){
		canvas.fillStyle = "#FF0000";
		canvas.fillRect(positionalData[pos].ballX+ball.width/2, positionalData[pos].ballY+ball.height/2, 2, 2);
		canvas.fillRect(computer.x+computer.width/2, positionalData[pos].computerY+computer.height/2, 2, 2);
	}
}

//draw the scores of the players
function drawScores(){
	//Draw the players score
	canvas.font = "bold 32px monospace";
	canvas.fillText(player.score,(CANVAS_WIDTH/2)-50,CANVAS_HEIGHT-20);
	canvas.fillText(computer.score,(CANVAS_WIDTH/2)+50, CANVAS_HEIGHT-20);
}


//This is user interactivity stuff that relies on HTML stuff being there.
//This .js needs to be embedded in the pong.html file

//This slider is for the speed of the computer paddle
$(function() {
	$( "#slider" ).slider({
		value:5,
		min:1,
		max:10,
		step:1,
		slide: function( event, ui ) {
			$( "#amount" ).val( ui.value );
			COMPUTERSPEED = ui.value;
			computer.updateVars();
			if(gamePaused){
				positionalData.splice( $("#timeSlider").slider("value"), positionalData.length);
			}
		}
	});
	$( "#amount" ).val( $( "#slider" ).slider( "value" ) );
});

//This slider is for the frequency in which the computer skips moving on a frame
$(function() {
	$( "#slider2" ).slider({
		value:8,
		min:1,
		max:25,
		step:1,
		slide: function( event, ui ) {
			$( "#amount2" ).val( ui.value );
			SKIPFREQUENCY = ui.value;
			computer.updateVars();
			if(gamePaused){
				positionalData.splice( $("#timeSlider").slider("value"), positionalData.length);
			}
		}
	});
	$( "#amount2" ).val( $( "#slider2" ).slider( "value" ) );
});

/* This slider is for changing the influence the position of
 * ball on the paddle has on the deflection angle
 */
$(function() {
	$( "#infSlider" ).slider({
		value:1,
		min:1,
		max:10,
		step:0.1,
		slide: function( event, ui ) {
			$( "#infAmount" ).val( ui.value );
			DIRECTIONALINFLUENCE = ui.value;
			if(gamePaused){
				positionalData.splice( $("#timeSlider").slider("value"), positionalData.length);
			}
		}
	});
	$( "#infAmount" ).val( $( "#infSlider" ).slider( "value" ) );
});

//This slider is for the user to be able to scrub through time
$(function() {
	var lastval;
	var newval;
	$( "#timeSlider" ).slider({
		value:0,
		min:0,
		max:SNAPSHOTS,
		//step:1,
		slide: function( event, ui ) {
			currentSlide = $("#timeSlider").slider('value');
			nextSlide = ui.value
			$( "#timeAmount" ).val( ui.value );
			assertTime(nextSlide-currentSlide,ui.value);
		}
	});
	$( "#timeAmount" ).val( $( "#timeSlider" ).slider( "value" ) );
});


//This is how I do the time warp again
function assertTime(change,value){
	//Game must be paused
	if(gamePaused){
		//The slider must have been moved forward and there is no previously computed positional data
		if((change>0) && (positionalData[value - ($( "#timeSlider" ).slider('option','min'))] === undefined)){
			//We must do this in a loop to make sure we capture every update on every frame
			while(positionalData.length<(value - $( "#timeSlider" ).slider('option','min'))){
				//Record all the positional data at this point before advancing
				positionalData.push(timeShot());
				/* For every frame we have not experienced yet, 
				 * update all the state that does not have a state saved.
				 */ 
				ball.update();
				computer.update();
				player.ballCollision();
				computer.ballCollision();
				topWall.update();
				bottomWall.update();
			}
		}
		else{
			// If we already have a state saved, load it up
			ball.x = positionalData[value].ballX;
			ball.y = positionalData[value].ballY;
			ball.isOut = positionalData[value].ballIsOut;
			ball.xVelocity = positionalData[value].ballXVel;
			ball.yVelocity = positionalData[value].ballYVel;
			computer.y = positionalData[value].computerY;
			player.score = positionalData[value].playerScore;
			computer.score = positionalData[value].computerScore;
		}
	}
}


function oFFTHERAILS(){
	canvas.font = "bold 48px monospace";
	canvas.fillStyle = "#000";
  	canvas.fillText("OFF THE RAILS", 300, 300);
}

//This update checks for the statuses on the checkboxes
//THe checkboxes in the HTML allow the user to manipulate more boolean mechanics.
function updateCheckboxes(){
	if($("#lat").is(':checked')){
		LATERALMOVEMENT = true;
	}
	else{
		LATERALMOVEMENT = false;
		player.x = 40;
	}
	if($("#proj").is(':checked')){
		PROJECTION = true;
	}
	else{
		PROJECTION = false;
	}


}

//When this is called, the color of all the diaplyed objects changes to newcolor
function changeColor(newcolor){
	temp = newcolor;
	player.color = temp;
	computer.color = temp;
	ball.color = temp;
	topWall.color = temp;
	bottomWall.color = temp;
}

function updateTimeForward(){
	positionalData.push(timeShot());
	$( "#timeSlider" ).slider('option','max', $( "#timeSlider" ).slider('option','max')+1);
	$( "#timeSlider" ).slider('value',$( "#timeSlider" ).slider('value')+1);
	$( "#timeAmount" ).val( $( "#timeSlider" ).slider( "value" ) );
}

/* This is the keypress callback
 * Note this is not all the keyboard input handling
 * This is for things where key "holds" are not appropriate
 * like switching between pausing and not pausing and we just need
 * to detect a single press and release.
 */
window.addEventListener('keypress', function (e) {
	//the keycode for p is 122 for keypress
	if(e.charCode == 112){
		//We must purge all data of the future
		//It is no longer reliable, the future may be different now
		if(gamePaused){
			positionalData = positionalData.slice(0,$( "#timeSlider" ).slider('value'));
			$( "#timeSlider" ).slider('option','max', $( "#timeSlider" ).slider('value')+400);
			for( col in collisionRecords){
				if(collisionRecords[col].frame > $( "#timeSlider" ).slider('value')){
					collisionRecords.splice(col,1);
				}
			}
		}
		gamePaused = !gamePaused;

	}
	if(e.charCode == 99){
		colorIndex++;
		if(colorIndex >= COLOR.length) colorIndex = 0;
		changeColor(COLOR[colorIndex]);
	}
}, false);