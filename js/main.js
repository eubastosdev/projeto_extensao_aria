(() => {
  "use strict";

  const root = document.documentElement;
  const storageKey = "web-para-todos-preferencias";
  const defaults = { font: 100, contrast: false, links: false };
  let preferences = { ...defaults };

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (saved && typeof saved === "object") {
      preferences.font = Number.isFinite(saved.font) ? Math.min(137.5, Math.max(87.5, saved.font)) : 100;
      preferences.contrast = saved.contrast === true;
      preferences.links = saved.links === true;
    }
  } catch (_) {
    // O site continua utilizável quando o armazenamento do navegador está indisponível.
  }

  const decrease = document.getElementById("font-decrease");
  const increase = document.getElementById("font-increase");
  const contrast = document.getElementById("contrast-toggle");
  const links = document.getElementById("links-toggle");
  const status = document.getElementById("access-status");
  const menu = document.getElementById("access-menu");

  function applyPreferences(message = "") {
    root.style.fontSize = `${preferences.font}%`;
    root.dataset.contrast = preferences.contrast ? "high" : "normal";
    root.dataset.highlightLinks = String(preferences.links);
    contrast.setAttribute("aria-pressed", String(preferences.contrast));
    links.setAttribute("aria-pressed", String(preferences.links));
    decrease.disabled = preferences.font <= 87.5;
    increase.disabled = preferences.font >= 137.5;
    status.textContent = message;
    try { localStorage.setItem(storageKey, JSON.stringify(preferences)); } catch (_) { /* Opcional. */ }
  }

  decrease.addEventListener("click", () => {
    preferences.font = Math.max(87.5, preferences.font - 12.5);
    applyPreferences(`Tamanho do texto: ${preferences.font}%.`);
  });
  increase.addEventListener("click", () => {
    preferences.font = Math.min(137.5, preferences.font + 12.5);
    applyPreferences(`Tamanho do texto: ${preferences.font}%.`);
  });
  contrast.addEventListener("click", () => {
    preferences.contrast = !preferences.contrast;
    applyPreferences(preferences.contrast ? "Alto contraste ativado." : "Alto contraste desativado.");
  });
  links.addEventListener("click", () => {
    preferences.links = !preferences.links;
    applyPreferences(preferences.links ? "Destaque de links ativado." : "Destaque de links desativado.");
  });
  document.getElementById("access-reset").addEventListener("click", () => {
    preferences = { ...defaults };
    applyPreferences("Preferências restauradas.");
  });
  applyPreferences();

  // A altura do cabeçalho fixo muda com a largura da tela e o tamanho do texto.
  // O CSS usa esse valor para que âncoras e o painel de ajustes não fiquem escondidos atrás dele.
  const header = document.querySelector(".site-header");
  const syncHeaderHeight = () => root.style.setProperty("--header-h", `${header.offsetHeight}px`);
  syncHeaderHeight();
  if ("ResizeObserver" in window) new ResizeObserver(syncHeaderHeight).observe(header);
  else window.addEventListener("resize", syncHeaderHeight);

  document.addEventListener("click", (event) => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  // Fecha o painel quando o foco do teclado sai dele, para não cobrir o conteúdo seguinte.
  menu.addEventListener("focusout", (event) => {
    if (event.relatedTarget && !menu.contains(event.relatedTarget)) menu.open = false;
  });
  menu.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      menu.open = false;
      menu.querySelector("summary").focus();
    }
  });

  // Os vídeos são fornecidos pela equipe. O placeholder some somente quando um MP4 válido é encontrado.
  const mainVideo = document.getElementById("main-video");
  const librasVideo = document.getElementById("libras-video");
  const mediaShells = [document.getElementById("main-video-shell"), document.getElementById("libras-video-shell")];
  const librasCaption = document.getElementById("libras-caption");
  let syncEnabled = false;

  // A sincronia só liga quando os dois vídeos existem; com um só, o player funciona sozinho.
  function updateSync() {
    syncEnabled = mediaShells.every((shell) => shell.classList.contains("is-ready"));
    if (!syncEnabled) return;
    librasVideo.muted = true; // O áudio vem do vídeo principal.
    librasCaption.textContent = "O vídeo em Libras acompanha o vídeo principal: reproduzir, pausar ou avançar um deles controla os dois.";
  }

  [mainVideo, librasVideo].forEach((video, index) => {
    const shell = mediaShells[index];
    const setReady = (ready) => { shell.classList.toggle("is-ready", ready); updateSync(); };
    video.addEventListener("loadedmetadata", () => setReady(true));
    video.addEventListener("error", () => setReady(false));
    // Se os metadados chegaram antes deste script rodar, o evento já passou: confira o estado atual.
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) setReady(true);
  });

  // Sincronia nos dois sentidos: quem usa só o player de Libras (por exemplo, em tela cheia) também controla o principal.
  // Cada espelhamento só age quando há diferença, o que evita que um vídeo fique respondendo ao outro em laço.
  const maxDrift = 0.3; // segundos de diferença tolerados antes de realinhar

  function mirror(source, target) {
    // Se o alvo for mais curto e a origem já passou do fim dele, não há o que acompanhar.
    const canFollow = () => !Number.isFinite(target.duration) || source.currentTime < target.duration - maxDrift;
    const alignTime = () => {
      if (canFollow() && Math.abs(target.currentTime - source.currentTime) > maxDrift) target.currentTime = source.currentTime;
    };
    const follow = () => {
      if (!syncEnabled || !target.paused || !canFollow()) return;
      alignTime();
      const started = target.play();
      if (started) started.catch(() => { /* O navegador pode bloquear; o vídeo de origem segue tocando. */ });
    };
    source.addEventListener("play", follow);
    source.addEventListener("pause", () => {
      if (syncEnabled && !source.ended && !target.paused) target.pause();
    });
    source.addEventListener("seeking", () => { if (syncEnabled) alignTime(); });
    source.addEventListener("ratechange", () => {
      if (syncEnabled && target.playbackRate !== source.playbackRate) target.playbackRate = source.playbackRate;
    });
    return { alignTime, follow };
  }

  const librasFollowsMain = mirror(mainVideo, librasVideo);
  mirror(librasVideo, mainVideo);
  // O principal é a referência: durante a reprodução, corrige pequenos atrasos do vídeo de Libras
  // e o retoma se ele tiver ficado parado (por exemplo, ao voltar para um trecho que ele cobre).
  mainVideo.addEventListener("timeupdate", () => {
    if (!syncEnabled || mainVideo.paused || mainVideo.seeking || librasVideo.seeking) return;
    librasFollowsMain.alignTime();
    librasFollowsMain.follow();
  });
  mainVideo.addEventListener("ended", () => { if (syncEnabled) librasVideo.pause(); });

  const examples = {
    imagem: {
      category: "CONTEÚDO VISUAL",
      title: "A informação está na imagem. E se você não puder vê-la?",
      icon: "✦", visualTitle: "Inscrições abertas", visualDetail: "Workshop de acessibilidade · 18h",
      barrier: "Sem texto alternativo, o conteúdo da imagem pode não chegar a quem usa leitor de telas.",
      fix: "Descreva a informação essencial no atributo <code>alt</code> ou em texto próximo.",
      code: '<img src="cartaz.jpg" alt="Inscrições abertas para workshop de acessibilidade às 18h">'
    },
    teclado: {
      category: "NAVEGAÇÃO",
      title: "E se uma função responder apenas ao clique do mouse?",
      icon: "⌨", visualTitle: "Abrir informações", visualDetail: "Uma ação deve receber foco e responder a Enter ou Espaço.",
      barrier: "Uma área clicável improvisada pode ficar fora da ordem de tabulação e não funcionar com teclado.",
      fix: "Use um botão HTML nativo para ações. Ele já oferece comportamento de teclado esperado.",
      code: '<button type="button" aria-label="Abrir informações do workshop">Abrir informações</button>'
    },
    video: {
      category: "CONTEÚDO AUDIOVISUAL",
      title: "E se a mensagem estiver apenas no áudio do vídeo?",
      icon: "▣", visualTitle: "Vídeo de apresentação", visualDetail: "Legenda: uma forma de acompanhar a fala e sons importantes.",
      barrier: "Sem alternativas textuais, parte do público não consegue acompanhar o áudio.",
      fix: "Associe um arquivo de legendas ao vídeo e ofereça uma transcrição revisada.",
      code: '<video controls>\n  <source src="video.mp4" type="video/mp4">\n  <track kind="captions" src="legenda.vtt" srclang="pt-BR" label="Português">\n</video>'
    }
  };

  const choices = [...document.querySelectorAll(".lab-choice")];
  const codePanel = document.getElementById("lab-code");
  const codeButton = document.getElementById("show-code");
  const visual = document.getElementById("lab-visual");
  const labStatus = document.getElementById("lab-status");

  function selectExample(key) {
    const example = examples[key];
    if (!example) return;
    let label = "";
    choices.forEach((button) => {
      const selected = button.dataset.lab === key;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
      if (selected) label = button.querySelector("strong").textContent;
    });
    document.getElementById("lab-category").textContent = example.category;
    document.getElementById("lab-demo-title").textContent = example.title;
    visual.querySelector("span").textContent = example.icon;
    visual.querySelector("strong").textContent = example.visualTitle;
    visual.querySelector("small").textContent = example.visualDetail;
    document.getElementById("lab-barrier").textContent = example.barrier;
    document.getElementById("lab-fix").innerHTML = example.fix; // Texto fixo deste arquivo, com <code>.
    codePanel.querySelector("code").textContent = example.code;
    codePanel.hidden = true;
    codeButton.setAttribute("aria-expanded", "false");
    codeButton.innerHTML = 'Ver exemplo de código <span aria-hidden="true">↓</span>';
    labStatus.textContent = `Exemplo exibido: ${label}.`;
  }

  choices.forEach((button) => button.addEventListener("click", () => selectExample(button.dataset.lab)));
  codeButton.addEventListener("click", () => {
    const expanded = codeButton.getAttribute("aria-expanded") === "true";
    codePanel.hidden = expanded;
    codeButton.setAttribute("aria-expanded", String(!expanded));
    codeButton.innerHTML = expanded ? 'Ver exemplo de código <span aria-hidden="true">↓</span>' : 'Ocultar exemplo de código <span aria-hidden="true">↑</span>';
  });

  const quiz = document.getElementById("quiz-form");
  const quizFeedback = document.getElementById("quiz-feedback");
  const answers = { q1: "b", q2: "a", q3: "a" };

  quiz.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = Object.keys(answers);
    const missing = fields.find((name) => !quiz.querySelector(`input[name="${name}"]:checked`));
    if (missing) {
      quizFeedback.textContent = "Responda às três perguntas para ver o resultado.";
      quiz.querySelector(`input[name="${missing}"]`).focus();
      return;
    }
    let score = 0;
    fields.forEach((name) => {
      const selected = quiz.querySelector(`input[name="${name}"]:checked`).value;
      const fieldset = quiz.querySelector(`input[name="${name}"]`).closest("fieldset");
      const correct = selected === answers[name];
      fieldset.classList.toggle("is-correct", correct);
      fieldset.classList.toggle("is-incorrect", !correct);
      if (correct) score += 1;
    });
    quizFeedback.textContent = score === 3 ? "3 de 3! Você identificou as escolhas acessíveis." : `${score} de 3. Reveja as perguntas marcadas e tente novamente.`;
  });
  quiz.addEventListener("change", () => {
    quizFeedback.textContent = "";
    quiz.querySelectorAll("fieldset").forEach((fieldset) => fieldset.classList.remove("is-correct", "is-incorrect"));
  });
})();
