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
var color_textures = ["textures/color_textures/3.jpg","textures/color_textures/3.jpg","textures/color_textures/3.jpg","textures/color_textures/3.jpg", "textures/color_textures/3.jpg", "textures/color_textures/3.jpg"];
//initialize audio
var conwayAudio = document.createElement('audio');
conwayAudio.volume = .4;
var conwaySource = document.createElement('source');
var cenaAudio = document.createElement('audio');
cenaAudio.volume = .8;
var cenaSource = document.createElement('source');
var cenaPiano = document.createElement('audio');
cenaPiano.volume = .5;
var cenaPianoSource = document.createElement('source');
conwaySource.src = 'sounds/conway.mp3';
cenaSource.src = 'sounds/AND_HIS_NAME_IS_JOHN_CENA.wav';
cenaPianoSource.src = 'sounds/cena_piano.mp3';
conwayAudio.appendChild(conwaySource);
cenaAudio.appendChild(cenaSource);  
cenaPiano.appendChild(cenaPianoSource);
var camera, scene, renderer;
var clock = new THREE.Clock();



//=============================================================================
function initialize_button() {
	var gridWidth = document.getElementById("gridWidth").value;
	var gridHeight = document.getElementById("gridHeight").value;
	
	// if bool is true, then random. If false, then all dead
	if (document.getElementById("size").value == 10) { // ALL DEAD
		initGrid(false);
	} else if (document.getElementById("size").value == 20) { // RANDOM
		initGrid(true);
	} else {
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
function cubeObj(t_Int, s, x_pos, y_pos) {
	var len_side = 50;
	var geometry = new THREE.CubeGeometry( len_side, len_side, len_side );
	//var material = new THREE.MeshPhongMaterial( { map: THREE.ImageUtils.loadTexture("textures/color_textures/3.jpg") } );
	var material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true, wireframeLinewidth: 2 }  );
	
	this.textureInt = t_Int;
	this.state = s;

	this.mesh = new THREE.Mesh( geometry , material );
	// this.mesh.rotation.x = -100;
	// this.mesh.rotation.y = -100;
	this.mesh.position = new THREE.Vector3(x_pos * len_side, y_pos * len_side, 0);
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

	for (var y = 0; y < gridHeight; ++y) {
		newRow = [];
		
		for (var x = 0; x < gridWidth; ++x) {
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
			}
			else if (x > 0 && y == 0) { // first row
				while (newRow[x - 1].textureInt == textureNew) {
					textureNew = Math.floor(Math.random()*6);
				}
			}
			else if (x == 0 && y > 0) { // first cube in all rows after the 1st
				while (grid[y - 1][x].textureInt == textureNew) {
					textureNew = Math.floor(Math.random()*6);
				}
			}
			else if (x > 0 && y > 0 && y < gridHeight) { // all rows but first and last, not first in row
				while (newRow[x - 1].textureInt == textureNew || grid[y - 1][x].textureInt == textureNew) {
					textureNew = Math.floor(Math.random()*6);
				}
			}
			else if (x > 0 && y == gridHeight) { // last row
				while (newRow[x - 1].textureInt == textureNew) {
					textureNew = Math.floor(Math.random()*6);
				}
			}
			newCube = new cubeObj(textureNew, state, x, y);			
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
	if (x > 0) { nAlive = deadOrAlive(x - 1, y, nAlive); } // left
	if (x < gridWidth - 1) { nAlive = deadOrAlive(x + 1, y, nAlive); } // right
	if (y > 0) { nAlive = deadOrAlive(x, y - 1, nAlive); } // below
	if (y < gridHeight - 1) { nAlive = deadOrAlive(x, y + 1, nAlive); } // above
	if (x > 0 && y > 0) { nAlive = deadOrAlive(x - 1, y - 1, nAlive); } // left-below
	if (x > 0 && y < gridWidth - 1) { nAlive = deadOrAlive(x - 1, y + 1, nAlive); } // left-above
	if (x < gridWidth - 1 && y > 0) { nAlive = deadOrAlive(x + 1, y - 1, nAlive); } // right-below
	if (x < gridWidth - 1 && y < gridHeight - 1) { nAlive = deadOrAlive(x + 1, y + 1, nAlive); } // right-above

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
	var gridNew = grid.slice();
	for (var x = 0; x < gridWidth; ++x) {
		for (var y = 0; y < gridHeight; ++y) {
			// Display values on the html pageX
			document.getElementById("gen_").value=gen;
			document.getElementById("gen_1").innerHTML=gen;
			document.getElementById("alives_").value=cubesAlive;
			document.getElementById("alives_1").innerHTML=cubesAlive;
			document.getElementById("deads_").value=deathToll;
			document.getElementById("deads_1").innerHTML=deathToll;
			document.getElementById("under_").value=deathUnder;
			document.getElementById("under_1").innerHTML=deathUnder;
			document.getElementById("over_").value=deathOver;
			document.getElementById("over_1").innerHTML=deathOver;
			updateCube(x, y, gridNew);
		}
	}
	grid = gridNew.slice();
}

function conwayButtonPress()
{
    var elem = document.getElementById("modeButton");
    if (elem.value == "Conway's") 
    {
        elem.value = "Cena's";
        conwayAudio.pause();
        conwayAudio.currentTime = 0;
        cenaAudio.play();
    }
    else 
    {
        elem.value = "Conway's";
        cenaAudio.pause();
        cenaAudio.currentTime = 0;
        cenaPiano.pause();
        cenaPiano.currentTime = 0;
        conwayAudio.play();
    }
}

function volumeToggle()
{
    var image = document.getElementById("pic");
    if (image.src.match("textures/PLAYING.png")) 
    {
        image.src = "textures/MUTE.png";
        conwayAudio.volume = 0;
        cenaAudio.volume = 0;
        cenaPiano.volume = 0;
    }
    else 
    {
        image.src = "textures/PLAYING.png";
        conwayAudio.volume = .4;
        cenaAudio.volume = .8;
        cenaPiano.volume = .5;
    }
}
//=============================================================================
//=============================================================================
var main = function() {
	// * VERY IMPORTANT STUFF GOES HERE YOU SHOULD ADD IT * //
    conwayAudio.play();

    renderer = new THREE.CanvasRenderer();
				renderer.setSize( window.innerWidth , window.innerHeight );
				document.body.appendChild( renderer.domElement );

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 1000;
	camera.position.x = 500;
	camera.position.y = 500;
	scene = new THREE.Scene();

	initGrid(false);


	// switchCubeState(3,3);
	// switchCubeState(3,2);
	// switchCubeState(3,4);

	switchCubeState(1,1);
	switchCubeState(2,1);
	switchCubeState(1,2);

	//updateGrid();


	for (var i = 0; i < grid.length; i++){
		for (var j = 0; j < grid[i].length; ++j){
			if (grid[i][j].state == true){
				scene.add( grid[i][j].mesh );
			}
		}
	}

	renderer.render(scene,camera);



};

function render() {

	// var delta = clock.getDelta(),
	// 	time = clock.getElapsedTime() * 1000;

	updateGrid();
	scene = new THREE.Scene();

	for (var i = 0; i < grid.length; i++){
		for (var j = 0; j < grid[i].length; ++j){
			if (grid[i][j].state == true){
				scene.add( grid[i][j].mesh );
			}
		}
	}


	renderer.render( scene, camera );

}

function animate() {
	requestAnimationFrame( animate );

	render();

}

conwayAudio.addEventListener("ended", function(e){conwayAudio.play();}, false);
cenaAudio.addEventListener("ended", function(e){cenaPiano.play();}, false);
cenaPiano.addEventListener("ended", function(e){cenaPiano.play();}, false);
window.addEventListener( 'load', main, true );