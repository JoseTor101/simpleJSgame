//https://platzi.com/new-home/clases/3573-javascript-practico-videojuegos/52327-arreglos-multidimensionales-en-javascript/

const canvas = document.querySelector('#game');
//Con cuantas dimensiones vamos a trabajar
const game = canvas.getContext('2d');

//game.&*()
//Importante cargar todo el contenido antes
window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);
document.addEventListener('keydown', handleKeyDown);

let record = document.getElementById('record')
record.innerText = formatTimer(localStorage.getItem('record'))

let time = document.getElementById('time');
let livesView = document.getElementById('lives')
let canvasSize = Math.min(window.innerHeight*0.8,window.innerWidth*0.8)
let elementSize = (canvasSize/10);
let level = 0;
let map = maps[level]
let mapRowCols;
let lives = 3;
let gameTime = 0;
let currentTimer = null;
let formatTime = null;

const playerPosition = {
  x: undefined,
  y: undefined,
};

const giftPosition = {
  x: undefined,
  y: undefined,
};

let bombs = []

const auxMap = {
  x: undefined,
  y: undefined,
}

function setCanvasSize(){
    canvasSize = Math.min(window.innerHeight*0.8,window.innerWidth*0.8) 
    elementSize = canvasSize/10;
    
    canvas.setAttribute('height',canvasSize);
    canvas.setAttribute('width',canvasSize);
    startGame()
}


setTime();


function startGame(){

    game.font = elementSize+'px Verdana';
    game.textAlign= 'end';

    map = maps[level];

    if (level > 3){
      gameWin();
      return
    }
    showLives();

    const mapRows = map.trim().split('\n');
    mapRowCols = mapRows.map( row => row.trim().split(''));
    game.clearRect(0,0,canvasSize, canvasSize);

    mapRowCols.forEach((row,rowI) => {
        row.forEach((col,colI)=>{
            const emoji = emojis[col];
            const posx = Math.floor(elementSize * (colI + 1));
            const posy = Math.floor(elementSize * (rowI + 1));
            game.fillText(emoji,posx,posy)
            if(col == 'O'){
              if (!playerPosition.x && !playerPosition.y) {
                playerPosition.x  = posx;
                playerPosition.y = posy;
                auxMap.x = colI;
                auxMap.y = rowI;
              }
            }
        })
    });
    movePlayer();
  }
  
function movePlayer(){
  touchBomb();

  if(mapRowCols[auxMap.y][auxMap.x] == 'I'){
    console.log('Subes de nivel!')
    level ++
    //gameTime = 0;
    startGame();
  }
  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y)
}

function touchBomb(){
    if (lives > 0){
      if (mapRowCols[auxMap.y][auxMap.x] == 'X'){ 
      lives--  
      //gameTime = 0;
      showLives()
      playerPosition.x = undefined
      playerPosition.y = undefined
      startGame()
    }}else {
      console.log("Perdiste :(")
      //gameTime=0
      level = 0;
      lives = 3;
      playerPosition.x = undefined
      playerPosition.y = undefined
      gameOver()
    }
}

function gameWin(){
  setRecord();
  time.innerText=formatTime;
  gameTime = 0;
  console.log("Juego terminado")

}

function gameOver(){
  console.log("Perdiste :(")
  showGameOverBanner();
  level = 0;
  lives = 3;
  gameTime = 0;
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame()
}
// Function to handle the keydown event
function handleKeyDown(event) {
  switch (event.key) {
    case 'ArrowUp':
      if (auxMap.y> 0 && auxMap.y <=9 ) {
        playerPosition.y -= elementSize;
        auxMap.y -= 1
        startGame();
      }
      /*if (Math.floor(playerPosition.y)>elementSize) {
        playerPosition.y -= elementSize;
        auxMap.y -= 1
        startGame();
      }*/
      break;
    case 'ArrowDown':
      if(auxMap.y>= 0 && auxMap.y <9 ) { 
        playerPosition.y += elementSize;
        auxMap.y += 1
        startGame();
      }
      /*if(Math.ceil(playerPosition.y)<canvasSize) { 
        playerPosition.y += elementSize;
        auxMap.y += 1
        startGame();
      }*/
      break;
    case 'ArrowLeft':
      if(auxMap.x> 0 && auxMap.x <=9 )  { 
        playerPosition.x -= elementSize;
        auxMap.x -= 1
        startGame();
      }
      /*if (Math.floor(playerPosition.x)>elementSize) {
        playerPosition.x -= elementSize;
        auxMap.x -= 1
        startGame();
      }*/
      break;
    case 'ArrowRight':
      if(auxMap.x>= 0 && auxMap.x <9 )  { 
        playerPosition.x += elementSize;
        auxMap.x += 1
        startGame();
      }
      /*if(Math.ceil(playerPosition.x)<elementSize*10) { 
        playerPosition.x += elementSize;
        auxMap.x += 1
        startGame();
      }*/
      break;
    default:
      break;
  }
}


function showLives(){
  const heartArray = Array(lives).fill(emojis['HEART'])
  
  livesView.textContent = heartArray.join("");
}



function setTime() {
  currentTimer = setInterval(() => {
    gameTime += 10; // Increment by 10 milliseconds
    formatTime = formatTimer(gameTime);
    time.innerText = formatTime;
  }, 10); 
}


function setRecord(){
  let currentRecord = localStorage.getItem('record')

  if (gameTime<currentRecord || !currentRecord){
    localStorage.setItem('record', gameTime);
    record.innerText = formatTimer(gameTime)
  }

}

function formatTimer(gametimer){
  const minutes = Math.floor(gametimer / 60000); 
  const seconds = ((gametimer % 60000) / 1000).toFixed(1);
  let formatTime = `${minutes} min ${seconds} s`;
  return formatTime  
}


let countdown = 10;
let countdownInterval;

function showGameOverBanner() {
  const gameOverBanner = document.getElementById('gameOverBanner');
  gameOverBanner.style.display = 'block';

  countdownInterval = setInterval(() => {
    countdown--;
    const countdownElement = document.getElementById('countdown');
    countdownElement.textContent = countdown;

    if (countdown === 0) {
      clearInterval(countdownInterval);
      document.getElementById('playAgainButton').disabled = false;
    }
  }, 1000); // Update the countdown every 1000ms (1 second)
  document.removeEventListener('keydown', handleKeyDown);
}

function playAgain() {
  clearInterval(countdownInterval);
  document.getElementById('playAgainButton').disabled = true;
  document.getElementById('countdown').textContent = 10;
  hideGameOverBanner();
  // Add logic to reset the game or start a new game
}

function hideGameOverBanner() {
  document.getElementById('gameOverBanner').style.display = 'none';
  document.addEventListener('keydown', handleKeyDown);
}

// Example usage to trigger the game over screen
// Call showGameOverBanner() when the game is over and display the banner.
// Call playAgain() when the "Play Again" button is clicked.
