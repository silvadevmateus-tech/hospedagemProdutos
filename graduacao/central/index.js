// <![CDATA[
(function () {
  var TZ_OFFSET = "-03:00";
  var ANO_ATUAL = new Date().getFullYear();

  var MESES = {
    janeiro: 1,
    jan: 1,
    fevereiro: 2,
    fev: 2,
    março: 3,
    marco: 3,
    mar: 3,
    abril: 4,
    abr: 4,
    maio: 5,
    mai: 5,
    junho: 6,
    jun: 6,
    julho: 7,
    jul: 7,
    agosto: 8,
    ago: 8,
    setembro: 9,
    set: 9,
    outubro: 10,
    out: 10,
    novembro: 11,
    nov: 11,
    dezembro: 12,
    dez: 12
  };

  function stripTags(s) {
    return String(s || "")
      .replace(/<[^>]*>/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  function pad(n) {
    return String(n).padStart(2, "0");
  }
  function toISO(y, m, d, h, mi) {
    return (
      y +
      "-" +
      pad(m) +
      "-" +
      pad(d) +
      "T" +
      pad(h) +
      ":" +
      pad(mi) +
      ":00" +
      TZ_OFFSET
    );
  }

  function formatPtBR(isoStr) {
    if (!isoStr) return "";
    var d = new Date(isoStr);
    if (isNaN(d.getTime())) return "";
    var mesesPt = [
      "janeiro",
      "fevereiro",
      "março",
      "abril",
      "maio",
      "junho",
      "julho",
      "agosto",
      "setembro",
      "outubro",
      "novembro",
      "dezembro"
    ];
    var dia = String(d.getDate()).padStart(2, "0");
    var mes = mesesPt[d.getMonth()];
    var ano = d.getFullYear();
    return ano === ANO_ATUAL
      ? dia + " de " + mes
      : dia + " de " + mes + " de " + ano;
  }

  function mesStrToNum(s) {
    if (!s) return null;
    var k = stripTags(s)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return MESES[k] || null;
  }

  function parseFaixa(textoDatas) {
    var txt = String(textoDatas || "")
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();

    txt = txt.replace(/\s+de\s+/g, " de ");

    txt = txt.replace(
      /^(\d{1,2})\s*de\s*([a-zçã\.]+)\s*a\s*(\d{1,2})\s*de\s*([a-zçã\.]+)$/i,
      (_, d1, m1, d2, m2) => d1 + " de " + m1 + " a " + d2 + " de " + m2
    );
    txt = txt.replace(
      /^(\d{1,2})\s*([a-zçã\.]+)\s*a\s*(\d{1,2})\s*([a-zçã\.]+)$/i,
      (_, d1, m1, d2, m2) => d1 + " de " + m1 + " a " + d2 + " de " + m2
    );

    var m0 = txt.match(/^(\d{1,2})\s*a\s*(\d{1,2})\s*([a-zçã\.]+)$/i);
    if (m0) {
      var d0a = parseInt(m0[1], 10),
        d0b = parseInt(m0[2], 10);
      var mes0 = mesStrToNum(m0[3]);
      var ano0 = ANO_ATUAL;
      return {
        startISO: toISO(ano0, mes0, d0a, 0, 0),
        endISO: toISO(ano0, mes0, d0b, 23, 59)
      };
    }

    var m1 = txt.match(
      /^(\d{1,2})\s*a\s*(\d{1,2})\s*de\s*([a-zçã\.]+)(?:\s*de\s*(\d{4}))?$/i
    );
    if (m1) {
      var d1 = parseInt(m1[1], 10),
        d2 = parseInt(m1[2], 10);
      var mes = mesStrToNum(m1[3]);
      var ano = m1[4] ? parseInt(m1[4], 10) : ANO_ATUAL;
      return {
        startISO: toISO(ano, mes, d1, 0, 0),
        endISO: toISO(ano, mes, d2, 23, 59)
      };
    }

    var m2 = txt.match(
      /^(\d{1,2})\s*de\s*([a-zçã\.]+)\s*a\s*(\d{1,2})\s*de\s*([a-zçã\.]+)(?:\s*de\s*(\d{4}))?$/i
    );
    if (m2) {
      var d1b = parseInt(m2[1], 10),
        mes1b = mesStrToNum(m2[2]);
      var d2b = parseInt(m2[3], 10),
        mes2b = mesStrToNum(m2[4]);
      var anoIni = m2[5] ? parseInt(m2[5], 10) : ANO_ATUAL;
      var anoFim = m2[5] ? parseInt(m2[5], 10) : ANO_ATUAL;
      return {
        startISO: toISO(anoIni, mes1b, d1b, 0, 0),
        endISO: toISO(anoFim, mes2b, d2b, 23, 59)
      };
    }

    var m3 = txt.match(
      /^(\d{1,2})\s*a\s*(\d{1,2})\s*([a-zçã\.]+)\s*de\s*(\d{4})$/i
    );
    if (m3) {
      var d13 = parseInt(m3[1], 10),
        d23 = parseInt(m3[2], 10);
      var mes3 = mesStrToNum(m3[3]);
      var ano3 = parseInt(m3[4], 10);
      return {
        startISO: toISO(ano3, mes3, d13, 0, 0),
        endISO: toISO(ano3, mes3, d23, 23, 59)
      };
    }

    var m4 = txt.match(
      /^(\d{1,2})(?:\s*de)?\s*([a-zçã\.]+)\s*de\s*(\d{4})$/i
    );
    if (m4) {
      var d4 = parseInt(m4[1], 10);
      var mes4 = mesStrToNum(m4[2]);
      var ano4 = parseInt(m4[3], 10);
      return {
        startISO: toISO(ano4, mes4, d4, 0, 0),
        endISO: toISO(ano4, mes4, d4, 23, 59)
      };
    }

    var m5 = txt.match(/^(\d{1,2})(?:\s*de)?\s*([a-zçã\.]+)$/i);
    if (m5) {
      var d5 = parseInt(m5[1], 10);
      var mes5 = mesStrToNum(m5[2]);
      var ano5 = ANO_ATUAL;
      return {
        startISO: toISO(ano5, mes5, d5, 0, 0),
        endISO: toISO(ano5, mes5, d5, 23, 59)
      };
    }

    var m6 = txt.match(
      /^(\d{1,2})\s*e\s*(\d{1,2})\s*de\s*([a-zçã\.]+)\s*de\s*(\d{4})$/i
    );
    if (m6) {
      var dA = parseInt(m6[1], 10),
        dB = parseInt(m6[2], 10);
      var mes6 = mesStrToNum(m6[3]);
      var ano6 = parseInt(m6[4], 10);
      var di = Math.min(dA, dB),
        df = Math.max(dA, dB);
      return {
        startISO: toISO(ano6, mes6, di, 0, 0),
        endISO: toISO(ano6, mes6, df, 23, 59)
      };
    }

    return null;
  }

  function coletarEventosDoBanner() {
    var eventos = [];
    var linhas = document.querySelectorAll(
      "#banner-default-view table tbody tr"
    );
    linhas.forEach(function (tr) {
      var tds = tr.querySelectorAll("td");
      if (tds.length < 2) return;

      var titulo = stripTags(tds[0].textContent);
      var datasRaw = tds[1].innerHTML || tds[1].textContent;
      var datas = stripTags(String(datasRaw).replace(/\u00A0/g, " "));
      if (!titulo || !datas) return;

      var faixa = parseFaixa(datas);
      if (!faixa) return;

      eventos.push({
        titulo: titulo,
        dataInicioISO: faixa.startISO,
        dataFimISO: faixa.endISO,
        dataInicioTxt: formatPtBR(faixa.startISO),
        dataFimTxt: formatPtBR(faixa.endISO)
      });
    });
    return eventos;
  }

  function pintar(card, estado) {
    var badge = card.querySelector(".kit-badge");
    var entrega = card.querySelector(".kit-entrega");
    var timer = card.querySelector(".kit-timer");

    card.style.background = "";
    card.style.borderColor = "#e0e0e0";
    card.style.color = "#000";
    if (entrega) entrega.style.color = "#000";
    if (timer) timer.style.color = "#000";
    if (badge) {
      badge.style.display = "none";
      badge.style.background = "#004080";
      badge.style.color = "#fff";
    }

    function showBadge(txt, bg) {
      if (!badge) return;
      badge.textContent = txt;
      badge.style.background = bg;
      badge.style.display = "inline-block";
    }

    if (estado === "sem_prazo") {
      card.style.background = "linear-gradient(180deg, #bdbdbd, #f5f5f5)";
      card.style.borderColor = "#bdbdbd";
      showBadge("Sem prazo", "#757575");
    }
    if (estado === "a_iniciar") {
      card.style.background = "linear-gradient(180deg, #e3f2fd, #ffffff)";
      card.style.borderColor = "#90caf9";
      showBadge("A iniciar", "#1565c0");
    }
    if (estado === "no_prazo") {
      card.style.background = "linear-gradient(180deg, #e8f5e9, #ffffff)";
      card.style.borderColor = "#a5d6a7";
      showBadge("No prazo", "#2e7d32");
    }
    if (estado === "finalizando") {
      card.style.background = "linear-gradient(180deg, #fff3e0, #ffffff)";
      card.style.borderColor = "#ffcc80";
      showBadge("Finalizando", "#ef6c00");
    }
    if (estado === "encerrado") {
      card.style.background = "linear-gradient(180deg, #ff5252, #ff1744)";
      card.style.borderColor = "#c62828";
      card.style.boxShadow = "0 0 0 1px rgba(198,40,40,0.35) inset";
      card.style.color = "#fff";
      if (entrega) entrega.style.color = "#fff";
      if (timer) timer.style.color = "#fff";
      showBadge("Encerrado", "#b71c1c");
    }
  }

  function initBlock(block) {
    var timerEl = block.querySelector(".kit-timer[data-deadline]");
    if (!timerEl) return;
    var startStr = timerEl.getAttribute("data-start");
    var deadlineStr = timerEl.getAttribute("data-deadline");
    if (!deadlineStr) {
      pintar(block, "sem_prazo");
      timerEl.textContent = "Data de prazo não definida";
      return;
    }

    var start = startStr ? new Date(startStr) : null;
    var end = new Date(deadlineStr);
    if (isNaN(end.getTime())) {
      timerEl.textContent = "Data de prazo inválida";
      return;
    }

    function tick() {
      var now = new Date();

      if (start && now < start) {
        timerEl.style.display = "none";
        pintar(block, "a_iniciar");
        return;
      } else {
        timerEl.style.display = "";
      }

      var diff = end - now;
      if (diff <= 0) {
        pintar(block, "encerrado");
        timerEl.textContent = "Encerrado";
        timerEl.style.display = "none";
        clearInterval(intervalId);
        return;
      }

      if (diff <= 48 * 60 * 60 * 1000) pintar(block, "finalizando");
      else pintar(block, "no_prazo");

      var d = Math.floor(diff / 86400000);
      diff -= d * 86400000;
      var h = Math.floor(diff / 3600000);
      diff -= h * 3600000;
      var m = Math.floor(diff / 60000);
      diff -= m * 60000;
      var s = Math.floor(diff / 1000);

      timerEl.textContent =
        d + "d " + pad(h) + "h " + pad(m) + "m " + pad(s) + "s restantes";
    }
    tick();
    var intervalId = setInterval(tick, 1000);
  }

  function applyResponsiveSizing() {
    var container = document.getElementById("kit-container");
    if (!container) return;
    var vpw = container.clientWidth || window.innerWidth || 600;
    var cols = vpw < 1024 ? 2 : 3;
    container.style.gap = vpw < 520 ? "8px" : "12px";

    Array.from(
      container.querySelectorAll(".kit-countdown:not(.kit-modelo)")
    ).forEach(function (card) {
      card.style.boxSizing = "border-box";
      card.style.flex = "1 1 calc(" + 100 / cols + "%)";
      card.style.margin = "0";
      var isSmallPhone = vpw < 360;
      card.style.padding = isSmallPhone ? "10px" : vpw < 520 ? "12px" : "14px";

      var titulo = card.querySelector(".kit-titulo");
      if (titulo) {
        titulo.style.fontSize =
          vpw < 520 ? "clamp(14px, 4.8vw, 18px)" : "20px";
        titulo.style.lineHeight = vpw < 520 ? "1.2" : "1.25";
        titulo.style.wordBreak = vpw < 520 ? "break-word" : "normal";
      }
      var entrega = card.querySelector(".kit-entrega");
      if (entrega) {
        entrega.style.fontSize =
          vpw < 520 ? "clamp(12px, 3.8vw, 15px)" : "16px";
        entrega.style.lineHeight = vpw < 520 ? "1.25" : "1.35";
      }
      var timer = card.querySelector(".kit-timer");
      if (timer) {
        timer.style.fontSize =
          vpw < 520 ? "clamp(12px, 4.2vw, 16px)" : "18px";
        timer.style.lineHeight = vpw < 520 ? "1.25" : "1.3";
        timer.style.marginTop = vpw < 520 ? "4px" : "6px";
        timer.style.wordBreak = vpw < 360 ? "break-word" : "normal";
      }
      var badge = card.querySelector(".kit-badge");
      if (badge) {
        badge.style.padding = vpw < 520 ? "8px 10px" : "10px 14px";
        badge.style.fontSize = vpw < 520 ? "12px" : "14px";
      }
    });
  }

  function gerarCardsDoBanner() {
    var container = document.getElementById("kit-container");
    var modelo = container.querySelector(".kit-countdown.kit-modelo");
    Array.from(
      container.querySelectorAll(".kit-countdown:not(.kit-modelo)")
    ).forEach(function (el) {
      el.remove();
    });

    var eventos = coletarEventosDoBanner();
    if (!eventos.length) {
      modelo.style.display = "none";
      return;
    }

    var now = new Date();
    var ativos = [],
      encerrados = [];
    eventos.forEach(function (ev) {
      if (new Date(ev.dataFimISO) < now) encerrados.push(ev);
      else ativos.push(ev);
    });
    var ordem = ativos.concat(encerrados);

    ordem.forEach(function (ev, idx) {
      var card = modelo.cloneNode(true);
      card.classList.remove("kit-modelo");
      card.style.display = "flex";
      card.setAttribute("data-slot", String(idx));
      card.style.maxWidth = "100%";

      var tituloEl = card.querySelector(".kit-titulo");
      if (tituloEl) tituloEl.textContent = ev.titulo || "";
      var inicioEl = card.querySelector(".inicio");
      if (inicioEl) inicioEl.textContent = ev.dataInicioTxt || "";
      var encEl = card.querySelector(".encerramento");
      if (encEl) encEl.textContent = ev.dataFimTxt || "";

      var timerEl = card.querySelector(".kit-timer[data-deadline]");
      if (timerEl) {
        timerEl.setAttribute("data-start", ev.dataInicioISO);
        timerEl.setAttribute("data-deadline", ev.dataFimISO);
      }
      container.appendChild(card);
    });

    Array.from(
      container.querySelectorAll(".kit-countdown:not(.kit-modelo)")
    ).forEach(initBlock);
    applyResponsiveSizing();
  }

  var btnOpen = document.getElementById("btnOpenTimer");
  var btnBack = document.getElementById("btnBackBanner");
  var bannerDefault = document.getElementById("banner-default-view");
  var bannerTimer = document.getElementById("banner-timer-view");
  var kitContainerEl = document.getElementById("kit-container");

  if (bannerTimer && kitContainerEl) {
    bannerTimer.appendChild(kitContainerEl);
    kitContainerEl.style.display = "none";
    bannerTimer.style.display = "none";
  }

  function showTimerInBanner() {
    gerarCardsDoBanner();
    bannerDefault.style.display = "none";
    bannerTimer.style.display = "block";
    kitContainerEl.style.display = "flex";
    if (btnOpen) btnOpen.style.display = "none";
    if (btnBack) btnBack.style.display = "inline-block";
    if (btnOpen) btnOpen.setAttribute("aria-expanded", "true");
    if (btnBack) btnBack.setAttribute("aria-expanded", "true");
    try {
      window.dispatchEvent(new Event("resize"));
    } catch (e) {}
  }

  function showDefaultBanner() {
    kitContainerEl.style.display = "none";
    bannerTimer.style.display = "none";
    bannerDefault.style.display = "block";
    if (btnOpen) btnOpen.style.display = "inline-block";
    if (btnBack) btnBack.style.display = "none";
    if (btnOpen) btnOpen.setAttribute("aria-expanded", "false");
    if (btnBack) btnBack.setAttribute("aria-expanded", "false");
  }

  if (btnOpen) btnOpen.addEventListener("click", showTimerInBanner);
  if (btnBack) btnBack.addEventListener("click", showDefaultBanner);

  if ("ResizeObserver" in window && kitContainerEl) {
    var ro = new ResizeObserver(applyResponsiveSizing);
    ro.observe(kitContainerEl);
  }
  window.addEventListener("resize", applyResponsiveSizing);
})();
// ]]>
