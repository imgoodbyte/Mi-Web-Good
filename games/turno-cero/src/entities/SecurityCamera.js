import Phaser from "phaser";

export class SecurityCamera {
  constructor(scene, x, y, obstacles, alarmSystem) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.obstacles = obstacles;
    this.alarmSystem = alarmSystem;
    this.enabled = true;
    this.range = 285;
    this.facing = Math.PI / 2;
    this.sweepCenter = Math.PI / 2;
    this.sweepWidth = Phaser.Math.DegToRad(54);
    this.lastTriggerAt = 0;

    this.vision = scene.add.graphics().setDepth(8);
    this.mount = scene.add.rectangle(x, y - 7, 34, 12, 0x26384a).setStrokeStyle(1, 0x648197).setDepth(32);
    this.head = scene.add.triangle(x, y + 4, -13, -9, 13, -9, 0, 16, 0x74a9b9).setDepth(33);
    this.lens = scene.add.circle(x, y + 9, 4, 0x62ece0).setDepth(34);
    this.status = scene.add.text(x + 25, y - 18, "CAM-01", {
      fontFamily: "IBM Plex Mono", fontSize: "8px", color: "#5f8e96",
    }).setDepth(32);
  }

  update(player, now) {
    if (!this.enabled) return;
    this.facing = this.sweepCenter + Math.sin(now * 0.00072) * this.sweepWidth;
    this.head.setRotation(this.facing - Math.PI / 2);
    this.lens.setPosition(this.x + Math.cos(this.facing) * 10, this.y + Math.sin(this.facing) * 10);
    this.drawVision();

    if (this.detect(player) && now - this.lastTriggerAt > 850) {
      this.lastTriggerAt = now;
      this.alarmSystem.activate(player);
    }
  }

  detect(player) {
    if (player.isHidden) return false;
    const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    if (distance > this.range || !this.hasClearPath(player)) return false;
    const targetAngle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    return Math.abs(Phaser.Math.Angle.Wrap(targetAngle - this.facing)) < Phaser.Math.DegToRad(25);
  }

  hasClearPath(target) {
    const ray = new Phaser.Geom.Line(this.x, this.y, target.x, target.y);
    return this.obstacles.getChildren().every((obstacle) => {
      if (!obstacle.active) return true;
      const bounds = obstacle.getBounds();
      if (bounds.contains(this.x, this.y)) return true;
      return !Phaser.Geom.Intersects.LineToRectangle(ray, bounds);
    });
  }

  drawVision() {
    const halfAngle = Phaser.Math.DegToRad(25);
    const points = [{ x: this.x, y: this.y }];
    for (let step = 0; step <= 10; step += 1) {
      const angle = this.facing - halfAngle + (halfAngle * 2 * step) / 10;
      points.push({ x: this.x + Math.cos(angle) * this.range, y: this.y + Math.sin(angle) * this.range });
    }
    this.vision.clear().fillStyle(this.alarmSystem.active ? 0xff3f55 : 0x54d7d0, this.alarmSystem.active ? 0.16 : 0.075).fillPoints(points, true);
  }

  disable() {
    if (!this.enabled) return false;
    this.enabled = false;
    this.vision.clear();
    this.lens.setFillStyle(0x485460).setAlpha(0.65);
    this.head.setFillStyle(0x34434e).setAlpha(0.7);
    this.status.setText("CAM-01 / OFF").setColor("#65717a");
    return true;
  }

  enable() {
    if (this.enabled) return false;
    this.enabled = true;
    this.lens.setFillStyle(0x62ece0).setAlpha(1);
    this.head.setFillStyle(0x74a9b9).setAlpha(1);
    this.status.setText("CAM-01").setColor("#5f8e96");
    return true;
  }
}
