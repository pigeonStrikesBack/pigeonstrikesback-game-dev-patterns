// Flyweight Object - BulletType
class BulletType {
  constructor(textureKey, tint) {
      this.textureKey = textureKey;
      this.tint = tint;
  }

  createBullet(scene, x, y, angle) {
      const sprite = scene.add.sprite(x, y, this.textureKey);
      sprite.rotation = angle;
      sprite.setScale(0.5);
      sprite.setTint(this.tint);
      return sprite;
  }
}

// Bullet instance
class Bullet {
  constructor(x, y, angle, bulletType, scene) {
      this.x = x;
      this.y = y;
      this.angle = angle;
      this.speed = 6;
      this.bulletType = bulletType;
      this.sprite = this.bulletType.createBullet(scene, x, y, angle);
  }

  update() {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.sprite.x = this.x;
      this.sprite.y = this.y;
  }

  isOutOfBounds(width, height) {
      return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }

  destroy() {
      this.sprite.destroy();
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#222',
  parent: 'canvas-container',
  scene: {
      preload: function () {
          this.load.image('bullet', 'assets/bullet.png');
          this.load.image('player', 'assets/player.png');
      },

      create: function () {
          this.player = this.add.sprite(400, 300, 'player').setScale(0.7);
          this.bullets = [];

          this.bulletTypes = [
              new BulletType('bullet', 0xff0000), // red
              new BulletType('bullet', 0x00ff00), // green
              new BulletType('bullet', 0x0000ff), // blue
          ];

          this.currentBulletTypeIndex = 0;
          this.bulletCount = 0;

          this.input.on('pointerdown', (pointer) => {
              const angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, pointer.x, pointer.y);
              if (this.bullets.length < 30) {
                  const bulletType = this.bulletTypes[this.currentBulletTypeIndex];
                  this.bullets.push(new Bullet(this.player.x, this.player.y, angle, bulletType, this));

                  // Increase bullet count, and cycle every 5 shots
                  this.bulletCount++;
                  if (this.bulletCount % 5 === 0) {
                      this.currentBulletTypeIndex = (this.currentBulletTypeIndex + 1) % this.bulletTypes.length;
                  }
              }
          });

          this.currentTypeText = this.add.text(10, 10, 'Bullet color: RED', { fontSize: '20px', fill: '#fff' });
          this.colorNames = ['RED', 'GREEN', 'BLUE'];
      },

      update: function () {
          this.bullets.forEach(bullet => bullet.update());

          this.bullets = this.bullets.filter(bullet => {
              if (bullet.isOutOfBounds(800, 600)) {
                  bullet.destroy();
                  return false;
              }
              return true;
          });

          this.currentTypeText.setText(`Bullet color: ${this.colorNames[this.currentBulletTypeIndex]}`);
      }
  }
};

const game = new Phaser.Game(config);
