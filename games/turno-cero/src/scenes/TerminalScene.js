import Phaser from "phaser";

export class TerminalScene extends Phaser.Scene {
  constructor() { super("TerminalScene"); }
  init(data) { this.laboratoryKey = data.laboratory; this.sequence = []; }

  create() {
    const { width, height } = this.scale;
    this.laboratory = this.scene.get(this.laboratoryKey);
    this.add.rectangle(width / 2, height / 2, width, height, 0x02050b, 0.9);
    this.add.rectangle(width / 2, height / 2, 760, 480, 0x091321).setStrokeStyle(2, 0x42c7ca, 0.65);
    this.add.text(width / 2 - 330, height / 2 - 200, "NORA // TERMINAL SRV-03", { fontFamily: "IBM Plex Mono", fontSize: "14px", color: "#62e0d7" });
    this.status = this.add.text(width / 2, height / 2 - 112, "", { align: "center", fontFamily: "IBM Plex Mono", fontSize: "17px", color: "#dce8f7", lineSpacing: 12 }).setOrigin(0.5);
    this.nodes = [];
    this.help = this.add.text(width / 2, height / 2 + 185, "ESC  CERRAR TERMINAL", { fontFamily: "IBM Plex Mono", fontSize: "11px", color: "#65758b" }).setOrigin(0.5);

    if (this.laboratory.stateManager.decisions.terminalUnlocked) this.showRouting();
    else this.showSequencePuzzle();
    this.input.keyboard.on("keydown-ESC", () => this.close());
  }

  clearNodes() { this.nodes.forEach((node) => node.destroy()); this.nodes = []; }

  makeButton(x, y, title, subtitle, callback) {
    const button = this.add.container(x, y);
    const background = this.add.rectangle(0, 0, 190, 92, 0x14283a).setStrokeStyle(1, 0x41657a).setInteractive({ useHandCursor: true });
    const heading = this.add.text(0, -15, title, { fontFamily: "IBM Plex Mono", fontSize: "15px", color: "#d9e7f1" }).setOrigin(0.5);
    const detail = this.add.text(0, 16, subtitle, { fontFamily: "IBM Plex Mono", fontSize: "9px", color: "#6e8797", align: "center" }).setOrigin(0.5);
    button.add([background, heading, detail]);
    background.on("pointerover", () => background.setFillStyle(0x1b4050));
    background.on("pointerout", () => background.setFillStyle(0x14283a));
    background.on("pointerdown", callback);
    this.nodes.push(button);
  }

  showSequencePuzzle() {
    this.clearNodes();
    this.status.setText("RESTAURA EL BUS DE CONTROL\nSECUENCIA REQUERIDA:  2  →  1  →  3").setColor("#dce8f7");
    [1, 2, 3].forEach((value, index) => this.makeButton(this.scale.width / 2 - 220 + index * 220, this.scale.height / 2 + 55, String(value), "NODO", () => this.pressNode(value)));
  }

  pressNode(value) {
    this.sequence.push(value);
    const expected = [2, 1, 3];
    if (this.sequence.some((entry, index) => entry !== expected[index])) {
      this.sequence = [];
      this.status.setText("SECUENCIA INCORRECTA\nMEMORIA DEL BUS REINICIADA").setColor("#ff7b88");
      return;
    }
    if (this.sequence.length === expected.length) {
      this.laboratory.stateManager.decide("terminalUnlocked");
      this.status.setText("ACCESO DE MANTENIMIENTO CONCEDIDO").setColor("#66e0b3");
      this.time.delayedCall(650, () => this.showRouting());
    } else this.status.setText(`SEÑAL RECIBIDA: ${this.sequence.join("  →  ")}`).setColor("#dce8f7");
  }

  showRouting() {
    this.clearNodes();
    const active = this.laboratory.stateManager.decisions.energyRoute;
    this.status.setText(`ENERGÍA DISPONIBLE: 1 MÓDULO\nRUTA ACTIVA: ${active ? active.toUpperCase() : "NINGUNA"}`).setColor("#dce8f7");
    const y = this.scale.height / 2 + 55;
    this.makeButton(this.scale.width / 2 - 215, y, "01  LUCES", "Reduce la oscuridad", () => this.route("lights"));
    this.makeButton(this.scale.width / 2, y, "02  CAM-01", "Aísla la cámara", () => this.route("camera"));
    this.makeButton(this.scale.width / 2 + 215, y, "03  SALIDA", "Alimenta la puerta", () => this.route("exit"));
  }

  route(route) {
    this.laboratory.applyEnergyRoute(route);
    this.status.setText(`ENERGÍA REDIRIGIDA\nMÓDULO ${route.toUpperCase()} ACTIVO`).setColor("#66e0b3");
    this.time.delayedCall(900, () => this.close());
  }

  close() { this.scene.stop(); this.scene.resume(this.laboratoryKey); }
}
