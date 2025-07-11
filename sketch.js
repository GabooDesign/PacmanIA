/*
 * This work has been created using p5js.org 1.9.4 and ml5js.org 1.2.1 
 * Using the template of Bodypose as base of this project
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next gen/blob/main/LICENSE.md
 *
 * This project has been created by GabooDesign for the class of "Proyecto V" by Jenny Abud.
 * If you wanna use it for any pourposes please let me know ;)
 */

// Webcam & ml5.js variables
let video;
let bodyPose;
let poses = [];
let connections;

// Pre-Loads
let imgplayer; // Preloads the image of the pacman player
let imgplayernose; // Preloads the image of player nose
let imgplayerdead; // Preloads the image of the pacman death
let font; // Preloads the font for the game

// Gamestates and UI
    // images
let ui_gameplay; // user interface for the gameplay
let ui_death; // user interface for dead screen

let gameState = 'playing'; // gamestates = "gameOver", "playing", "standBy"
let countdown = 9; // Countdown to start the game again as a loop
let gameOverStartTime = 0; //Millis to count back

// *Player*
let playerDetected = false; // Detects if there is a player in the Capture
let playCredits = 0; // Time that the player can still playing
let lastUpdate = 0; // Last time update
let highScore = 0; // The most time that has been saved during Runtime
let posX = 0; // Position in X of the nose of the player

// *Enemies*
let imgEnemies = []; // Preloads an array of gif enemies
let enemies = [];


function preload() {
  //----------------------------------------------------------------------- PRELOAD
  // Preload the bodyPose model
  bodyPose = ml5.bodyPose();

  // Preload the image of the player
  imgplayer = loadImage("sprites/player.gif");
  imgplayerdead = loadImage('sprites/PlayerDead.gif')
  imgplayernose = loadImage("sprites/playerNose.png");

  // Preload the font of the game
  font = loadFont("fonts/8-bit-hud.ttf");

  // Preload the user interface images
  ui_gameplay = loadImage('sprites/ui_runtime.png')
  ui_death = loadImage('sprites/ui_dead.png')
  
  // Preload the enemies array of gifs
  imgEnemies = [
    loadImage("sprites/enemies/enemie1.gif"),
    loadImage("sprites/enemies/enemie2.gif"),
    loadImage("sprites/enemies/enemie3.gif"),
    loadImage("sprites/enemies/enemie4.gif"),
  ];
}


function setup() {
  //----------------------------------------------------------------------- SETUP
  createCanvas(640, 480);

  // Create the video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Start detecting poses in the webcam video
  bodyPose.detectStart(video, gotPoses);
  // Get the skeleton connection information
  connections = bodyPose.getSkeleton();

  // Create enemies
  enemies = [
    { x: random(width), y: random(-300, -50), speed: 2.2, img: imgEnemies[0] },
    { x: random(width), y: random(-300, -50), speed: 2, img: imgEnemies[1] },
    { x: random(width), y: random(-300, -50), speed: 3.1416, img: imgEnemies[2], },
    { x: random(width), y: random(-300, -50), speed: 3.5, img: imgEnemies[3] }
  ];
}


function draw() {
  //------------------------------------------------------------------------ DRAW
  // Shows webcam
  image(video, 0, 0, width, height);

  //Sets the HighScore if the PlayCredits are upper than the actual value
  if (playCredits >= highScore) {
    highScore = playCredits;
  }

    // Enemies logic  
    if(gameState === 'playing'){
      // Restart the enemies
      for (let i = 0; i < enemies.length; i++) {
      let e = enemies[i];
      e.y += e.speed;

      if (e.y > height + 40) {
        playCredits++; // sumás crédito
        e.y = random(-300, -50);
        e.x = random(width);
      }
        if (
          playerDetected &&
          posX < e.x + 50 &&
          posX + 50 > e.x &&
          400 < e.y + 50 &&
          400 + 50 > e.y
        ) {
          if (gameState !== "gameOver") {
            gameState = "gameOver";
            gameOverStart = millis();
            playCredits = 0;
          } else{
            if (gameState !== "standBy"){
              paused();
            }
          }
        }

      image(e.img, e.x, e.y, 50, 50);
      }
    
    // image background  
    image(ui_gameplay, 0, 0, width, height);

    // texts
    fill(255);
    textSize(12);
    textFont(font);
    textAlign(LEFT, BOTTOM);
    stroke(0);
    text("High Score: " + highScore, 15, 470);
    text("Your Score: " + playCredits, 440, 470);
    }
    if(gameState === 'gameOver'){
      gameIsOver();
      playCredits = 0;
    }
  
  // ml5.js ia body detection
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[0];

      if (keypoint.confidence > 0.1) {
        playerDetected = true; // Detects an human
        if(gameState === 'playing'){
        posX = keypoint.x;
        image(imgplayer, posX, 380, 50, 50);
        image(imgplayernose, keypoint.x-25/2, keypoint.y-25/2, 25, 25);
          }
        }
      }
    }
  } // End function Draw

function gameIsOver() {
  let elapsed = int((millis() - gameOverStart) / 1000);
  let remaining = countdown - elapsed;

  // Muestra la pantalla de Game Over
  image(ui_death, 0, 0, width, height);

  // Texto principal
  fill(255, 0, 0);
  textSize(32);
  textFont(font);
  textAlign(CENTER, CENTER);
  stroke(0);
  strokeWeight(1);
  text("Game Over !", width / 2, height / 2);
  textStyle(BOLD);

  // Puntajes
  fill(255);
  textSize(16);
  text("High Score: " + highScore, width / 2, 180);
  text("Your Score: " + playCredits, width / 2, 300);
  
  // Player death
  image (imgplayerdead, posX, 380)
  
  // Countdown visual
  textSize(10);
  text("next game will begin in... " + remaining + " segs", 320, 430);

  // Si se acaba el tiempo, reiniciar
  if (remaining <= 0) {
    resetGame();
  }
}

function resetGame() {
  // Reinicia el juego
  gameState = "playing";
  countdown = 9;
  
  // Preload again the sprite of pacman death to the next game over
  imgplayerdead = loadImage('sprites/PlayerDead.gif')
  
  for (let i = 0; i < enemies.length; i++) {
    enemies[i].x = random(width);
    enemies[i].y = random(-300, -50);
  }
}

function fstandBy(){
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
    text("High Score: " + highScore, width / 2, 300);
    text("IA en los videojuegos", width / 2, 200);

    // Instructions
    fill(255);
    textSize(14);
    textFont(font);
    textAlign(CENTER, BOTTOM);
    stroke(0);
    text("Ponte frente a la webcam para inciar.", 320, 430);
    
    // Credits
    fill(255);
    textSize(10);
    textFont(font);
    textAlign(CENTER, BOTTOM);
    stroke(0);
    text("by GabooDesign", 320, 470);
    
    // Image
    image(imgplayer, width / 2 + 210, height / 2 - 25, 50, 50);
}


// Callback function for when bodyPose outputs data
function gotPoses(results) {
  //-----------------------------------------------------------------------
  // Save the output to the poses variable
  poses = results;
}
