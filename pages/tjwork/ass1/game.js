
//RELEASED TO THE PUBLIC DOMAIN

//Thomas Meehan (tmeehan)

//Team PixeLoco



/*
This is essentially a super basic version of duck hunt. Aside from
obvious things like colors and sounds I added a function that places a
"duck" on the grid after removing the old one upon a successful hit
as well as on startup. I also changed the touch function to check to
see if the hit was successful and take the appropriate action such as
playing sounds and calling for a new duck. Upon 10 successful hits,
victory music plays and a encouraging message appears.

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
var duckGreen = 0x095C04; //the perfect shade of green befitting a mallard (or something)
var oldw, oldh; // values to track the duck's previous position, used for cleanup
var count =0; // count of successful hits


newBird = function(first){ //function for placing duck on random bead and cleaning old position

	var w, h;

	if(first ==0){ // check if initial call, not actually necessary in current build, but useful for future
	PS.color(oldw, oldh, 0xffffff )

}



	w = PS.random( 10 ) -1 ; // random width 1-32
	h = PS.random( 10 ) -1; // random height

	PS.color (w, h, duckGreen);
	//PS.radius(w,h, 50);

	oldh =h; //save old positions
	oldw =w;




};

PS.init = function( system, options ) {
	"use strict";

	// Use PS.gridSize( x, y ) to set the grid to
	// the initial dimensions you want (32 x 32 maximum)
	// Do this FIRST to avoid problems!
	// Otherwise you will get the default 8x8 grid

	PS.gridSize( 10, 10 );
	PS.gridColor( 0x00F7FF ); //  Aqua blue-ish? I don't know, I'm a programmer. It looks pretty

	PS.statusColor( PS.COLOR_BLACK );
	PS.statusText( "Shoot 10 ducks!" ); //give player blood-thirsty objective

	//PS.audioLoad( "fx_click", { lock: true } ); // load a bunch of sounds
	//PS.audioLoad( "fx_blast1", { lock: true } );
	PS.audioLoad( "fx_squawk", { lock: true } );
	PS.audioLoad( "fx_bloink", { lock: true } );
	PS.audioLoad( "fx_tada", { lock: true } );



newBird(1); //place first bird



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
	//var next;
	var curColor; //hold current color

	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Change color of touched bed
	// The default [data] is 0, which equals PS.COLOR_BLACK

	curColor = PS.color (x, y, PS.CURRENT); //get current color



	if ( curColor == duckGreen ) { //if you miraculously managed to hit the stationary target
		//PS.audioPlay("fx_blast1");
		PS.audioPlay("fx_squawk");
		//PS.color( x, y, 0xffffff);
		count +=1; //increase count
		if (count ==10){ // check if this is the 10th hit, if so play ironically happy music
			PS.color(x,y, 0xffffff);
			PS.audioPlay("fx_tada");
			PS.statusText( "CONGRATULATIONS, A WINNER IS YOU!!!" );
			PS.color(PS.ALL, PS.ALL, PS.COLOR_YELLOW);
		}else {
			newBird(0); //otherwise just get new bird
		}
	} else if(curColor == 0xffffff) { //user managed to miss...never trust the user...
		//PS.audioPlay("fx_blast1");
		PS.audioPlay("fx_bloink");
		//PS.color( x, y, 0xffffff);
		newBird(0);
	}


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
	//	PS.debug( "DOWN: key = " + key + ", shift = " + shift + "\n" );

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

