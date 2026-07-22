export class DialogueManager {
  constructor(scene) {
    this.scene = scene;
    const { width, height } = scene.scale;
    this.panel = scene.add.rectangle(width / 2, height - 78, Math.min(width - 64, 900), 108, 0x080d19, 0.96)
      .setStrokeStyle(1, 0x4f68a5, 0.65).setScrollFactor(0).setDepth(50).setVisible(false);
    this.text = scene.add.text(width / 2 - Math.min(width - 104, 850) / 2, height - 105, "", {
      fontFamily: "IBM Plex Mono", fontSize: "15px", color: "#d7e1ff", wordWrap: { width: Math.min(width - 104, 850) }, lineSpacing: 7,
    }).setScrollFactor(0).setDepth(51).setVisible(false);
    this.timer = null;
  }

  show(lines, duration = 4200) {
    clearTimeout(this.timer);
    this.panel.setVisible(true);
    this.text.setText(lines.join("\n")).setVisible(true);
    this.timer = setTimeout(() => this.hide(), duration);
  }

  hide() { this.panel.setVisible(false); this.text.setVisible(false); }
}
