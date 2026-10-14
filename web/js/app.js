import { Game } from "./game.js";
import { LEVELS, TOTAL_HAZARDS, formatTime } from "./content.js";
import { drawHero } from "./art.js";

const $ = (id) => document.getElementById(id);
const modal = $("modal");
let confirmModal = () => {},
  screen = "home",
  token = null,
  runPromise = null,
  submitted = false;
let networkGeneration = 0,
  clockLabel = "",
  restoredMessage = "",
  fetchBoardGeneration = 0;
const touch = matchMedia("(pointer: coarse)").matches;
const portrait = () =>
  matchMedia("(max-width: 900px) and (orientation: portrait)").matches;
function showScreen(name) {
  screen = name;
  for (const id of ["home", "game-screen", "summary"])
    $(id).classList.toggle("hidden", id !== name);
  document.body.classList.toggle("playing", name === "game-screen");
}
function showModal({
  kicker = "",
  title,
  text = "",
  body,
  symbol = "✦",
  button = "Continuer →",
  onConfirm,
}) {
  game.setPaused(true);
  $("modal-kicker").textContent = kicker;
  $("modal-title").textContent = title;
  $("modal-symbol").textContent = symbol;
  $("modal-confirm").textContent = button;
  $("modal-body").replaceChildren();
  if (text) {
    const p = document.createElement("p");
    p.textContent = text;
    $("modal-body").append(p);
  }
  if (body) $("modal-body").append(body);
  confirmModal = onConfirm || resume;
  if (!modal.open) modal.showModal();
}
function resume() {
  if (document.hidden || portrait()) {
    game.setPaused(true);
    return;
  }
  if (screen === "game-screen") {
    game.setPaused(false);
    $("game").focus({ preventScroll: true });
  }
}
function pause() {
  if (screen !== "game-screen" || modal.open) return;
  showModal({
    kicker: "ON SOUFFLE UN INSTANT",
    title: "Mission en pause.",
    text: "Oscar vous attend. Prenez le temps qu’il vous faut : le chronomètre est arrêté.",
    symbol: "Ⅱ",
    button: "Reprendre la mission →",
  });
}
const game = new Game($("game"), {
  level(level, index) {
    $("level-number").textContent = `MISSION 0${index + 1} / 02`;
    $("level-name").textContent = level.name;
    $("counter").textContent = "0 / 5 dangers sécurisés";
    $("clock").textContent = formatTime(game.totalTime);
    $("world-caption").textContent = level.subtitle;
    $("interaction").classList.add("hidden");
    $("route-hint").textContent =
      "Suivez les flèches · approchez-vous des dangers signalés →";
  },
  near(h) {
    $("interaction").classList.toggle("hidden", !h);
    if (h) {
      $("danger-title").textContent = h.title;
      $("action-text").textContent = h.action;
    }
  },
  progress(hazards) {
    $("counter").textContent =
      `${hazards.filter((h) => h.secured).length} / 5 sécurisés · ${hazards.filter((h) => h.identified).length} repérés`;
  },
  secured(h) {
    showModal({
      kicker: "UN BON RÉFLEXE DE PLUS",
      title: h.title,
      text: h.message,
      symbol: "✓",
      button: "Poursuivre la tournée →",
    });
  },
  recovered() {
    restoredMessage =
      "Retour en zone sûre. Votre progression est conservée. Pensez à sauter au bord de la passerelle.";
    $("route-hint").textContent = restoredMessage;
  },
  exitBlocked(h) {
    $("route-hint").textContent =
      `Il reste un danger : ${h.title}. Revenez sur vos pas ←`;
  },
  clock(value) {
    if (clockLabel !== value) {
      clockLabel = value;
      $("clock").textContent = value;
    }
  },
  finished(index, results) {
    showSummary(index, results);
  },
});

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  try {
    const response = await fetch(new URL(`api/${path}`, document.baseURI), {
      ...options,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
    const data = await response.json();
    if (!response.ok)
      throw new Error(
        data.error || "Le tableau est temporairement indisponible.",
      );
    return data;
  } catch (error) {
    if (
      error instanceof SyntaxError ||
      error.name === "AbortError" ||
      error instanceof TypeError
    )
      throw new Error(
        "Le tableau est temporairement indisponible. Vous pouvez continuer à jouer.",
      );
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
function startRun() {
  const generation = ++networkGeneration;
  token = null;
  runPromise = request("runs", { method: "POST", body: "{}" })
    .then((data) => {
      if (generation === networkGeneration) token = data.token;
    })
    .catch(() => {});
}
function tutorial(index = 0) {
  const controls = document.createElement("div");
  controls.className = "controls-list";
  controls.textContent = touch
    ? "← → Se déplacer · ↥ Sauter · Bouton jaune : sécuriser un danger à proximité."
    : "← → Se déplacer · Espace : sauter · E : sécuriser un danger à proximité.";
  showModal({
    kicker: `SITE 0${index + 1} · ${LEVELS[index].name.toUpperCase()}`,
    title: index ? "Cap sur l’usine." : "Bienvenue dans l’équipe, Oscar.",
    text: "Repérez les cinq dangers, approchez-vous et choisissez le bon réflexe. Rejoignez ensuite la sortie, sans course contre la montre. Les sauts sont une mécanique de jeu : sur un vrai site, empruntez uniquement les cheminements sécurisés.",
    body: controls,
    button: "Commencer la tournée →",
  });
}
function start() {
  submitted = false;
  $("score-form").classList.remove("hidden");
  $("score-form").reset();
  $("score-status").textContent = "";
  $("copy-status").textContent = "";
  startRun();
  showScreen("game-screen");
  game.start();
  orientation();
  tutorial();
}
function showSummary(index, results) {
  showScreen("summary");
  const final = index === LEVELS.length - 1;
  $("summary-kicker").textContent = final
    ? "MISSION ACCOMPLIE · 2 SITES SÉCURISÉS"
    : `SITE 0${index + 1} · TOURNÉE TERMINÉE`;
  $("summary-title").textContent = final
    ? "Site sécurisé."
    : "Raffinerie sécurisée.";
  $("summary-message").textContent = final
    ? "Site sécurisé : bravo, vous contribuez à la prévention des accidents."
    : "Cinq dangers, cinq bons réflexes. La prévention continue à l’usine.";
  const selected = final ? results : [results[index]],
    total = final ? TOTAL_HAZARDS : 5;
  const data = [
    [
      `${selected.reduce((n, r) => n + r.identified, 0)} / ${total}`,
      "dangers identifiés",
    ],
    [
      `${selected.reduce((n, r) => n + r.secured, 0)} / ${total}`,
      "dangers sécurisés",
    ],
    [
      formatTime(selected.reduce((n, r) => n + r.time, 0)),
      "de prévention active · hors pauses",
    ],
  ];
  $("stats").replaceChildren(
    ...data.map(([value, label]) => {
      const div = document.createElement("div");
      div.className = "stat";
      const strong = document.createElement("strong"),
        span = document.createElement("span");
      strong.textContent = value;
      span.textContent = label;
      div.append(strong, span);
      return div;
    }),
  );
  $("advice").textContent = LEVELS[index].tip;
  $("level-actions").classList.toggle("hidden", final);
  $("final-actions").classList.toggle("hidden", !final);
  $("summary-title").focus({ preventScroll: true });
  window.scrollTo(0, 0);
  if (final) {
    updateShare();
    loadBoard();
  }
}
async function loadBoard() {
  const generation = ++fetchBoardGeneration;
  $("refresh-board").disabled = true;
  try {
    const data = await request("scores");
    if (generation !== fetchBoardGeneration) return;
    $("leaderboard").replaceChildren(
      ...data.scores.map((entry) => {
        const li = document.createElement("li"),
          b = document.createElement("b"),
          span = document.createElement("span"),
          date = document.createElement("time");
        b.textContent = entry.initials;
        span.textContent = `${entry.secured} / 10 · ${formatTime(entry.duration_ms / 1000)}`;
        date.dateTime = entry.created_at;
        date.textContent = new Date(entry.created_at).toLocaleDateString(
          "fr-FR",
        );
        li.append(b, span, date);
        return li;
      }),
    );
    if (!data.scores.length) {
      const li = document.createElement("li");
      li.textContent = "La première signature pourrait être la vôtre.";
      $("leaderboard").append(li);
    }
    if (!submitted)
      setStatus(
        "score-status",
        "Une mission terminée, une place dans le tableau. L’inscription reste facultative.",
      );
  } catch (error) {
    if (generation === fetchBoardGeneration)
      setStatus("score-status", error.message, true);
  } finally {
    if (generation === fetchBoardGeneration)
      $("refresh-board").disabled = false;
  }
}
function setStatus(id, text, error = false) {
  $(id).textContent = text;
  $(id).className = error ? "error" : "success";
}
function shareURL() {
  const url = new URL(".", location.href);
  url.search = "";
  url.hash = "";
  return url.href;
}
function updateShare() {
  $("share-text").textContent =
    `J’ai terminé « Oscar, mission zéro accident » : 10 dangers sécurisés sur 10 ! Une courte mission pour découvrir les bons réflexes de prévention. À vous de jouer : ${shareURL()}`;
  $("linkedin").href =
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareURL())}`;
}
function orientation() {
  const wasBlocked = !$("orientation").classList.contains("hidden");
  const blocked = screen === "game-screen" && portrait();
  $("orientation").classList.toggle("hidden", !blocked);
  if (blocked) {
    game.setPaused(true);
    if (!modal.open) pause();
  } else if (wasBlocked && screen === "game-screen" && !modal.open) pause();
}
$("play").addEventListener("click", start);
$("replay").addEventListener("click", start);
$("next-level").addEventListener("click", () => {
  showScreen("game-screen");
  game.loadLevel(1);
  orientation();
  tutorial(1);
});
$("pause").addEventListener("click", pause);
$("secure").addEventListener("click", () => game.interact());
$("modal-confirm").addEventListener("click", () => {
  modal.close();
  confirmModal();
});
modal.addEventListener("cancel", (event) => {
  event.preventDefault();
});
$("refresh-board").addEventListener("click", loadBoard);
$("initials").addEventListener("input", (event) => {
  event.target.value = event.target.value.replace(/[^a-z]/gi, "").toUpperCase();
});
$("score-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (submitted) return;
  const button = event.submitter;
  button.disabled = true;
  try {
    await runPromise;
    if (!token)
      throw new Error(
        "Inscription indisponible pour cette partie : la connexion au tableau manquait au départ. Vous pouvez rejouer, sans obligation de vous inscrire.",
      );
    const result = await request("scores", {
      method: "POST",
      body: JSON.stringify({
        token,
        initials: $("initials").value.toUpperCase(),
        duration_ms: Math.round(game.totalTime * 1000),
        trace: game.trace,
      }),
    });
    submitted = true;
    $("score-form").classList.add("hidden");
    await loadBoard();
    setStatus(
      "score-status",
      result.duplicate
        ? "Votre mission figurait déjà au tableau. Merci !"
        : "Mission inscrite. Merci de faire avancer la prévention !",
    );
  } catch (error) {
    setStatus("score-status", error.message, true);
  } finally {
    button.disabled = false;
  }
});
$("copy-share").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText($("share-text").textContent);
    setStatus(
      "copy-status",
      "Texte copié. Collez-le dans votre publication LinkedIn.",
    );
  } catch {
    const area = document.createElement("textarea");
    area.value = $("share-text").textContent;
    area.readOnly = true;
    showModal({
      title: "Votre texte à partager",
      text: "Sélectionnez puis copiez ce texte.",
      body: area,
      button: "Fermer",
      onConfirm: () => {},
    });
    area.select();
  }
});
$("privacy-open").addEventListener("click", () =>
  showModal({
    title: "Votre signature, simplement.",
    text: "L’inscription est facultative, sans compte ni e-mail. Les trois lettres, le nombre de dangers sécurisés et le temps sont publics. Seules les 20 dernières inscriptions sont conservées en base active. Les jetons techniques expirent après 24 heures ; les limites réseau sont temporaires. Le gestionnaire du serveur peut retirer une inscription. Des copies peuvent subsister dans les sauvegardes YunoHost selon leur durée de conservation. Aucun outil de suivi publicitaire n’est utilisé.",
    button: "Compris",
    onConfirm: () => {},
  }),
);
const keyMap = { ArrowLeft: "left", ArrowRight: "right", " ": "jump" };
window.addEventListener("keydown", (event) => {
  if (screen !== "game-screen" || modal.open || portrait()) return;
  if (keyMap[event.key]) {
    event.preventDefault();
    game.setControl(keyMap[event.key], true);
  }
  if (event.key.toLowerCase() === "e" && !event.repeat) {
    event.preventDefault();
    game.interact();
  }
  if (event.key === "Escape" || event.key.toLowerCase() === "p") pause();
});
window.addEventListener("keyup", (event) => {
  if (keyMap[event.key]) game.setControl(keyMap[event.key], false);
});
document.querySelectorAll("[data-control]").forEach((button) => {
  const release = () => {
    game.setControl(button.dataset.control, false);
    button.classList.remove("active");
  };
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    button.setPointerCapture(event.pointerId);
    if (!game.paused) {
      game.setControl(button.dataset.control, true);
      button.classList.add("active");
    }
  });
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("lostpointercapture", release);
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pause();
});
window.addEventListener("blur", () => {
  game.keys.clear();
  if (screen === "game-screen") pause();
});
window.addEventListener("resize", orientation);
drawHero($("hero"));
