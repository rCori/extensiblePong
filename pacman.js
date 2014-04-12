/* An adaptation of the extensible pong mechanics idea but with
 * Pac-Man. The idea heere is to be able to manipulate and
 * visualize ideas the behavior of the ghost's AI.
 */


//Much of the code here inspirded from a tutorial by Daniel X. Moore
//http://www.html5rocks.com/en/tutorials/canvas/notearsgame/
var CANVAS_WIDTH = 400;
var CANVAS_HEIGHT = 600;

//This code puts the canvas we want in the browser
var canvasElement = jQuery("<canvas width='" + CANVAS_WIDTH +
                      "'height='" + CANVAS_HEIGHT + "'style='border:1px solid #000000'></canvas>");
var canvas = canvasElement.get(0).getContext("2d");
var myCanv = canvasElement.get(0);
canvasElement.appendTo('body');

//Lets call this a debug map
myMapData = [['o','o','o'],['M','=','3'],['2','3','6']];
var myTileset = tileset(myMapData);
myTileset.renderMap(canvas);