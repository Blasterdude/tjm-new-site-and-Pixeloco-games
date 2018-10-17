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
var width, height, skipped, active, alive, coolDown, shotNum, curShot, curFire, score, inum, sup,
	superCount, level, tut, gbl, card, dMove, skipped,

	shotTimer,
	endTimer,
	cardTimer,
	tuTimer,
	globalTimer;

superCheck = function(){ //grants powerup every 5 kills
	superCount +=1;
	if (superCount ==10){
		superCount =0;
		PS.audioPlay("fx_powerup1")
		sup =1;
	}
}

moveShot = function(row){ //takes care of moving bullet and clearing enemies in its path

		//PS.debug( "continuing, curshot is " + curShot + "\n" );

		curShot = 1;

		//PS.debug( "continuing, curshot is " + curShot + "\n" );


		if (row == 4) {
			curShot = 1;

			var temp;

			temp = PS.color(shotNum, 4);
			PS.color(shotNum, 4, active);
			if (temp == active) {
				PS.color(shotNum, 4, 0xb3914e)
				PS.color(shotNum, 5, 0xb3914e)
				score +=100;
				superCheck();
			} else
				PS.color(shotNum, 4, temp);

			temp = PS.color(shotNum, 9);
			PS.color(shotNum, 9, active);
			if (temp == active) {
				PS.color(shotNum, 9, 0xb3914e)
				PS.color(shotNum, 10, 0xb3914e)
				score +=100;
				superCheck();
			} else
				PS.color(shotNum, 9, temp);


			temp = PS.color(shotNum, 14);
			PS.color(shotNum, 14, active);
			if (temp == active) {
				PS.color(shotNum, 14, 0xb3914e)
				PS.color(shotNum, 15, 0xb3914e)
				score +=100;
				superCheck();
			} else
				PS.color(shotNum, 14, temp);


			if (shotNum == 0) {
				shotNum = width - 9
				if(shotTimer != null){
					PS.timerStop(shotTimer)
				}
				//move()
				curShot = 0;
				curFire =0
				//sup =0;

				return
			} else {
				shotNum--;
			}
		}

		if (row == 1) {

			var temp;

			temp = PS.color(shotNum, 4);
			PS.color(shotNum, 4, active);
			if (temp == active) {
				PS.color(shotNum, 4, 0xb3914e)
				PS.color(shotNum, 5, 0xb3914e)
				score +=100;
				superCheck();

			} else
				PS.color(shotNum, 4, temp);

			if (shotNum == 0) {
				shotNum = width - 9
				PS.timerStop(shotTimer)
				//move()
				curShot = 0;
				curFire =0
				inum++;

				return
			} else {
				shotNum--;
			}
		}


		if (row == 2) {

			var temp;
			temp = PS.color(shotNum, 9);
			PS.color(shotNum, 9, active);
			if (temp == active) {
				PS.color(shotNum, 9, 0xb3914e)
				PS.color(shotNum, 10, 0xb3914e)
				score +=100;
				superCheck();

			} else
				PS.color(shotNum, 9, temp);

			if (shotNum == 0) {
				shotNum = width - 9
				PS.timerStop(shotTimer)
				//move()
				curShot = 0;
				curFire =0
				inum++;

				return
			} else {
				shotNum--;
			}
		}

		if (row == 3) {

			temp = PS.color(shotNum, 14);
			PS.color(shotNum, 14, active);
			if (temp == active) {
				PS.color(shotNum, 14, 0xb3914e)
				PS.color(shotNum, 15, 0xb3914e)
				score +=100;
				superCheck();

			} else
				PS.color(shotNum, 14, temp);

			if (shotNum == 0) {
				shotNum = width - 9
				PS.timerStop(shotTimer)
				//move()
				curShot = 0;
				curFire =0
				inum++;

				return
			} else {
				shotNum--;
			}
		}
		//curShot = 0;
};

showCard = function(){ //shows pre and post level info
		tuTimer = PS.timerStart(60, tutorial);
		globalTimer = PS.timerStart(15, tick);
		PS.timerStop(cardTimer);
};

restart = function(x,y,data){ //restart level, also used for progressing through levels
	PS.gridSize( width, height );

	PS.exec(PS.ALL, PS.ALL, PS.DEFAULT);

	alive =1;
	if(tuTimer) {
		PS.timerStop(tuTimer);
	}
	if(globalTimer) {
		PS.timerStop(globalTimer)
	}

	PS.statusText("Level " + level + "\n")

	cardTimer = PS.timerStart(60, showCard)

	curShot =0;
	curFire=0;
	score =0;
	inum =0;
	//active = 0x000000;

	shotNum = width-9
	//PS.gridSize( width, height );

	PS.color(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT)
	PS.border(PS.ALL, PS.ALL, 0)
	PS.gridShadow(true)

	//globalTimer = PS.timerStart(15, tick);
	active = PS.COLOR_WHITE;
	drawPath(4);
	drawPath(9);
	drawPath(14)
	if (level >2){
		sup =1;
	}
	drawField();
	if (level >3){
		move();
		tut =0;
	}
	superCount =0;
};

dead = function(){ //called when the player dies, offers chance to restart

	//PS.debug( "YOU ARE DEAD\n" );

	alive =0;

	PS.statusText("YOU LOSE, tap to restart")

	//PS.timerStop(globalTimer);

	tuTimer = PS.timerStart(60, tutorial);

	PS.border(PS.ALL,PS.ALL, 0)

	PS.exec(PS.ALL,PS.ALL, restart)

	PS.color(PS.ALL, PS.ALL, PS.COLOR_WHITE)
}

move = function(){ //controls enemies advancing
var i, temp;
	for (i=width-9;i>=0;i--){
		temp = PS.color(i,4)
		if (i == width-9 && temp != 0xb3914e){
			//PS.debug( "killing color color is " + temp + "\n" );
			dead();
			return;
		}
		if (temp !=0xb3914e){
			PS.color(i+1,4, temp)
			PS.color(i+1,5, temp)
			PS.color(i+2,4, temp)
			PS.color(i+2,5, temp)

			if (i >=0) {
				PS.color(i, 4, 0xb3914e)
				PS.color(i, 5, 0xb3914e)
			}
			i--;
			if (i >=0) {
				PS.color(i, 4, 0xb3914e)
				PS.color(i, 5, 0xb3914e)
			}
		}
	}
	for (i=width-9;i>=0;i--){
		temp = PS.color(i,9)
		if (i == width-9 && temp != 0xb3914e){
			//PS.debug( "killing color color is " + temp + "\n" );
			dead();
			return;
		}
		if (temp !=0xb3914e){
			PS.color(i+1,9, temp)
			PS.color(i+1,10, temp)
			PS.color(i+2,9, temp)
			PS.color(i+2,10, temp)
			if (i >=0) {
				PS.color(i, 9, 0xb3914e)
				PS.color(i, 10, 0xb3914e)
			}
			i--;
			if (i >=0) {
				PS.color(i, 9, 0xb3914e)
				PS.color(i, 10, 0xb3914e)
			}
		}
	}
	for (i=width-9;i>=0;i--){
		temp = PS.color(i,14)
		if (i == width-9 && temp != 0xb3914e){
			//PS.debug( "killing color color is " + temp + "\n" );
			dead();
			return;
		}
		if (temp !=0xb3914e){
			PS.color(i+1,14, temp)
			PS.color(i+1,15, temp)
			PS.color(i+2,14, temp)
			PS.color(i+2,15, temp)
			if (i >=0) {
				PS.color(i, 14, 0xb3914e)
				PS.color(i, 15, 0xb3914e)
			}
			i--;
			if (i >=0) {
				PS.color(i, 14, 0xb3914e)
				PS.color(i, 15, 0xb3914e)
			}
		}
	}
	drawField()
	ranSpawn()
};

drawPath = function(start){ //draws path for enemies to follow
	var i;
	for (i=0;i<width-8;i++){
		PS.color(i,start, 0xb3914e)
		PS.fade(i,start,5)

		PS.color(i,start+1, 0xb3914e)
		PS.fade(i,start+1,5)
	}
}

fire = function(x,y,data){ //fires all paths

	if (alive ==0) {
		return
	}else {
		if (curFire == 0 && sup == 1) {
			sup = 0;
			curFire = 1;
			PS.audioPlay("fx_powerup4")

			shotTimer = PS.timerStart(1, moveShot, 4);
		}
	}
};

fire1 = function(x,y,data){ //fires path 1
	if (alive ==0) {
		return
	}else {
		if (curFire == 0) {
			curFire = 1;

			PS.audioPlay("fx_shoot6")
			shotTimer = PS.timerStart(1, moveShot, 1);
		}
	}
}

fire2 = function(x,y,data){ //fires path 2
	if (alive ==0) {
		return
	}else {
		if (curFire == 0) {
			curFire = 1;
			PS.audioPlay("fx_shoot6")

			shotTimer = PS.timerStart(1, moveShot, 2);
		}
	}
}

fire3 = function(x,y,data){ //fires path 3
	if (alive ==0) {
		return
	}else {
		if (curFire == 0) {
			curFire = 1;
			PS.audioPlay("fx_shoot6")

			shotTimer = PS.timerStart(1, moveShot, 3);
		}
	}
}

spawn = function(track, color){ //spawns enemies
	if (track ==1){
		if (PS.color(0,4) != 0xb3914e){
			return;
		}
		PS.color(0,4, color)
		PS.color(1,4, color)
		PS.color(0,5, color)
		PS.color(1,5, color)
	}

	if (track ==2){
		if (PS.color(0,9) != 0xb3914e){
			return;
		}
		PS.color(0,9, color)
		PS.color(1,9, color)
		PS.color(0,10, color)
		PS.color(1,10, color)
	}

	if (track ==3){
		if (PS.color(0,14) != 0xb3914e){
			return;
		}
		PS.color(0,14, color)
		PS.color(1,14, color)
		PS.color(0,15, color)
		PS.color(1,15, color)
	}
}

ranSpawn = function(){ //controls randomness of spawning
	var i, ran, color,amount;

	if (level >3){
		amount = PS.random(3)-1
		if (score ==0)
			amount = PS.random(2)
	}else
	amount = 1;

	if (level >4){
		amount = PS.random(4)-1;
		if (score ==0)
			amount = PS.random(2)
	}

	for (i=0;i<amount; i++){

		if (level >= 6)
		ran = PS.random(12)
		if (level <= 5)
		ran = PS.random(9)
		if (level <= 3)
		ran = PS.random(3);

		if (ran ==1)
			color = PS.COLOR_BLUE

		if (ran ==2)
			color = PS.COLOR_RED

		if (ran ==3)
			color = PS.COLOR_YELLOW

		if (ran ==4)
			color = PS.COLOR_VIOLET

		if (ran ==5)
			color = PS.COLOR_ORANGE

		if (ran ==6)
			color = PS.COLOR_GREEN

		if (ran ==7)
			color = PS.COLOR_BLUE

		if (ran ==8)
			color = PS.COLOR_RED

		if (ran ==9)
			color = PS.COLOR_YELLOW

		if (ran ==10)
			color = PS.COLOR_VIOLET

		if (ran ==11)
			color = PS.COLOR_ORANGE

		if (ran ==12)
			color = PS.COLOR_GREEN

		spawn(PS.random(3),color)
	}
}

setActive = function(x,y, data){ //set active color for killing things
	var temp;

	if (alive ==0) {

		return

	}else {


		temp = active;

	if (PS.color(x, y) == PS.COLOR_WHITE) {
		active = PS.color(x, y);
		//PS.audioPlay("fx_bloop")


	} else {

		switch (active) {

			case PS.COLOR_WHITE:
			{
				active = PS.color(x, y);
				//PS.audioPlay("fx_bloop")

				break;
			}

			case PS.COLOR_BLUE:
			{
				if (PS.color(x, y) == PS.COLOR_RED) {
					active = PS.COLOR_VIOLET
				} else {
					if (PS.color(x, y) == PS.COLOR_YELLOW) {
						active = PS.COLOR_GREEN
					}
				}
				//PS.audioPlay("fx_bloop")

				break;
			}

			case PS.COLOR_RED:
			{
				if (PS.color(x, y) == PS.COLOR_BLUE) {
					active = PS.COLOR_VIOLET
				} else {
					if (PS.color(x, y) == PS.COLOR_YELLOW) {
						active = PS.COLOR_ORANGE
					}
				}
				//PS.audioPlay("fx_bloop")

				break;
			}

			case PS.COLOR_YELLOW:
			{
				if (PS.color(x, y) == PS.COLOR_RED) {
					active = PS.COLOR_ORANGE
				} else {
					if (PS.color(x, y) == PS.COLOR_BLUE) {
						active = PS.COLOR_GREEN
					}
				}
				//PS.audioPlay("fx_bloop")

				break;
			}

			default:
			{
				//PS.debug("Active color is " + active + "\n");
				//PS.audioPlay("fx_bloink")

			}

		}
	}

	//PS.debug( "Active color is " + active + "\n" );
		if (level >2){
			move();
		}
		if (temp == active)
			PS.audioPlay("fx_bloink")
		else
			PS.audioPlay("fx_bloop")


		drawField();

}

};

drawColor = function(start, color){ //draws color pallet blocks

	t = {
		top : 1,
		left : 0,
		bottom : 0,
		right : 0
	};
	tl = {
		top : 1,
		left : 1,
		bottom : 0,
		right : 0
	};
	tr = {
		top : 1,
		left : 0,
		bottom : 0,
		right : 1
	};
	l = {
		top : 0,
		left : 1,
		bottom : 0,
		right : 0
	};
	r = {
		top : 0,
		left : 0,
		bottom : 0,
		right : 1
	};
	b = {
		top : 0,
		left : 0,
		bottom : 1,
		right : 0
	};

	br = {
		top : 0,
		left : 0,
		bottom : 1,
		right : 1
	};
	bl = {
		top : 0,
		left : 1,
		bottom : 1,
		right : 0
	};

	var i,j;

	PS.color(width-3, start, color)
	PS.color(width-2, start, color)
	PS.color(width-1, start, color)

	PS.color(width-3, start+1, color)
	PS.color(width-2, start+1, color)
	PS.color(width-1, start+1, color)

	PS.color(width-3, start+2, color)
	PS.color(width-2, start+2, color)
	PS.color(width-1, start+2, color)

	PS.border(width-3, start, tl)
	PS.border(width-2, start, t)
	PS.border(width-1, start, tr)

	PS.border(width-3, start+1, l)
	PS.border(width-1, start+1, r)

	PS.border(width-3, start+2, bl)
	PS.border(width-2, start+2, b)
	PS.border(width-1, start+2, br)

	for(i=width-3;i<width;i++){
		for (j=start;j<start+3;j++){
			PS.exec(i,j,setActive)
		}
	}
}

drawCas = function(start){ //draw castle

	var i, beg, end, color, fNum;

	switch ( start ) {
		case 2:
		{
			fNum =fire1;
			break;
		}

		case 7:
		{
			fNum =fire2;
			break;
		}

		case 12:
		{
			fNum =fire3;
			break;
		}
	}

		color = active;

	beg = width -9;
	end = width-5;
	PS.color(beg,start, color);
	PS.exec(beg,start,fNum);

	PS.color(beg +2,start, color);
	PS.exec(beg+2,start,fNum);

	PS.color(end,start, color);
	PS.exec(end,start,fNum);

	for (i=beg; i<=end;i++){
		PS.color(i,start+1, color);
		PS.exec(i,start+1,fNum);
	}

	for (i=beg+1; i<=end-1;i++){
		PS.color(i,start+2, color);
		PS.exec(i, start+2, fNum)
		PS.color(i,start +3, color);
		PS.exec(i, start+3, fNum)
	}
};

drawField = function(){ //essentially refreshes image
	if (alive) {

		var i, j;

		drawCas(2);
		drawCas(7)
		drawCas(12)

		drawColor(1, PS.COLOR_BLUE)
		drawColor(4, PS.COLOR_RED)
		drawColor(7, PS.COLOR_YELLOW)
		drawColor(10, PS.COLOR_WHITE)


		for (i = width - 24; i < width-8; i++) {
			for (j = height - 3; j < height; j++) {
				if (sup) {
					PS.color(i, j, 0xab0000)
				}
				else{
					PS.color(i, j, 0x000000)
				}
				PS.exec(i, j, fire);
			}
		}
	}
};

levelEnd = function(){ //stops level when completed
	PS.timerStop(endTimer);
	restart(1,1,"stuff");
}

nextLevel = function(){ //begins next level
	level++;
	alive =0;
	if (skipped){
		skipped =0;
	}else
		PS.statusText("Level Complete")
	endTimer = PS.timerStart(60, levelEnd)
	//restart(1,1,"stuff")
}

youWin = function(){ //when you win

	alive =0;
	PS.statusText("CONGRATS, YOU WON!!!")

	PS.border(PS.ALL,PS.ALL, 0)
	PS.color(PS.ALL, PS.ALL, PS.COLOR_WHITE)

}

tick = function(){ //called on timer to constantly adjust things like the score

	if (alive == 0){
		return
	}else {


		for (i = width - 24; i < width-8; i++) {
			for (j = height - 3; j < height; j++) {
				if (sup) {
					PS.color(i, j, 0xab0000)
				}
				else{
					PS.color(i, j, 0x000000)
				}
				PS.exec(i, j, fire);
			}
		}

		if (tut == 0) {
			PS.statusText("Score: " + score + "\n")
		}


		if (inum == 3 && dMove ==0) {
			inum = 0;
			//sup =1;
			move()
		}

		if (level == 4) {
			if (score > 4000) {
				nextLevel()
			}
		}

		if (level == 5) {
			if (score > 6000) {
				nextLevel()
			}
		}

		if (level == 6) {
			if (score > 7500) {
				nextLevel()
			}
		}

		if (level == 7) {
			if (score > 10000) {
				youWin()
			}
		}
	}
};

tutorial = function(){ //handles tutorial prompts
	if (alive ==0){
		return
	}else {
		var color;
		if (level == 1) {

			if (score > 0) {
				nextLevel();
				return;
			}
			if (active != PS.COLOR_WHITE) {
				spawn(1, active)
				PS.statusText("Tap the castle to destroy the invader")
				return;
			}
			PS.statusText("Select any color on the right")
		} else {
			if (level == 2) {

				if (score > 0) {
					nextLevel();
					return;
				}

				if (gbl == 1 && active == PS.COLOR_WHITE) {
					spawn(3, PS.COLOR_GREEN)
					PS.statusText("Mix colors to defeat the invader")
					return;
				}


				if (active == PS.COLOR_GREEN || active == PS.COLOR_VIOLET || active == PS.COLOR_ORANGE) {
					PS.statusText("You can clean your pallet by tapping white")
					gbl = 1;
					return

				}

				PS.statusText("Mix colors by selecting two primary colors")
			}
		}
		if (level == 3) {
			if (score > 3000) {
				//PS.debug("limit acheived, next level\n")
				nextLevel();
				return;
			}

			if (sup == 0) {
				PS.statusText("Supers recharge every 1000 points after use")
				dMove =0;
				return;


			}

			if (active != PS.COLOR_WHITE) {
				PS.statusText("Tap the bottom button to use your super")
				spawn(1, active)
				spawn(2, active)
				spawn(3, active)

				gbl = 2;
				return;
			}

			if (gbl != 2)
				PS.statusText("Select another color")

		}
	}

};

startTut = function(x, y, data){ //if the player begins from tutorial

	skipped =0
	curShot =0;
	curFire=0;
	alive =1;
	tut =1;
	gbl =0;
	score =0;
	level =1;
	inum =0;
	dMove =1;
	//active = 0x000000;

	width = 32;

	height = 20;

	shotNum = width-9
	PS.gridSize( width, height );
	PS.color(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT)

	PS.border(PS.ALL, PS.ALL, 0)
	PS.gridShadow(true)

	globalTimer = PS.timerStart(15, tick);
	active = PS.COLOR_WHITE;
	drawPath(4);
	drawPath(9);
	drawPath(14)
	sup =0;
	drawField();
	//move();

	superCount =0;

	tuTimer = PS.timerStart(60, tutorial);
}

startGame = function(x, y, data){ //if the player wants to skip the tutorial

	skipped =1;
	curShot =0;
	curFire=0;
	alive =1;
	tut =1;
	gbl =0;
	score =0;
	level =1;
	inum =0;
	dMove =1;
	//active = 0x000000;

	width = 32;

	height = 20;

	shotNum = width-9
	PS.gridSize( width, height );
	PS.color(PS.ALL, PS.ALL, PS.COLOR_GRAY_LIGHT)

	PS.border(PS.ALL, PS.ALL, 0)
	PS.gridShadow(true)

	globalTimer = PS.timerStart(15, tick);
	active = PS.COLOR_WHITE;
	drawPath(4);
	drawPath(9);
	drawPath(14)
	sup =0;
	drawField();
	//move();

	superCount =0;

	tuTimer = PS.timerStart(60, tutorial);

	level =3;
	nextLevel();

};;

PS.init = function( system, options ) { //presents menu to choose tutorial or skip
	"use strict";

	// Use PS.gridSize( x, y ) to set the grid to
	// the initial dimensions you want (32 x 32 maximum)
	// Do this FIRST to avoid problems!
	// Otherwise you will get the default 8x8 grid

	PS.gridSize( 2, 1 );

	PS.color(0,0, PS.COLOR_YELLOW)
	PS.color(1,0, PS.COLOR_GREEN)

	PS.exec(0,0, startTut)
	PS.exec(1,0, startGame)

	PS.statusText("Press Yellow for the tutorial, or green to skip.")

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

PS.keyDown = function( key, shift, ctrl, options ) { //only used for debugging
	"use strict";

	// Uncomment the following line to inspect parameters
		//PS.debug( "DOWN: key = " + key + ", shift = " + shift + "\n" );

	/*if (key ==32){
		spawn(1, PS.COLOR_BLUE)
		spawn(2, PS.COLOR_RED)
		spawn(3, PS.COLOR_YELLOW)
	}
	if (key ==98){
		spawn(1, PS.COLOR_BLUE)
		spawn(2, PS.COLOR_BLUE)
		spawn(3, PS.COLOR_BLUE)
	}
	if (key ==121){
		spawn(1, PS.COLOR_YELLOW)
		spawn(2, PS.COLOR_YELLOW)
		spawn(3, PS.COLOR_YELLOW)
	}
	if (key ==114){
		spawn(1, PS.COLOR_RED)
		spawn(2, PS.COLOR_RED)
		spawn(3, PS.COLOR_RED)
	}*/

/*	if (key ==32) {
		nextLevel();
	}

	if (key ==57) {
		score = 7400;
	}*/


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

