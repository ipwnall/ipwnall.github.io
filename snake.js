/**
 * @license HTML5 experiment Snake
 * http://www.xarg.org/project/html5-snake/
 *
 * Copyright (c) 2011, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/
 
var xFoodPosition;
var yFoodPosition;
var highScore = new Array();
 		highScore['value'] = 0;
		highScore['time'] = 0;
		highScore['name'] = 'na';
var scoreList = new Array();
 
//preload images and declare sources here

var imgArray = new Array();

imgArray[0] = new Image(); imgArray[0].src = 'images/snakeface.png'; 
imgArray[1] = new Image(); imgArray[1].src = 'images/adderall.png';
imgArray[2] = new Image(); imgArray[2].src = 'images/chomping.gif';

imgArray[11] = new Image(); imgArray[11].src = 'images/chewing1.png';
imgArray[12] = new Image(); imgArray[12].src = 'images/chewing2.png';
imgArray[13] = new Image(); imgArray[13].src = 'images/chewing3.png';
imgArray[14] = new Image(); imgArray[14].src = 'images/chewing4.png';
imgArray[15] = new Image(); imgArray[15].src = 'images/chewing5.png';
imgArray[16] = new Image(); imgArray[16].src = 'images/chewing6.png';
imgArray[17] = new Image(); imgArray[17].src = 'images/chewing7.png';

imgArray.onload=function(){};

function init() {
	var ctx;
	var turn  = [];
	var xV = [-1, 0, 1, 0];
	var yV = [0, -1, 0, 1];
	var queue = [];
	var elements = 1;
	var map = [];
	var X = 5 + (Math.random() * (30 - 10))|0;
	var Y = 5 + (Math.random() * (30 - 10))|0;
	var direction = Math.random() * 3 | 0;
	var interval = 0;
	var score = 0;
	var inc_score = 50;
	var sum = 0, easy = 0;
	var i, dir, oldX, oldY;
	var snakecanvas = document.getElementById("snakecanvas");
	var imgCounter = 10;
	for (i = 0; i < 30; i++) {
		map[i] = [];
	}
	
	// this sets the size of snakecanvas, but only in appearance not the actual game objects
	snakecanvas.setAttribute('width', 30 * 25);
	snakecanvas.setAttribute('height', 30 * 25);
	ctx = snakecanvas.getContext('2d');
	//ctx.globalCompositeOperation='destination-over';



	
	
	

	function placeFood() {
		var x, y;
		do {
			x = Math.random() * 30|0;
			y = Math.random() * 30|0;
		} while (map[x][y]);
		map[x][y] = 1;
		//ctx.strokeRect(x * 25 + 1, y * 25 + 1, 25 - 2, 25 - 2);
		ctx.drawImage(imgArray[1], x * 25 + 1, y * 25 + 1);
	}
	
	placeFood();
	
	function clock() {
		if (easy) {
			X = (X+30)%30;
			Y = (Y+30)%30;
		}
		--inc_score;
		if (turn.length) {
			dir = turn.pop();
			if ((dir % 2) !== (direction % 2)) {
				direction = dir;
			}
		}
		if (
		(easy || (0 <= X && 0 <= Y && X < 30 && Y < 30))
			&& 2 !== map[X][Y]) {
			if (1 === map[X][Y]) {
				score+= Math.max(5, inc_score);
				inc_score = 50;
				placeFood();
				elements++;
				xFoodPosition = X * 25;
				yFoodPosition = Y * 25;
				explodebg();
			}
			
			//this is a trick to have animated icons without being able to use gifs.
			imgCounter++;
			ctx.drawImage(imgArray[imgCounter], X * 25, Y * 25);
			ctx.drawImage(imgArray[0], oldX * 25, oldY * 25);
			oldX = X;
			oldY = Y;
			
			
			map[X][Y] = 2;
			queue.unshift([X, Y]);
			X+= xV[direction];
			Y+= yV[direction];
			if (elements < queue.length) {
				dir = queue.pop()
				map[dir[0]][dir[1]] = 0;
				ctx.clearRect(dir[0] * 25, dir[1] * 25, 25, 25);
					if (dir[0]*25 == xFoodPosition && dir[1]*25 == yFoodPosition){
						xFoodPosition = -25;
						yFoodPosition = -25;
					} else {ctx.drawImage(imgArray[imgCounter], xFoodPosition, yFoodPosition)};
			}
			if (imgCounter == 17) {imgCounter = 10};
			
		} else if (!turn.length) {
			highScore['value'] = score;
			highScore['time'] = Math.round(+new Date()/1000);
			highScore['name'] = 'Michael';
			if (highScore['value'] > 20){saveToFirebase(highScore);}
			if (confirm("You lost! Play again? Your Score is " + highScore['value'])) {
				
				
				
				ctx.clearRect(0, 0, 1000, 1000);
				queue = [];
				elements = 1;
				map = [];
				//i'm not sure about that second value in (30 - x) but it may need to match size of image
				X = 5 + (Math.random() * (30 - 10))|0;
				Y = 5 + (Math.random() * (30 - 10))|0;
				direction = Math.random() * 3 | 0;
				score = 0;
				inc_score = 50;
				xFoodPosition = -25; yFoodPosition = -25;
				oldX = -25; oldY = -25;
				imgCounter = 10;
				
				for (i = 0; i < 30; i++) {
					map[i] = [];
				}
				placeFood();
			} else {
				window.clearInterval(interval);
			}
		}
	}
	interval = window.setInterval(clock, 100);
	document.onkeydown = function(e) {
		var code = e.keyCode - 37;
		/*
		 * 0: left
		 * 1: up
		 * 2: right
		 * 3: down
		 **/
		if (0 <= code && code < 4 && code !== turn[0]) {
			turn.unshift(code);
		} else if (-5 == code) {
			if (interval) {
				window.clearInterval(interval);
				interval = null;
			} else {
				interval = window.setInterval(clock, 60);
			}
		} else { // O.o
			dir = sum + code;
			if (dir == 44||dir==94||dir==126||dir==171) {
				sum+= code
			} else if (dir === 218) easy = 1;
		}
	}
	
}