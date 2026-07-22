export class Door {
  constructor(scene, x, y, inventory, dialogue, lines) {
    this.scene = scene;
    this.inventory = inventory;
    this.dialogue = dialogue;
    this.lines = lines;
    this.opened = false;
    this.gameObject = scene.add.rectangle(x, y, 28, 170, 0x315681).setStrokeStyle(2, 0x7ca8d6).setDepth(5);
    scene.physics.add.existing(this.gameObject, true);
    scene.add.text(x - 8, y - 56, "03", { fontFamily: "IBM Plex Mono", fontSize: "11px", color: "#a9ceef" }).setDepth(6);
  }

  get x() { return this.gameObject.x; }
  get y() { return this.gameObject.y; }

  interact() {
    if (this.opened) return;
    if (!this.inventory.has("green-card")) return this.dialogue.show(this.lines.locked);
    this.opened = true;
    this.gameObject.body.enable = false;
    this.scene.tweens.add({ targets: this.gameObject, alpha: 0.12, scaleY: 0.15, duration: 450, ease: "Cubic.easeInOut" });
    this.scene.stateManager.decide("openedServerRoom");
    this.dialogue.show(this.lines.opened);
  }
}
