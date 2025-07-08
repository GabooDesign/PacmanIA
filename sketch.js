// This project is debug only!!!

let video;
let font;

// Change between into UI
let gamePlay = false; // UI during runtime
let gameOver = false; // UI Game Over
let standBy = true; // UI StandBy

// Preloads of images
let ui_gameplay; // UI Background
let ui_death; // UI death

function preload() {
  // Preload the font of the game
  font = loadFont("8-bit-hud.ttf");

  ui_gameplay = loadImage("ui_runtime.png");
  ui_death = loadImage("ui_dead.png");
}

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
}

function draw() {
  // Shows webcam
  image(video, 0, 0, width, height);

  // Shows UI while GamePlay
  if (gamePlay === true) {
    image(ui_gameplay, 0, 0, width, height);

    fill(255);
    textSize(12);
    textFont(font);
    textAlign(LEFT, BOTTOM);
    stroke(0);
    text("High Score: " + "XX", 15, 470);
    text("Your Score: " + "XX", 440, 470);
  }

  // Shows UI in the deadscreen
  if (gameOver === true) {
    // Background
    image(ui_death, 0, 0, width, height);

    // GAME OVER
    fill(255, 0, 0);
    textSize(32);
    textFont(font);
    textAlign(CENTER, CENTER);
    stroke(0);
    strokeWeight(1);
    text("Game Over !", width / 2, height / 2);
    textStyle(BOLD);
    textAlign(CENTER);

    // Shows Player scores and high score saved during runtime
    fill(255);
    textSize(16);
    textFont(font);
    textAlign(CENTER, CENTER);
    stroke(5);
    strokeWeight(4);
    text("High Score: " + "XX", width / 2, 180);
    text("Your Score: " + "XX", width / 2, 300);

    // Timer to next game
    fill(255);
    textSize(10);
    textFont(font);
    textAlign(CENTER, BOTTOM);
    stroke(0);
    text("next game will begin in... " + "9" + " segs", 320, 470);
  }

    // Shows UI in the deadscreen
  if (standBy === true) {
    // Background
    image(ui_death, 0, 0, width, height);

    // Title
    fill(255);
    textSize(32);
    textFont(font);
    textAlign(CENTER, CENTER);
    stroke(0);
    strokeWeight(5);
    text("Pacman + IA", width / 2, height / 2);
    textStyle(BOLD);
    textAlign(CENTER);

    // Shows Player scores and high score saved during runtime
    fill(255);
    textSize(12);
    textFont(font);
    textAlign(CENTER, CENTER);
    stroke(5);
    strokeWeight(5);
    text("High Score: " + "25", width / 2, 300); // replace with highScore
    text("IA en los videojuegos", width / 2, 200);

    // Timer to next game
    fill(255);
    textSize(12);
    textFont(font);
    textAlign(CENTER, BOTTOM);
    stroke(0);
    text("by GabooDesign", 320, 470);
  
  }
  
}

// Save Screenshot
function keyPressed() {
  if (key === "s") {
    saveCanvas();
  }
}
