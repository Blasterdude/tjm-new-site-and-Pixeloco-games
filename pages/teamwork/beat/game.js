/*
Released to the public domain

All music credited to their respective creators / copyright holders

Featuring:

"Courtesy", "Otis" and "Focus" by Chipzel"
"Fanfare" by Nobuo Uematsu
"Tron Legacy (End Titles)" by Daft Punk

 */


// game.js for Perlenspiel 3.1

/*
Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
Perlenspiel is Copyright © 2009-14 Worcester Polytechnic Institute.
This file is part of Perlenspiel.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with Perlenspiel. If not, see <http://www.gnu.org/licenses/>.
*/

// The following comment lines are for JSLint. Don't remove them!

/*jslint nomen: true, white: true */
/*global PS */

// This is a template for creating new Perlenspiel games

// All of the functions below MUST exist, or the engine will complain!

// PS.init( system, options )
// Initializes the game
// This function should normally begin with a call to PS.gridSize( x, y )
// where x and y are the desired initial dimensions of the grid
// [system] = an object containing engine and platform information; see documentation for details
// [options] = an object with optional parameters; see documentation for details


//global variables
var globalTimer, BPM, correct, mainChannel, num, height, width, curX, curY, gColor, px, py,
	live, goal, gx, gy, level, fail, song,

	//timers
	shadowFadeTimer = null,
	countDownTimer = null,
	acidTimer =null,
	lvlTimer = null;


isSurounded = function(x,y){ //checks if the player avatar is surrounded by target block
							//prevents infinite loops when searching for non target blocks
	var sur;

	sur =0;

	if (curX+1 < width){
		if(PS.color(curX+1, curY) == gColor){
			sur = 1;
			//PS.debug( "right color \n" );
		}else {
			sur = 0;
			//PS.debug( "NOT SURROUNDED \n" );
			return sur
		}
	}
	if (curY+1 < height){
		if(PS.color(curX, curY+1) == gColor){
			sur = 1;
			//PS.debug( "down color \n" );
		}else {
			sur = 0;
			//PS.debug( "NOT SURROUNDED \n" );
			return sur
		}
	}
	if (curX-1 >=0){
		if(PS.color(curX-1, curY) == gColor){
			sur = 1;
			//PS.debug( "left color \n" );
		}else {
			sur = 0;
			//PS.debug( "NOT SURROUNDED \n" );
			return sur
		}
	}
	if (curY-1 >= 0){
		if(PS.color(curX, curY-1) == gColor){
			//PS.debug( "up color \n" );
			sur = 1;
		}else {
			sur = 0;
			//PS.debug( "NOT SURROUNDED \n" );
			return sur
		}
	}

return sur
};

ranCord = function(){ //picks random space directly adjacent to player to place target block
	var x, y, obj;

	ran = PS.random(4) - 1;
	switch (ran) {

		case 0:
		{
			x = curX + 1;
			y = curY + 0;
			break;
		}

		case 1:
		{
			x = curX - 0;
			y = curY + 1;
			break;
		}
		case 2:
		{
			x = curX + 0;
			y = curY - 1;
			break;
		}

		case 3:
		{
			x = curX - 1;
			y = curY - 0;
			break;
		}
	}

	obj = {
		x: x,
		y: y
	};

	return obj;
};

ranCorrect = function(){ // places a random target block around player, uses lots of helper functions

	//PS.debug("begin\n");

	var x, y, ran, ret, sur, i, lookColor, sameColor;

	ret = ranCord();
	x =ret.x;
	y= ret.y;
	sur = isSurounded(x,y);
	sameColor =0;
	lookColor=0;

	i =0;

	if (( x >= 0 ) && ( x < width ) && ( y >= 0 ) && ( y < height )) {
		//PS.debug("valid cord " + x + " and " + y+ "\n");
		if (PS.color(x, y) == gColor) {
			//PS.debug("valid color is identical\n");
			sameColor =1;
		}
	}

	if ((sur ==0) && sameColor)
		lookColor =1;

	while( ( x < 0 ) || ( x >= width ) ||
	( y < 0 ) || ( y >= height ) || lookColor ) {

		//PS.debug( "loop " + i + "\n" );

		ret = ranCord();
		x =ret.x;
		y= ret.y;
		sur = isSurounded(x,y);
		sameColor =0;
		lookColor =0;

		//PS.debug("sur is " + sur + "\n");

		if (( x >= 0 ) && ( x < width ) && ( y >= 0 ) && ( y < height )) {
			//PS.debug("valid cord " + x + " and " + y+ "\n");
			if (PS.color(x, y) == gColor) {
				//PS.debug("valid color is identical\n");
				sameColor =1;
			}
		}

		if ((sur ==0) && sameColor)
			lookColor =1;

		i++;
	}

	PS.color(x,y, gColor);
	PS.radius(x,y,0);

};

drawField = function(){ //draws the field on each pulse
	var i, j, r, g,b;

	for (i=0; i<width; i++){
		for (j=0; j<height; j++){


			PS.color(i,j,randomColor());
			PS.radius(i,j,0);
			PS.border(i,j,randomBorder());
			PS.borderColor(i,j, 0x000000);
		}
	}

	gColor = randomColor();

	//PS.color(PS.ALL, PS.ALL, gColor)

	PS.gridColor(gColor);

	PS.color(px,py, gColor);
	PS.radius(px,py,0);
	ranCorrect();
	PS.color(gx,gy,goal);
	PS.border(gx,gy,0);
	PS.radius(gx,gy,0);
	PS.color(curX, curY, PS.COLOR_WHITE);
	PS.radius(curX,curY,50);
	PS.border(curX,curY, 10);

};

randomBorder = function(){ // randomly adjusts border width, creating cool art style with little to no actual effort

	var obj;
	obj = {
		top : PS.random( 11 ) ,
		left : PS.random( 11 ) ,
		bottom : PS.random( 11 ) ,
		right : PS.random( 11 )
	};

	return obj;
};

number = function(){ // helps with countdown

	PS.color(PS.ALL,PS.ALL, PS.COLOR_GRAY)
	PS.radius(PS.ALL,PS.ALL,0);
	num--;
	if (num ==0){
		PS.timerStop(countDownTimer);
		PS.statusText("GO");
		begin();
	}else {
		//PS.glyphColor(2, 2, 0xFFFFFF);
		PS.statusText(num);
	}

};

countDown = function(){ //starts countdown between levels

	num= 3;

	PS.color(PS.ALL,PS.ALL, PS.COLOR_GRAY)
	PS.radius(PS.ALL,PS.ALL,0);
	mainChannel = PS.audioPlay(song,{
		loop: true,
		path: 'audio/'
	});
	PS.statusText(num);
	countDownTimer = PS.timerStart((3600/BPM), number);

};

randomColor = function(){ // picks random color from pallet
	var obj, red, green, blue, ran;

	red = PS.random(56) - 1 + 100; // red value 200-255
	green = PS.random(56) - 1 + 100; // green value 200-255
	blue = PS.random(56) - 1 + 100; // blue value 200-255

	obj ={
		r: red,
		g: green,
		b: blue
	};


	if (level ==1 )
		ran = 1;

	if (level ==2 )
		ran = PS.random(2);

	if (level ==3 )
		ran = PS.random(3);

	if (level ==4 )
		ran = PS.random(4);

	if (level ==5 )
		ran = PS.random(5);

	switch (ran){
		case 1:{
			obj = PS.COLOR_BLUE
			break;
		}
		case 2:{
			obj = PS.COLOR_GREEN
			break;
		}
		case 3:{
			obj = PS.COLOR_RED
			break;
		}
		case 4:{
			obj = PS.COLOR_ORANGE
			break;
		}
		case 5:{
			obj = PS.COLOR_CYAN
			break;
		}
		case 6:{
			obj = PS.COLOR_MAGENTA
			break;
		}
		case 7:{
			obj = PS.COLOR_VIOLET
			break;
		}
		case 8:{
			obj = PS.COLOR_MAGENTA
			break;
		}
	}

	return obj;

};

youLose= function(){ // called when player does something stupid resulting in loss

	//PS.timerStop(shadowFadeTimer);
	PS.timerStop(globalTimer);
	live =0;
	//PS.debug( "YOU LOSE \n" );

	PS.audioStop(mainChannel);
	PS.audioPlay("fx_scratch"
	);

	PS.statusText("Press 'R' to retry level");
	fail =1;

};

dropAcid = function(){
	var i,j;

	PS.color(PS.ALL,PS.ALL,randomColor());

	PS.radius(PS.ALL,PS.ALL,0);

	for (i=0; i<width; i++){
		for (j=0; j<height; j++){
			PS.border(i,j,randomBorder());
		}
	}

};

youWin = function(){ // called when final level is complete
	//PS.timerStop(shadowFadeTimer);


	PS.timerStop(globalTimer);
	live =0;
	//PS.debug( "YOU WIN \n" );

	PS.audioStop(mainChannel);
	mainChannel = PS.audioPlay("bonus",{
		loop: true,
		path: 'audio/'
	});
	PS.statusText("A WINNER IS YOU!");

	acidTimer = PS.timerStart(3600/BPM, dropAcid)


};

lvlComplete = function(){ //called when level is completed
	PS.color(PS.ALL,PS.ALL, PS.COLOR_GRAY);
	PS.radius(PS.ALL,PS.ALL,0);

	//PS.debug( "Level " + level + " complete \n" );

	PS.timerStop(globalTimer);

	PS.audioStop(mainChannel);

	PS.statusText("Level " + level + " complete \n");

	PS.audioPlay("fanfare",{
		path: 'audio/'
	});
	live =0;
	level++;

	lvlTimer = PS.timerStart(240, nextLevel)

};

nextLevel = function(){ //loads next level

	PS.timerStop(lvlTimer);

	switch (level){
		case 2: {
			width =5;
			height =5;
			BPM = 51;
			song = "easy"
			break;
		}

		case 3: {
			width =6;
			height =6;
			BPM = 65;
			song = "courtesy"
			break;
		}

		case 4: {
			width =7;
			height =7;
			BPM = 67.5;
			song = "otis"
			break;
		}


		case 5:{
			width =8;
			height =8;
			BPM = 86;
			song = "focus"
			break;
		}
	}

	PS.gridSize(width, height );
	PS.gridShadow(true, 0x000000);
	PS.border(PS.ALL,PS.ALL, 0)
	PS.gridColor(0x000000);
	PS.statusColor(0xFFFFFF);
	countDown();

};

isCorrect = function(){ // only used for testing, sets to correct no matter what move is made
	if (true){
		correct =1;
	}
};

fadeShadow = function(){ //attempt to fade shadow indicating beat, doesn't really work too well.

		PS.gridShadow(true, PS.COLOR_BLACK);
	if (shadowFadeTimer != null) {
		PS.timerStop(shadowFadeTimer);
	}
};

flashToBeat = function(){ // called on every beat of song, checks for correct moves, pulses border, etc.

	if (correct ==0){
		youLose();
		//return;
	} else{
		correct =0;
		drawField();
		//PS.color
		PS.gridShadow(true, PS.COLOR_WHITE);
		shadowFadeTimer = PS.timerStart(5, fadeShadow);
	}

};

begin = function(){ //starts each level as soon as countdown ends
	//PS.gridColor(0x000000);
	gColor = randomColor();
	PS.gridColor(gColor);
	//PS.color(PS.ALL,PS.ALL,gColor );
	globalTimer = PS.timerStart((3600/BPM), flashToBeat);


	correct =0;
	live =1;

	PS.statusColor(0xFFFFFF);

	//globalTimer = PS.timerStart((3600/BPM), flashToBeat);

	curX = (width-1);
	curY = 0;
	px =curX;
	py = curY;
	gx = 0
	gy = height-1;

	if (level ==1){
		PS.statusText("Move with the beat to get to the goal!")
	}

	if (level ==2){
		PS.statusText("Move onto beads matching the background!")
	}

	drawField();
};

move = function(x,y){ //handles movement, detects correct and incorrect moves
	var nx, ny;

	if(correct ==1){
		return
	}

	nx = curX + x;
	ny = curY + y;


	if ( ( nx < 0 ) || ( nx >= width ) ||
		( ny < 0 ) || ( ny >= height ) ) {
		youLose()
		return;
	}

	if ( PS.color( nx, ny ) == goal){
		if (level <5){

			PS.color(PS.ALL,PS.ALL, PS.COLOR_GRAY)
			PS.radius(PS.ALL,PS.ALL,0);

			lvlComplete();
			return
		}else {
			youWin();
			return
		}
	}

	if ( PS.color( nx, ny ) != gColor && ( PS.color( nx, ny ) != PS.COLOR_GRAY ) && ( PS.color( nx, ny ) != goal)){
		youLose();
		return;
	}

	correct =1;

	PS.radius(px,py,0);

	px =curX;
	py =curY;

	PS.color( px, py, gColor );
	PS.radius(px,py,0);

	curX = nx;
	curY = ny;

	PS.color ( nx, ny, PS.COLOR_WHITE );
	PS.radius(nx,ny,50);
	PS.border(nx,ny,0);

};

PS.init = function( system, options ) { //initializes initial conditions
	"use strict";

	PS.audioLoad("fx_scratch");

	fail =0;

	// Use PS.gridSize( x, y ) to set the grid to
	// the initial dimensions you want (32 x 32 maximum)
	// Do this FIRST to avoid problems!
	// Otherwise you will get the default 8x8 grid

	shadowFadeTimer = null;
	countDownTimer = null;

	height =4;
	width =4;
	level =1;
	BPM = 51;
	song = "easy"
	goal = (PS.COLOR_YELLOW);

	PS.gridSize(width, height );
	PS.gridShadow(true, 0x000000);
	PS.border(PS.ALL,PS.ALL, 0);
	PS.gridColor(0x000000);
	PS.statusColor(0xFFFFFF);

	countDown();
	//PS.gridShadow(true, PS.COLOR_YELLOW)


	// Add any other initialization code you need here
};

// PS.touch ( x, y, data, options )
// Called when the mouse button is clicked on a bead, or when a bead is touched
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.touch = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches over a bead
};

// PS.release ( x, y, data, options )
// Called when the mouse button is released over a bead, or when a touch is lifted off a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.release = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead
};

// PS.enter ( x, y, button, data, options )
// Called when the mouse/touch enters a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.enter = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead
};

// PS.exit ( x, y, data, options )
// Called when the mouse cursor/touch exits a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.exit = function( x, y, data, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead
};

// PS.exitGrid ( options )
// Called when the mouse cursor/touch exits the grid perimeter
// It doesn't have to do anything
// [options] = an object with optional parameters; see documentation for details

PS.exitGrid = function( options ) {
	"use strict";

	// Uncomment the following line to verify operation
	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid
};

// PS.keyDown ( key, shift, ctrl, options )
// Called when a key on the keyboard is pressed
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the following constants:
// Arrow keys = PS.ARROW_UP, PS.ARROW_DOWN, PS.ARROW_LEFT, PS.ARROW_RIGHT
// Function keys = PS.F1 through PS.F1
// [shift] = true if shift key is held down, else false
// [ctrl] = true if control key is held down, else false
// [options] = an object with optional parameters; see documentation for details

PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
		//PS.debug( "DOWN: key = " + key + ", shift = " + shift + "\n" );

	if (live==1){ //can only move if field is "live"

		switch ( key ) {
			case PS.KEY_ARROW_UP:
			case 119: // lower-case w
			case 87: // upper-case W
			{
				move( 0, -1 );
				break;
			}
			case PS.KEY_ARROW_DOWN:
			case 115: // lower-case s
			case 83: // upper-case S
			{
				move( 0, 1 );
				break;
			}
			case PS.KEY_ARROW_LEFT:
			case 97: // lower-case a
			case 65: // upper-case A
			{
				move( -1, 0 );
				break;
			}
			case PS.KEY_ARROW_RIGHT:
			case 100: // lower-case d
			case 68: // upper-case D
			{
				move( 1, 0 );
				break;
			}
		}

		if (key == 32){ //"a" key
			fail =0;
			youWin();
		}
	}

	//restarts level if failed using r key
	if (fail ==1){
		if (key == 114){ //"R" key
			fail =0;
			countDown()
		}




	}

	// Add code here for when a key is pressed
};

// PS.keyUp ( key, shift, ctrl, options )
// Called when a key on the keyboard is released
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the following constants:
// Arrow keys = PS.ARROW_UP, PS.ARROW_DOWN, PS.ARROW_LEFT, PS.ARROW_RIGHT
// Function keys = PS.F1 through PS.F12
// [shift] = true if shift key is held down, false otherwise
// [ctrl] = true if control key is held down, false otherwise
// [options] = an object with optional parameters; see documentation for details

PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict";

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.keyUp(): key = " + key + ", shift = " + shift + ", ctrl = " + ctrl + "\n" );

	// Add code here for when a key is released
};

// PS.input ( sensors, options )
// Called when an input device event (other than mouse/touch/keyboard) is detected
// It doesn't have to do anything
// [sensors] = an object with sensor information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.input = function( sensors, options ) {
	"use strict";

	// Uncomment the following block to inspect parameters
	/*
	PS.debug( "PS.input() called\n" );
	var device = sensors.wheel; // check for scroll wheel
	if ( device )
	{
		PS.debug( "sensors.wheel = " + device + "\n" );
	}
	*/
	
	// Add code here for when an input event is detected
};

