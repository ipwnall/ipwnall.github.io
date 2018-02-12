// shim layer with setTimeout fallback
// from http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();




var wavecanvas = document.getElementById("wavecanvas");
var wavec = wavecanvas.getContext("2d");

var pullStrength = 0.002;
var maxPullStrength = 0.004;
var dampeningFactor = .8;
var maxDampeningFactor = .98;
var initialHeight = 0.65;
var cells = [];
var gridSize = 31;
var conservationOfMassCorrection = 0;
var cellWidth = 1 / (gridSize-1) * wavecanvas.width;
var cellHeight = 1 / (gridSize-1) * wavecanvas.height;

var mouseX, mouseY, mouseDown;
var animate = true;

function executeFrame(){
  if(animate)
    requestAnimFrame(executeFrame);
  clearwavecanvas();
  drawCells();
  iterateSimulation();
};

// Store the color strings as an object re-use optimization.
// (otherwise new string objects would be created for each color each frame)
var grayStrings = [];
for(var gray = 0;gray < 255; gray++){
    // this transforms strings from 'rgb(255,190,201)' to '#FF564B'
    wavec.fillStyle = 'rgb('+gray+','+gray+','+gray+')';
    // store the colors of the form '#FF564B'
    grayStrings.push(wavec.fillStyle);
}

for(var i = 0; i < gridSize; i++){
  for(var j = 0; j < gridSize; j++){
  
    // Raise a single cell so the simulation is
    // initialized with something that looks interesting
    var isRaisedCell = false;
    if(i === Math.floor(gridSize*3))
      if(j === Math.floor(gridSize*3))
        isRaisedCell = true;
    
    cells.push({
      // for a still initial surface
      // height: 0.5,
       
      // for an initial wave:
      height: isRaisedCell ? 2 : initialHeight,
      
      velocity: 0
    });
  }
}

function clearwavecanvas(){
  wavecanvas.width = 750;
  wavecanvas.height = 750;
  
  cellWidth = 1 / (gridSize-1) * wavecanvas.width;
  cellHeight = 1 / (gridSize-1) * wavecanvas.height;
}
function drawCells(){
  
  for(var i = 0; i < gridSize; i++){
    for(var j = 0; j < gridSize; j++){
      var cell = cells[i + j * gridSize];
      var x = i / (gridSize-1) * wavecanvas.width;
      var y = j / (gridSize-1) * wavecanvas.height;
      var gray = Math.floor(cell.height * 255);
      gray = gray > 255 ? 255 : gray < 0 ? 0 : gray;
      
      // This commented method of defining the colors
      // would create lots of new String objects.
      // Better to re-use existing objects so that
      // no memory is allocated/released each frame.
      //wavec.fillStyle = 'rgb('+gray+','+gray+','+gray+')';
      
      wavec.fillStyle = grayStrings[gray];
      wavec.fillRect(x,y,cellWidth+1,cellHeight+1);
    }
  }
}
function iterateSimulation(){
  var avgHeight = 0;
  for(var i = 0; i < gridSize; i++){
    for(var j = 0; j < gridSize; j++){
      // center cell
      var wavec = cells[i + j * gridSize];
      
      for(var di = -1; di <= 1; di++){
        for(var dj = -1; dj <= 1; dj++){
        
          if(di !== 0 || dj !== 0){
            var ni = ((i + di) + gridSize) % gridSize;
            var nj = ((j + dj) + gridSize) % gridSize;
            
            var neighbor = cells[ni + nj * gridSize];
            
            // pull toward neighbors
            wavec.velocity += pullStrength * (neighbor.height - wavec.height);
          }
        }
      }
      
      // increment velocity
      wavec.height += wavec.velocity;
      
      // ensure conservation of mass
      wavec.height += conservationOfMassCorrection;
      
      // apply dampening
      wavec.velocity *= dampeningFactor;
      
      avgHeight += wavec.height;
    }
  }
  avgHeight /= Math.pow(gridSize - 1,2);
  
  conservationOfMassCorrection = initialHeight - avgHeight;
}


function explodebg(){
	var i = Math.floor((gridSize-1) * xFoodPosition / wavecanvas.width);
    var j = Math.floor((gridSize-1) * yFoodPosition / wavecanvas.height);
    var cell = cells[i + j * gridSize];
    cell.height = 2;
    cell.velocity = 0;
		if (pullStrength < maxPullStrength) {
			pullStrength = pullStrength + 0.0001;
		}
		if (dampeningFactor < maxDampeningFactor) {
			dampeningFactor = 1-((1-dampeningFactor)*.9);
		}
}

executeFrame();