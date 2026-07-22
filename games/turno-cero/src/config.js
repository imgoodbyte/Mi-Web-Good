import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene.js";
import { PreloadScene } from "./scenes/PreloadScene.js";
import { MainMenuScene } from "./scenes/MainMenuScene.js";
import { LaboratoryScene } from "./scenes/LaboratoryScene.js";
import { TerminalScene } from "./scenes/TerminalScene.js";
import { PauseScene } from "./scenes/PauseScene.js";
import { EndingScene } from "./scenes/EndingScene.js";
import { DecisionScene } from "./scenes/DecisionScene.js";

export const gameConfig = {
  type: Phaser.AUTO,
  parent: "game-container",
  backgroundColor: "#050811",
  width: 1280,
  height: 720,
  pixelArt: false,
  physics: {
    default: "arcade",
    arcade: { debug: false },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, PreloadScene, MainMenuScene, LaboratoryScene, TerminalScene, DecisionScene, PauseScene, EndingScene],
};
