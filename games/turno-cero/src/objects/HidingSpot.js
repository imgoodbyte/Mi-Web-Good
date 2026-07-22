export class HidingSpot {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.label = "ESCONDERSE";
    this.occupied = false;

    this.marker = scene.add.rectangle(x, y, 42, 54, 0x23344c, 0.75)
      .setStrokeStyle(1, 0x6f87a8, 0.7)
      .setDepth(4);
    scene.add.text(x, y, "▥", {
      fontFamily: "IBM Plex Mono", fontSize: "21px", color: "#8194b0",
    }).setOrigin(0.5).setDepth(5);
  }

  interact() {
    this.occupied = !this.occupied;
    this.label = this.occupied ? "SALIR DEL CASILLERO" : "ESCONDERSE";
    this.scene.player.setHidden(this.occupied, { x: this.x, y: this.y });
    this.marker.setStrokeStyle(2, this.occupied ? 0x68d9b0 : 0x6f87a8, 0.9);
    this.scene.dialogue.show(
      this.occupied
        ? ["OCULTO", "Mantente en silencio. Pulsa E para salir."]
        : ["HAS SALIDO DEL ESCONDITE", "El pasillo vuelve a estar a la vista."],
      2500,
    );
  }
}
