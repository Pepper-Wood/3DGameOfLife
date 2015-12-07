// * SOME JS INITIALIZATION STUFF GOES HERE PROBABLY MAYBE? *

var grid = []; // Grid containing all the cubes
var gridWidth = 20;
var gridHeight = 20;
cubesAlive = 0;
gen = 0; // Current generation/iteration number
deathOver = 0; // Total deaths due to overpopulation
deathUnder = 0; // Total deaths due to underpopulation
deathToll = 0; // Total deaths overall
var cena_textures = ["textures/cena_textures/1.jpg","textures/cena_textures/2.jpg","textures/cena_textures/3.jpg","textures/cena_textures/4.jpg", "textures/cena_textures/5.jpg", "textures/cena_textures/6.jpg"];
var color_textures = ["textures/color_textures/1.jpg","textures/color_textures/2.jpg","textures/color_textures/3.jpg","textures/color_textures/4.jpg", "textures/color_textures/5.jpg", "textures/color_textures/6.jpg"];
//initialize audio
var conwayAudio = document.createElement('audio');
var conwaySource = document.createElement('source');
var cenaAudio = document.createElement('audio');
var cenaSource = document.createElement('source');
conwaySource.src = 'sounds/AND_HIS_NAME_IS_JOHN_CENA.wav';
cenaSource.src = 'sounds/AND_HIS_NAME_IS_JOHN_CENA.wav';
conwayAudio.appendChild(conwaySource);
cenaAudio.appendChild(cenaSource);  
//=============================================================================
function initialize_button() {
	var gridWidth = document.getElementById("gridWidth").value;
	var gridHeight = document.getElementById("gridHeight").value;
	
	// if bool is true, then random. If false, then all dead
	if (document.getElementById("game_name").value == 10) { // ALL DEAD
		initGrid(false);
	} else if (document.getElementById("game_name").value == 20) { // RANDOM
		initGrid(true);
	}
}

//=============================================================================
function change_state_button() {
	// individ_x and individ_y are the parameters needed
	switchCubeState(document.getElementById("individ_x").value, document.getElementById("individ_y").value);
}

//=============================================================================
function play_button() {
	//DO STUFF
}

//=============================================================================
function pause_button() {
	//DO STUFF
}

//=============================================================================
function cubeObj(textureInt, state, x_pos, y_pos) {
	geometry = new THREE.CubeGeometry( 200, 200, 200 );
	material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture(color_textures[textureInt-1]) } );

	this.textureInt_ = textureInt;
	this.state_ = state;

	this.mesh_ = new THREE.Mesh( geometry , material );
	this.mesh_.rotation.x = -100;
	this.mesh_.rotation.y = -100;
	this.mesh_.position = new THREE.Vector3(x_pos,y_pos);
}

//=============================================================================
// Initialize the grid; if type == true, cubes will have random states, else all will be dead
function initGrid(type) {
	// Initialize the tracked stats
	cubesAlive = 0;
	gen = 0;
	deathOver = 0;
	deathUnder = 0;
	deathToll = 0;

	// Initialize the grid
	grid = [];
	var newRow = [];
	var newCube;
	var textureNew;
	var state = false;
	var stateInt;

	for (var x = 0; x < gridWidth; ++x) {
		newRow = [];
		
		for (var y = 0; y < gridLength; ++y) {
			// Randomize state (if applicable)
			if (type) {
				stateInt = Math.floor(Math.random()*2);
				if (stateInt == 1) { 
					state = true; 
					cubesAlive += 1;
				}
				else { 
					state = false;
				}
			}
			// Randomize texture
			textureNew = Math.floor(Math.random()*6);			
			if (x == 0 && y == 0) { // upper left corner
				break;
			}
			else if (x > 0 && y == 0) { // first row
				while (grid[x - 1][y].textureInt == textureNew) {
					textureNew = Math.floor(Math.random()*6);
				}
			}
			else if (x == 0 && y > 0) { // first cube in all rows after the 1st
				while (grid[x][y - 1].textureInt == textureNew) {
					textureNew = Math.floor(Math.random()*6);
				}
			}
			else if (x > 0 && y > 0 && y < gridHeight) { // all rows but first and last, not first in row
				while (grid[x - 1][y].textureInt == textureNew || grid[x][y - 1].textureInt == textureNew) {
					textureNew = Math.floor(Math.random()*6);
				}
			}
			else if (x > 0 && y == gridHeight) { // last row
				while (grid[x - 1][y].textureInt == textureNew) {
					textureNew = Math.floor(Math.random()*6);
				}
			}			
			newCube = new cubeObj(textureInt, state, x, y);
			newRow.push(newCube);
		}
		grid.push(newRow);
	}
}

//=============================================================================
// Check if a given cube is alive or dead, and update the appropriate given var
function deadOrAlive(x, y, nAlive) {
	if (grid[x][y].state == true) {
		nAlive += 1;
	}
	return nAlive;
}

//=============================================================================
// Have a specific cube update its state according the rules
function updateCube(x, y, gridNew) {
	// First, check the states of all neighbors and tally up # alive/dead
	var nAlive = 0; // # of neighbors alive
	if (x > 0) { nAlive = deadOrAlive(x - 1, y, neighbors); }
	if (x < gridWidth) { nAlive = deadOrAlive(x + 1, y, neighbors); }
	if (y > 0) { nAlive = deadOrAlive(x, y - 1, neighbors); }
	if (y < gridWidth) { nAlive = deadOrAlive(x, y + 1, neighbors); }

	if (grid[x][y]) { // if the cell is alive
		// Rule 1: Any live cell with fewer than two live neighbours dies, as if caused by under-population.
		// Rule 3: Any live cell with more than three live neighbours dies, as if by over-population.
		if (nAlive < 2 || nAlive > 3) {
			gridNew[x][y].state = false;
			deathToll += 1;
			cubesAlive -= 1;
			if (nAlive < 2) { deathUnder += 1; } // Rule 1
			else { deathOver += 1; } // Rule 2
		}
		// Rule 2: Any live cell with two or three live neighbours lives on to the next generation.
	}
	
	else { // if the cell is dead
		// Rule 4: Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
		if (nAlive == 3) {
			gridNew[x][y].state = true;
			cubesAlive += 1;
		}
	}
}

//=============================================================================
// Change a specific cube's state to be the opposite of what it currently is
function switchCubeState(x, y) {
	if (grid[x][y].state) { // if the cube is currently alive
		grid[x][y].state = false;
		cubesAlive -= 1;
	}
	else {
		grid[x][y].state = true;
		cubesAlive += 1;
	} 
}

//=============================================================================
// Update the states of the entire grid
function updateGrid() {
	var gridNew = grid;
	for (var x = 0; x < gridWidth; ++x) {
		for (var y = 0; y < gridHeight; ++y) {
			updateCube(x, y);
		}
	}
	grid = gridNew;
}

function volumeToggle()
{
    
    var image = document.getElementById("pic");
    if (image.src.match("textures/PLAYING.png")) 
    {
        image.src = "textures/MUTE.png";
        conwayAudio.volume = 0;
        cenaAudio.volume = 0;
    }
    else 
    {
        image.src = "textures/PLAYING.png";
        conwayAudio.volume = 1;
        cenaAudio.volume = 1;
    }
}
//=============================================================================
//=============================================================================
var main = function() {
	// * VERY IMPORTANT STUFF GOES HERE YOU SHOULD ADD IT * //
    conwayAudio.play();
};

window.addEventListener( 'load', main, true );