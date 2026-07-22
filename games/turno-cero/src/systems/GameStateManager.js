export class GameStateManager {
  constructor() {
    this.nora = { trust: 0, threat: 0, control: 2 };
    this.decisions = {
      readFirstRecord: false,
      readSecurityRecord: false,
      openedServerRoom: false,
      heardCameraWarning: false,
      terminalUnlocked: false,
      energyRoute: null,
      sawNoraContradiction: false,
      answeredNora: false,
      noraResponse: null,
    };
  }

  decide(key, value = true) { this.decisions[key] = value; }

  adjustNora({ trust = 0, threat = 0, control = 0 }) {
    this.nora.trust = Math.max(-3, Math.min(3, this.nora.trust + trust));
    this.nora.threat = Math.max(0, Math.min(3, this.nora.threat + threat));
    this.nora.control = Math.max(0, Math.min(3, this.nora.control + control));
  }

  answerNora(response) {
    this.decide("answeredNora");
    this.decide("noraResponse", response);
    if (response === "trust") this.adjustNora({ trust: 2, threat: -1 });
    if (response === "question") this.adjustNora({ trust: -1, threat: 1 });
  }
}
