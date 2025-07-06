/*
 * This work has been created using ml5js.org 1.2.1 and p5js.org 1.9.4
 * ml5.js license and Code of Conduct: https://github.com/ml5js/ml5-next gen/blob/main/LICENSE.md
 * 
 * 
 * This project has been created by GabooDesign for the class of "Proyecto V" by Jenny Abud.
 * If you wanna use it for any pourposes please let me know ;)
*/

// ml5.js variables
let video;
let bodyPose;
let poses = [];
let connections;

// Pre-Loads
let imgplayer; // Preloads the image of the pacman player
let numPlayers = 0; // Temporal
let font; // Preloads the font for the game

// *Player*
let playerDetected = false;  // Detects if there is a player in the Capture
let playCredits = 0; // Time that the player can still playing
let lastUpdate = 0; // Last time update
let highScore = 0; // The most time that has been saved during Runtime
let posX = 0; // Position in X of the nose of the player

// *Enemies*
let imgEnemies = [] // Preloads an array of gif enemies
let enemies = [];


function preload() //-----------------------------------------------------------------------
{ 
  // Preload the bodyPose model
  bodyPose = ml5.bodyPose();
  
  // Preload the image of the player
  imgplayer= loadImage('sprites/player.gif');

  // Preload the font of the game
  font = loadFont('fonts/8-bit-hud.ttf')
  
  // Preload the enemies array of gifs
  imgEnemies = [ 
    loadImage('sprites/enemies/enemie1.gif'),
    loadImage('sprites/enemies/enemie2.gif'),
    loadImage('sprites/enemies/enemie3.gif'),
    loadImage('sprites/enemies/enemie4.gif')
  ]
}

function setup()  //-----------------------------------------------------------------------
{
  createCanvas(640, 480);

  // Create the video and hide it
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  // Start detecting poses in the webcam video
  bodyPose.detectStart(video, gotPoses);
  // Get the skeleton connection information
  connections = bodyPose.getSkeleton();
  
for (let i = 0; i < 6; i++) {
  enemies.push({
    x: random(width),
    y: random(-300, -50),
    speed: random(2, 6),
    img: random(imgEnemies)
  });
}

  enemies = [
  { x: random(width), y: random(-300, -50), speed: ('playCredits'), img: imgEnemies[0] },
  { x: random(width), y: random(-300, -50), speed: 2, img: imgEnemies[1] },
  { x: random(width), y: random(-300, -50), speed: 3, img: imgEnemies[2] },
  { x: random(width), y: random(-300, -50), speed: 4, img: imgEnemies[3] }
];






}

function draw() //------------------------------------------------------------------------
{
  image(video, 0, 0, width, height);
  
  playerDetected = false; // ← reinicia en cada frame

  if (playCredits >= highScore) {
  highScore = playCredits;
}


  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[0];

      if (keypoint.confidence > 0.1) {
        playerDetected = true; // Detects an human
        image(imgplayer, keypoint.x, 400, 50, 50);
      }
    }
  }

  // playTime logics, adds 1 to score when the player still survives
  if (playerDetected) {
    if (millis() - lastUpdate >= 1000) {
      playCredits++;
      lastUpdate = millis();
    }
  } else {
    playTime = 0;
  }

  // Show texts UI
  fill(255);
  textSize(12);
  textFont(font);
  textAlign(LEFT, BOTTOM);
  stroke(0);
  text('High Score: ' + highScore, 10, 470);
  text('Your Score: ' + playCredits, 430, 470);

  // Enemies logic

  for (let i = 0; i < enemies.length; i++) {
  let e = enemies[i];
  e.y += e.speed;

  if (e.y > height + 40) {
    playCredits++; // sumás crédito
    e.y = random(-300, -50);
    e.x = random(width);
  }

  image(e.img, e.x, e.y, 50, 50);
}







}




// Callback function for when bodyPose outputs data
function gotPoses(results) //-----------------------------------------------------------------------
{
  // Save the output to the poses variable
  poses = results;
}