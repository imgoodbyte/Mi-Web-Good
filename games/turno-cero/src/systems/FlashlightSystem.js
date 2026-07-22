import Phaser from "phaser";

export class FlashlightSystem {
  constructor(scene, player, inventory, worldWidth, worldHeight) {
    this.scene = scene;
    this.player = player;
    this.inventory = inventory;
    this.enabled = true;
    this.drainPerSecond = 0.42;
    this.toggleKey = scene.input.keyboard.addKey("F");
    this.lowBatteryWarningShown = false;
    this.ambientAlpha = 0.88;

    this.darkness = scene.add.renderTexture(0, 0, worldWidth, worldHeight)
      .setOrigin(0)
      .setDepth(30);
    this.lightShape = scene.make.image({ key: "flashlight-mask", add: false }).setOrigin(0.5, 0.83);
    this.refreshDarkness();
  }

  toggle() {
    if (this.inventory.battery <= 0) return;
    this.enabled = !this.enabled;
    this.scene.events.emit("flashlight:changed", this.enabled);
  }

  update(delta) {
    if (Phaser.Input.Keyboard.JustDown(this.toggleKey)) this.toggle();

    if (this.enabled) {
      const remaining = this.inventory.consumeBattery(this.drainPerSecond * (delta / 1000));
      if (remaining <= 0) {
        this.enabled = false;
        this.scene.events.emit("flashlight:empty");
      } else if (remaining <= 15 && !this.lowBatteryWarningShown) {
        this.lowBatteryWarningShown = true;
        this.scene.events.emit("flashlight:low");
      }
    }

    this.refreshDarkness();
  }

  refreshDarkness() {
    this.darkness.clear();
    this.darkness.fill(0x02040a, this.ambientAlpha);

    if (!this.enabled) return;
    const flicker = this.inventory.battery <= 15 && Math.random() < 0.035;
    if (flicker) return;

    this.lightShape.setPosition(this.player.x, this.player.y);
    this.lightShape.setRotation(this.player.rotation);
    this.darkness.erase(this.lightShape);
  }

  get stateLabel() {
    if (this.inventory.battery <= 0) return "AGOTADA";
    return this.enabled ? "ENCENDIDA" : "APAGADA";
  }

  setEmergencyLights(powered) {
    this.ambientAlpha = powered ? 0.58 : 0.88;
  }
}
