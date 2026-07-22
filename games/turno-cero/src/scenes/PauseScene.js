import Phaser from "phaser";

export class PauseScene extends Phaser.Scene {
  constructor() { super("PauseScene"); }
  init(data) { this.laboratory = data.laboratory; }
  create() {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x02040a, 0.82);
    this.add.text(width / 2, height / 2 - 50, "PAUSA", { fontFamily: "Manrope", fontSize: "48px", fontStyle: "bold", color: "#eef3ff" }).setOrigin(0.5);
    this.add.text(width / 2, height / 2 + 30, "ESC  CONTINUAR", { fontFamily: "IBM Plex Mono", fontSize: "13px", color: "#8292ae" }).setOrigin(0.5);
    this.input.keyboard.once("keydown-ESC", () => { this.scene.stop(); this.scene.resume(this.laboratory); });
  }
}
