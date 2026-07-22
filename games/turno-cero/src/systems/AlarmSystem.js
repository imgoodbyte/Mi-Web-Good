export class AlarmSystem {
  constructor(scene) {
    this.scene = scene;
    this.active = false;
    this.endsAt = 0;
    this.duration = 9000;

    const { width } = scene.scale;
    this.label = scene.add.text(width - 24, 22, "", {
      fontFamily: "IBM Plex Mono", fontSize: "12px", color: "#ff8c96",
      backgroundColor: "#280810dd", padding: { x: 14, y: 10 },
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(45).setVisible(false);

    this.warningBorder = scene.add.graphics().setScrollFactor(0).setDepth(44).setVisible(false);
    this.warningBorder.lineStyle(5, 0xe5384d, 0.42).strokeRect(3, 3, scene.scale.width - 6, scene.scale.height - 6);
    scene.tweens.add({ targets: this.warningBorder, alpha: 0.25, yoyo: true, repeat: -1, duration: 380 });
  }

  activate(position) {
    const wasActive = this.active;
    this.active = true;
    this.endsAt = this.scene.time.now + this.duration;
    this.label.setVisible(true);
    this.warningBorder.setVisible(true);
    this.scene.events.emit("alarm:position", { x: position.x, y: position.y });
    if (!wasActive) this.scene.events.emit("alarm:activated");
  }

  clear(reason = "clear") {
    if (!this.active) return;
    this.active = false;
    this.label.setVisible(false);
    this.warningBorder.setVisible(false);
    this.scene.events.emit("alarm:cleared", reason);
  }

  update(now) {
    if (!this.active) return;
    const seconds = Math.max(0, Math.ceil((this.endsAt - now) / 1000));
    this.label.setText(`⚠  ALERTA ACTIVA  00:${String(seconds).padStart(2, "0")}`);
    if (now >= this.endsAt) this.clear("timeout");
  }
}
