import Phaser from "phaser";

export class MainMenuScene extends Phaser.Scene {
  constructor() { super("MainMenuScene"); }

  create() {
    const { width, height } = this.scale;
    this.add.grid(width / 2, height / 2, width, height, 44, 44, 0x070b16, 1, 0x17213a, 0.45);
    this.add.circle(width * 0.73, height * 0.35, 250, 0x253d85, 0.16);
    this.add.text(70, 70, "GOOD GAMES / EXPERIMENTO 002", { fontFamily: "IBM Plex Mono", fontSize: "12px", color: "#657597", letterSpacing: 2 });
    this.add.text(70, height * 0.31, "TURNO CERO", { fontFamily: "Manrope", fontSize: "76px", fontStyle: "bold", color: "#eef3ff" });
    this.add.text(74, height * 0.31 + 86, "LABORATORIO 13", { fontFamily: "IBM Plex Mono", fontSize: "22px", color: "#6e8cff", letterSpacing: 8 });
    this.add.text(74, height * 0.31 + 142, "02:13 AM  ·  PROTOCOLO NOCTURNO ACTIVO", { fontFamily: "IBM Plex Mono", fontSize: "12px", color: "#69738a" });
    const button = this.add.text(74, height - 150, "INICIAR PROTOTIPO  →", { fontFamily: "IBM Plex Mono", fontSize: "15px", color: "#f4f7ff", backgroundColor: "#536ee0", padding: { x: 22, y: 14 } }).setInteractive({ useHandCursor: true });
    button.on("pointerover", () => button.setBackgroundColor("#6c83e8"));
    button.on("pointerout", () => button.setBackgroundColor("#536ee0"));
    button.on("pointerdown", () => this.scene.start("LaboratoryScene"));
    this.input.keyboard.once("keydown-ENTER", () => this.scene.start("LaboratoryScene"));
  }
}
