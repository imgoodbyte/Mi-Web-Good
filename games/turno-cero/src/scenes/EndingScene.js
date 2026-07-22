import Phaser from "phaser";

export class EndingScene extends Phaser.Scene {
  constructor() { super("EndingScene"); }
  init(data) { this.decisions = data.decisions || {}; this.nora = data.nora || {}; }
  create() {
    const { width, height } = this.scale;
    this.add.grid(width / 2, height / 2, width, height, 42, 42, 0x060a13, 1, 0x162039, 0.4);
    this.add.text(width / 2, height / 2 - 110, "PROTOCOLO INTERRUMPIDO", { fontFamily: "IBM Plex Mono", fontSize: "11px", color: "#6680a8", letterSpacing: 3 }).setOrigin(0.5);
    this.add.text(width / 2, height / 2 - 45, "FIN DE LA PRUEBA 0.1", { fontFamily: "Manrope", fontSize: "42px", fontStyle: "bold", color: "#dfe8ff" }).setOrigin(0.5);
    let profile = "CAUTELOSO";
    let result = "Escapaste, pero las intenciones de NORA siguen ocultas.";
    if (this.decisions.noraResponse === "trust") { profile = "OBEDIENTE"; result = "Aceptaste la versión de NORA y seguiste su ruta."; }
    if (this.decisions.noraResponse === "question" && this.decisions.sawNoraContradiction) { profile = "OBSERVADOR"; result = "Usaste la evidencia para confrontar la mentira de NORA."; }
    if (this.decisions.noraResponse === "question" && !this.decisions.sawNoraContradiction) { profile = "DESCONFIADO"; result = "Cuestionaste a NORA incluso sin tener todas las pruebas."; }
    this.add.text(width / 2, height / 2 + 16, `PERFIL: ${profile}\n${result}`, { align: "center", fontFamily: "IBM Plex Mono", fontSize: "14px", color: "#8fa0ba", lineSpacing: 12 }).setOrigin(0.5);
    this.add.text(width / 2, height / 2 + 82, `NORA  CONFIANZA ${this.nora.trust ?? 0}  /  AMENAZA ${this.nora.threat ?? 0}`, { fontFamily: "IBM Plex Mono", fontSize: "10px", color: "#596b8c" }).setOrigin(0.5);
    const button = this.add.text(width / 2, height / 2 + 140, "VOLVER AL MENÚ", { fontFamily: "IBM Plex Mono", fontSize: "12px", color: "#eff4ff", backgroundColor: "#405cc6", padding: { x: 18, y: 12 } }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    button.on("pointerdown", () => this.scene.start("MainMenuScene"));
  }
}
