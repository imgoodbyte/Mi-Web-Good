import Phaser from "phaser";

export class PreloadScene extends Phaser.Scene {
  constructor() { super("PreloadScene"); }

  preload() {
    const { width, height } = this.scale;
    this.add.text(width / 2, height / 2 - 42, "INICIALIZANDO PROTOCOLO", {
      fontFamily: "IBM Plex Mono", fontSize: "11px", color: "#607393", letterSpacing: 3,
    }).setOrigin(0.5);
    const track = this.add.rectangle(width / 2, height / 2, 280, 2, 0x1a263e);
    const bar = this.add.rectangle(width / 2 - 140, height / 2, 0, 2, 0x627eea).setOrigin(0, 0.5);
    this.load.on("progress", (value) => bar.setDisplaySize(280 * value, 2));
    this.load.on("complete", () => track.setFillStyle(0x4f68c8));
    this.load.image("student-concept", "assets/images/player/student-concept-transparent.png");
  }

  create() {
    const graphics = this.make.graphics({ x: 0, y: 0, add: false });
    graphics.fillStyle(0xc5d7ff).fillCircle(18, 18, 12);
    graphics.fillStyle(0x5b76e8).fillTriangle(18, 0, 11, 18, 25, 18);
    graphics.generateTexture("player", 36, 36);
    graphics.destroy();

    const light = this.make.graphics({ x: 0, y: 0, add: false });
    light.fillStyle(0xffffff, 0.2).fillCircle(210, 265, 92);
    light.fillStyle(0xffffff, 0.3).fillCircle(210, 265, 66);
    light.fillStyle(0xffffff, 0.42).fillTriangle(125, 275, 295, 275, 247, 24);
    light.fillStyle(0xffffff, 0.72).fillTriangle(158, 275, 262, 275, 230, 66);
    light.fillStyle(0xffffff, 0.9).fillCircle(210, 265, 35);
    light.generateTexture("flashlight-mask", 420, 320);
    light.destroy();

    const robot = this.make.graphics({ x: 0, y: 0, add: false });
    robot.fillStyle(0x192637).fillRoundedRect(3, 3, 34, 34, 8);
    robot.lineStyle(2, 0xd05864).strokeRoundedRect(3, 3, 34, 34, 8);
    robot.fillStyle(0xff5264).fillCircle(13, 18, 4).fillCircle(27, 18, 4);
    robot.fillStyle(0x738399).fillRect(11, 29, 18, 3);
    robot.generateTexture("centinela", 40, 40);
    robot.destroy();
    this.scene.start("MainMenuScene");
  }
}
