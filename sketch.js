// ------------------------------------------ VARIABLES GLOBALES

let video, bodyPose, poses = [], connections;
let imgplayer, imgplayernose, imgplayerdead, font;
let ui_gameplay, ui_death;
let gameState = 'standBy';
let gameovercountdown = 9;
let gameOverStart = 0;
let playerDetected = false;
let playCredits = 0;
let lastUpdate = 0;
let highScore = 0;
let posX = 0;
let imgEnemies = [];
let enemies = [];

let temptotalTime = 15;
let tempstartTime;

let wincountdown = 5;
let wingameOverStart = 0;

let imgClock;
let clock = {
  x: 0,
  y: -100,
  speed: 2,
  size: 40,
  active: true
};

let imgPoint;
let point = {
  x: 0,
  y: -100,
  speed: 2,
  size: 30,
  active: true
};


// ------------------------------------------ PRELOAD

function preload() {
  bodyPose = ml5.bodyPose();
  imgplayer = loadImage("sprites/player.gif");
  imgplayerdead = loadImage('sprites/PlayerDead.gif');
  imgplayernose = loadImage("sprites/playerNose.png");
  font = loadFont("fonts/8-bit-hud.ttf");
  ui_gameplay = loadImage('sprites/ui_runtime.png');
  ui_death = loadImage('sprites/ui_dead.png');
  imgEnemies = [
    loadImage("sprites/enemies/enemie1.gif"),
    loadImage("sprites/enemies/enemie2.gif"),
    loadImage("sprites/enemies/enemie3.gif"),
    loadImage("sprites/enemies/enemie4.gif"),
  ];
  imgClock = loadImage('sprites/Clock.png');
  imgPoint = loadImage('sprites/Point.png');
}

// ------------------------------------------ SETUP

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  bodyPose.detectStart(video, gotPoses);
  connections = bodyPose.getSkeleton();

  enemies = [
    { x: random(width), y: random(-300, -50), speed: 2.2, img: imgEnemies[0] },
    { x: random(width), y: random(-300, -50), speed: 2, img: imgEnemies[1] },
    { x: random(width), y: random(-300, -50), speed: 3.1416, img: imgEnemies[2] },
    { x: random(width), y: random(-300, -50), speed: 3.5, img: imgEnemies[3] }
  ];

clock.x = random(width - clock.size);
clock.y = random(-400, -100);
clock.speed = random(1.5, 4);
clock.active = true;
  
point.x = random(width - point.size);
point.y = random(-400, -100);
point.speed = random(1.5, 4);
point.active = true;

}

// ------------------------------------------ DRAW

function draw() {
  image(video, 0, 0, width, height);

  if (gameState === 'standBy') {
    fstandBy();
  }

  else if (gameState === 'playing') {
    let tempelapsed = int((millis() - tempstartTime) / 1000);
    let tempremaining = temptotalTime - tempelapsed;
    
    if (point.active) {
  image(imgPoint, point.x, point.y, point.size, point.size);
  point.y += point.speed;

  if (point.y > height + 50) {
    point.x = random(width - point.size);
    point.y = random(-400, -100);
    point.speed = random(1.5, 4);
  }

  // Colisión con jugador
  if (playerDetected &&
      posX < point.x + point.size &&
      posX + 50 > point.x &&
      400 < point.y + point.size &&
      400 + 50 > point.y) {
    playCredits += 3; // 3 puntos extra
    point.x = random(width - point.size);
    point.y = random(-400, -100);
    point.speed = random(1.5, 4);
  }
}

    if (tempremaining > 0) {
      fill(255);
      textSize(24);
      textFont(font);
      textAlign(CENTER, CENTER);
      stroke(0);
      text(tempremaining, width / 2 - 25, 440);
    } else {
      gameState = 'youWin';
      wingameOverStart = millis();
    }

    if (clock.active) {
  image(imgClock, clock.x, clock.y, clock.size, clock.size);
  clock.y += clock.speed;

  // Reposicionar si sale de pantalla
  if (clock.y > height + 50) {
    clock.x = random(width - clock.size);
    clock.y = random(-400, -100);
  }

  // Verificar colisión con el jugador
  if (playerDetected &&
      posX < clock.x + clock.size &&
      posX + 50 > clock.x &&
      400 < clock.y + clock.size &&
      400 + 50 > clock.y) {
    temptotalTime = temptotalTime + 15
    clock.x = random(width - clock.size);
    clock.y = random(-400, -100);
    clock.speed = random(1.5, 4);
  }
}
    
    
    
    
    
    image(ui_gameplay, 0, 0, width, height);
    fill(255);
    textSize(12);
    textFont(font);
    textAlign(LEFT, BOTTOM);
    stroke(0);
    text("High Score: " + highScore, 15, 470);
    text("Your Score: " + playCredits, 440, 470);

    for (let i = 0; i < enemies.length; i++) {
      let e = enemies[i];
      e.y += e.speed;

      if (e.y > height + 40) {
        playCredits++;
        e.y = random(-300, -50);
        e.x = random(width);
      }

      if (playerDetected &&
        posX < e.x + 50 &&
        posX + 50 > e.x &&
        400 < e.y + 50 &&
        400 + 50 > e.y) {
        if (gameState !== "gameOver") {
          gameState = "gameOver";
          gameOverStart = millis();
        }
      }

      image(e.img, e.x, e.y, 50, 50);
    }
  }

  else if (gameState === 'gameOver') {
    gameIsOver();
  }

  else if (gameState === 'youWin') {
    youWin();
  }

  // Mostrar jugador si está detectado
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i];
    for (let j = 0; j < pose.keypoints.length; j++) {
      let keypoint = pose.keypoints[0];
      if (keypoint.confidence > 0.01 && gameState === 'playing') {
        posX = keypoint.x;
        image(imgplayer, posX, 380, 50, 50);
        image(imgplayernose, keypoint.x - 12.5, keypoint.y - 12.5, 25, 25);
      }
    }
  }
}

// ------------------------------------------ GAME STATES

function gameIsOver() {
  let elapsed = int((millis() - gameOverStart) / 1000);
  let remaining = gameovercountdown - elapsed;

  image(ui_death, 0, 0, width, height);
  fill(255, 0, 0);
  textSize(32);
  textFont(font);
  textAlign(CENTER, CENTER);
  stroke(0);
  text("Game Over !", width / 2, height / 2);

  fill(255);
  textSize(16);
  text("High Score: " + highScore, width / 2, 180);
  text("Your Score: " + playCredits, width / 2, 300);
  image(imgplayerdead, posX, 380);

  textSize(10);
  text("next game will begin in... " + remaining + " segs", 320, 430);

  if (remaining <= 0) {
    resetGame();
  }
}

function youWin() {
  let winelapsed = int((millis() - wingameOverStart) / 1000);
  let remaining = wincountdown - winelapsed;
  
  image(ui_death, 0, 0, width, height);
  fill(255);
  textSize(32);
  textFont(font);
  textAlign(CENTER, CENTER);
  stroke(0);
  text("Time is up !", width / 2, height / 2);
    if (playCredits >= highScore) {
  fill(0, 255, 0);
  textSize(16);
  text("New High Score: " + playCredits, width / 2, 300);
  text("Reclama tu premio!", width / 2, 350);
  highScore = playCredits;
    } else {
  fill(255);
  textSize(16);
  text("High Score: " + highScore, width / 2, 300);  
  }
  

  fill(255);
  textSize(10);
  text("next game will begin in... " + remaining + " segs", 320, 430);

  if (remaining <= 0) {
    resetGame();
  }
}

function resetGame() {
  gameState = 'playing';
  gameOverStart = 0;
  wingameOverStart = 0;
  playCredits = 0;
  temptotalTime = 15;
  tempstartTime = millis();


clock.x = random(width - clock.size);
clock.y = random(-400, -100);
clock.speed = random(1.5, 4);
clock.active = true;
  
  imgplayerdead = loadImage('sprites/PlayerDead.gif');

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].x = random(width);
    enemies[i].y = random(-300, -50);
  }
}

function fstandBy() {
  gameState = 'standBy';
  image(ui_death, 0, 0, width, height);

  fill(255);
  textSize(32);
  textFont(font);
  textAlign(CENTER, CENTER);
  stroke(0);
  text("Pacman + IA", width / 2, height / 2);
  textStyle(BOLD);

  textSize(12);
  text("High Score: " + highScore, width / 2, 300);
  textSize(14);
  text("Ponte frente a la webcam para iniciar.", 320, 430);

  textSize(10);
  text("by GabooDesign", 320, 470);
  image(imgplayer, width / 2 + 210, height / 2 - 25, 50, 50);
}

// ------------------------------------------ IA DETECCIÓN

function gotPoses(results) {
  poses = results;
  if (poses.length === 0) {
    playerDetected = false;
    gameState = 'standBy';
  } else {
    if (!playerDetected && gameState === 'standBy') {
      playerDetected = true;
      gameState = 'playing';
      tempstartTime = millis(); // Inicia el temporizador aquí también
    } else {
      playerDetected = true;
    }
  }
}
