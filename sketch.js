let grid;
let grid_new;
let score = 0;

let soundClassifier;
let voiceResult;

let voiceCommand;

function preload() {
  let options = {
   probabilityThreshold: 0.75 
  }
  soundClassifier = ml5.soundClassifier('SpeechCommands18w', options);
}

function setup() {
  createCanvas(400, 400);
  noLoop();
  grid = blankGrid();
  grid_new = blankGrid();
  // console.table(grid);
  addNumber();
  addNumber();
  
  updateCanvas();
}

function voiceMove(){
  
  // Step 0: Classify Voice Command
  //soundClassifier.classify(gotResults);
  
  // grid variables
  let flipped = false;
  let rotated = false;
  let played = true;
  
  // Step 1: Interpret Effects of Command
  if (voiceCommand == 'down') { 
    } else if ( voiceCommand == 'up'){
      grid = flipGrid(grid);
      flipped = true;
    } else if (voiceCommand == 'right'){
      grid = transposeGrid(grid);
      rotated = true;
    } else if (voiceCommand == 'left'){
      grid = transposeGrid(grid);
      grid = flipGrid(grid);
      rotated = true;
      flipped = true;
    } else {
      played = false;
    }
  
    // Step 2: Actuate Effects onto Grid
    if (played) {
    let past = copyGrid(grid);
    for (let i = 0; i < 4; i++) {
      grid[i] = operate(grid[i]);
    }
    let changed = compare(past, grid);
    if (flipped) {
      grid = flipGrid(grid);
    }
    if (rotated) {
      grid = transposeGrid(grid);
    }
    if (changed) {
      addNumber();
    }
      updateCanvas();

    let gameover = isGameOver();
    if (gameover) {
      console.log("GAME OVER");
    }

    let gamewon = isGameWon();
    if (gamewon) {
      console.log("GAME WON");
    }

    }
}

// One "move"
function keyPressed() {
  let flipped = false;
  let rotated = false;
  let played = true;
  switch (keyCode) {
    case DOWN_ARROW:
      // do nothing
      break;
    case UP_ARROW:
      grid = flipGrid(grid);
      flipped = true;
      break;
    case RIGHT_ARROW:
      grid = transposeGrid(grid);
      rotated = true;
      break;
    case LEFT_ARROW:
      grid = transposeGrid(grid);
      grid = flipGrid(grid);
      rotated = true;
      flipped = true;
      break;
    default:
      played = false;
  }

  if (played) {
    let past = copyGrid(grid);
    for (let i = 0; i < 4; i++) {
      grid[i] = operate(grid[i]);
    }
    let changed = compare(past, grid);
    if (flipped) {
      grid = flipGrid(grid);
    }
    if (rotated) {
      grid = transposeGrid(grid);
    }
    if (changed) {
      addNumber();
    }
    updateCanvas();

    let gameover = isGameOver();
    if (gameover) {
      console.log("GAME OVER");
    }

    let gamewon = isGameWon();
    if (gamewon) {
      console.log("GAME WON");
    }

  }
}

function updateCanvas() {
  
  //voiceCommand();
  //voiceMove();
  
  background(255);
  drawGrid();
  select('#score').html(score);
  select('#voiceResult').html(voiceResult);
  soundClassifier.classify(gotResults);
}

function gotResults(error, results){
 if (error){
  console.error(error); 
 }
  voiceCommand = results[0].label;
  voiceConfidence = results[0].confidence;
  console.log(results[0].label, results[0].confidence);
  voiceResult = ('I heard you say ' + voiceCommand.toUpperCase() + ' with a confidence of ' + floor(voiceConfidence*100) + '%');
  //resultP.html(`${results[0].label} : ${results[0].confidence}`);
  
  voiceMove();
}

function drawGrid() {
  let w = 100;
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      noFill();
      strokeWeight(2);
      let val = grid[i][j];
      let s = val.toString();
      if (grid_new[i][j] === 1) {
        stroke(200, 0, 200);
        strokeWeight(16);
        grid_new[i][j] = 0;
      } else {
        strokeWeight(4);
        stroke(0);
      }

      if (val != 0) {
        fill(colorsSizes[s].color);
      } else {
        noFill();
      }
      rect(i * w, j * w, w, w, 30);
      if (val !== 0) {
        textAlign(CENTER, CENTER);
        noStroke();
        fill(0);
        textSize(colorsSizes[s].size);
        text(val, i * w + w / 2, j * w + w / 2);
      }
    }
  }
}