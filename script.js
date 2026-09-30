(function () {
  "use strict";

  var STORAGE_KEY = "waslaa_leads_v1";
  var THEME_KEY = "waslaa_theme_v1";
  var TEXT_SCALE_KEY = "waslaa_text_scale_v1";
  var TEXT_SCALE_STEPS = [0.875, 1, 1.125, 1.25];
  var i18n = window.WaslaaI18n;

  function t(path, vars) {
    return i18n ? i18n.t(path, vars) : path;
  }

  function intentCopy(intent) {
    var key = "intents." + (intent || "conversa");
    var title = t(key + ".title");
    var lead = t(key + ".lead");
    if (title === key + ".title") {
      return {
        title: t("intents.conversa.title"),
        lead: t("intents.conversa.lead")
      };
    }
    return { title: title, lead: lead };
  }

  /* Theme: system preference on first visit; manual choice in localStorage */
  function systemTheme() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches
      ? "light"
      : "dark";
  }

  function readStoredTheme() {
    try {
      var stored = localStorage.getItem(THEME_KEY);
      if (stored === "light" || stored === "dark") return stored;
    } catch (err) {
      /* ignore */
    }
    return null;
  }

  function getTheme() {
    var attr = document.documentElement.getAttribute("data-theme");
    if (attr === "light" || attr === "dark") return attr;
    return readStoredTheme() || systemTheme();
  }

  function applyTheme(theme, options) {
    options = options || {};
    var next = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;
    if (options.persist) {
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (err) {
        /* ignore quota / private mode */
      }
    }
    updateThemeToggle(next);
  }

  function updateThemeToggle(theme) {
    var btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;
    var current = theme || getTheme();
    var isLight = current === "light";
    btn.setAttribute("aria-pressed", isLight ? "true" : "false");
    btn.setAttribute(
      "aria-label",
      isLight ? t("a11y.themeToDark") : t("a11y.themeToLight")
    );
    btn.title = isLight ? t("a11y.themeToDark") : t("a11y.themeToLight");
    var text = btn.querySelector("[data-theme-toggle-text]");
    if (text) {
      text.textContent = isLight ? t("a11y.themeLight") : t("a11y.themeDark");
    }
  }

  function initTheme() {
    var stored = readStoredTheme();
    applyTheme(stored || systemTheme(), { persist: false });

    var toggle = document.querySelector("[data-theme-toggle]");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var next = getTheme() === "light" ? "dark" : "light";
        applyTheme(next, { persist: true });
      });
    }

    var mq =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: light)");
    if (mq) {
      var onSchemeChange = function () {
        if (readStoredTheme()) return;
        applyTheme(systemTheme(), { persist: false });
      };
      if (typeof mq.addEventListener === "function") {
        mq.addEventListener("change", onSchemeChange);
      } else if (typeof mq.addListener === "function") {
        mq.addListener(onSchemeChange);
      }
    }
  }

  initTheme();

  /* Text scale (complements browser zoom; does not replace it) */
  function nearestScaleStep(value) {
    var best = TEXT_SCALE_STEPS[1];
    var bestDiff = Math.abs(best - value);
    for (var i = 0; i < TEXT_SCALE_STEPS.length; i++) {
      var step = TEXT_SCALE_STEPS[i];
      var diff = Math.abs(step - value);
      if (diff < bestDiff) {
        best = step;
        bestDiff = diff;
      }
    }
    return best;
  }

  function readStoredScale() {
    try {
      var raw = localStorage.getItem(TEXT_SCALE_KEY);
      if (raw == null) return null;
      var n = parseFloat(raw);
      if (isNaN(n)) return null;
      return nearestScaleStep(n);
    } catch (err) {
      return null;
    }
  }

  function getTextScale() {
    var attr = document.documentElement.getAttribute("data-text-scale");
    var n = parseFloat(attr);
    if (!isNaN(n)) return nearestScaleStep(n);
    return readStoredScale() || 1;
  }

  function applyTextScale(scale, options) {
    options = options || {};
    var next = nearestScaleStep(scale);
    document.documentElement.style.setProperty("--text-scale", String(next));
    document.documentElement.setAttribute("data-text-scale", String(next));
    if (options.persist) {
      try {
        localStorage.setItem(TEXT_SCALE_KEY, String(next));
      } catch (err) {
        /* ignore quota / private mode */
      }
    }
    updateTextScaleControls(next);
  }

  function updateTextScaleControls(scale) {
    var current = scale != null ? scale : getTextScale();
    var down = document.querySelector("[data-text-scale-down]");
    var up = document.querySelector("[data-text-scale-up]");
    var min = TEXT_SCALE_STEPS[0];
    var max = TEXT_SCALE_STEPS[TEXT_SCALE_STEPS.length - 1];
    if (down) {
      down.disabled = current <= min;
      down.setAttribute("aria-label", t("a11y.textDecrease"));
      down.title = current <= min ? t("a11y.textMin") : t("a11y.textDecrease");
    }
    if (up) {
      up.disabled = current >= max;
      up.setAttribute("aria-label", t("a11y.textIncrease"));
      up.title = current >= max ? t("a11y.textMax") : t("a11y.textIncrease");
    }
    var group = document.querySelector("[data-text-scale-group]");
    if (group) {
      group.setAttribute(
        "aria-label",
        t("a11y.textCurrent", { percent: Math.round(current * 100) })
      );
    }
  }

  function stepTextScale(direction) {
    var current = getTextScale();
    var idx = TEXT_SCALE_STEPS.indexOf(current);
    if (idx < 0) idx = TEXT_SCALE_STEPS.indexOf(nearestScaleStep(current));
    var nextIdx = Math.max(
      0,
      Math.min(TEXT_SCALE_STEPS.length - 1, idx + direction)
    );
    applyTextScale(TEXT_SCALE_STEPS[nextIdx], { persist: true });
  }

  function initTextScale() {
    applyTextScale(readStoredScale() || getTextScale() || 1, { persist: false });

    var down = document.querySelector("[data-text-scale-down]");
    var up = document.querySelector("[data-text-scale-up]");
    if (down) {
      down.addEventListener("click", function () {
        stepTextScale(-1);
      });
    }
    if (up) {
      up.addEventListener("click", function () {
        stepTextScale(1);
      });
    }
  }

  initTextScale();

  /* Read aloud via Web Speech API (optional; never auto-starts) */
  var speechState = "idle"; /* idle | reading | paused | unavailable */
  var speechUtterance = null;
  var speechVoicesReady = false;

  function speechSupported() {
    return !!(window.speechSynthesis && window.SpeechSynthesisUtterance);
  }

  function setSpeechStatus(key, visible) {
    var el = document.querySelector("[data-speech-status]");
    if (!el) return;
    var msg = key ? t(key) : "";
    el.textContent = msg;
    el.classList.toggle("is-visible", !!(visible && msg));
  }

  function pickVoiceForLocale(locale) {
    if (!speechSupported()) return null;
    var voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;
    var lang = locale || document.documentElement.lang || "pt-BR";
    var primary = lang.toLowerCase();
    var base = primary.split("-")[0];

    var exact = null;
    var prefix = null;
    var baseMatch = null;
    for (var i = 0; i < voices.length; i++) {
      var v = voices[i];
      var vLang = String(v.lang || "").toLowerCase();
      if (vLang === primary) {
        exact = v;
        break;
      }
      if (!prefix && vLang.indexOf(primary) === 0) prefix = v;
      if (!baseMatch && vLang.indexOf(base) === 0) baseMatch = v;
    }
    return exact || prefix || baseMatch || voices[0];
  }

  function collectReadableText() {
    var main = document.getElementById("conteudo");
    if (!main) return "";
    var parts = [];
    var nodes = main.querySelectorAll(
      "h1, h2, h3, .hero-lead, .section-head > p, .module-body > p, .module-body > h3, .connect-grid li p, .law-close, .cta-final > p, .brand-hero, .module-name, .status, .how-stage-label, .how-core-desc, .how-tags li, .law-card li, .connect-grid li h3"
    );
    nodes.forEach(function (node) {
      if (node.closest("[aria-hidden='true']")) return;
      var text = (node.textContent || "").replace(/\s+/g, " ").trim();
      if (text) parts.push(text);
    });
    return parts.join(". ");
  }

  function updateSpeechControls() {
    var toggle = document.querySelector("[data-speech-toggle]");
    var stop = document.querySelector("[data-speech-stop]");
    var toggleText = document.querySelector("[data-speech-toggle-text]");
    var playIcon = document.querySelector(".a11y-speech-icon-play");
    var pauseIcon = document.querySelector(".a11y-speech-icon-pause");
    var tools = document.querySelector("[data-a11y-tools]");
    var speechGroup = document.querySelector("[data-speech-controls]");

    if (tools) tools.setAttribute("aria-label", t("a11y.toolsGroup"));
    if (speechGroup) speechGroup.setAttribute("aria-label", t("a11y.speechGroup"));

    if (!toggle) return;

    if (speechState === "unavailable" || !speechSupported()) {
      speechState = "unavailable";
      toggle.disabled = true;
      toggle.setAttribute("aria-pressed", "false");
      toggle.setAttribute("aria-label", t("a11y.speechUnavailable"));
      toggle.title = t("a11y.speechUnavailable");
      if (toggleText) toggleText.textContent = t("a11y.speechPlayShort");
      if (playIcon) playIcon.hidden = false;
      if (pauseIcon) pauseIcon.hidden = true;
      if (stop) stop.disabled = true;
      setSpeechStatus("a11y.speechUnavailable", true);
      return;
    }

    toggle.disabled = false;
    if (stop) stop.disabled = speechState === "idle";
    if (stop) {
      stop.setAttribute("aria-label", t("a11y.speechStop"));
      stop.title = t("a11y.speechStop");
    }

    if (speechState === "reading") {
      toggle.setAttribute("aria-pressed", "true");
      toggle.setAttribute("aria-label", t("a11y.speechPause"));
      toggle.title = t("a11y.speechPause");
      if (toggleText) toggleText.textContent = t("a11y.speechPauseShort");
      if (playIcon) playIcon.hidden = true;
      if (pauseIcon) pauseIcon.hidden = false;
      setSpeechStatus("a11y.speechReading", true);
    } else if (speechState === "paused") {
      toggle.setAttribute("aria-pressed", "false");
      toggle.setAttribute("aria-label", t("a11y.speechResume"));
      toggle.title = t("a11y.speechResume");
      if (toggleText) toggleText.textContent = t("a11y.speechResumeShort");
      if (playIcon) playIcon.hidden = false;
      if (pauseIcon) pauseIcon.hidden = true;
      setSpeechStatus("a11y.speechPaused", true);
    } else {
      toggle.setAttribute("aria-pressed", "false");
      toggle.setAttribute("aria-label", t("a11y.speechPlay"));
      toggle.title = t("a11y.speechPlay");
      if (toggleText) toggleText.textContent = t("a11y.speechPlayShort");
      if (playIcon) playIcon.hidden = false;
      if (pauseIcon) pauseIcon.hidden = true;
      if (speechState === "idle") setSpeechStatus("a11y.speechIdle", false);
    }
  }

  function stopSpeech(options) {
    options = options || {};
    if (!speechSupported()) return;
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      /* ignore */
    }
    speechUtterance = null;
    speechState = "idle";
    if (options.announceDone) {
      updateSpeechControls();
      setSpeechStatus("a11y.speechDone", true);
      window.setTimeout(function () {
        if (speechState === "idle") setSpeechStatus("a11y.speechIdle", false);
      }, 2200);
    } else {
      updateSpeechControls();
    }
  }

  function startSpeech() {
    if (!speechSupported()) {
      speechState = "unavailable";
      updateSpeechControls();
      return;
    }
    var text = collectReadableText();
    if (!text) return;

    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      /* ignore */
    }

    var locale = i18n ? i18n.getLocale() : document.documentElement.lang || "pt-BR";
    var utter = new window.SpeechSynthesisUtterance(text);
    utter.lang = locale;
    utter.rate = prefersReducedMotion() ? 0.95 : 1;
    utter.pitch = 1;
    var voice = pickVoiceForLocale(locale);
    if (voice) utter.voice = voice;

    utter.onstart = function () {
      speechState = "reading";
      updateSpeechControls();
    };
    utter.onend = function () {
      speechUtterance = null;
      speechState = "idle";
      updateSpeechControls();
      setSpeechStatus("a11y.speechDone", true);
      window.setTimeout(function () {
        if (speechState === "idle") setSpeechStatus("a11y.speechIdle", false);
      }, 2200);
    };
    utter.onerror = function () {
      speechUtterance = null;
      if (speechState === "reading" || speechState === "paused") {
        speechState = "idle";
        updateSpeechControls();
      }
    };

    speechUtterance = utter;
    speechState = "reading";
    updateSpeechControls();
    window.speechSynthesis.speak(utter);
  }

  function toggleSpeech() {
    if (!speechSupported()) {
      speechState = "unavailable";
      updateSpeechControls();
      return;
    }
    if (speechState === "reading") {
      try {
        window.speechSynthesis.pause();
      } catch (err) {
        /* ignore */
      }
      /* Some engines ignore pause; fall back to stop if still speaking without pause support */
      if (window.speechSynthesis.paused || !window.speechSynthesis.speaking) {
        speechState = "paused";
        updateSpeechControls();
      } else {
        /* pause unsupported — keep reading; user can stop */
        speechState = "paused";
        try {
          window.speechSynthesis.pause();
        } catch (err2) {
          /* ignore */
        }
        updateSpeechControls();
      }
      return;
    }
    if (speechState === "paused") {
      try {
        window.speechSynthesis.resume();
      } catch (err) {
        /* ignore */
      }
      if (window.speechSynthesis.paused) {
        /* resume failed on some browsers — restart */
        startSpeech();
        return;
      }
      speechState = "reading";
      updateSpeechControls();
      return;
    }
    startSpeech();
  }

  function initSpeech() {
    var toggle = document.querySelector("[data-speech-toggle]");
    var stop = document.querySelector("[data-speech-stop]");

    if (!speechSupported()) {
      speechState = "unavailable";
      updateSpeechControls();
      return;
    }

    function warmVoices() {
      window.speechSynthesis.getVoices();
      speechVoicesReady = true;
    }
    warmVoices();
    if (typeof window.speechSynthesis.addEventListener === "function") {
      window.speechSynthesis.addEventListener("voiceschanged", warmVoices);
    } else {
      window.speechSynthesis.onvoiceschanged = warmVoices;
    }

    if (toggle) {
      toggle.addEventListener("click", function () {
        toggleSpeech();
      });
    }
    if (stop) {
      stop.addEventListener("click", function () {
        stopSpeech({ announceDone: false });
        setSpeechStatus("a11y.speechIdle", false);
      });
    }

    /* Stop speech when language changes so voice/lang stay in sync */
    if (i18n) {
      i18n.onChange(function () {
        if (speechState === "reading" || speechState === "paused") {
          stopSpeech({ announceDone: false });
        }
        updateSpeechControls();
      });
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden && speechState === "reading") {
        try {
          window.speechSynthesis.pause();
          speechState = "paused";
          updateSpeechControls();
        } catch (err) {
          /* ignore */
        }
      }
    });

    updateSpeechControls();
  }

  initSpeech();

  /* Navigation */
  var nav = document.querySelector("[data-nav]");
  var navToggle = document.querySelector("[data-nav-toggle]");
  var navToggleLabel = document.querySelector("[data-nav-toggle-label]");
  var mqMobileNav =
    window.matchMedia && window.matchMedia("(max-width: 760px)");
  var headerEl = document.querySelector(".site-header");

  function updateNavToggleLabel(open) {
    if (!navToggleLabel) return;
    navToggleLabel.textContent = open ? t("a11y.closeMenu") : t("a11y.openMenu");
  }

  function getHeaderOffset() {
    var h = headerEl ? headerEl.getBoundingClientRect().height : 0;
    if (!h) {
      var raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--header-h")
        .trim();
      h = parseFloat(raw) || 68;
    }
    return h + 12;
  }

  function scrollToTarget(target, behavior) {
    if (!target) return;
    var top =
      window.pageYOffset +
      target.getBoundingClientRect().top -
      getHeaderOffset();
    if (top < 0) top = 0;
    window.scrollTo({
      top: top,
      behavior: behavior || (prefersReducedMotion() ? "auto" : "smooth")
    });
  }

  function prefersReducedMotion() {
    return !!(
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function getNavFocusable() {
    if (!nav) return [];
    return Array.prototype.slice.call(
      nav.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(function (el) {
      return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length;
    });
  }

  function setNavOpen(open) {
    if (!nav || !navToggle) return;
    var willOpen = !!open;
    nav.classList.toggle("is-open", willOpen);
    navToggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
    updateNavToggleLabel(willOpen);

    if (isMobileNav()) {
      document.body.classList.toggle("nav-open", willOpen);
      nav.setAttribute("aria-hidden", willOpen ? "false" : "true");
      if (willOpen) {
        var focusables = getNavFocusable();
        if (focusables.length) {
          window.requestAnimationFrame(function () {
            focusables[0].focus();
          });
        }
      }
    } else {
      document.body.classList.remove("nav-open");
      nav.removeAttribute("aria-hidden");
    }
  }

  function isMobileNav() {
    return mqMobileNav ? mqMobileNav.matches : window.innerWidth <= 760;
  }

  function closeNav() {
    setNavOpen(false);
  }

  function navigateToHash(hash, options) {
    options = options || {};
    if (!hash || hash === "#") return false;
    var id = hash.charAt(0) === "#" ? hash.slice(1) : hash;
    if (!id) return false;
    var target = document.getElementById(id);
    if (!target) return false;

    closeNav();

    var runScroll = function () {
      scrollToTarget(target, options.behavior);
      try {
        if (history.replaceState) {
          history.replaceState(null, "", "#" + id);
        } else {
          location.hash = id;
        }
      } catch (err) {
        location.hash = id;
      }
      if (typeof target.focus === "function") {
        var hadTabindex = target.hasAttribute("tabindex");
        if (!hadTabindex) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        if (!hadTabindex) {
          target.addEventListener(
            "blur",
            function onBlur() {
              target.removeAttribute("tabindex");
              target.removeEventListener("blur", onBlur);
            },
            { once: true }
          );
        }
      }
    };

    if (isMobileNav()) {
      window.setTimeout(runScroll, 50);
    } else {
      runScroll();
    }
    return true;
  }

  function syncNavAriaForViewport() {
    if (!nav) return;
    if (isMobileNav()) {
      var open = nav.classList.contains("is-open");
      nav.setAttribute("aria-hidden", open ? "false" : "true");
      if (!open) document.body.classList.remove("nav-open");
    } else {
      nav.removeAttribute("aria-hidden");
      document.body.classList.remove("nav-open");
      if (nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        if (navToggle) navToggle.setAttribute("aria-expanded", "false");
        updateNavToggleLabel(false);
      }
    }
  }

  if (navToggle && nav) {
    syncNavAriaForViewport();

    navToggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
    });

    nav.querySelectorAll("a[href^='#'], button").forEach(function (item) {
      item.addEventListener("click", function (event) {
        var href = item.getAttribute("href");
        if (href && href.charAt(0) === "#") {
          if (navigateToHash(href)) {
            event.preventDefault();
          }
          return;
        }
        closeNav();
      });
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("is-open")) return;
      if (!isMobileNav()) return;
      if (nav.contains(event.target) || navToggle.contains(event.target)) return;
      closeNav();
    });

    function onNavViewportChange() {
      syncNavAriaForViewport();
    }

    if (mqMobileNav) {
      if (typeof mqMobileNav.addEventListener === "function") {
        mqMobileNav.addEventListener("change", onNavViewportChange);
      } else if (typeof mqMobileNav.addListener === "function") {
        mqMobileNav.addListener(onNavViewportChange);
      }
    }

    window.addEventListener("resize", onNavViewportChange);
  }

  /* In-page anchors outside the mobile panel (brand, footer, hero CTAs) */
  document.addEventListener("click", function (event) {
    var link = event.target.closest('a[href^="#"]');
    if (!link) return;
    if (nav && nav.contains(link)) return;
    var href = link.getAttribute("href");
    if (!href || href === "#") return;
    if (navigateToHash(href)) {
      event.preventDefault();
    }
  });

  /* Modal helpers */
  var activeModal = null;
  var lastFocus = null;
  var activeMsgChannel = "whatsapp";
  var lastContactIntent = "conversa";
  var lastContactContext = "";

  function getFocusable(container) {
    return Array.prototype.slice.call(
      container.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(function (el) {
      return !el.hasAttribute("hidden") && el.offsetParent !== null;
    });
  }

  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    document.querySelectorAll(".modal:not([hidden])").forEach(function (open) {
      if (open !== modal) {
        open.hidden = true;
      }
    });
    lastFocus = document.activeElement;
    modal.hidden = false;
    activeModal = modal;
    document.body.classList.add("modal-open");
    closeNav();

    var panel = modal.querySelector(".modal-panel");
    var focusables = getFocusable(panel);
    if (focusables.length) {
      focusables[0].focus();
    } else {
      panel.setAttribute("tabindex", "-1");
      panel.focus();
    }
  }

  function closeModal(modal) {
    var target = modal || activeModal;
    if (!target) return;
    target.hidden = true;
    if (activeModal === target) {
      activeModal = null;
    }
    if (!document.querySelector(".modal:not([hidden])")) {
      document.body.classList.remove("modal-open");
    }
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  document.addEventListener("click", function (event) {
    var openBtn = event.target.closest("[data-open-modal]");
    if (openBtn) {
      var intent = openBtn.getAttribute("data-intent") || "conversa";
      var context = openBtn.getAttribute("data-context") || "";
      prepareContactForm(intent, context);
      openModal("modal-" + openBtn.getAttribute("data-open-modal"));
      return;
    }

    var panelBtn = event.target.closest("[data-open-panel]");
    if (panelBtn) {
      var panelId = panelBtn.getAttribute("data-open-panel");
      if (panelId === "leads") {
        renderLeads();
      }
      if (panelId === "mensageria") {
        var channel = panelBtn.getAttribute("data-channel") || "whatsapp";
        selectMessagingChannel(channel);
      }
      openModal("panel-" + panelId);
      return;
    }

    if (event.target.closest("[data-close-modal]")) {
      closeModal(event.target.closest(".modal"));
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (activeModal) {
        closeModal(activeModal);
        return;
      }
      if (nav && nav.classList.contains("is-open")) {
        closeNav();
        if (navToggle) navToggle.focus();
      }
      return;
    }

    if (
      event.key === "Tab" &&
      nav &&
      nav.classList.contains("is-open") &&
      isMobileNav() &&
      !activeModal
    ) {
      var navFocusables = getNavFocusable();
      if (!navFocusables.length) return;
      var navFirst = navFocusables[0];
      var navLast = navFocusables[navFocusables.length - 1];
      if (event.shiftKey && document.activeElement === navFirst) {
        event.preventDefault();
        navLast.focus();
      } else if (!event.shiftKey && document.activeElement === navLast) {
        event.preventDefault();
        navFirst.focus();
      } else if (!nav.contains(document.activeElement) && document.activeElement !== navToggle) {
        event.preventDefault();
        (event.shiftKey ? navLast : navFirst).focus();
      }
      return;
    }

    if (event.key === "Tab" && activeModal) {
      var panel = activeModal.querySelector(".modal-panel");
      var focusables = getFocusable(panel);
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  function prepareContactForm(intent, context) {
    var form = document.getElementById("form-contato");
    var success = document.getElementById("form-success");
    var title = document.getElementById("modal-contato-title");
    var lead = document.querySelector("[data-modal-lead]");
    var intentField = document.getElementById("field-intent");
    var contextField = document.getElementById("field-context");
    var segmento = document.getElementById("field-segmento");
    var mensagem = document.getElementById("field-mensagem");

    lastContactIntent = intent || "conversa";
    lastContactContext = context || "";

    if (form) form.hidden = false;
    if (success) success.hidden = true;
    if (form) form.reset();

    clearErrors();

    var copy = intentCopy(intent);
    if (title) title.textContent = copy.title;
    if (lead) lead.textContent = copy.lead;
    if (intentField) intentField.value = intent;
    if (contextField) contextField.value = context;

    if (context && segmento) {
      var options = Array.prototype.slice.call(segmento.options);
      var match = options.find(function (opt) {
        return opt.value === context || opt.textContent === context;
      });
      if (match) {
        segmento.value = match.value || match.textContent;
      }
    }

    if (mensagem) {
      var prefixes = {
        integrar: t("form.prefixIntegrate"),
        caso: t("form.prefixCase"),
        acessibilidade: t("form.prefixA11y"),
        conversa: t("form.prefixTalk")
      };
      if (context) {
        mensagem.placeholder = (prefixes[intent] || prefixes.conversa) + context;
      } else {
        mensagem.placeholder = t("form.messagePh");
      }
    }
  }

  function clearErrors() {
    document.querySelectorAll(".field-error").forEach(function (el) {
      el.hidden = true;
    });
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function loadLeads() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function saveLeads(leads) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }

  var form = document.getElementById("form-contato");
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      clearErrors();

      var data = new FormData(form);
      var nome = String(data.get("nome") || "").trim();
      var email = String(data.get("email") || "").trim();
      var mensagem = String(data.get("mensagem") || "").trim();
      var valid = true;

      if (!nome) {
        var eNome = document.querySelector('[data-error-for="nome"]');
        if (eNome) eNome.hidden = false;
        valid = false;
      }
      if (!email || !isValidEmail(email)) {
        var eEmail = document.querySelector('[data-error-for="email"]');
        if (eEmail) eEmail.hidden = false;
        valid = false;
      }
      if (!mensagem) {
        var eMsg = document.querySelector('[data-error-for="mensagem"]');
        if (eMsg) eMsg.hidden = false;
        valid = false;
      }

      if (!valid) {
        var firstError = form.querySelector(".field-error:not([hidden])");
        if (firstError) {
          var field = firstError.previousElementSibling;
          if (field && field.focus) field.focus();
        }
        return;
      }

      var lead = {
        id: "lead_" + Date.now(),
        createdAt: new Date().toISOString(),
        intent: String(data.get("intent") || "conversa"),
        context: String(data.get("context") || ""),
        nome: nome,
        email: email,
        organizacao: String(data.get("organizacao") || "").trim(),
        segmento: String(data.get("segmento") || "").trim(),
        mensagem: mensagem
      };

      var leads = loadLeads();
      leads.unshift(lead);
      saveLeads(leads);

      form.hidden = true;
      var success = document.getElementById("form-success");
      var successText = document.querySelector("[data-success-text]");
      if (success) success.hidden = false;
      if (successText) {
        var intentLabel =
          intentCopy(lead.intent).title || t("leads.fallbackIntent");
        successText.textContent = t("form.successBody", {
          nome: lead.nome,
          intent: intentLabel,
          email: lead.email
        });
      }
    });
  }

  function intentLabel(intent) {
    return intentCopy(intent).title || intent;
  }

  function renderLeads() {
    var list = document.getElementById("leads-list");
    if (!list) return;
    var leads = loadLeads();
    if (!leads.length) {
      list.innerHTML =
        '<p class="leads-empty">' + escapeHtml(t("leads.empty")) + "</p>";
      return;
    }

    var locale = i18n ? i18n.getLocale() : "pt-BR";
    list.innerHTML = leads
      .map(function (lead) {
        var when = new Date(lead.createdAt);
        var dateStr = isNaN(when.getTime())
          ? lead.createdAt
          : when.toLocaleString(locale);
        return (
          '<article class="lead-item">' +
          "<strong>" +
          escapeHtml(lead.nome) +
          "</strong>" +
          "<p>" +
          escapeHtml(lead.email) +
          (lead.organizacao
            ? " · " + escapeHtml(lead.organizacao)
            : "") +
          "</p>" +
          "<p>" +
          escapeHtml(intentLabel(lead.intent)) +
          (lead.context ? " — " + escapeHtml(lead.context) : "") +
          "</p>" +
          "<p>" +
          escapeHtml(lead.mensagem) +
          "</p>" +
          "<p>" +
          escapeHtml(dateStr) +
          "</p>" +
          "</article>"
        );
      })
      .join("");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  document.addEventListener("click", function (event) {
    if (!event.target.closest("[data-clear-leads]")) return;
    if (window.confirm(t("leads.confirmClear"))) {
      localStorage.removeItem(STORAGE_KEY);
      renderLeads();
    }
  });

  /* Mensageria channel switch */
  function selectMessagingChannel(name) {
    activeMsgChannel = name === "telegram" ? "telegram" : "whatsapp";
    var buttons = document.querySelectorAll("[data-select-channel]");
    var channelLabel = document.querySelector("[data-msg-channel]");
    var bubbleIn = document.querySelector("[data-msg-in]");
    var bubbleOut = document.querySelector("[data-msg-out]");

    buttons.forEach(function (btn) {
      var active = btn.getAttribute("data-select-channel") === activeMsgChannel;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    if (channelLabel) {
      channelLabel.textContent =
        activeMsgChannel === "telegram" ? "Telegram" : "WhatsApp";
    }
    if (activeMsgChannel === "telegram") {
      if (bubbleIn) bubbleIn.textContent = t("msg.tgIn");
      if (bubbleOut) bubbleOut.textContent = t("msg.tgOut");
    } else {
      if (bubbleIn) bubbleIn.textContent = t("msg.waIn");
      if (bubbleOut) bubbleOut.textContent = t("msg.waOut");
    }
  }

  document.addEventListener("click", function (event) {
    var channelBtn = event.target.closest("[data-select-channel]");
    if (!channelBtn) return;
    selectMessagingChannel(channelBtn.getAttribute("data-select-channel"));
  });

  function refreshDynamicCopy() {
    updateNavToggleLabel(
      nav && nav.classList.contains("is-open")
    );
    updateThemeToggle();
    updateTextScaleControls();
    updateSpeechControls();
    selectMessagingChannel(activeMsgChannel);

    var contactOpen = document.getElementById("modal-contato");
    if (contactOpen && !contactOpen.hidden) {
      var success = document.getElementById("form-success");
      var title = document.getElementById("modal-contato-title");
      var lead = document.querySelector("[data-modal-lead]");
      var copy = intentCopy(lastContactIntent);
      if (success && success.hidden) {
        if (title) title.textContent = copy.title;
        if (lead) lead.textContent = copy.lead;
      } else if (success && !success.hidden) {
        var successTitle = success.querySelector("h3");
        if (successTitle) successTitle.textContent = t("form.successTitle");
      }
    }

    var leadsPanel = document.getElementById("panel-leads");
    if (leadsPanel && !leadsPanel.hidden) {
      renderLeads();
    }
  }

  var prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* How-flow micro-interaction */
  var howFlow = document.querySelector("[data-how-flow]");
  if (howFlow && !prefersReduced) {
    var inputs = howFlow.querySelectorAll('[data-flow-item="in"]');
    var outputs = howFlow.querySelectorAll('[data-flow-item="out"]');
    var index = 0;

    function tickFlow() {
      inputs.forEach(function (el) {
        el.classList.remove("is-active");
      });
      outputs.forEach(function (el) {
        el.classList.remove("is-active");
      });
      if (inputs[index]) inputs[index].classList.add("is-active");
      if (outputs[index % outputs.length]) {
        outputs[index % outputs.length].classList.add("is-active");
      }
      index = (index + 1) % Math.max(inputs.length, 1);
    }

    tickFlow();
    setInterval(tickFlow, 2200);
  } else if (howFlow) {
    howFlow.querySelectorAll("[data-flow-item]").forEach(function (el) {
      el.classList.add("is-active");
    });
  }

  /* Reveal on scroll */
  if (!prefersReduced && "IntersectionObserver" in window) {
    var revealEls = document.querySelectorAll(
      ".section-head, .layer-scene, .how-flow, .module, .connect-grid li, .law-card, .law-close, .cta-final"
    );
    revealEls.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px)";
      el.style.transition =
        "opacity 0.6s var(--ease, ease), transform 0.6s var(--ease, ease)";
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.style.opacity = "1";
          entry.target.style.transform = "none";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  if (i18n) {
    i18n.onChange(refreshDynamicCopy);
    i18n.bootstrap().then(function () {
      refreshDynamicCopy();
    });
  } else {
    var yearEl = document.querySelector("[data-year]");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
    updateThemeToggle();
  }
})();
