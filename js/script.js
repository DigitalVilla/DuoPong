var canvas = document.getElementById('myCanvas');
var ctx =canvas.getContext('2d');

//Canvas Size
var Width = 720, Height = 640;
canvas.setAttribute('width', String(Width));
canvas.setAttribute('height', String(Height));

//Ball settings and position
var ballRadius = 10;
var color="#ee4d92";
var x = canvas.width/2;
var y = canvas.height-13;

var score = 0;
var bBreak = 0;
var lifes = 3;
// Speed translation
var v=3; //change this value
var values = [[v,-v],[-v,v],[v,v],[-v,-v]];
var r = Math.floor(Math.random()*4);
var dx = values[r][0]
var dy =	values[r][1]
console.log(r);

// Paddle 1 & 2 on X
var pXHeight = 8;
var pXWidth = 80;
var pX = (canvas.width-pXWidth)/2;

// Paddle 3 & 4 on Y
var pYHeight = 75;
var pYWidth = 8;
var pY = (canvas.height-pYHeight)/2;

// conditionals for keys
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;

// Brick wall (brickW  * wallCols) wallCols OffsetLeft
var wallRows =5;
var wallCols = 6;
var brickW = 60;
var brickH = 20;
var padding = 15;
var wallHeight = brickH*wallRows+(padding*wallRows-padding); 
var wallWidth = brickW*wallCols+(padding*wallCols-padding); 
var OffsetTop = Math.round((Height-wallHeight)/2);
var OffsetLeft = Math.round((Width-wallWidth)/2);

//Set controls 
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.keyCode == 39) {
       rightPressed = true;
    } else if(e.keyCode == 37) {
       leftPressed = true;
    } else if (e.keyCode == 38) { 
		 upPressed = true;
	 } else if (e.keyCode == 40) {
		 downPressed = true;
	 }
};

function keyUpHandler(e) {
    if (e.keyCode == 39) {
       rightPressed = false;
    } else if(e.keyCode == 37) {
       leftPressed = false;
    } else if (e.keyCode == 38) { 
		 upPressed = false;
	 } else if (e.keyCode == 40) {
		 downPressed = false;
	 }
};

// Wall's array = (c) columns and (r) rows
var Wall = [];
for(c=0; c <wallCols; c++) {
    Wall[c] = [];
    for(r=0; r<wallRows; r++) {
        Wall[c][r] = { x: 0, y: 0, status: 1 };
    }
};

// Loop to draw brics
function drawBricks() {
    for(c=0; c<wallCols; c++) {
        for(r=0; r<wallRows; r++) {
            if (Wall[c][r].status == 1) {
					var brickX = (c*(brickW+padding))+OffsetLeft;
					var brickY = (r*(brickH+padding))+OffsetTop;
					Wall[c][r].x = brickX;
					Wall[c][r].y = brickY;
						
					ctx.beginPath();
					ctx.rect(brickX, brickY, brickW, brickH);
					ctx.fillStyle = '#0189CB';
					if (c==0) {
						ctx.fillStyle = '#019BE6';
					} else if (c==2) {
						ctx.fillStyle = '#03A7F7';
					} else if (c==4) {
						ctx.fillStyle = '#00a2df';
					}
					ctx.fill();
					ctx.closePath();
				}
        }
    }
};

 function drawBall (c) {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle =  c;
	ctx.fill();
	ctx.closePath();
};
	
function drawPaddle1() {
	ctx.beginPath();
	ctx.rect(pX, canvas.height-pXHeight, pXWidth, pXHeight);
	ctx.fillStyle = "#ee4d92";
	ctx.fill();
	ctx.closePath();
};

function drawPaddle2() {
	ctx.beginPath();
	ctx.rect(pX, 0, pXWidth, pXHeight);
	ctx.fillStyle = "#ee4d92";
	ctx.fill();
	ctx.closePath();
};

function drawPaddle3() {
	ctx.beginPath();
	ctx.rect(0, pY, pYWidth, pYHeight);
	ctx.fillStyle = "#ee4d92";
	ctx.fill();
	ctx.closePath();
};

function drawPaddle4() {
	ctx.beginPath();
	ctx.rect(canvas.width-pYWidth,  pY, pYWidth, pYHeight);
	ctx.fillStyle = "#ee4d92";
	ctx.fill();
	ctx.closePath();
};

//Draw score
function drawScore() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 20, 32);
}

//Draw Lifes
function drawLifes() {
    ctx.font = "20px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lifes:"+lifes, 600, 32);
}

//Add Drawings to Canvas
initDraw();
function initDraw() {
	drawPaddle1();
	drawPaddle2();
	drawPaddle3();
	drawPaddle4();
	drawBricks();
	drawScore();
	drawLifes();
	drawBall (color);
};

//Collision Detection
function collisionDetection() {
	for(c=0; c<wallCols; c++) {
		for(r=0; r<wallRows; r++) {
		var b = Wall[c][r];
		if (b.status == 1) {
			if(x > b.x-5 && x < b.x+brickW+5 && y > b.y-5 && y < b.y+brickH+5) {
				// debugger;
				if (x < b.x || x > b.x+brickW) {
						dx =-dx;
				} else if (y < b.y || y > b.y+brickH ) {
						dy = -dy;
				}
				bBreak++;
				if (bBreak <= Math.floor(wallRows*wallCols*1) ) {
						
					b.status = 0;
				};
				score+=10;
					// color == "#ee4d92"? color ="#0095DD":color ="#ee4d92";
					if (bBreak === wallRows*wallCols) {
					setTimeout( function () {
						alert("CONGRATULATIONS ***!");
						document.location.reload();
						}, 100);
					}
				}
			}
		}
	}
};


function paddleLogic () {
	// Paddle X Logic 
	if (rightPressed && pX < canvas.width-pXWidth) {
		 pX += 12;
	} else if(leftPressed && pX > 0) {
		 pX -= 12;
	}

	// Paddle Y Logic 
	if (upPressed && pY > 0) {
		 pY -= 10;
	} else if(downPressed && pY < canvas.height-pYHeight) {
		 pY += 10;
	}
	
	x += dx;
	y += dy;
};

function ballLogic () {
	if (x + dx > canvas.width-ballRadius+2 || x + dx < ballRadius-2) {
		if (y > pY-10 && y < pY + pYHeight +10) { //Hits Paddle
			dx = -dx;
			score += 5;
			color="#ee4d92";
		} else { //Hits field
			dx = -dx;
			color="#0095DD";
			score -= 10;
			lifes--;
			if (lifes <= 0) {
				alert("GAME OVER");
			  document.location.reload();
			}
		}	
	};
				
	if (y + dy < ballRadius-2 || y + dy > canvas.height-ballRadius+2) {
		if (x > pX-10 && x < pX + pXWidth +10) { //Hits Paddle
			dy = -dy;
			score += 5;
			color="#ee4d92";
			
		} else { //Hits field
			dy = -dy;
			score -= 10;
			color="#0095DD";
			lifes--;
			if (lifes <= 0) {
				alert("GAME OVER");
			  document.location.reload();
			}
		};		
	};
};


// Game Starter	
document.addEventListener('keypress', function (e) {
	if (e.keyCode === 13) {
		// setInterval(gameUpdate,20);
		gameUpdate();
	}
});

function gameUpdate() {
	//Erase old frames
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//Draw canvas
	initDraw();
	// Brick, Ball & Paddle logic
	ballLogic ();
	paddleLogic ();
	collisionDetection();
	requestAnimationFrame(gameUpdate);
};
