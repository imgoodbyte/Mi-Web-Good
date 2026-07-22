import Phaser from "phaser";

const STATES = {
  PATROL: "PATRULLA",
  INVESTIGATE: "INVESTIGA",
  CHASE: "PERSECUCIÓN",
  SEARCH: "BUSCANDO",
  RETURN: "REGRESANDO",
};

export class RobotEnemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, patrolPoints, obstacles) {
    super(scene, x, y, "centinela");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(11).setCollideWorldBounds(true);
    this.body.setSize(30, 30);

    this.patrolPoints = patrolPoints;
    this.obstacles = obstacles;
    this.patrolIndex = 0;
    this.state = STATES.PATROL;
    this.facing = 0;
    this.lastSeen = new Phaser.Math.Vector2(x, y);
    this.stateStartedAt = 0;
    this.lostSightAt = 0;
    this.speeds = { patrol: 85, investigate: 105, chase: 155, return: 100 };

    this.vision = scene.add.graphics().setDepth(9);
    this.stateText = scene.add.text(x, y - 34, this.state, {
      fontFamily: "IBM Plex Mono", fontSize: "9px", color: "#7f93ad",
      backgroundColor: "#07101bcc", padding: { x: 5, y: 3 },
    }).setOrigin(0.5).setDepth(32);
  }

  setState(next, now) {
    if (this.state === next) return;
    this.state = next;
    this.stateStartedAt = now;
    const colors = {
      [STATES.PATROL]: "#7f93ad", [STATES.INVESTIGATE]: "#e7c568",
      [STATES.CHASE]: "#ff7482", [STATES.SEARCH]: "#df9b62", [STATES.RETURN]: "#769ac7",
    };
    this.stateText.setText(next).setColor(colors[next]);
    this.scene.events.emit("robot:state", next);
  }

  update(player, flashlight, now) {
    const detection = this.detectPlayer(player, flashlight);

    if (detection.visible) {
      this.lastSeen.set(player.x, player.y);
      this.lostSightAt = now;
      this.setState(STATES.CHASE, now);
    } else if (detection.heard && this.state !== STATES.CHASE) {
      this.lastSeen.set(player.x, player.y);
      this.setState(STATES.INVESTIGATE, now);
    } else if (this.state === STATES.CHASE && now - this.lostSightAt > 1200) {
      this.setState(STATES.SEARCH, now);
    }

    switch (this.state) {
      case STATES.PATROL: this.followPatrol(); break;
      case STATES.INVESTIGATE: this.moveToward(this.lastSeen, this.speeds.investigate, () => this.setState(STATES.SEARCH, now)); break;
      case STATES.CHASE: this.moveToward(player, this.speeds.chase); break;
      case STATES.SEARCH:
        this.setVelocity(0, 0);
        this.facing += 0.018;
        if (now - this.stateStartedAt > 2600) this.setState(STATES.RETURN, now);
        break;
      case STATES.RETURN:
        this.moveToward(this.patrolPoints[this.patrolIndex], this.speeds.return, () => this.setState(STATES.PATROL, now));
        break;
    }

    this.setRotation(this.facing + Math.PI / 2);
    this.stateText.setPosition(this.x, this.y - 38);
    this.drawVision(flashlight);
  }

  followPatrol() {
    const target = this.patrolPoints[this.patrolIndex];
    this.moveToward(target, this.speeds.patrol, () => {
      this.patrolIndex = (this.patrolIndex + 1) % this.patrolPoints.length;
    });
  }

  moveToward(target, speed, onArrival) {
    const distance = Phaser.Math.Distance.Between(this.x, this.y, target.x, target.y);
    if (distance < 12) {
      this.setVelocity(0, 0);
      onArrival?.();
      return;
    }
    const angle = Phaser.Math.Angle.Between(this.x, this.y, target.x, target.y);
    this.facing = angle;
    this.scene.physics.velocityFromRotation(angle, speed, this.body.velocity);
  }

  detectPlayer(player, flashlight) {
    if (player.isHidden) return { visible: false, heard: false };
    const distance = Phaser.Math.Distance.Between(this.x, this.y, player.x, player.y);
    const moving = player.body.velocity.lengthSq() > 100;
    const heard = moving && distance < 105 && this.hasClearPath(player);
    const range = flashlight.enabled ? 330 : 220;
    if (distance > range || !this.hasClearPath(player)) return { visible: false, heard };

    const playerAngle = Phaser.Math.Angle.Between(this.x, this.y, player.x, player.y);
    const angleDifference = Math.abs(Phaser.Math.Angle.Wrap(playerAngle - this.facing));
    const inFieldOfView = angleDifference < Phaser.Math.DegToRad(36);
    return { visible: inFieldOfView, heard };
  }

  hasClearPath(target) {
    const ray = new Phaser.Geom.Line(this.x, this.y, target.x, target.y);
    return this.obstacles.getChildren().every((obstacle) => {
      if (!obstacle.active) return true;
      return !Phaser.Geom.Intersects.LineToRectangle(ray, obstacle.getBounds());
    });
  }

  drawVision(flashlight) {
    const range = flashlight.enabled ? 330 : 220;
    const halfAngle = Phaser.Math.DegToRad(36);
    const points = [{ x: this.x, y: this.y }];
    for (let step = 0; step <= 12; step += 1) {
      const angle = this.facing - halfAngle + (halfAngle * 2 * step) / 12;
      points.push({ x: this.x + Math.cos(angle) * range, y: this.y + Math.sin(angle) * range });
    }
    const color = this.state === STATES.CHASE ? 0xff425b : 0xe8b84d;
    this.vision.clear().fillStyle(color, this.state === STATES.CHASE ? 0.15 : 0.07).fillPoints(points, true);
  }

  resetToPatrol() {
    const start = this.patrolPoints[0];
    this.setPosition(start.x, start.y).setVelocity(0, 0);
    this.patrolIndex = 1;
    this.setState(STATES.PATROL, this.scene.time.now);
  }

  respondToAlarm(position, now) {
    if (this.state === STATES.CHASE) return;
    this.lastSeen.set(position.x, position.y);
    this.setState(STATES.INVESTIGATE, now);
  }
}
