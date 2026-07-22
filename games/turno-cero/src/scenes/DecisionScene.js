import Phaser from "phaser";

export class DecisionScene extends Phaser.Scene {
  constructor() { super("DecisionScene"); }
  init(data) { this.laboratoryKey = data.laboratory; }

  create() {
    const { width, height } = this.scale;
    this.laboratory = this.scene.get(this.laboratoryKey);
    this.add.rectangle(width / 2, height / 2, width, height, 0x02040a, 0.88);
    this.add.rectangle(width / 2, height / 2, 780, 430, 0x0a1020).setStrokeStyle(1, 0x5369a6, 0.75);
    this.add.text(width / 2, height / 2 - 165, "NORA // SOLICITUD DE CONFIRMACIÓN", {
      fontFamily: "IBM Plex Mono", fontSize: "11px", color: "#7288c1", letterSpacing: 2,
    }).setOrigin(0.5);
    this.add.text(width / 2, height / 2 - 92, "La ruta está despejada.\n¿Confías en mis instrucciones?", {
      align: "center", fontFamily: "IBM Plex Mono", fontSize: "20px", color: "#e0e7f8", lineSpacing: 14,
    }).setOrigin(0.5);

    this.makeChoice(width / 2 - 190, height / 2 + 65, "CONFIAR", "Seguir la ruta de NORA", "trust", 0x314a8b);
    this.makeChoice(width / 2 + 190, height / 2 + 65, "CUESTIONAR", "Señalar la contradicción", "question", 0x55334f);
    this.add.text(width / 2, height / 2 + 165, "Esta decisión será registrada.", {
      fontFamily: "IBM Plex Mono", fontSize: "10px", color: "#59657e",
    }).setOrigin(0.5);
  }

  makeChoice(x, y, title, description, value, color) {
    const panel = this.add.rectangle(x, y, 310, 112, color, 0.75).setStrokeStyle(1, 0x8294c4, 0.5).setInteractive({ useHandCursor: true });
    this.add.text(x, y - 17, title, { fontFamily: "IBM Plex Mono", fontSize: "15px", color: "#f1f4ff" }).setOrigin(0.5);
    this.add.text(x, y + 18, description, { fontFamily: "IBM Plex Mono", fontSize: "10px", color: "#a0abc2" }).setOrigin(0.5);
    panel.on("pointerover", () => panel.setAlpha(1).setScale(1.025));
    panel.on("pointerout", () => panel.setAlpha(0.75).setScale(1));
    panel.on("pointerdown", () => this.choose(value));
  }

  choose(value) {
    this.laboratory.resolveNoraDecision(value);
    this.scene.stop();
    this.scene.resume(this.laboratoryKey);
  }
}
