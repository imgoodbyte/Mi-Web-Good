export class Terminal {
  constructor(scene, x, y) {
    this.scene = scene;
    this.gameObject = scene.add.rectangle(x, y, 52, 42, 0x173448).setStrokeStyle(2, 0x55d6dc).setDepth(4);
    scene.add.rectangle(x, y - 2, 34, 19, 0x48d9cf, 0.35).setDepth(5);
  }

  get x() { return this.gameObject.x; }
  get y() { return this.gameObject.y; }
  interact() { this.scene.scene.launch("TerminalScene", { laboratory: this.scene.scene.key }); this.scene.scene.pause(); }
}
