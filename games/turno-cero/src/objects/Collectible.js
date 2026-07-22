export class Collectible {
  constructor(scene, { x, y, key, label, color, onCollect }) {
    this.scene = scene;
    this.key = key;
    this.label = label;
    this.onCollect = onCollect;
    this.collected = false;
    this.gameObject = scene.add.rectangle(x, y, 24, 24, color).setStrokeStyle(2, 0xffffff, 0.75).setDepth(4);
    scene.tweens.add({ targets: this.gameObject, y: y - 5, yoyo: true, repeat: -1, duration: 900, ease: "Sine.easeInOut" });
  }

  get x() { return this.gameObject.x; }
  get y() { return this.gameObject.y; }

  interact() {
    if (this.collected) return;
    this.collected = true;
    this.scene.tweens.killTweensOf(this.gameObject);
    this.gameObject.destroy();
    this.onCollect();
  }
}
