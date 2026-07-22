export class InventoryManager {
  constructor(scene) {
    this.scene = scene;
    this.items = new Set();
    this.battery = 50;
  }

  add(key) {
    this.items.add(key);
    this.scene.events.emit("inventory:changed", this.snapshot());
  }

  has(key) { return this.items.has(key); }

  charge(amount) {
    this.battery = Math.min(100, this.battery + amount);
    this.scene.events.emit("inventory:changed", this.snapshot());
  }

  consumeBattery(amount) {
    const previous = Math.floor(this.battery);
    this.battery = Math.max(0, this.battery - amount);
    if (Math.floor(this.battery) !== previous) {
      this.scene.events.emit("inventory:changed", this.snapshot());
    }
    return this.battery;
  }

  snapshot() { return { items: [...this.items], battery: this.battery }; }
}
