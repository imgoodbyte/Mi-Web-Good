document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("gameModal");
  const arena = document.getElementById("arena");
  const target = document.getElementById("target");
  const startScreen = document.getElementById("gameStart");
  const startButton = document.getElementById("startGame");
  const scoreDisplay = document.getElementById("score");
  const timeDisplay = document.getElementById("time");
  const message = document.getElementById("gameMessage");
  let score = 0;
  let timeLeft = 30;
  let timer = null;
  let moveTimer = null;
  let playing = false;

  const formatScore = (value) => String(value).padStart(2, "0");

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
    target.style.left = `${padding + Math.random() * (maxX - padding)}px`;
    target.style.top = `${padding + Math.random() * (maxY - padding)}px`;
    target.classList.remove("hit");
    target.classList.add("is-active");
    window.clearTimeout(moveTimer);
    moveTimer = window.setTimeout(moveTarget, Math.max(430, 1050 - score * 25));
  }

  function finishGame() {
    stopGame();
    startScreen.classList.remove("is-hidden");
    startScreen.querySelector("h2").textContent = `${score} pulsos`;
    startScreen.querySelector("p").textContent = score < 12 ? "Buen comienzo. La luz aún puede sorprenderte." : score < 22 ? "¡Muy buenos reflejos! El pulso casi no pudo escapar." : "Increíble. Parece que puedes ver el futuro.";
    startButton.textContent = "Jugar otra vez";
    message.textContent = "Partida terminada";
    startButton.focus();
  }

  function startGame() {
    stopGame();
    score = 0;
    timeLeft = 30;
    playing = true;
    scoreDisplay.textContent = "00";
    timeDisplay.textContent = "30";
    message.textContent = "Sigue el pulso";
    startScreen.classList.add("is-hidden");
    moveTarget();
    timer = window.setInterval(() => {
      timeLeft -= 1;
      timeDisplay.textContent = String(timeLeft).padStart(2, "0");
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
