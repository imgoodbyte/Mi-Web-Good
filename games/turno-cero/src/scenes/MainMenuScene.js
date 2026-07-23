import Phaser from "phaser";

export class MainMenuScene extends Phaser.Scene {
  constructor() { super("MainMenuScene"); }

  create() {
    const { width, height } = this.scale;
    this.input.setDefaultCursor("default");
    this.createBackground(width, height);
    this.createCharacter(width, height);
    this.createInterface(width, height);
    this.createStartButton(76, height - 158);
    this.input.keyboard.once("keydown-ENTER", () => this.startGame());
  }

  createBackground(width, height) {
    this.add.rectangle(width / 2, height / 2, width, height, 0x050812);
    this.add.circle(width * 0.78, height * 0.43, 234, 0x182f68, 0.28);
    this.add.circle(width * 0.9, height * 0.15, 144, 0x432465, 0.16);

    const grid = this.add.grid(width / 2, height / 2, width, height, 42, 42, 0x050812, 0, 0x18223a, 0.34);
    grid.setAlpha(0.68);
    const horizon = this.add.graphics();
    horizon.lineStyle(1, 0x47649e, 0.17);
    horizon.lineBetween(0, height - 78, width, height - 78);
    horizon.lineBetween(width * 0.52, 0, width * 0.52, height);

    for (let index = 0; index < 26; index += 1) {
      const dot = this.add.circle(
        Phaser.Math.Between(Math.floor(width * 0.5), width),
        Phaser.Math.Between(30, height - 30),
        Phaser.Math.Between(1, 2),
        0x9cb6ff,
        Phaser.Math.FloatBetween(0.08, 0.32),
      );
      this.tweens.add({ targets: dot, alpha: 0.02, duration: Phaser.Math.Between(1200, 2800), yoyo: true, repeat: -1, delay: Phaser.Math.Between(0, 1600) });
    }

    this.scanLine = this.add.rectangle(width * 0.76, -10, width * 0.48, 1, 0x6d8fff, 0.28);
    this.tweens.add({ targets: this.scanLine, y: height + 10, duration: 5200, repeat: -1, ease: "Linear" });
  }

  createCharacter(width, height) {
    const glow = this.add.ellipse(width * 0.79, height * 0.52, 276, 366, 0x395cc5, 0.1);
    glow.setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: glow, alpha: 0.16, scale: 1.04, duration: 2400, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    this.characterGhost = this.add.image(width * 0.79 + 6, height * 0.5 + 8, "student-concept")
      .setDisplaySize(390, 390).setTint(0x426cff).setAlpha(0.13).setBlendMode(Phaser.BlendModes.ADD);
    this.character = this.add.image(width * 0.79, height * 0.5, "student-concept").setDisplaySize(390, 390);
    this.character.setAlpha(0).setX(width * 0.79 + 32);
    this.tweens.add({ targets: this.character, alpha: 1, x: width * 0.79, duration: 1050, ease: "Cubic.easeOut" });
    this.tweens.add({ targets: [this.character, this.characterGhost], y: "+=5", duration: 3100, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });

    const flashlightGlow = this.add.circle(width * 0.74, height * 0.51, 24, 0xffd77c, 0.12).setBlendMode(Phaser.BlendModes.ADD);
    this.tweens.add({ targets: flashlightGlow, alpha: 0.24, scale: 1.18, duration: 1500, yoyo: true, repeat: -1 });

    this.add.text(width - 52, height - 113, "SUJETO 13", {
      fontFamily: "IBM Plex Mono", fontSize: "11px", color: "#8c9eb9", letterSpacing: 2,
    }).setOrigin(1, 0.5).setRotation(-Math.PI / 2);
  }

  createInterface(width, height) {
    const left = 76;
    this.add.text(left, 54, "GOOD GAMES", {
      fontFamily: "Manrope", fontSize: "13px", fontStyle: "bold", color: "#eef3ff",
    });
    this.add.text(left + 101, 56, "/  EXPERIMENTO 002", {
      fontFamily: "IBM Plex Mono", fontSize: "12px", color: "#94a4bd", letterSpacing: 1,
    });

    const status = this.add.container(left, 112);
    status.add(this.add.circle(3, 6, 4, 0x69e0ae));
    status.add(this.add.text(15, 0, "CONEXIÓN RESTAURADA  ·  02:13 AM", {
      fontFamily: "IBM Plex Mono", fontSize: "12px", color: "#bdc7d8", letterSpacing: 1,
    }));
    this.tweens.add({ targets: status.list[0], alpha: 0.25, duration: 850, yoyo: true, repeat: -1 });

    this.add.text(left, 183, "TURNO", {
      fontFamily: "Manrope", fontSize: "78px", fontStyle: "bold", color: "#f0f3fb",
    }).setLetterSpacing(-4);
    this.add.text(left, 258, "CERO", {
      fontFamily: "Manrope", fontSize: "92px", fontStyle: "bold", color: "#718cff",
    }).setLetterSpacing(-5);
    this.add.text(left + 5, 354, "LABORATORIO  13", {
      fontFamily: "IBM Plex Mono", fontSize: "16px", color: "#e0e5ef", letterSpacing: 7,
    });

    this.add.rectangle(left, 405, 48, 1, 0x607ed7).setOrigin(0, 0.5);
    this.add.text(left + 63, 397, "PROTOCOLO NOCTURNO ACTIVO", {
      fontFamily: "IBM Plex Mono", fontSize: "11px", color: "#aab7ca", letterSpacing: 1,
    });
    this.add.text(left, 438, "Las puertas están bloqueadas. Los sistemas te observan.\nNORA asegura que conoce una salida.", {
      fontFamily: "IBM Plex Mono", fontSize: "14px", color: "#d0d7e4", lineSpacing: 9,
    });

    const noraPanel = this.add.container(width - 305, 42);
    noraPanel.add(this.add.rectangle(0, 0, 235, 68, 0x09101f, 0.8).setStrokeStyle(1, 0x31466d, 0.65).setOrigin(0));
    noraPanel.add(this.add.text(15, 11, "NORA / SISTEMA CENTRAL", { fontFamily: "IBM Plex Mono", fontSize: "10px", color: "#9badd0", letterSpacing: 1 }));
    noraPanel.add(this.add.text(15, 36, "«Puedo ayudarte a salir.»", { fontFamily: "IBM Plex Mono", fontSize: "13px", color: "#edf2ff" }));

    this.add.text(left, height - 51, "WASD  MOVERSE     E  INTERACTUAR     F  LINTERNA     ESC  PAUSA", {
      fontFamily: "IBM Plex Mono", fontSize: "11px", color: "#929eb1", letterSpacing: 1,
    });
    this.add.text(width - 42, height - 51, "BUILD 0.1  /  PHASER", {
      fontFamily: "IBM Plex Mono", fontSize: "11px", color: "#78869c",
    }).setOrigin(1, 0);
  }

  createStartButton(x, y) {
    const button = this.add.container(x, y);
    const background = this.add.rectangle(0, 0, 278, 54, 0x526fe2).setOrigin(0).setStrokeStyle(1, 0x8fa3f4, 0.5).setInteractive({ useHandCursor: true });
    const label = this.add.text(20, 17, "INICIAR PROTOCOLO", { fontFamily: "IBM Plex Mono", fontSize: "12px", color: "#f7f9ff" });
    const arrowCircle = this.add.circle(247, 27, 17, 0xf2f5ff);
    const arrow = this.add.text(247, 26, "→", { fontFamily: "Manrope", fontSize: "17px", color: "#26386f" }).setOrigin(0.5);
    button.add([background, label, arrowCircle, arrow]);
    background.on("pointerover", () => {
      background.setFillStyle(0x6682ef);
      this.tweens.add({ targets: [arrowCircle, arrow], x: "+=4", duration: 180, ease: "Cubic.easeOut" });
    });
    background.on("pointerout", () => {
      background.setFillStyle(0x526fe2);
      arrowCircle.x = 247; arrow.x = 247;
    });
    background.on("pointerdown", () => this.startGame());
    this.add.text(x, y + 68, "PULSA ENTER PARA COMENZAR", {
      fontFamily: "IBM Plex Mono", fontSize: "10px", color: "#8998b0", letterSpacing: 1,
    });
  }

  startGame() {
    this.cameras.main.fadeOut(420, 3, 6, 14);
    this.time.delayedCall(430, () => this.scene.start("LaboratoryScene"));
  }
}
