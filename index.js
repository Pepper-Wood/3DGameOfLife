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
// Initialize the grid such that all cubes are false/dead/off
function initGridClean() {
	grid = Array(gridWidth).fill(Array(gridHeight).fill(false));
}

//=============================================================================
// Initialize the grid such that cube status is randomized
function initGridClean() {
	// * MARINA DOES THIS ONE * //
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
	nAlive = deadOrAlive(x - 1, y, neighbors);
	nAlive = deadOrAlive(x + 1, y, neighbors);
	nAlive = deadOrAlive(x, y - 1, neighbors);
	nAlive = deadOrAlive(x, y + 1, neighbors);

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
	for (var x = 0; x < grid.length; ++x) {
		for (var y = 0; y < grid[x].length; ++y) {
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