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



//Global variables

var instrument, sustain, follow, hit, songList, len, prettyZone, width, height, controlZone, pianoZone, q=0;

var timer = null;
var ftimer = null;
var ftimer2 = null;
var fallTimer = null;
var gblTimer = null;

//var Array;
var rArray;

var gObj= {
	rgb: 0xF8FFBB
};

var hNote = null;
var pos =0;
var aPos;

printNote = function(){ //used in bugtesting to print note outputs,
						// can also be very useful for future "record" features
	var index;
	for (index =0; index< rArray.length; index++){
		//PS.debug( "\""+ rArray[index]+ "\", " );
	}
	//PS.debug( "\n" );
};

//used to record all played notes
//possible use for record feature
recordNotes = function(note){
	rArray[rArray.length] = note;
	printNote();
	//aPos++;
};

removePretty=function(x, y, color){//remove colored bead from visualization area
	PS.color(x,y,color)
};

placeRanPretty= function(){ //place random colored bead in visualization area
	var x, y, r, g, b, prettyObj;

	x = PS.random(32) - 1; //random x value between 0 and 31
	y = PS.random(11) - 1 + 21; // random y value between 20 and 31
	r = PS.random(56) - 1 + 200; // red value 200-255
	g = PS.random(56) - 1 + 200; // green value 200-255
	b = PS.random(56) - 1 + 200; // blue value 200-255
	PS.color(x, y, r, g, b); // sets color of bead
	PS.data(x,y, "pretty")
	//fallHand(x,y,r,g,b);
	prettyObj ={
		w:x,
		h:y,
		red: r,
		green: g,
		blue: b
	};
	return prettyObj;
};

placePretty = function(x,y, color){ //basically just places bead, used in visualization area
	PS.color(x,y, color);
}

makePretty = function(){ //places several beads in visualization area
	var i, y, fallTime, rObj;
	for (i=0; i<20; i++) {
		//PS.debug( "Make bead \n" );
		rObj = placeRanPretty();
	}
};

//called on timer to make beads in visualization area fall at constant rate
gblTick = function(){
	var i, j, color, white;
	white =0xFFFFFF;
	//PS.debug( "data ticking \n" );
	for(j=height-1; j>=prettyZone; j--){
		for(i=0; i<width; i++){
			color = PS.color(i,j);
			//PS.debug( "data is color " + color +" \n" );
			if(PS.data(i,j)=="pretty"){
				//PS.debug( "data is pretty \n" );
				//if(j!=height-1) {
					removePretty(i, j, white);
				//}
				//PS.debug( "made black at " + i + " " + j+ " \n" );
				PS.data(i,j,null);

				if(j<height-1){
					//PS.debug( "made new color at " + i + " " + j+ " \n" );
					placePretty(i,j+1,color);
					PS.data(i,j+1,"pretty")
				}
			}
		}
	}
};

drawBlack = function(){		//redraw all black notes to make normal key coloring easier

	for (i = 0; i <= 9; i++) {

		PS.glyph(3, 9, "s")
		PS.glyph(7, 9, "d")
		PS.glyph(15, 9, "g")
		PS.glyph(19, 9, "h")
		PS.glyph(23, 9, "j")

		PS.glyphColor(3, 9, PS.COLOR_WHITE)
		PS.glyphColor(7, 9, PS.COLOR_WHITE)
		PS.glyphColor(15, 9, PS.COLOR_WHITE)
		PS.glyphColor(19, 9, PS.COLOR_WHITE)
		PS.glyphColor(23, 9, PS.COLOR_WHITE)

		PS.color(3, i, 0x000000)
		PS.border(3, i, 0);
		PS.color(4, i, 0x000000)
		PS.border(4, i, 0);
		PS.color(7, i, 0x000000)
		PS.border(7, i, 0);
		PS.color(8, i, 0x000000)
		PS.border(8, i, 0);
		PS.color(15, i, 0x000000)
		PS.border(15, i, 0);
		PS.color(16, i, 0x000000)
		PS.border(16, i, 0);
		PS.color(19, i, 0x000000)
		PS.border(19, i, 0);
		PS.color(20, i, 0x000000)
		PS.border(20, i, 0);
		PS.color(23, i, 0x000000)
		PS.border(23, i, 0);
		PS.color(24, i, 0x000000)
		PS.border(24, i, 0);
	}

};
noteHand = function(x,y,data){
	playNote(data)
}

playNote = function(note){ //called when key is pressed, plays note and handles coloration

	makePretty();
	recordNotes(note);

	if (instrument == 1){
		if (sustain ==1) {
			PS.audioPlay("l_piano_" + note)
		}
		else
		PS.audioPlay("piano_" + note)
	}

	if (instrument == 2){
		if (sustain ==1) {
			PS.audioPlay("l_hchord_" + note)
		}
		else
		PS.audioPlay("hchord_" + note)
	}

	if (instrument == 3){

		if (note == "c4"){
			PS.audioPlay("xylo_c5");
		}

		if (note == "db4"){
			PS.audioPlay("xylo_db5");
		}

		if (note == "d4"){
			PS.audioPlay("xylo_d5");
		}

		if (note == "eb4"){
			PS.audioPlay("xylo_eb5");
		}

		if (note == "e4"){
			PS.audioPlay("xylo_e5");
		}

		if (note == "f4"){
			PS.audioPlay("xylo_f5");
		}

		if (note == "gb4"){
			PS.audioPlay("xylo_gb5");
		}

		if (note == "g4"){
			PS.audioPlay("xylo_g5");
		}

		if (note == "ab4"){
			PS.audioPlay("xylo_ab5");
		}

		if (note == "a4"){
			PS.audioPlay("xylo_a5");
		}

		if (note == "bb4"){
			PS.audioPlay("xylo_bb5");
		}

		if (note == "b4"){
			PS.audioPlay("xylo_b5");
		}

		if (note == "c5"){
			PS.audioPlay("xylo_c6");
		}
	}






}; //plays a note

noteColor = function(color, note){ //colors note based on actions

	//PS.debug( "noteColor() @ " + note +"\n" );

	for (j=0; j <= 15; j++){

		if (note == "c4") {
			//PS.debug( "noteColor() @ " + note +"\n" );
			for (i = 0; i <= 3; i++) {
				PS.color(i, j, color)
			}
			drawBlack()
		}
		if (note == "d4") {
			//PS.debug( "noteColor() @ " + note +"\n" );

			for (i = 4; i <= 7; i++) {
				PS.color(i, j, color)
			}
			drawBlack()
		}
		if (note == "e4") {
			//PS.debug( "noteColor() @ " + note +"\n" );

			for (i = 8; i <= 11; i++) {
				PS.color(i, j, color)
			}
			drawBlack()
		}
		if (note == "f4") {
			//PS.debug( "noteColor() @ " + note +"\n" );

			for (i = 12; i <= 15; i++) {
				PS.color(i, j, color)
			}
			drawBlack()
		}
		if (note == "g4") {
			//PS.debug( "noteColor() @ " + note +"\n" );

			for (i = 16; i <= 19; i++) {
				PS.color(i, j, color)
			}
			drawBlack()
		}
		if (note == "a4") {
			//PS.debug( "noteColor() @ " + note +"\n" );

			for (i = 20; i <= 23; i++) {
				PS.color(i, j, color)
			}
			drawBlack()
		}
		if (note == "b4") {
			//PS.debug( "noteColor() @ " + note +"\n" );

			for (i = 24; i <= 27; i++) {
				PS.color(i, j, color)
			}
			drawBlack()
		}
		if (note == "c5") {
			//PS.debug( "noteColor() @ " + note +"\n" );

			for (i = 28; i <= 31; i++) {
				PS.color(i, j, color)
			}
			drawBlack()
		}
	}


	for (j=0; j <= 9; j++){

		if (note == "db4") {
			//PS.debug( "noteColor() @ " + note +"\n" );

			for (i = 3; i <= 4; i++) {
				PS.color(i, j, color)
			}
		}

		if (note == "eb4") {
			//PS.debug( "noteColor() @ " + note +"\n" );

			for (i = 7; i <= 8; i++) {
				PS.color(i, j, color)
			}
		}


		if (note == "gb4") {
			//PS.debug( "noteColor() @ " + note +"\n" );

			for (i = 15; i <= 16; i++) {
				PS.color(i, j, color)
			}
		}

		if (note == "ab4") {
			//PS.debug( "noteColor() @ " + note +"\n" );

			for (i = 19; i <= 20; i++) {
				PS.color(i, j, color)
			}
		}

		if (note == "bb4") {
			//PS.debug( "noteColor() @ " + note +"\n" );

			for (i = 23; i <= 24; i++) {
				PS.color(i, j, color)
			}
		}
	}



};

drawControls = function(bNum){ //draws control area

	for (j=16; j<=20; j++){
		for (i=10;i<width;i++){
			PS.color(i,j, 0x000000)
		}
	}

	/*for(i=16; i<=20; i++){ //black zone
		PS.color(PS.ALL, i, 0x000000);
		//PS.fade(PS.ALL, i, 60);
	}
*/

	if(bNum==1){
		for(i=0;i<=4;i++){
			for (j=16; j<=20;j++){
				//PS.fade(i,j,60,gObj)
				//PS.debug( " num is 1, q is " + q + " \n" );
				PS.color(i, j, 0x000000)
				//q++;
			}
		}
	}

	if(bNum==2){
		for(i=5;i<=9;i++){
			for (j=16; j<=20;j++){
				//PS.fade(i,j,60,gObj)
				//PS.debug( " num is 1, q is " + q + " \n" );
				PS.color(i, j, 0x000000)
				//q++;

			}
		}
	}


	//PS.debug( " num is 4, \n" );
	if (sustain == 1) {
		//PS.debug( " num is 4, sus is 1 \n" );
		//sustain = 1;

		for (i = 10; i <= 21; i++) {
			for (j = 16; j <= 20; j++) {
				PS.color(i, j, 0xF8FFBB)
			}
		}
	}else{
		//PS.debug( " num is 4, sus is other \n" );
		//sustain = 0;

		for (i = 10; i <= 21; i++) {
			for (j = 16; j <= 20; j++) {
				PS.color(i, j, 0x000000)
			}
		}
	}


	if (timer) {
		//PS.debug( " num is 4, sus is zero \n" );
		//sustain = 1;
		for (i = 22; i <= 26; i++) {
			for (j = 16; j <= 20; j++) {
				PS.color(i, j, 0xF8FFBB)
			}
		}
	}

	if(follow){
		for (i = 27; i <= 31; i++) {
			for (j = 16; j <= 20; j++) {
				PS.color(i, j, 0xF8FFBB)
			}
		}
	}


	PS.glyph(2,18, 0x1403);
	//PS.glyphScale(1, 18, 100);
	for (i =1; i<=3; i++){
		for (j=17; j<=19; j++){
			PS.color(i, j, 0xC5FFBB);
			PS.exec(i,j, upHand);
		}
	}


	PS.glyph(7,18, 0x1401)
	for (i =6; i<=8; i++){
		for (j=17; j<=19; j++){
			PS.color(i, j, 0xFFCDBB);
			PS.exec(i,j, downHand);
		}
	}

	//PS.glyph(17,18, 0x20E3)
	for (i =11; i<=20; i++){
		for (j=17; j<=19; j++){
			PS.color(i, j, 0xBBFFF7);
			PS.exec(i,j, susHand);
		}
	}

	PS.glyph(24,18, 0x029D7)
	for (i =23; i<=25; i++){
		for (j=17; j<=19; j++){
			PS.color(i, j, 0xBBDDFF);
			PS.exec (i,j, metHand);
		}
	}

	PS.glyph(29,18, 0x266C)
	for (i =28; i<=30; i++){
		for (j=17; j<=19; j++){
			PS.color(i, j, 0xBDBBFF);
			PS.exec (i,j, followHand);
		}
	}
};

tick = function(){ //tick metronome
	PS.audioPlay("fx_tick")
};

metro = function(){ //handles metronome
	if (timer){
		PS.timerStop(timer);
		timer = null;
	}else{
		timer = PS.timerStart(45, tick)
	}
	drawControls()
};

metHand = function(x,y,data){
	metro();
};

susHand = function(x,y, data){ //handles sustain
		if (sustain ==0)
			sustain =1;
		else
			sustain =0;
		drawControls()
};

followMe = function(){ //handels follow me function
	//follow =1;
	//var done =0;
	//PS.debug( " follow me func \n" );
	len = songList.length;
	if (pos < len){
		if (pos) {
			PS.timerStop(ftimer);
			PS.timerStop(ftimer2);
		}

		//PS.debug( " pos is " + pos + "\n" );

		hNote = songList[pos]
		noteColor(0xFFBBBB, hNote)

		ftimer = PS.timerStart(30, noteColor, PS.COLOR_WHITE, hNote)
		//PS.debug( " follow me func TIMER 1 FIN \n");

		ftimer2 = PS.timerStart(20, noteColor, 0xFFBBBB, hNote)
		//PS.debug( " follow me func TIMER 2 FIN \n");
		pos++;

	}
	else{
		PS.timerStop(ftimer);
		PS.timerStop(ftimer2);
		follow =0;
		pos =0;
		drawControls()
	}

}; //controls follow me function

followHand = function(x,y, data){

	//PS.debug( " follow handler click \n" );
	//PS.debug( " follow var is " + follow + "\n" );


	if (follow ==0) {
		follow = 1;
	//	PS.debug(" follow var is " + follow + "\n");
		drawControls()
		followMe();
	}
	else
	drawControls();

};

upHand = function(x,y, data){ //changes instrument up

	if (instrument == 3)
		instrument =1;
	else
		instrument++;

	drawControls(1);

};

downHand = function(x,y, data){ //changes instrument down

	if (instrument ==1)
		instrument =3;
	else
		instrument--;

	drawControls(2)
};

PS.init = function( system, options ) {
	"use strict";
	var i, j, b, l;
	PS.audioLoad ("fx_tick");
	follow =0;
	hit =0;
	gblTimer =PS.timerStart(5, gblTick);
	height = 32;
	width =32;
	pianoZone =0;
	prettyZone = 21;
	controlZone = 16;

	PS.keyRepeat(false);

	//song for follow me
	//Marry had a little lamb
	songList = ["e4", "d4", "c4", "d4", "e4", "e4", "e4", "d4",
		"d4", "d4", "e4", "g4", "g4", "e4", "d4", "c4", "d4",
		"e4", "e4", "e4", "e4", "d4", "d4", "e4", "d4", "c4",];

	aPos =0;

	rArray = [];


	// Use PS.gridSize( x, y ) to set the grid to
	// the initial dimensions you want (32 x 32 maximum)
	// Do this FIRST to avoid problems!
	// Otherwise you will get the default 8x8 grid

	PS.gridSize(32, 32);
	PS.gridShadow(true, PS.DEFAULT)

	instrument =1; //make piano
	sustain =0;



	PS.gridColor(0x000000);

	PS.statusColor(0xFFFFFF);
	PS.statusText("Click any piano key to begin!");


	//define uneven borders
	b = {
		top : PS.CURRENT,
		left : PS.CURRENT,
		bottom : 1,
		right : PS.CURRENT
	};

	l = {
		top : PS.CURRENT,
		left : 1,
		bottom : PS.CURRENT,
		right : PS.CURRENT
	};



	PS.border(PS.ALL, PS.ALL, 0); //start with no borders
	PS.borderColor(PS.ALL,PS.ALL, PS.COLOR_BLUE);


	PS.border(PS.ALL, 15, b); //border between keyboard
	PS.borderColor(PS.ALL, 15, 0x000000);

	PS.glyph(0,15, "z")
	PS.glyph(4,15, "x")
	PS.glyph(8,15, "c")
	PS.glyph(12,15, "v")
	PS.glyph(16,15, "b")
	PS.glyph(20,15, "n")
	PS.glyph(24,15, "m")
	PS.glyph(28,15, ",")


for(i=0; i<=15; i++) { //borders between notes
	PS.border(0, i, l);
	PS.borderColor(0, i, 0x000000);

	PS.border(4, i, l);
	PS.borderColor(4, i, 0x000000);

	PS.border(8, i, l);
	PS.borderColor(8, i, 0x000000);

	PS.border(12, i, l);
	PS.borderColor(12, i, 0x000000);

	PS.border(16, i, l);
	PS.borderColor(16, i, 0x000000);

	PS.border(20, i, l);
	PS.borderColor(20, i, 0x000000);

	PS.border(24, i, l);
	PS.borderColor(24, i, 0x000000);

	PS.border(28, i, l);
	PS.borderColor(28, i, 0x000000);

}

	drawBlack();


	//PS.color(0, PS.ALL, PS.COLOR_RED);
	//PS.color(23, PS.ALL, PS.COLOR_RED);

	for (j=16; j<=20; j++){
		for (i=0;i<width;i++){
			PS.color(i,j, 0x000000)
			if (i<10){
				PS.fade(i,j, 15, gObj)
			}
			else{
				PS.fade(i,j, 15)
			}
		}
	}

	for (j=0;j<controlZone;j++){
		PS.fade(PS.ALL, j, 5)
	}

	for (j=prettyZone;j<height;j++){
		//PS.fade(PS.ALL, j, 30)
	}

	drawControls();

	for (j=0; j <= 15; j++){

		for (i=0; i<=3; i++){
			PS.data(i,j,"c4")
			PS.exec(i,j, noteHand)
		}
		for (i=4; i<=7; i++){
			PS.data(i,j,"d4")
			PS.exec(i,j, noteHand)
		}
		for (i=8; i<=11; i++){
			PS.data(i,j,"e4")
			PS.exec(i,j, noteHand)
		}
		for (i=12; i<=15; i++){
			PS.data(i,j,"f4")
			PS.exec(i,j, noteHand)
		}
		for (i=16; i<=19; i++){
			PS.data(i,j,"g4")
			PS.exec(i,j, noteHand)
		}
		for (i=20; i<=23; i++){
			PS.data(i,j,"a4")
			PS.exec(i,j, noteHand)
		}
		for (i=24; i<=27; i++){
			PS.data(i,j,"b4")
			PS.exec(i,j, noteHand)
		}
		for (i=28; i<=31; i++){
			PS.data(i,j,"c5")
			PS.exec(i,j, noteHand)
		}
	}

	for (j=0; j <= 9; j++){

		for (i=3; i<=4; i++){
			PS.data(i,j,"db4")
			PS.exec(i,j, noteHand)
		}

		for (i=7; i<=8; i++){
			PS.data(i,j,"eb4")
			PS.exec(i,j, noteHand)
		}

		for (i=15; i<=16; i++){
			PS.data(i,j,"gb4")
			PS.exec(i,j, noteHand)
		}

		for (i=19; i<=20; i++){
			PS.data(i,j,"ab4")
			PS.exec(i,j, noteHand)
		}

		for (i=23; i<=24; i++){
			PS.data(i,j,"bb4")
			PS.exec(i,j, noteHand)
		}
	}
	// Add any other initialization code you need here

	//PS.border(PS.ALL, PS.ALL, 1)
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

	if (follow && (data == hNote)){
		followMe();
	}
	noteColor(PS.COLOR_GRAY, data) //depressed note color
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

	noteColor(PS.COLOR_WHITE, data); //restore previous state
	drawBlack();
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
	 //PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead


	noteColor(0xFFEDBB, data);

	//mostly to provide instructions in status bar

	if(y<controlZone){
		PS.statusText("You can also use your keyboard keys to play!");

	}else if (y < prettyZone - 1 && y >= controlZone + 1) {

			if (x < 4 && x > 0) {
				PS.statusText("Cycle instrument up");
			}else if (x < 9 && x >= 6) {
				PS.statusText("Cycle instrument down");
			}else if (x < 21 && x >= 11) {
				PS.statusText("Toggle sustain pedal");
			} else if (x < 26 && x >= 23) {
				PS.statusText("Toggle metronome");
			}else if (x<width-1 && x >=28){
				PS.statusText("Activate Follow Me! mode");
			}else{
				PS.statusText("");
			}
			//PS.statusText("CONTROL ZONE");
	}else{
		PS.statusText("");
	}



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
	 //PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead

	noteColor(PS.COLOR_WHITE, data);
	drawBlack();

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

	//many keyboard keys can be used to activate functions
	//mostly used for debuggig, but can be used by user if they stumble upon it.
	if (key == 49){
		instrument =1;
		drawControls()
	}

	if (key == 50){
		instrument =2;
		drawControls()
	}

	if (key == 51){
		instrument =3;
		drawControls()
	}

	if (key == 52){

		if (sustain ==0)
			sustain =1;
		else
			sustain =0;
		drawControls()
	}

	if (key == 53){
		metro();
	}

	if (key == 54){

		//PS.debug( " follow handler key \n" );
		if (follow ==0) {
			follow = 1;
			//PS.debug(" follow var is " + follow + "\n");
			drawControls()
			followMe();
		}
		else
			drawControls();
	}

	if (key == 122){
		playNote("c4")
		noteColor(PS.COLOR_GRAY, "c4")
	}

	if (key == 120){
		playNote("d4")
		noteColor(PS.COLOR_GRAY, "d4")
	}

	if (key == 99){
		playNote("e4")
		noteColor(PS.COLOR_GRAY, "e4")
	}

	if (key == 118){
		playNote("f4")
		noteColor(PS.COLOR_GRAY, "f4")
	}

	if (key == 98){
		playNote("g4")
		noteColor(PS.COLOR_GRAY, "g4")
	}

	if (key == 110){
		playNote("a4")
		noteColor(PS.COLOR_GRAY, "a4")
	}

	if (key == 109){
		playNote("b4")
		noteColor(PS.COLOR_GRAY, "b4")
	}

	if (key == 44){
		playNote("c5")
		noteColor(PS.COLOR_GRAY, "c5")
	}

	if (key == 115){
		playNote("db4")
		noteColor(PS.COLOR_GRAY, "db4")
	}

	if (key == 100){
		playNote("eb4")
		noteColor(PS.COLOR_GRAY, "eb4")
	}

	if (key == 103){
		playNote("gb4")
		noteColor(PS.COLOR_GRAY, "gb4")
	}

	if (key == 104){
		playNote("ab4")
		noteColor(PS.COLOR_GRAY, "ab4")
	}

	if (key == 106){
		playNote("bb4")
		noteColor(PS.COLOR_GRAY, "bb4")
	}




	// Uncomment the following line to inspect parameters
		//PS.debug( "DOWN: key = " + key + ", shift = " + shift + "\n" );

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

	//noteColor(PS.COLOR_WHITE, data);
	//drawBlack();

	if (key == 122){

		noteColor(PS.COLOR_WHITE, "c4");
		drawBlack();
	}

	if (key == 120){
		noteColor(PS.COLOR_WHITE, "d4")
		drawBlack();
	}

	if (key == 99){
		noteColor(PS.COLOR_WHITE, "e4")
		drawBlack();
	}

	if (key == 118){
		noteColor(PS.COLOR_WHITE, "f4")
		drawBlack();
	}

	if (key == 98){
		noteColor(PS.COLOR_WHITE, "g4")
		drawBlack();
	}

	if (key == 110){
		noteColor(PS.COLOR_WHITE, "a4")
		drawBlack();
	}

	if (key == 109){
		noteColor(PS.COLOR_WHITE, "b4")
		drawBlack();
	}

	if (key == 44){
		noteColor(PS.COLOR_WHITE, "c5")
		drawBlack();
	}

	if (key == 115){
		noteColor(PS.COLOR_WHITE, "db4")
		drawBlack();
	}

	if (key == 100){
		noteColor(PS.COLOR_WHITE, "eb4")
		drawBlack();
	}

	if (key == 103){
		noteColor(PS.COLOR_WHITE, "gb4")
		drawBlack();
	}

	if (key == 104){
		noteColor(PS.COLOR_WHITE, "ab4")
		drawBlack();
	}

	if (key == 106){
		noteColor(PS.COLOR_WHITE, "bb4")
		drawBlack();
	}

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

