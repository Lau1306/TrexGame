var score;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, groundImage, invisibleGround;
var cloud, cloudImage, cloudsGroup;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obstaclesGroup;
var gameOver, gameOverImg, restart, restartImg;
var jumpSound, dieSound, checkPointSound, backgroundSound;

var backimg;

function preload(){
  //Carga animación
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  backgroundSound = loadSound("mixkit-arcade-retro-background-219.wav")
}

function setup(){
  createCanvas(600,200)
  
  backimg = loadImage("sky.png");
  
  //Crea objeto trex y le asigna animación
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  //Escalar trex
  trex.scale = 0.5; 
    
  //Crea sprite para suelo
  ground = createSprite(200,180,400,20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  
  //Crea suelo invisible
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.visible = false;
  restart.visible = false;
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  score = 0;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  trex.setCollider("circle",0,0,40);
  //trex.debug = true;

  //backgroundSound.loop();
}

function draw(){
  background(backimg);
    
  //Impide que el trex se vaya hacia abajo
  trex.collide(invisibleGround);
  
  text("ScoreScore: " + score, 500, 50);
   
  drawSprites();  
  
  if(gameState === PLAY){
    //Mueve suelo en hacia atrás
    ground.velocityX = -(6 + score/100);
    
    //Hace que el trex salte al presionar espacio
    if(keyDown("space") && trex.y >= 160){
      trex.velocityY = -13;
      jumpSound.play();
    }

    //Agrega gravedad para la caida
    trex.velocityY = trex.velocityY + 0.8;
    
    //Crea suelo simétrico
    if(ground.x < 0){
      ground.x = ground.width / 2;
    }
    
    //Puntuación
    score = score + Math.round(getFrameRate()/60);
    
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
      
      //IA
      /*trex.velocityY = -12;
      jumpSound.play();*/
    }
    
    if(score > 0 && score % 600 == 0){
      checkPointSound.play();
      backimg = loadImage("sky_n.png");
    }
    
    if(score > 0 && score % 1000 == 0){
      backimg = loadImage("sky.png");
    }
    
    spawnClouds();
    spawnObstacles();
  }
  else if(gameState === END){
    ground.velocityX = 0;
    trex.velocityY = 0;
    
    trex.changeAnimation("collided", trex_collided);
    
    gameOver.visible = true;
    restart.visible = true;
 
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)){
      reset();
    }
  }
}

function spawnClouds(){
  if(frameCount % 60 == 0){
    cloud = createSprite(600,100,40,10);
    cloud.addImage(cloudImage);
    cloud.scale = Math.random(0,1);
    cloud.velocityX = -3;
    cloud.y = Math.round(random(10,80));
    
    //Cambia profundidades
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    cloud.lifetime = 200;
    
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles(){
  if(frameCount % 60 == 0){
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -(6 + score/100);
    
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
        default: break;
    }
    
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  console.log("reset");
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  
  score = 0;
}