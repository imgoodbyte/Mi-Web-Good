export class ExitDoor {
  constructor(scene, x, y, dialogue) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.dialogue = dialogue;
    this.powered = false;
    this.decisionResolved = false;
    this.label = "SALIDA DE EMERGENCIA";
    this.gameObject = scene.add.rectangle(x, y, 28, 90, 0x441d2a)
      .setStrokeStyle(2, 0xc34f61).setDepth(6);
    scene.physics.add.existing(this.gameObject, true);
    this.sign = scene.add.text(x - 9, y - 61, "EXIT", {
      fontFamily: "IBM Plex Mono", fontSize: "10px", color: "#d55c6d",
    }).setDepth(7);
  }

  setPowered(powered) {
    this.powered = powered;
    this.gameObject.setFillStyle(powered ? 0x174236 : 0x441d2a);
    this.gameObject.setStrokeStyle(2, powered ? 0x66dda8 : 0xc34f61);
    this.sign.setColor(powered ? "#70e2af" : "#d55c6d");
  }

  interact() {
    if (!this.powered) return this.dialogue.show(this.scene.dialogueLines.exitOffline);
    if (!this.decisionResolved) {
      return this.dialogue.show(["AUTORIZACIÓN PENDIENTE", "NORA espera una respuesta antes de liberar el cierre."], 3200);
    }
    this.scene.scene.start("EndingScene", {
      decisions: { ...this.scene.stateManager.decisions },
      nora: { ...this.scene.stateManager.nora },
    });
  }

  resolveDecision() { this.decisionResolved = true; }
}
