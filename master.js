window.requestAnimFrame = (function() {
	console.log("requestAnimFrame");
	return (window.requestAnimationFrame		||
		window.webkitRequestAnimationFrame		||
		window.mozRequestAnimationFrame		||
		window.oRequestAnimationFrame			||
		window.msRequestAnimationFrame		||
	function (callback) {
		return window.setTimeout(callback , 1000 / 30);
	});
})();
window.cancelAnimFrame = (function() {
	console.log("cancelAnimFrame");
	return (window.cancelAnimationFrame 		||
		window.webkitCancelAnimationFrame 		||
		window.mozCancelAnimationFrame 		||
		window.oCancelAnimationFrame 			||
		window.msCancelAnimationFrame 		||
		clearTimeout);
})();

let 	canvas = document.getElementById('canvas'),
	ctx = canvas.getContext('2d'),
	H = 600,
	W = 800,
	restartBtn = {},
	background = {},
	mouse = {},
	ball = {},
	paddle = {},
	traject = {},
	particule = {},
	brick = {},
	speed = 0,
	lvl = 0,
	life = true,
	score = 0,
	over = false;

canvas.addEventListener("mousemove", trackPosition, true);
function trackPosition(event) {
	mouse.x = event.pageX;
	mouse.y = event.pageY;
	if(!ball.move) {
		if(!(traject.a >= -1.963495408193604 && traject.a <= 1.963495408193604)) traject.calc();
	}
};
canvas.addEventListener("mousedown", click, true);
function click(event) {
	mouse.x = event.pageX;
	mouse.y = event.pageY;
	if(over) {
		if((mouse.x >= restartBtn.x && mouse.x <= restartBtn.x + restartBtn.w)
		&& (mouse.y >= restartBtn.y && mouse.y <= restartBtn.y + restartBtn.h)) {
			init();
		}
	} else {
		if(!ball.move) ball.move = true;
	}
};

window.onkeydown = KeyDown;
window.onkeyup = KeyUp;

canvas.height = H;
canvas.width = W;

/** TRAJECTORY **/
traject = {
	line: [
		{x: [0, 0], y: [0, 0], dx: 0, dy: 0},
		{x: [0, 0], y: [0, 0], dx: 0, dy: 0}
	],
	l: 4, i: 5, a: 0,
	draw: function() {
		ctx.save();
		ctx.setLineDash([3,5]);
		ctx.shadowColor = "blue";
		ctx.shadowBlur = 30;
		ctx.strokeStyle = "#fff";
		
		for(let i = 0; i < 2; i++) {
			ctx.beginPath();
			ctx.moveTo(this.line[i].x[0], this.line[i].y[0]);
			ctx.lineTo(this.line[i].x[1], this.line[i].y[1]);
			ctx.stroke();
			ctx.closePath();
		}
		ctx.restore();
	},
	calc: function() {
		this.line[0].x[1] = this.line[0].x[0];
		this.line[0].y[1] = this.line[0].y[0];
		ball.dx = Math.sin(this.a) * ball.speed;
		ball.dy = Math.cos(this.a) * ball.speed;
		this.line[0].dx = Math.sin(this.a) * ball.speed;
		this.line[0].dy = Math.cos(this.a) * ball.speed;
		while(!collide(this.line[0])) {
			this.line[0].x[1] += this.line[0].dx;
			this.line[0].y[1] += this.line[0].dy;
		}
		this.line[1].x[0] = this.line[0].x[1];
		this.line[1].y[0] = this.line[0].y[1];
		this.line[1].x[1] = this.line[1].x[0];
		this.line[1].y[1] = this.line[1].y[0];
		this.line[1].dx = this.line[0].dx;
		this.line[1].dy = this.line[0].dy;
		while(!collide(this.line[1])) {
			this.line[1].x[1] += this.line[1].dx;
			this.line[1].y[1] += this.line[1].dy;
		}
	}
};
/** BALL **/
ball = {
	x: 400, y: paddle.y, wh: 10,
	dx: 0, dy: 0, a: 0, speed: 10, move: false,
	collide: {up: false, down: false, right: false, left: false},
	draw: function() {
		ctx.beginPath();
		ctx.fillStyle = "#fff";
		ctx.shadowColor = "blue";
		ctx.shadowBlur = 30;
		ctx.arc(this.x, this.y, this.wh, 0, (Math.PI * 2), false);
		ctx.fill();
		ctx.closePath();
	},
};
/** PARTICULES **/
particule = {
	count: 20, tab: [],
	draw: function() {
		for(let i = 0; this.tab[i]; i++) {
			ctx.save();
			ctx.fillStyle = "#fff";
			ctx.shadowColor = "red";
			ctx.shadowBlur = 30;
			if(this.tab[i].a > 0) ctx.arc(this.tab[i].x, this.tab[i].y, this.tab[i].a, 0, (Math.PI * 2), false);
			ctx.restore();
			this.tab[i].x = this.tab[i].vx;
			this.tab[i].y = this.tab[i].vy;
			this.tab[i].a = Math.max(this.tab[i].a - 0.05, 0.0);
		}
	}
};
/** BACKGROUND **/
background = {
	stars: [],
	mediumStars: [],
	bigStars: [],
	w: 800, h: 600, x: 0, y:0, tmp: 0,
	draw: function() {
		ctx.beginPath();
		ctx.fillStyle = "#000";
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.fillStyle = "#fff";
		let i = 0, a, b;
	 	for(let i = 0; i < 300; i++)
			ctx.fillRect(this.stars[i].x, this.stars[i].y, 1, 1);
		for(let i = 20; i < 70; i++)
			ctx.fillRect(this.stars[i].x, this.stars[i].y, 2, 2);
		for(let i = 0; i < 20; i++)
			ctx.fillRect(this.stars[i].x, this.stars[i].y, 3, 3);
		for(let i = 0; this.mediumStars[i]; i++) {
			ctx.fillRect((this.mediumStars[i].x - 1), (this.mediumStars[i].y - 1), 3, 3);
			ctx.fillRect(this.mediumStars[i].x, (this.mediumStars[i].y - 4), 1, 9);
			ctx.fillRect((this.mediumStars[i].x - 2), this.mediumStars[i].y, 5, 1);
		}
		for(let i = 0; this.bigStars[i]; i++) {
			ctx.fillRect((this.bigStars[i].x - 1), (this.bigStars[i].y - 2), 3, 5);
			ctx.fillRect(this.bigStars[i].x, (this.bigStars[i].y - 5), 1, 11);
			ctx.fillRect((this.bigStars[i].x - 4), this.bigStars[i].y, 9, 1);
		}
		ctx.closePath();
	},
	createStars: function() {
		for(let i = 0; i < 300; i++)
			this.stars.push({x: Math.floor(Math.random() * Math.floor(W)), y: Math.floor(Math.random() * Math.floor(H))});
	},
	createSpecial: function() {
		this.mediumStars = [];
		this.bigStars = [];
		for(let i = 0; i < 2; i++) {
			let tmp = Math.floor(Math.random() * Math.floor(300));
			this.mediumStars.push({x: this.stars[tmp].x, y: this.stars[tmp].y});
		}
		for(let i = 0; i < 2; i++) {
			let tmp = Math.floor(Math.random() * Math.floor(300));
			this.bigStars.push({x: this.stars[tmp].x, y: this.stars[tmp].y});
		}
	}
};
/** RESTART **/
restartBtn = {
	w: 100, h: 50, x: (W / 2 - 50), y: (H / 2 - 50),
	draw: function() {
		ctx.save();
		ctx.strokeStyle = "#fff";
		ctx.lineWidth = "2";
		ctx.strokeRect(this.x, this.y, this.w, this.h);
		ctx.font = "20px arial,sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillStlye = "#fff";
		ctx.fillText("Restart", (W / 2), (H / 2 - 25));
		ctx.restore();
	}
};
/** PADDLE **/
paddle = {
	x: (W / 2 - 75), y: (H - 20), w: 150, h: 10, speed: 10,
	direction: {left: false, right: false},
	draw: function() {
		ctx.beginPath();
		ctx.fillStyle = "#fff";
		ctx.shadowColor = 'blue';
		ctx.shadowBlur = 30;
		ctx.fillStyle = "#fff";
		ctx.fillRect(this.x, this.y, this.w, this.h);
		ctx.closePath();
	}
};
/** BRICK **/
brick = {
	w: 115, h: 20, element: [
		[
			{x: 30, y: 30, pv: 100}, {x: 155, y: 30, pv: 100},
			{x: 280, y: 30, pv: 100}, {x: 405, y: 30, pv: 100},
			{x: 530, y: 30, pv: 100}, {x: 655, y: 30, pv: 100},
			{x: 30, y: 60, pv: 100}, {x: 155, y: 60, pv: 100},
			{x: 280, y: 60, pv: 100}, {x: 405, y: 60, pv: 100},
			{x: 530, y: 60, pv: 100}, {x: 655, y: 60, pv: 100},
			{x: 30, y: 90, pv: 100}, {x: 155, y: 90, pv: 100},
			{x: 280, y: 90, pv: 100}, {x: 405, y: 90, pv: 100},
			{x: 530, y: 90, pv: 100}, {x: 655, y: 90, pv: 100},
			{x: 30, y: 120, pv: 100}, {x: 155, y: 120, pv: 100},
			{x: 280, y: 120, pv: 100}, {x: 405, y: 120, pv: 100},
			{x: 530, y: 120, pv: 100}, {x: 655, y: 120, pv: 100}
		], [
			{x: 30, y: 30, t: 1}, {x: 405, y: 30, t: 2},
			{x: 655, y: 30, t: 1}, {x: 30, y: 60, t: 1},
			{x: 280, y: 60, t: 1}, {x: 655, y: 60, t: 1},
			{x: 155, y: 90, t: 2}, {x: 280, y: 120, t: 1},
			{x: 405, y: 120, t: 1}, {x: 530, y: 150, t: 2},
			{x: 30, y: 180, t: 1}, {x: 405, y: 180, t: 1},
			{x: 655, y: 180, t: 1}, {x: 30, y: 210, t: 2},
			{x: 280, y: 210, t: 2}, {x: 655, y: 210, t: 2}
		], [
			{x: 30, y: 30, t: 2}, {x: 280, y: 30, t: 2},
			{x: 405, y: 30, t: 2}, {x: 655, y: 30, t: 2},
			{x: 155, y: 60, t: 2}, {x: 530, y: 60, t: 2},
			{x: 30, y: 90, t: 1}, {x: 655, y: 90, t: 1},
			{x: 30, y: 120, t: 1}, {x: 655, y: 120, t: 1},
			{x: 30, y: 150, t: 2}, {x: 155, y: 150, t: 1},
			{x: 280, y: 150, t: 2}, {x: 405, y: 150, t: 2},
			{x: 530, y: 150, t: 1}, {x: 655, y: 150, t: 2},
			{x: 30, y: 180, t: 1}, {x: 280, y: 180, t: 1},
			{x: 405, y: 180, t: 1}, {x: 655, y: 180, t: 1}
		], [
			{x: 30, y: 30, t: 2}, {x: 155, y: 30, t: 1},
			{x: 280, y: 30, t: 1}, {x: 405, y: 30, t: 1},
			{x: 530, y: 30, t: 1}, {x: 655, y: 30, t: 2},
			{x: 30, y: 60, t: 1}, {x: 155, y: 60, t: 2},
			{x: 530, y: 60, t: 2}, {x: 655, y: 60, t: 1},
			{x: 30, y: 90, t: 1}, {x: 280, y: 90, t: 2},
			{x: 405, y: 90, t: 2}, {x: 655, y: 90, t: 1},
			{x: 30, y: 120, t: 1}, {x: 280, y: 120, t: 2},
			{x: 405, y: 120, t: 2}, {x: 655, y: 120, t: 1},
			{x: 30, y: 150, t: 1}, {x: 155, y: 150, t: 2},
			{x: 530, y: 150, t: 2}, {x: 655, y: 150, t: 1},
			{x: 30, y: 180, t: 2}, {x: 155, y: 180, t: 1},
			{x: 280, y: 180, t: 1}, {x: 405, y: 180, t: 1},
			{x: 530, y: 180, t: 1}, {x: 655, y: 180, t: 2},

		]
	],
	draw: function() { 
		ctx.beginPath();
		ctx.shadowColor = 'red';
		ctx.shadowBlur = 30;
		for(let i = 0; this.element[lvl][i]; i++) {
			if(this.element[lvl][i].pv == 100) {
				ctx.fillStyle = "#fff";
				ctx.fillRect(this.element[lvl][i].x, this.element[lvl][i].y, this.w, this.h);
			}
			if(this.element[lvl][i].pv == 200) {
				ctx.strokeStyle = "#fff";
				ctx.lineWidth = "2";
				ctx.strokeRect(this.element[lvl][i].x, this.element[lvl][i].y, this.w, this.h);
			}
		}
		ctx.closePath();
	}
};

function init() {
	over = false;
	for(let a = 0; brick.element[a]; a++) {
		for(let b = 0; brick.element[a][b]; b++) {
			if(brick.element[a][b].t == 1) Object.assign(brick.element[a][b],{pv: 100});
			if(brick.element[a][b].t == 2) Object.assign(brick.element[a][b],{pv: 200});
		}
	}
	ball.speed = 10;
	ball.move = false;
	lvl = 1;
	score = 0;
	life = true;
	paddle.x = (W / 2) - (paddle.w / 2);
	paddle.direction.left = false;
	paddle.direction.right = false;
};
function draw() {
	background.draw();
	brick.draw();
	if(!ball.move) traject.draw();
	paddle.draw();
	ball.draw();
	update();
};
function update() {
	if(!life) gameOver();
	else {
		let lvlComplete = true;
		if(!ball.move) {
			ball.x = (paddle.x + (paddle.w / 2)) - (ball.wh / 2);
			ball.y = paddle.y - (paddle.h * 2);
			if(mouse.x && mouse.y) {
				traject.line[0].x[0] = ball.x;
				traject.line[0].y[0] = ball.y;
				traject.a = Math.atan2(mouse.x - traject.line[0].x[0], mouse.y - traject.line[0].y[0]);
				if(!(traject.a >= -1.963495408193604 && traject.a <= 1.963495408193604)) traject.calc();
			}
		} else {
			if(collide(ball)) {
				ball.a =  Math.atan2(ball.y + ball.dy, ball.x + ball.dx);
				console.log(ball.a);
				//for(let i = 0; i != particule.count; i++)
				//	particule.tab[i].push({x: ball.x, y: ball.y, a: ball.a, speed: 0});
			}
			ball.x += ball.dx;
			ball.y += ball.dy;
		}
		if(background.tmp == 40) {
			background.createSpecial();
			background.tmp = 0;
		} else background.tmp++;
		if(paddle.direction.left && paddle.x > 0) paddle.x -= (paddle.speed);
		if(paddle.direction.right && paddle.x + paddle.w < W) paddle.x += (paddle.speed);
		for(let i = 0; brick.element[lvl][i]; i++) {
			if(brick.element[lvl][i].pv != 0) {
				lvlComplete =  false;
				break;
			}
		}
		if(lvlComplete) {
			ball.speed += 2;
			lvl++;
			ball.move =  false;
		}
		updateScore();
	}
};

function updateScore() {
	score = 0;
	for(let a = 0; brick.element[a]; a++) {
		for(let b = 0; brick.element[a][b]; b++) {
			if(brick.element[a][b].pv == 0) {
				if(brick.element[a][b].t == 1) score += 10;
				if(brick.element[a][b].t == 2) score += 20;
			}
		}
	}
	ctx.save();
	ctx.fillStyle = "#fff";
	ctx.font = "20px 'btn',arial,sans-serif";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Score: " + score, 20, 550 );
	ctx.restore();
};

function collide(a) {
	let aX, aY, aW, aH,
		bX, bY, bW, bH,
		up = false,
		down = false,
		left = false,
		right = false,
		dx = a.dx,
		dy = a.dy;
	if(a == ball) {
		aX = a.x;
		aY = a.y;
		aW = a.wh;
		aH = a.wh;
	} else {
		aX = a.x[1];
		aY = a.y[1];
		aW = 1;
		aH = 1;
	}
	if((aX + dx > W - aW) || (aX + dx < aW)) {
		a.dx = -dx;
		return true;	
	}
	if((aY + dy < aH) || (aY > paddle.y - aH && ((aX < paddle.x + paddle.w) && (aX + aW > paddle.x)))) {
		a.dy = -dy;
		return true;
	}
	if(aY + dy > H) {
		if(a == ball) life = 0;
		return true;
	}
	for(let i = 0; brick.element[lvl][i]; i++) {
		bX = brick.element[lvl][i].x;
		bY = brick.element[lvl][i].y;
		bW = brick.w;
		bH = brick.h;
		if(brick.element[lvl][i].pv) {
			if((aX >= bX) && (aX <= (bX + bW)) || (((aX + aW) >= bX) && (aX <= bX))) {
				if((aY >= (bY + (bH + dy))) && (aY <= (bY + bH))) up = true;
				if(((aY + aH) >= bY) && ((aY + aH) <= (bY + dy))) down = true;
			}
			if((aY >= bY) && (aY <= (bY + bH)) || (((aY + aH) >= bY) && (aY <= bY))) {
				if((aX >= (bX + (bW + dx))) && (aX <= (bX + bW))) left = true;
				if(((aX + aW) >= bX) && ((aX + aW) <= (bX + dx))) right = true;
			}
			if(up || down || right || left) {
				if(up || down) a.dy = -dy;
				if(right || left) a.dx = -dx;
				if(a == ball) brick.element[lvl][i].pv -= 100;
				return true;
			}
		}
	}
	return false;
};

function animLoop() {
	setTimeout(function() {
		requestAnimFrame(animLoop);
	}, 1000 / 60);
	draw();
};

function gameOver() {
	ctx.save();
	ctx.font = "20px 'over',arial,sans-serif";
	ctx.textAlign = "center";
	ctx.textBaseligne = "middle";
	ctx.fillStyle = "#fff";
	ctx.shadowColor = "red";
	ctx.fillText("GAME OVER - You scored " + score + " points !", (W / 2), (H / 2 + 25));
	ctx.restore();
	restartBtn.draw();
	over = true;
};

background.createStars();
init();
animLoop();

KEY_LEFT	= 37;
KEY_RIGHT	= 39;
KEY_Q		= 81;
KEY_D		= 68;

function CheckEvent(event) {
	if (window.event) return window.event;
	else return event;
};
function KeyDown(event) {
	let WinObject = CheckEvent(event);
	let key = WinObject.keyCode;
	if (life) {
		if (key == KEY_RIGHT || key == KEY_D) paddle.direction.right = true;
		if (key == KEY_LEFT || key == KEY_Q) paddle.direction.left = true;
	}
};
function KeyUp(event) {
	let WinObject = CheckEvent(event);
	let key = WinObject.keyCode;
	if (life) {
		if (key == KEY_RIGHT || key == KEY_D) paddle.direction.right = false;
		if (key == KEY_LEFT || key == KEY_Q) paddle.direction.left = false;
	}
};
