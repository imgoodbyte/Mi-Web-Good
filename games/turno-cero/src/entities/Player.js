import Phaser from "phaser";

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, "player");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true).setDepth(10);
    this.body.setSize(26, 30);
    this.speed = 205;
    this.isHidden = false;
    this.keys = scene.input.keyboard.addKeys("W,A,S,D,UP,DOWN,LEFT,RIGHT,E");
  }

  update() {
    if (this.isHidden) {
      this.setVelocity(0, 0);
      return;
    }
    const left = this.keys.A.isDown || this.keys.LEFT.isDown;
    const right = this.keys.D.isDown || this.keys.RIGHT.isDown;
    const up = this.keys.W.isDown || this.keys.UP.isDown;
    const down = this.keys.S.isDown || this.keys.DOWN.isDown;
    const direction = new Phaser.Math.Vector2(Number(right) - Number(left), Number(down) - Number(up)).normalize();
    this.setVelocity(direction.x * this.speed, direction.y * this.speed);
    if (direction.lengthSq() > 0) this.setRotation(direction.angle() + Math.PI / 2);
  }

  wantsToInteract() { return Phaser.Input.Keyboard.JustDown(this.keys.E); }

  setHidden(hidden, position) {
    this.isHidden = hidden;
    this.setVelocity(0, 0);
    this.setAlpha(hidden ? 0.18 : 1);
    if (hidden && position) this.setPosition(position.x, position.y);
  }
}
