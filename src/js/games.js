document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("gameModal");
  const arena = document.getElementById("arena");
  const target = document.getElementById("target");
  const targetImage = target.querySelector("img");
  const startScreen = document.getElementById("gameStart");
  const startButton = document.getElementById("startGame");
  const scoreDisplay = document.getElementById("score");
  const timeDisplay = document.getElementById("time");
  const message = document.getElementById("gameMessage");
  const feedback = document.getElementById("gameFeedback");
  let score = 0;
  let timeLeft = 30;
  let timer = null;
  let moveTimer = null;
  let feedbackTimer = null;
  let playing = false;
  let previousTargetX = 0;

  const formatScore = (value) => String(value).padStart(2, "0");

  function showFeedback(text, tone = "warning", duration = 2400) {
    window.clearTimeout(feedbackTimer);
    feedback.textContent = text;
    feedback.className = `game-feedback game-feedback--${tone}`;
    requestAnimationFrame(() => feedback.classList.add("is-visible"));
    feedbackTimer = window.setTimeout(() => feedback.classList.remove("is-visible"), duration);
  }

  function evaluatePace(elapsed) {
    if (elapsed === 10) {
      if (score <= 3) showFeedback("ESE PULSO NO ESTÁ PRECISO...", "danger");
      else if (score <= 7) showFeedback("LA RATITA TODAVÍA TE LLEVA VENTAJA", "warning");
      else showFeedback("¡BUEN PULSO! NO LA DEJES ESCAPAR", "good");
    }

    if (elapsed === 20) {
      if (score <= 5) showFeedback("ESTÁS MUY LENTO... ¿SIGUES AHÍ?", "danger");
      else if (score <= 12) showFeedback("PUEDES HACERLO MEJOR. ¡ACELERA!", "warning");
      else showFeedback("¡REFLEJOS DE LABORATORIO! SIGUE ASÍ", "good");
    }
  }

  function openGame() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    window.setTimeout(() => startButton.focus(), 150);
  }

  function stopGame() {
    playing = false;
    window.clearInterval(timer);
    window.clearTimeout(moveTimer);
    window.clearTimeout(feedbackTimer);
    feedback.classList.remove("is-visible");
    target.classList.remove("is-active");
  }

  function closeGame() {
    stopGame();
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    startScreen.classList.remove("is-hidden");
    document.getElementById("openGame").focus();
  }

  function moveTarget() {
    if (!playing) return;
    const padding = 18;
    const size = target.offsetWidth;
    const maxX = Math.max(padding, arena.clientWidth - size - padding);
    const maxY = Math.max(padding, arena.clientHeight - size - padding);
    const nextX = padding + Math.random() * (maxX - padding);
    target.style.left = `${nextX}px`;
    target.style.top = `${padding + Math.random() * (maxY - padding)}px`;
    const movingLeft = previousTargetX && nextX < previousTargetX;
    targetImage.style.transform = `scaleX(${movingLeft ? -1 : 1}) rotate(${Math.random() * 8 - 4}deg)`;
    previousTargetX = nextX;
    target.classList.remove("hit");
    target.classList.add("is-active");
    window.clearTimeout(moveTimer);
    moveTimer = window.setTimeout(moveTarget, Math.max(430, 1050 - score * 25));
  }

  function finishGame() {
    const finalMessage = score < 10
      ? "JAJAJA... ¡MÁS SUERTE PARA LA PRÓXIMA!"
      : score < 20
        ? "CASI LA TIENES. TU PULSO ESTÁ MEJORANDO."
        : "¡PULSO PERFECTO! LA FUGITIVA NO TUVO OPORTUNIDAD.";
    stopGame();
    startScreen.classList.remove("is-hidden");
    startScreen.querySelector("h2").textContent = `${score} capturas`;
    startScreen.querySelector("p").textContent = finalMessage;
    startButton.textContent = "Jugar otra vez";
    message.textContent = "La fugitiva volvió a esconderse";
    startButton.focus();
  }

  function startGame() {
    stopGame();
    score = 0;
    timeLeft = 30;
    previousTargetX = 0;
    playing = true;
    scoreDisplay.textContent = "00";
    timeDisplay.textContent = "30";
    message.textContent = "¡No la pierdas de vista!";
    startScreen.classList.add("is-hidden");
    moveTarget();
    timer = window.setInterval(() => {
      timeLeft -= 1;
      timeDisplay.textContent = String(timeLeft).padStart(2, "0");
      const elapsed = 30 - timeLeft;
      evaluatePace(elapsed);
      if (timeLeft === 5) showFeedback("¡TU TIEMPO SE TERMINA!", "danger", 1800);
      if (timeLeft <= 0) finishGame();
    }, 1000);
  }

  target.addEventListener("click", () => {
    if (!playing) return;
    score += 1;
    scoreDisplay.textContent = formatScore(score);
    target.classList.add("hit");
    window.clearTimeout(moveTimer);
    window.setTimeout(moveTarget, 90);
  });

  document.getElementById("openGame").addEventListener("click", openGame);
  startButton.addEventListener("click", startGame);
  document.querySelectorAll("[data-close-game]").forEach((button) => button.addEventListener("click", closeGame));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) closeGame();
  });
});
