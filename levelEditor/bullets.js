const bullets = [];
const bulletsShotPerLocation = {};

const DIRECTION_ENUM = {
	"Right": [1, 0],
	"Left": [-1, 0],
	"Up": [0, -1],
	"Down": [0, 1],
};

function shootBullet(x, y, block) {
	let [_87, dirName, bullet, size, speed, max, _x, _y, _duration, _state, _timer] = block;
	const pos = x + "," + y;
	if ((bulletsShotPerLocation[pos] ?? 0) >= max) return;
	bulletsShotPerLocation[pos] ??= 0;
	bulletsShotPerLocation[pos]++;

	const dir = DIRECTION_ENUM[dirName];
	const offset = level[x][y][0] === 73 ? 0.25 : 0.5;

	bullets.push({
		x: x + offset + ((offset + size / baseBlockSize / 2) * dir[0]),
		y: y + offset + ((offset + size / baseBlockSize / 2) * dir[1]),
		size,
		vx: dir[0] * speed,
		vy: dir[1] * speed,
		bullet,
		origin: pos,
		lives: 0,
		invincibilityLeft: 0,
		invincibilityPerPierce: 0,
	});
}

function bulletTick(dt) {
	const deletionStack = [];
	for (const i in bullets) {
		const bullet = bullets[i];
		bullet.x += dt * bullet.vx / 1000 / 100;
		bullet.y += dt * bullet.vy / 1000 / 100;

		const x = bullet.x;
		const y = bullet.y;

		const radius = bullet.size / baseBlockSize / 2;

		// check block collision
		const topCorner = [Math.floor(x - radius), Math.floor(y - radius)];
		const bottomCorner = [Math.ceil(x + radius), Math.ceil(y + radius)];
		outer: for (let bx = topCorner[0]; bx <= bottomCorner[0]; bx++) for (let by = topCorner[1]; by <= bottomCorner[1]; by++) {
			const type = getBlockType(bx, by);
			const colType = bulletFields.includes(type) ? 2 : hasHitbox.includes(type) ? 1 : 0;
			if (colType === 0) continue;

			if (Math.max(0, Math.abs(bx + 0.5 - x) - 0.5) ** 2 + Math.max(0, Math.abs(by + 0.5 - y) - 0.5) ** 2 < radius ** 2) {
				if (colType === 1) {
					deletionStack.push(i);
					break outer;
				}

				const props = level[bx][by];
				switch (props[0]) {
					case 88:
						bullet.lives = props[1];
						bullet.invincibilityPerPierce = props[2];
				}
			}
		}

		if (bullet.invincibilityLeft > 0) {
			bullet.invincibilityLeft -= dt;
			continue;
		}

		// check player collision
		const px = player.x / baseBlockSize;
		const py = player.y / baseBlockSize;
		const sps = player.size / baseBlockSize / 2; // "semi-player size"

		if (Math.max(0, Math.abs(px + sps - x) - sps) ** 2 + Math.max(0, Math.abs(py + sps - y) - sps) ** 2 < radius ** 2) {
			bullet.lives--;
			bullet.invincibilityLeft = bullet.invincibilityPerPierce;
			let deleteBullet = false;
			if (bullet.lives < 0) deleteBullet = true;

			props = typeof bullet.bullet === "number" ? [bullet.bullet] : bullet.bullet;
			switch (props[0]) {
				case 2:
					player.shouldDie = true;
					break;
				case 6:
					player.xg = false;
					if (player.g > 0) player.g = -player.g;
					break;
				case 7:
					player.xg = false;
					if (player.g < 0) player.g = -player.g;
					break;
				case 59:
					player.xg = true;
					if (player.g > 0) player.g = -player.g;
					break;
				case 60:
					player.xg = true;
					if (player.g < 0) player.g = -player.g;
					break;
				case 8:
					player.g = Math.sign(player.g) * 170;
					break;
				case 9:
					player.g = Math.sign(player.g) * 325;
					break;
				case 10:
					player.g = Math.sign(player.g) * 650;
					break;
				case 48:
					player.g = props[1];
					player.xg = props[2];
					break;
				case 12:
					player.maxJumps = 0;
					player.currentJumps = player.maxJumps;
					break;
				case 13:
					player.maxJumps = 1;
					player.currentJumps = player.maxJumps;
					break;
				case 14:
					player.maxJumps = 2;
					player.currentJumps = player.maxJumps;
					break;
				case 15:
					player.maxJumps = 3;
					player.currentJumps = player.maxJumps;
					break;
				case 16:
					player.maxJumps = Infinity;
					player.currentJumps = player.maxJumps;
					break;
				case 49:
					player.maxJumps = props[1];
					player.currentJumps = player.maxJumps;
					break;
				case 21:
					player.moveSpeed = 300;
					break;
				case 22:
					player.moveSpeed = 600;
					break;
				case 23:
					player.moveSpeed = 1200;
					break;
				case 50:
					player.moveSpeed = props[1];
					break;
				case 64:
					player.targetSize = 10;
					break;
				case 65:
					player.targetSize = 20;
					break;
				case 66:
					player.targetSize = 40;
					break;
				case 67:
					player.targetSize = props[1];
					break;
				case 68:
					player.gameSpeed = 0.5;
					break;
				case 69:
					player.gameSpeed = 1;
					break;
				case 70:
					player.gameSpeed = 2;
					break;
				case 71:
					player.gameSpeed = props[1];
					break;
				default:
					console.log("Aghh you died to", bullet[4]);
					break;
			}

			if (deleteBullet && deletionStack[deletionStack.length - 1] !== i) deletionStack.push(i);
		}
	}

	while (deletionStack.length > 0) {
		bulletsShotPerLocation[bullets[deletionStack[deletionStack.length - 1]].origin]--;
		// this is ok and won't mess anything up with the indexes
		// since we start at the end of the list and later bullets are more to the right
		bullets.splice(deletionStack.pop(), 1);
	}
}

const bulletOptions = [
	2, 6, 7, 59, 60, 8, 9, 10, 48, 12, 13, 14, 15, 16, 49, 21, 22, 23, 50, 64, 65, 66, 67, 68, 69, 70, 71,
	"Basic", "Gravity", "Jumping", "Speed", "Size", "Time Speed",
];

const bulletFields = [88];

// resume at 31