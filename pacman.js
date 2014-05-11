/* An adaptation of the extensible pong mechanics idea but with
 * Pac-Man. The idea heere is to be able to manipulate and
 * visualize ideas the behavior of the ghost's AI.
 */


//Much of the code here inspirded from a tutorial by Daniel X. Moore
//http://www.html5rocks.com/en/tutorials/canvas/notearsgame/
var CANVAS_WIDTH = 448;
var CANVAS_HEIGHT = 576;

//This code puts the canvas we want in the browser

var canvasElement = jQuery("<canvas width='" + CANVAS_WIDTH +
                      "'height='" + CANVAS_HEIGHT + "'style='border:1px solid #000000'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");
var myCanv = canvasElement.get(0);
canvasElement.appendTo('body');

var FPS = 30;


var DEBUG = false;
//Lets call this a debug map
/*Original pacman has a tileset of 28x36 so thats what we
 *will be going for here. Of course we will need to draw over
 *some of this as well.
 *If the game is 448x576 each tile is (448/28)x(576x36) or 16x16.
 * Eventually each tile will be a 16x16 pixel image
 */
//myMapData = [['=','I','I'],['=','o','='],['o','O','o'],['I','6','I']];
/* Now we are going to try a real Pacman map tile set
 * minus icons and ghost pen door
 * this is according to the pacman dossier
 */
var myMapData = /* 1 */[['M','M','M','7','4','4','4','4','4','4','4','4','1','M','M','M','8','e','2','M','M','M','7','4','4','4','4','1','7','4','4','4','4','1','M','M'],
				/* 2 */ ['M','M','M','8','o','o','O','o','o','o','o','o','2','M','M','M','8','e','2','M','M','M','8','o','o','o','O','=','=','o','o','o','o','2','M','M'],
				/* 3 */ ['M','M','M','8','o','7','I','1','o','7','1','o','2','M','M','M','8','e','2','M','M','M','8','o','7','1','o','9','3','o','7','1','o','2','M','M'],
				/* 4 */ ['M','M','M','8','o','=','M','=','o','=','=','o','2','M','M','M','8','e','2','M','M','M','8','o','=','=','o','o','o','o','=','=','o','2','M','M'],
				/* 5 */ ['M','M','M','8','o','=','M','=','o','=','=','o','2','M','M','M','8','e','2','M','M','M','8','o','=','9','I','I','1','o','=','=','o','2','M','M'],
				/* 6 */ ['M','M','M','8','o','9','6','3','o','9','3','o','9','6','6','6','3','e','9','6','6','6','3','o','9','I','I','I','3','o','=','=','o','2','M','M'],
				/* 7 */ ['M','M','M','8','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','=','=','o','2','M','M'],
				/* 8 */ ['M','M','M','8','o','7','I','1','o','7','I','I','I','I','I','I','1','e','7','I','I','I','1','o','7','1','o','7','I','I','3','=','o','2','M','M'],
				/* 9 */ ['M','M','M','8','o','=','M','=','o','9','I','I','1','7','I','I','3','e','9','I','I','I','3','o','=','=','o','9','I','I','1','=','o','2','M','M'],
				/*10 */ ['M','M','M','8','o','=','M','=','o','o','o','o','=','=','e','e','e','e','e','e','e','e','e','o','=','=','o','o','o','o','=','=','o','2','M','M'],
				/*11 */ ['M','M','M','8','o','=','M','=','o','7','1','o','=','=','e','7','6','6','6','1','e','7','1','o','=','=','o','7','1','o','=','=','o','2','M','M'],
				/*12 */ ['M','M','M','8','o','9','I','3','o','=','=','o','9','3','e','2','M','M','M','8','e','=','=','o','9','3','o','=','=','o','9','3','o','2','M','M'],
				/*13 */ ['M','M','M','8','o','o','o','o','o','=','=','o','e','e','e','2','M','M','M','8','e','=','=','o','o','o','o','=','=','o','o','o','o','2','M','M'],
				/*14 */ ['M','M','M','9','I','I','I','1','o','=','9','I','I','1','e','=','M','M','M','8','e','=','9','I','I','1','e','=','9','I','I','1','o','2','M','M'],
				/*15 */ ['M','M','M','7','I','I','I','3','o','=','7','I','I','3','e','=','M','M','M','8','e','=','7','I','I','3','e','=','7','I','I','3','o','2','M','M'],
				/*16 */ ['M','M','M','8','o','o','o','o','o','=','=','o','e','e','e','2','M','M','M','8','e','=','=','o','o','o','o','=','=','o','o','o','o','2','M','M'],
				/*17 */ ['M','M','M','8','o','7','I','1','o','=','=','o','7','1','e','2','M','M','M','8','e','=','=','o','7','1','o','=','=','o','7','1','o','2','M','M'],
				/*18 */ ['M','M','M','8','o','=','M','=','o','9','3','o','=','=','e','9','4','4','4','3','e','9','3','o','=','=','o','9','3','o','=','=','o','2','M','M'],
				/*19 */ ['M','M','M','8','o','=','M','=','o','o','o','o','=','=','e','e','e','e','e','e','e','e','e','o','=','=','o','o','o','o','=','=','o','2','M','M'],
				/*20 */ ['M','M','M','8','o','=','M','=','o','7','I','I','3','9','I','I','1','e','7','I','I','I','1','o','=','=','o','7','I','I','3','=','o','2','M','M'],
				/*21 */ ['M','M','M','8','o','9','I','3','o','9','I','I','I','I','I','I','3','e','9','I','I','I','3','o','9','3','o','9','I','I','1','=','o','2','M','M'],
				/*22 */ ['M','M','M','8','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','o','=','=','o','2','M','M'],
				/*23 */ ['M','M','M','8','o','7','4','1','o','7','1','o','7','4','4','4','1','e','7','4','4','4','1','o','7','I','I','I','1','o','=','=','o','2','M','M'],
				/*24 */ ['M','M','M','8','o','=','M','=','o','=','=','o','2','M','M','M','8','e','2','M','M','M','8','o','=','7','I','I','3','o','=','=','o','2','M','M'],
				/*25 */ ['M','M','M','8','o','=','M','=','o','=','=','o','2','M','M','M','8','e','2','M','M','M','8','o','=','=','o','o','o','o','=','=','o','2','M','M'],
				/*26 */ ['M','M','M','8','o','9','I','3','o','9','3','o','2','M','M','M','8','e','2','M','M','M','8','o','9','3','o','7','1','o','9','3','o','2','M','M'],
				/*27 */ ['M','M','M','8','o','o','O','o','o','o','o','o','2','M','M','M','8','e','2','M','M','M','8','o','o','o','O','=','=','o','o','o','o','2','M','M'],
				/*28 */ ['M','M','M','9','6','6','6','6','6','6','6','6','3','M','M','M','8','e','2','M','M','M','9','6','6','6','6','3','9','6','6','6','6','3','M','M']]
var myTileset = tileset(myMapData,CANVAS_WIDTH, CANVAS_HEIGHT,'spritesheet.png',canvas);
setInterval(function(){
	draw();
	update();
}, 1000/FPS);

//Function for update game logic and drawing
function update(){
	//update here
	pacman.update();
	blinky.update();
	pinky.update();
	inky.update();
	clyde.update();
	debug(DEBUG);
};

function draw(){
	myTileset.renderMap(canvas);
	pacman.draw();
	blinky.draw();
	pinky.draw();
	inky.draw();
	clyde.draw();
	blinky.visualize("#FF0000");
	pinky.visualize("#FF66CC");
	inky.visualize("#00FFFF");
	clyde.visualize();
}


//Create the player object
var pacman = player();

//Create the ghost objects
var blinky = ghost(7*16,5*16,"blinky.png", true);
var pinky = ghost(20*16,5*16,"pinky.png", true);
var inky = ghost(7*16,32*16,"inky.png", true);
var clyde = ghost(20*16,32*16,"clyde.png",true);


//Blinky literally just follows pacman directly
//His target tile is always just the target tile of pacman
blinky.findTarget = function(){
	blinky.target = {x:pacman.xTile,y:pacman.yTile};
	if(pacman.energizer>0){
		blinky.target = {x:0,y:2};
	}
}

//Pinky chases 4 ahead of PacMan
//There is a noted bug which I am including here
pinky.findTarget = function(){

	if(pacman.movement == 1){
		pinky.target = {x:pacman.xTile-4,y:pacman.yTile};
	}
	else if(pacman.movement == 2){
		pinky.target = {x:pacman.xTile+4,y:pacman.yTile};
	}
	//Here I am implementing the bug
	else if(pacman.movement == 3){
		pinky.target = {x:pacman.xTile-4, y:pacman.yTile-4};
	}
	else if(pacman.movement == 4){
		pinky.target = {x:pacman.xTile, y:pacman.yTile + 4};
	}

	if(pacman.energizer>0){
		pinky.target={x:33,y:2};
	}
}


/* Inky needs blinky's target tile and current location to find his
 * own. Inky takes blinky's target, which is pacman, and adds 2 tiles
 * in the direction pacman is facing. Then he takes that tile and gets
 * difference between it and blinky's current location call it x. That difference
 * is doubled to 2x. Inky's target tile is at the end of a line segment 2x
 * long with one end at blinky's current location and midpoint being that
 * 2 offset tile. The offset tile location has a bug much like pinky where
 * When pacman is pointing up, the offset is 2 up AND 2 LEFT of blinky's
 * target(pacman's location).
 * 
 */

inky.findTarget = function(){
	var offset = {};
	if(pacman.movement == 1){
		offset.x = blinky.target.x - 2;
		offset.y = blinky.target.y;
	}
	else if(pacman.movement == 2){
		offset.x = blinky.target.x + 2;
		offset.y = blinky.target.y;
	}
	else if(pacman.movement == 3){
		offset.x = blinky.target.x - 2;
		offset.y = blinky.target.y - 2;
	}
	else if(pacman.movement == 4){
		offset.x = blinky.target.x;
		offset.y = blinky.target.y + 2;
	}
	//If pacman isn't moving make it chase
	else{
		inky.target = {x:28, y:34};
		return;
	}
	//make offset in terms of pixel not tile
	//get the pixel in the center of the offset tile
	offset.x = (offset.x*16)+8;
	offset.y = (offset.y*16)+8;

	//Find distance between offset tile and blinky's location
	//Not absolute because we are going to double this and
	//find it i relation to blinky IE this might be below and
	//to the left, so we retain the sign
	var dist = {};
	dist.x = 2*(offset.x-blinky.x);
	dist.y = 2*(offset.y-blinky.y);
	var targetTile = myTileset.findTile(blinky.x+dist.x,blinky.y+dist.y);
	inky.target = {x:targetTile.xTile,y:targetTile.yTile};
	if(pacman.energizer>0){
		inky.target = {x:28, y:34};
	}

}

clyde.findTarget = function(){
	//find the euclidian distance between clyde's tile
	//and pacman's tile
	//Get the pixel locations of these tiles
	var clydeTile = myTileset.findLoc(clyde.xTile,clyde.yTile);
	var pacTile = myTileset.findLoc(pacman.xTile,pacman.yTile);
	var distance = Math.sqrt(((clydeTile.xLoc-pacTile.xLoc)*(clydeTile.xLoc-pacTile.xLoc))+((clydeTile.yLoc-pacTile.yLoc)*(clydeTile.yLoc-pacTile.yLoc)));
	if(distance > 8*myTileset.tileWidth){
		clyde.target = {x:pacman.xTile,y:pacman.yTile};
	}
	else{
		clyde.target = {x:0,y:34};
	}
	if(pacman.energizer>0){
		clyde.target = {x:0,y:34};
	}
}

//Right now this just draws a circle around pacman
//Very cheap effect for right, can look better in the future
clyde.visualize = function(){
	canvas.strokeStyle = "#FF6600";
	canvas.fillStyle = "#FF6600";
	canvas.beginPath();
	canvas.arc(pacman.xLoc,pacman.yLoc,16*8,0,2*Math.PI);
	canvas.stroke();

	var extraRightCost = 0;
	var extraDownCost = 0;

	if(clyde.movement == 1) {extraRightCost = -1;}
	if(clyde.movement == 2) {extraRightCost = 1;}
	if(clyde.movement == 3) {extraDownCost = -1;}
	if(clyde.movement == 4) {extraDownCost = 1;}

	//If we calculated a right path
	if(clyde.right != 9999){
		canvas.beginPath();
		canvas.moveTo((clyde.xTile+extraRightCost+1)*16+8,(clyde.yTile+extraDownCost)*16+8);
		canvas.lineTo(clyde.target.x*16+8, clyde.target.y*16+8);
		canvas.stroke();
		canvas.fillRect((clyde.xTile+extraRightCost+1)*16,(clyde.yTile+extraDownCost)*16,16,16);
	}
	//If we calculated a left path
	if(clyde.left != 9999){
		canvas.beginPath();
		canvas.moveTo((clyde.xTile+extraRightCost-1)*16+8,(clyde.yTile+extraDownCost)*16+8);
		canvas.lineTo(clyde.target.x*16+8, clyde.target.y*16+8);
		canvas.stroke();
		canvas.fillRect((clyde.xTile+extraRightCost-1)*16,(clyde.yTile+extraDownCost)*16,16,16);

	}
	//If we calculated an up path
	if(clyde.up != 9999){
		canvas.beginPath();
		canvas.moveTo((clyde.xTile+extraRightCost)*16+8,(clyde.yTile+extraDownCost-1)*16+8);
		canvas.lineTo(clyde.target.x*16+8, clyde.target.y*16+8);
		canvas.stroke();
		canvas.fillRect((clyde.xTile+extraRightCost)*16,(clyde.yTile+extraDownCost-1)*16,16,16);
	}
	//If we calculated a down path
	if(clyde.down != 9999){
		canvas.beginPath();
		canvas.moveTo((clyde.xTile+extraRightCost)*16+8,(clyde.yTile+extraDownCost+1)*16+8);
		canvas.lineTo(clyde.target.x*16+8, clyde.target.y*16+8);
		canvas.stroke();
		canvas.fillRect((clyde.xTile+extraRightCost)*16,(clyde.yTile+extraDownCost+1)*16,16,16);

	}
}

function debug(ISDEBUG){
	if(ISDEBUG){
		canvas.fillStyle = "#FFF";
		canvas.fillText("pacman movement = "+pacman.movement,0,10);
		canvas.fillText("pacman nextDirection = "+pacman.nextDirection,0,20);
		canvas.fillText("pacman pos: x = "+ pacman.xLoc + " y = " + pacman.yLoc,0,30);
		canvas.fillText("pacman left = "+pacman.left,0,40);
		canvas.fillText("pacman right = "+pacman.right,0,50);
		canvas.fillText("pacman up = "+pacman.up,0,60);
		canvas.fillText("pacman down = "+pacman.down,0,70);
		canvas.fillText("pacman energizer = "+pacman.energizer,0,80);
		canvas.fillText("blinky movement = "+blinky.movement,200,10);
		canvas.fillText("blinky nextDirection = "+blinky.nextDirection,200,20);
		canvas.fillText("blinky pos: x = "+ blinky.x + " y = " + blinky.y,200,30);
		canvas.fillText("blinky pos: xTile = "+ blinky.xTile + " yTile = " + blinky.yTile,200,40);
		canvas.fillText("blinky up = "+blinky.up,200,50);
		canvas.fillText("blinky down = "+blinky.down,200,60);
		canvas.fillText("blinky left = "+blinky.left,200,70);
		canvas.fillText("blinky right = "+blinky.right,200,80);
		canvas.fillText("inky target.x = "+inky.target.x,200,90);
		canvas.fillText("inky target.y = "+inky.target.y,200,100);
	}
}

/* This is the snapTime callback I need for
 * getting a bundle object of important data
 */
function saveData(){
	var data = {
		pacX: pacman.xLoc,
		pacY: pacman.yLoc,
		blinkyX: blinky.x,
		blinkyY: blinky.y,
		inkyX: inky.x,
		inkyY: inky.y,
		pinkyX: pinky.x,
		pinkyY: pinky.y,
		clydeX: clyde.x,
		clydeY: clyde.y
	}
	return data;
}

/* This is the loadTime callback I need
 * for loading a bundle of properly formatted
 * data
 */
function loadData(data){
	pacman.xLoc = data.pacX;
	pacman.yLoc = data.pacY;
	blinky.x = data.blinkyX;
	blinky.y = data.blinkyY;
	inky.x = data.inkyX;
	inky.y = data.inkyY;
	pinky.x = data.pinkyX;
	pinky.y = data.pinkyY;
	clyde.x = data.clydeX;
	clyde.y = data.clydeY;
}


//This slider is for the user to be able to scrub through time
$(function() {
	var lastval;
	var newval;
	$( "#timeSlider" ).slider({
		value:0,
		min:0,
		max:200,
		//step:1,
		slide: function( event, ui ) {
			$( "#timeAmount" ).val( ui.value );
			loadTime(ui.value,loadData)
		}
	});
	$( "#timeAmount" ).val( $( "#timeSlider" ).slider( "value" ) );
});
