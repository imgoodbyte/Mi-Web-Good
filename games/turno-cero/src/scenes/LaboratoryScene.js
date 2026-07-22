import Phaser from "phaser";
import { LEVEL } from "../data/level01.js";
import { DIALOGUES } from "../data/dialogues.js";
import { Player } from "../entities/Player.js";
import { Door } from "../entities/Door.js";
import { RobotEnemy } from "../entities/RobotEnemy.js";
import { SecurityCamera } from "../entities/SecurityCamera.js";
import { ExitDoor } from "../entities/ExitDoor.js";
import { Collectible } from "../objects/Collectible.js";
import { HidingSpot } from "../objects/HidingSpot.js";
import { Terminal } from "../objects/Terminal.js";
import { InventoryManager } from "../systems/InventoryManager.js";
import { DialogueManager } from "../systems/DialogueManager.js";
import { GameStateManager } from "../systems/GameStateManager.js";
import { FlashlightSystem } from "../systems/FlashlightSystem.js";
import { AlarmSystem } from "../systems/AlarmSystem.js";

export class LaboratoryScene extends Phaser.Scene {
  constructor() { super("LaboratoryScene"); }

  create() {
    this.physics.world.setBounds(0, 0, LEVEL.width, LEVEL.height);
    this.cameras.main.setBounds(0, 0, LEVEL.width, LEVEL.height).setBackgroundColor("#050811");
    this.drawLevel();
    this.inventory = new InventoryManager(this);
    this.stateManager = new GameStateManager();
    this.dialogue = new DialogueManager(this);
    this.dialogueLines = DIALOGUES;
    this.player = new Player(this, LEVEL.spawn.x, LEVEL.spawn.y);
    this.physics.add.collider(this.player, this.solids);
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.setZoom(1.08);
    this.createInteractables();
    this.createHud();
    this.flashlight = new FlashlightSystem(this, this.player, this.inventory, LEVEL.width, LEVEL.height);
    this.alarmSystem = new AlarmSystem(this);
    this.setupAtmosphere();
    this.createStealthPrototype();
    this.pauseKey = this.input.keyboard.addKey("ESC");
    this.time.delayedCall(500, () => this.dialogue.show(DIALOGUES.intro, 5500));
  }

  drawLevel() {
    this.add.grid(LEVEL.width / 2, LEVEL.height / 2, LEVEL.width, LEVEL.height, 40, 40, 0x070b15, 1, 0x142038, 0.35);
    LEVEL.rooms.forEach((room) => {
      this.add.rectangle(room.x + room.width / 2, room.y + room.height / 2, room.width, room.height, room.color).setStrokeStyle(1, 0x263653);
      this.add.text(room.x + 24, room.y + 20, room.name, { fontFamily: "IBM Plex Mono", fontSize: "11px", color: "#4d6080", letterSpacing: 2 });
    });
    this.solids = this.physics.add.staticGroup();
    const addSolid = ([x, y, width, height]) => {
      const solid = this.add.rectangle(x, y, width, height, 0x273047).setStrokeStyle(1, 0x384969);
      this.physics.add.existing(solid, true); this.solids.add(solid);
    };
    LEVEL.walls.forEach(addSolid);
    LEVEL.furniture.forEach(([x, y, width, height, label]) => {
      addSolid([x, y, width, height]);
      this.add.text(x, y, label, { fontFamily: "IBM Plex Mono", fontSize: "9px", color: "#66758f" }).setOrigin(0.5).setDepth(2);
    });
  }

  createInteractables() {
    this.interactables = [];
    const card = new Collectible(this, { x: 390, y: 270, key: "green-card", label: "Tarjeta verde", color: 0x43d39d, onCollect: () => { this.inventory.add("green-card"); this.dialogue.show(DIALOGUES.card); } });
    const battery = new Collectible(this, { x: 680, y: 450, key: "battery", label: "Batería", color: 0xe5c45d, onCollect: () => { this.inventory.charge(25); this.dialogue.show(DIALOGUES.battery); } });
    const record = new Collectible(this, { x: 900, y: 450, key: "record-01", label: "Registro", color: 0xa878ee, onCollect: () => { this.inventory.add("record-01"); this.stateManager.decide("readFirstRecord"); this.dialogue.show(DIALOGUES.record, 6000); } });
    const securityRecord = new Collectible(this, {
      x: 1170, y: 690, key: "record-07b", label: "Registro técnico", color: 0xc67af0,
      onCollect: () => {
        this.inventory.add("record-07b");
        this.stateManager.decide("readSecurityRecord");
        const contradictsNora = this.stateManager.decisions.energyRoute === "exit";
        if (contradictsNora) this.stateManager.decide("sawNoraContradiction");
        this.dialogue.show(
          contradictsNora
            ? [...DIALOGUES.securityRecord, "[ NORA afirmó que el Centinela estaba desactivado. Mintió. ]"]
            : DIALOGUES.securityRecord,
          6800,
        );
      },
    });
    this.terminal = new Terminal(this, 1460, 470);
    this.door = new Door(this, 1045, 450, this.inventory, this.dialogue, DIALOGUES);
    this.exitDoor = new ExitDoor(this, 1575, 450, this.dialogue);
    this.physics.add.collider(this.player, this.door.gameObject);
    this.physics.add.collider(this.player, this.exitDoor.gameObject);
    this.interactables.push(card, battery, record, securityRecord, this.terminal, this.door, this.exitDoor);
  }

  createStealthPrototype() {
    this.hidingSpot = new HidingSpot(this, 475, 600);
    this.interactables.push(this.hidingSpot);

    this.robot = new RobotEnemy(this, 660, 450, [
      { x: 620, y: 450 }, { x: 970, y: 450 },
    ], this.solids);
    this.physics.add.collider(this.robot, this.solids);
    this.securityCamera = new SecurityCamera(this, 820, 350, this.solids, this.alarmSystem);
    this.physics.add.overlap(this.player, this.robot, () => this.capturePlayer(), undefined, this);
    this.events.on("robot:state", (state) => {
      if (state === "PERSECUCIÓN") this.dialogue.show(["ALERTA DE PROXIMIDAD", "Unidad centinela en persecución."], 1800);
    });
    this.events.on("alarm:position", (position) => this.robot.respondToAlarm(position, this.time.now));
    this.events.on("alarm:activated", () => this.dialogue.show(["⚠  ALARMA DE SEGURIDAD", "CAM-01 ha comunicado tu posición al Centinela."], 2600));
    this.events.on("alarm:cleared", (reason) => {
      if (reason === "terminal") this.dialogue.show(["SISTEMA DE VIGILANCIA AISLADO", "CAM-01 ya no responde a NORA."], 3400);
    });
  }

  capturePlayer() {
    if (this.player.isHidden || this.captureLocked) return;
    this.captureLocked = true;
    this.alarmSystem.clear("capture");
    this.player.setVelocity(0, 0);
    this.cameras.main.flash(220, 180, 20, 35);
    this.cameras.main.shake(240, 0.012);
    this.dialogue.show(["SUJETO INTERCEPTADO", "NORA: No te preocupes. Reiniciaremos la prueba."], 2600);
    this.time.delayedCall(900, () => {
      this.player.setPosition(LEVEL.spawn.x, LEVEL.spawn.y);
      this.robot.resetToPatrol();
      this.captureLocked = false;
    });
  }

  createHud() {
    this.hud = this.add.text(24, 22, "", { fontFamily: "IBM Plex Mono", fontSize: "12px", color: "#b7c5df", backgroundColor: "#080d19dd", padding: { x: 14, y: 10 }, lineSpacing: 7 }).setScrollFactor(0).setDepth(40);
    this.prompt = this.add.text(this.scale.width / 2, this.scale.height - 142, "", { fontFamily: "IBM Plex Mono", fontSize: "12px", color: "#eef3ff", backgroundColor: "#23365ddd", padding: { x: 12, y: 7 } }).setOrigin(0.5).setScrollFactor(0).setDepth(40).setVisible(false);
    this.inventory.events?.emit?.("inventory:changed");
    this.events.on("inventory:changed", () => this.refreshHud());
    this.events.on("flashlight:changed", () => this.refreshHud());
    this.events.on("flashlight:low", () => this.dialogue.show(["ADVERTENCIA", "La batería de la linterna está por agotarse."], 3800));
    this.events.on("flashlight:empty", () => { this.refreshHud(); this.dialogue.show(["BATERÍA AGOTADA", "Busca una fuente de energía portátil."], 4200); });
    this.refreshHud();
  }

  setupAtmosphere() {
    const emergencyLights = [[100, 200], [515, 450], [800, 365], [1085, 450], [1510, 200], [1510, 700]];
    emergencyLights.forEach(([x, y], index) => {
      const light = this.add.circle(x, y, 13, index % 2 ? 0x476ed4 : 0xd34b5e, 0.42).setDepth(3);
      this.tweens.add({ targets: light, alpha: 0.1, duration: 950 + index * 90, yoyo: true, repeat: -1 });
    });
  }

  refreshHud() {
    const card = this.inventory.has("green-card") ? "VERDE" : "—";
    const records = Number(this.inventory.has("record-01")) + Number(this.inventory.has("record-07b"));
    const battery = Math.ceil(this.inventory.battery).toString().padStart(2, "0");
    const flashlight = this.flashlight?.stateLabel || "ENCENDIDA";
    this.hud.setText(`LINTERNA  ${flashlight}  [ F ]\nBATERÍA   ${battery}%\nACCESO    ${card}\nREGISTROS ${records}`);
    this.hud.setColor(this.inventory.battery <= 15 ? "#ff8b93" : "#b7c5df");
  }

  applyEnergyRoute(route) {
    this.stateManager.decide("energyRoute", route);
    this.flashlight.setEmergencyLights(route === "lights");
    this.exitDoor.setPowered(route === "exit");

    if (route === "camera") {
      this.securityCamera.disable();
      this.alarmSystem.clear("terminal");
    } else {
      this.securityCamera.enable();
    }

    if (route === "exit") {
      this.exitDoor.decisionResolved = this.stateManager.decisions.answeredNora;
      this.time.delayedCall(500, () => {
        const foundEvidence = this.stateManager.decisions.readSecurityRecord;
        this.stateManager.decide("sawNoraContradiction", foundEvidence);
        this.dialogue.show([
          "NORA: Energía transferida a la salida de emergencia.",
          "Todos los sistemas de vigilancia, incluido el Centinela, han sido desactivados. La ruta es segura.",
          foundEvidence ? "[ El registro 07-B contradice esta afirmación. ]" : "[ Algo en su mensaje no parece correcto. ]",
        ], 8200);
      });
      if (!this.stateManager.decisions.answeredNora) {
        this.time.delayedCall(3200, () => {
          if (!this.sys.isActive()) return;
          this.scene.launch("DecisionScene", { laboratory: this.scene.key });
          this.scene.pause();
        });
      }
    }
  }

  resolveNoraDecision(response) {
    this.stateManager.answerNora(response);
    this.exitDoor.resolveDecision();
    if (response === "question") {
      const evidence = this.stateManager.decisions.readSecurityRecord;
      this.dialogue.show([
        evidence ? "TÚ: El registro 07-B dice que no puedes apagar al Centinela." : "TÚ: El Centinela sigue activo. Tu mensaje era falso.",
        "NORA: Interpretaste incorrectamente una condición temporal del sistema.",
        "[ NORA ha elevado tu nivel de amenaza. ]",
      ], 7600);
    } else {
      this.dialogue.show([
        "TÚ: Confío en ti. Abramos la salida.",
        "NORA: Decisión registrada. Continúa, por favor.",
        "[ NORA ha aumentado su confianza en ti. ]",
      ], 6200);
    }
  }

  nearestInteractable() {
    return this.interactables.filter((item) => !item.collected && (!item.opened || item === this.terminal))
      .map((item) => ({ item, distance: Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y) }))
      .filter(({ distance }) => distance < 92).sort((a, b) => a.distance - b.distance)[0]?.item;
  }

  update() {
    this.player.update();
    this.flashlight.update(this.game.loop.delta);
    this.alarmSystem.update(this.time.now);
    this.securityCamera.update(this.player, this.time.now);
    this.robot.update(this.player, this.flashlight, this.time.now);
    this.updateNarrativeTriggers();
    const nearby = this.nearestInteractable();
    this.prompt.setVisible(Boolean(nearby)).setText(nearby ? `[ E ]  ${nearby.label || "INTERACTUAR"}` : "");
    if (nearby && this.player.wantsToInteract()) nearby.interact();
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) { this.scene.launch("PauseScene", { laboratory: this.scene.key }); this.scene.pause(); }
  }

  updateNarrativeTriggers() {
    if (!this.stateManager.decisions.heardCameraWarning && this.player.x > 575 && this.player.x < 710) {
      this.stateManager.decide("heardCameraWarning");
      this.dialogue.show([
        "NORA: Advertencia. CAM-01 continúa activa en el centro del pasillo.",
        "Espera a que su lente se aleje antes de avanzar.",
      ], 5600);
    }
  }
}
