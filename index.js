// * SOME JS INITIALIZATION STUFF GOES HERE PROBABLY MAYBE? *

var grid = []; // Grid containing all the cubes
var gridWidth = 20;
var gridHeight = 20;
cubesAlive = 0;
gen = 0; // Current generation/iteration number
deathOver = 0; // Total deaths due to overpopulation
deathUnder = 0; // Total deaths due to underpopulation
deathToll = 0; // Total deaths overall

//=============================================================================
function cubeObj(textureInt, state, x_pos, y_pos) {
	// * NEEDS TO BE MODIFIED TO ACCOUNT FOR CHANGES*
	this.material_ = material;
	this.materialJC_ = materialJC;
	this.mesh_ = new THREE.Mesh( geometry, material );
	this.mesh_.rotation.x = -100;
	this.mesh_.rotation.y = -100;
	this.mesh_.position = new THREE.Vector3(x_pos,y_pos);
}

//=============================================================================
// Initialize the grid; if type == true, cubes will have random states
function initGrid(var type) {
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
				if (stateInt == 1) { state = true; }
				else { state = false; }
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
function deadOrAlive(var x, var y, var nAlive) {
	if (grid[x][y] == true) {
		nAlive += 1;
	}
	return nAlive;
}

//=============================================================================
// Have a specific cube update its state
function updateCube(var x, var y, var gridNew) {
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
			gridNew[x][y] = false;
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
			gridNew[x][y] = true;
			cubesAlive += 1;
		}
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

//=============================================================================
//=============================================================================
window.onload = function init() {
	// * VERY IMPORTANT STUFF GOES HERE YOU SHOULD ADD IT *
};