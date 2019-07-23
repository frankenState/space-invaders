var MIDC = 'MID_CURSOR';

var monsters = [];
var bullets = [];

window.onload = (e) => {
	console.log('loaded!');



	monsters.push(new Monster());
	monsters.push(new Monster(300, 8));

	$('spaceship').style.top = (parse($('space').style.height) * 0.8) + 'px';
	$('spaceship').style.left = (parse($('space').style.width) * 0.47) + 'px';
	

	$('space').onmousemove = (e) => {
		let spaceship = $('spaceship');
		let spaceX = parse($('space').style.width);
		let spaceSX = $('space').offsetLeft;
		let spaceY = parse($('space').style.height);
		let spaceSY = $('space').offsetTop;
	
		let yOverlap = (e.clientY + (spaceship.height / 2.8 )) > spaceY;
		let xOverlap = (e.clientX + (spaceship.width / 2.8 )) > spaceX;	
		let xSOverlap = e.clientX - (spaceship.height / 2 ) < spaceSX;
		let ySOverlap = e.clientY - (spaceship.width / 2 ) < spaceSY;
	
		if (!yOverlap && !ySOverlap)
			spaceship.style.top = calc(MIDC, e.clientY, spaceship.height ) + 'px';
		
		if (!xOverlap && !xSOverlap)
		spaceship.style.left = calc(MIDC, e.clientX, spaceship.width ) + 'px';
	
		
	}

	$('spaceship').onclick = (e) => {
		let bullet = new Bullet(
			e.clientX - (parse($('spaceship').style.width) * 0.09),
			e.clientY - (parse($('spaceship').style.height) * 0.5)
		);
	}
}

const bullet = (x,y) => {
	var div = document.createElement('div');
	div.style.position = 'absolute';
	div.style.top = y + 'px';
	div.style.left = x + 'px';
	div.style.width = '7px';
	div.style.height = '7px';
	div.style.backgroundColor = '#fc3030';
	div.style.borderRadius = '10px';
	$('space').appendChild(div);
	bulletAccelerate(div);
}

const bulletAccelerate = (bullet) => {
	let speed = 10;

	bullet.style.top = (bullet.offsetTop - 10) + 'px';
	//console.log(bullet);
	requestAnimationFrame(() => bulletAccelerate(bullet));
}
// --- MONSTER CLASS -- //
class Monster {
	constructor(
		x = 8, 
		y = 10, 
		width = 100, 
		height = 100, 
		url = 'img/monster.png', 
		life = 100
	) {
		this.x = x;
		this.y = y;
		this.url = url;
		this.life = life;
		var monster = document.createElement('img');
		monster.style.position = 'absolute';
		monster.style.top = y + 'px';
		monster.style.left = x + 'px';
		monster.style.width = width + 'px';
		monster.style.height = height + 'px';
		monster.src = url;
		$('space').appendChild(monster);
		this.monster = monster;
		this.toEast = true;
		this.animateMonster();
		this.spaceshipDestroyed = false;
	}

	animateMonster() {
		let startX = $('space').offsetLeft;
		let endX = 400;
		let startY = $('space').offsetTop;
		let endY = 600;
		let width = 100;
		let height = 100;

		let xSpeed = 2;
		let ySpeed = 2;

		let monsterX = this.getOffsetX();
		let monsterY = this.getOffsetY();
		
		if ((monsterX + width) > (startX + endX))
			this.toEast = false;
		else if (monsterX < startX && !this.toEast) 
			this.toEast = true;

		if (this.toEast){
			this.setLeft(monsterX + xSpeed);
		} else {
			this.setLeft(monsterX - xSpeed);
		}
		let spaceship = $('spaceship');
		// check for spaceship collision
		if (!this.spaceshipDestroyed && spaceship !== null){
			
			let sSX = spaceship.offsetLeft,
				sEX = sSX + parse(spaceship.style.width),
				sSY = spaceship.offsetTop,
				sEY = sSY + parse(spaceship.style.height);

			//console.log({sSY,sEX,sSY,sEY});
			let mSX = this.getOffsetX(),
				mEX = mSX + parse(this.getWidth()),
				mSY = this.getOffsetY(),
				mEY = mSY + parse(this.getHeight());

			if (sSX >= mSX && sEX <= mEX){
				if (mEY >= sSY){
					this.spaceshipDestroyed = true;
					$('space').onmousemove = null;
					$('space').removeChild(spaceship);
					console.log('Spaceshipt destroyed, game over! :( ');

				}
			}
		}


		this.animate = requestAnimationFrame(() => this.animateMonster());
		if (this.life < 1) {
			cancelAnimationFrame(this.animate);
			$('space').removeChild(this.monster);
		}
	}

	setDamage(damage) {
		this.life -= damage;
	}

	setTop(y) {
		this.monster.style.top = y + 'px';
	}

	setLeft(x) {
		this.monster.style.left = x + 'px';
	}

	getOffsetY() {
		return this.monster.offsetTop;
	}

	getOffsetX() {
		return this.monster.offsetLeft;
	}

	getHeight() {
		return this.monster.style.height;
	}

	getWidth() {
		return this.monster.style.width;
	}

	getLife() {
		return this.life;
	}


}

// --- BULLET CLASS --- //

class Bullet {

	constructor(x,y, speed = 7, damage = 10) {
		var div = document.createElement('div');
		div.style.position = 'absolute';
		div.style.top = y + 'px';
		div.style.left = x + 'px';
		div.style.width = '7px';
		div.style.height = '7px';
		div.style.backgroundColor = this.color();
		div.style.borderRadius = '10px';
		$('space').appendChild(div);

		this.bullet = div;
		this.speed = speed;
		this.damage = damage;
		this.isCollided = false;
		this.accelerateBullet();
	}

	color() {
		return `rgb(${Math.random()*254},${Math.random()*254},${Math.random()*254})`;
	}

	accelerateBullet() {
		
		this.setTop( this.getOffsetY() - this.speed);

		// check for collisions 
		monsters.forEach( (monster,i) => {
			let mSX = monster.getOffsetX(),
				mEX = monster.getOffsetX() + parse(monster.getWidth()),
				mSY = monster.getOffsetY(),
				mEY = monster.getOffsetY() + parse(monster.getHeight());

			let bSX = this.getOffsetX(),
				bEX = this.getOffsetX() + parse(this.getX()),
				bSY = this.getOffsetY(),
				bEY = this.getOffsetY() + parse(this.getY());

			if ((mSX <= bSX && mEX >= bEX)){
				if (mEY >= bSY) {
					if (monster.getLife() > 0) {
						monster.setDamage(this.getDamage());
						console.log('Monster Life => ', monster.getLife());
						this.isCollided = true;

						if (monster.getLife() <= 0) {
							monsters = monsters.filter((e,j) => j !== i);
							if (monsters.length === 0)
								console.log('You win!');
						}
					} 
				}
			}

		})

		this.animate = requestAnimationFrame(() => this.accelerateBullet());
		if (this.getOffsetY() < 0 || this.isCollided) {
			cancelAnimationFrame(this.animate);
			$('space').removeChild(this.bullet);
		}

	}


	setTop(y) {
		this.bullet.style.top = y + 'px';
	}

	getOffsetY() {
		return this.bullet.offsetTop;
	}

	getOffsetX() {
		return this.bullet.offsetLeft;
	}

	getX() {
		return this.bullet.style.width;
	}

	getY() {
		return this.bullet.style.height;
	}

	getDamage() {
		return this.damage;
	}

}

const parse = (n) => parseFloat(n.toString().indexOf('px') > -1 ? n.substring(0, n.indexOf('px')) : n);

const calc = (type, value, value1 = 0) => {
	const clean = parse(value);
	const clean1 = parse(value1);

	switch (type){
		case MIDC:
			return ( value - (value1 / 2));
		default:
			return clean;
	}
}

const $ = (id) => {
	return document.getElementById(id);
}