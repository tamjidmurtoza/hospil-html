(function () {
  "use strict";

  var root = document.documentElement;

  // FAQ accordion (one open at a time). Runs before the GSAP fail-safe so it always works.
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    btn.addEventListener("click", function () {
      var open = !item.classList.contains("is-open");
      faqItems.forEach(function (other) {
        other.classList.remove("is-open");
        other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
    // Page height changed: keep scroll-triggered positions in sync
    item.querySelector(".faq-a").addEventListener("transitionend", function () {
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });

  // Fail-safe: if GSAP didn't load, just show everything.
  if (!window.gsap || !window.ScrollTrigger) {
    root.classList.remove("js");
    var pl = document.getElementById("preloader");
    if (pl) pl.remove();
    document
      .querySelectorAll(".cs_counter[data-count-to]")
      .forEach(function (el) {
        el.textContent = el.dataset.countTo + (el.dataset.suffix || "");
      });
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText);

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /*--------------------------------------------------------------
    Smooth scroll (Lenis)
  --------------------------------------------------------------*/
  var lenis = null;
  if (window.Lenis && !reduceMotion) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }

  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { offset: -80, duration: 1.4 });
    else if (typeof target === "number")
      window.scrollTo({ top: target, behavior: "smooth" });
    else
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id === "#") return;
      var el = id === "#top" ? 0 : document.querySelector(id);
      if (el === null) return;
      e.preventDefault();
      document.body.classList.remove("menu-open");
      scrollToTarget(el);
    });
  });

  // Placeholder purchase links: replace href="#" with your marketplace URL.
  document.querySelectorAll("[data-purchase]").forEach(function (a) {
    if (a.getAttribute("href") === "#")
      a.addEventListener("click", function (e) {
        e.preventDefault();
      });
  });

  document.getElementById("menuToggle").addEventListener("click", function () {
    document.body.classList.toggle("menu-open");
  });

  /*--------------------------------------------------------------
    Header: sticky, hide on scroll down, active link
  --------------------------------------------------------------*/
  var header = document.getElementById("header");
  ScrollTrigger.create({
    start: "top -80",
    end: "max",
    onUpdate: function (self) {
      header.classList.toggle("is-sticky", self.scroll() > 80);
      var hide =
        self.direction === 1 &&
        self.scroll() > 600 &&
        !document.body.classList.contains("menu-open");
      header.classList.toggle("is-hidden", hide);
    },
  });

  document.querySelectorAll(".nav a").forEach(function (link) {
    var sec = document.querySelector(link.getAttribute("href"));
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec,
      start: "top center",
      end: "bottom center",
      onToggle: function (self) {
        link.classList.toggle("is-active", self.isActive);
      },
    });
  });

  /*--------------------------------------------------------------
    Custom cursor + magnetic buttons
  --------------------------------------------------------------*/
  if (finePointer && !reduceMotion) {
    var cursor = document.querySelector(".cursor");
    var dot = document.querySelector(".cursor-dot");
    var cx = gsap.quickTo(cursor, "x", { duration: 0.45, ease: "power3" });
    var cy = gsap.quickTo(cursor, "y", { duration: 0.45, ease: "power3" });
    var dx = gsap.quickTo(dot, "x", { duration: 0.1 });
    var dy = gsap.quickTo(dot, "y", { duration: 0.1 });
    document.addEventListener("mouseleave", function () {
      cursor.classList.remove("is-visible");
      dot.classList.remove("is-visible");
    });
    window.addEventListener("mousemove", function (e) {
      cx(e.clientX);
      cy(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
      cursor.classList.add("is-visible");
      dot.classList.add("is-visible");
    });
    document.querySelectorAll("a, button, .compare").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        cursor.classList.add("is-hover");
      });
      el.addEventListener("mouseleave", function () {
        cursor.classList.remove("is-hover");
      });
    });

    document.querySelectorAll(".magnetic").forEach(function (btn) {
      var mx = gsap.quickTo(btn, "x", { duration: 0.5, ease: "power3.out" });
      var my = gsap.quickTo(btn, "y", { duration: 0.5, ease: "power3.out" });
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        mx((e.clientX - r.left - r.width / 2) * 0.12);
        my((e.clientY - r.top - r.height / 2) * 0.15);
      });
      btn.addEventListener("mouseleave", function () {
        mx(0);
        my(0);
      });
    });

    // Spotlight on feature and pricing cards
    document.querySelectorAll(".feature, .price-card").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--x", e.clientX - r.left + "px");
        card.style.setProperty("--y", e.clientY - r.top + "px");
      });
    });

    // CTA: soft light follows the cursor
    var cta = document.getElementById("cta");
    cta.addEventListener("mousemove", function (e) {
      var r = cta.getBoundingClientRect();
      cta.style.setProperty("--mx", e.clientX - r.left + "px");
      cta.style.setProperty("--my", e.clientY - r.top + "px");
    });
  }

  /*--------------------------------------------------------------
    Marquees (strip + inner pages), speed reacts to scroll velocity
  --------------------------------------------------------------*/
  function marquee(track, dir, duration) {
    var group = track.firstElementChild;
    track
      .appendChild(group.cloneNode(true))
      .setAttribute("aria-hidden", "true");
    var from = dir === 1 ? -50 : 0;
    gsap.set(track, { xPercent: from });
    var tween = gsap.to(track, {
      xPercent: from + (dir === 1 ? 50 : -50),
      duration: duration,
      ease: "none",
      repeat: -1,
    });
    if (reduceMotion) tween.pause();
    return tween;
  }

  var marquees = [];
  var stripTrack = document.querySelector(".strip-track");
  stripTrack.firstElementChild.innerHTML +=
    stripTrack.firstElementChild.innerHTML;
  marquees.push(marquee(stripTrack, -1, 30));
  document.querySelectorAll(".page-row").forEach(function (row) {
    var tw = marquee(row, parseInt(row.dataset.dir, 10), 84);
    marquees.push(tw);
    row.addEventListener("mouseenter", function () {
      gsap.to(tw, { timeScale: 0, duration: 0.6 });
    });
    row.addEventListener("mouseleave", function () {
      gsap.to(tw, { timeScale: 1, duration: 0.6 });
    });
  });
  if (!reduceMotion) {
    ScrollTrigger.create({
      onUpdate: function (self) {
        var boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 5);
        marquees.forEach(function (tw) {
          if (tw.timeScale() === 0) return;
          gsap.to(tw, {
            timeScale: boost,
            duration: 0.2,
            overwrite: true,
            onComplete: function () {
              gsap.to(tw, { timeScale: 1, duration: 1 });
            },
          });
        });
      },
    });
  }

  /*--------------------------------------------------------------
    Compare slider (RTL)
  --------------------------------------------------------------*/
  var compare = document.getElementById("compare");
  var cmpState = { pos: 50 };
  function setPos(p) {
    cmpState.pos = p;
    compare.style.setProperty("--pos", p + "%");
  }
  function posFromEvent(e) {
    var r = compare.getBoundingClientRect();
    return Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
  }
  var dragging = false;
  compare.addEventListener("pointerdown", function (e) {
    dragging = true;
    gsap.killTweensOf(cmpState);
    compare.setPointerCapture(e.pointerId);
    setPos(posFromEvent(e));
  });
  compare.addEventListener("pointermove", function (e) {
    if (dragging) setPos(posFromEvent(e));
  });
  compare.addEventListener("pointerup", function () {
    dragging = false;
  });
  compare.addEventListener("pointercancel", function () {
    dragging = false;
  });

  /*--------------------------------------------------------------
    Counters
  --------------------------------------------------------------*/
  const qs = (selector) => document.querySelector(selector);
  const qsa = (selector) => document.querySelectorAll(selector);
  const exists = (selector) => !!qs(selector);
  const prefersReducedMotion = () => reduceMotion;

  const COUNTER_DEFAULT_DURATION = 2000;
  const COUNTER_WHEEL = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
  const COUNTER_MAX_TURNS_PER_SECOND = 1.5;

  function counterAnimation(element, target, duration, suffix) {
    const el = typeof element === "string" ? qs(element) : element;
    if (!el) return;

    const to = Number(target);
    if (!Number.isFinite(to)) return;

    const time =
      Number(duration) > 0 ? Number(duration) : COUNTER_DEFAULT_DURATION;
    const tail = suffix == null ? "" : String(suffix);
    const [intPart, fracPart = ""] = Math.abs(to)
      .toFixed(countDecimals(to))
      .split(".");
    const digits = (intPart + fracPart).split("").map(Number);
    const places = [];
    for (let place = intPart.length - 1; place >= -fracPart.length; place--) {
      places.push(place);
    }

    const wheels = buildCounterWheels(el, places, digits, to < 0, tail);
    if (!wheels) {
      el.textContent = formatCounterValue(intPart, fracPart, to < 0) + tail;
      return;
    }
    const maxTurns = Math.round((time / 1000) * COUNTER_MAX_TURNS_PER_SECOND);
    wheels.forEach((wheel) => {
      const fullTurns = Math.floor(
        Math.abs(to) / Math.pow(10, wheel.place + 1),
      );
      const turns = Math.min(fullTurns, Math.max(0, maxTurns - wheel.place));
      wheel.travel = turns * 10 + wheel.finalDigit;
    });

    const settle = () =>
      wheels.forEach((wheel) => spinCounterWheel(wheel, wheel.finalDigit));

    if (prefersReducedMotion()) {
      settle();
      return;
    }

    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / time, 1);

      if (progress >= 1) {
        settle();
        return;
      }

      const remaining = 1 - easeInOutSine(progress);
      wheels.forEach((wheel) => {
        const position = wheel.finalDigit - wheel.travel * remaining;
        spinCounterWheel(wheel, ((position % 10) + 10) % 10);
      });

      requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  function buildCounterWheels(el, places, digits, negative, suffix) {
    el.textContent = "";

    const inner = document.createElement("span");
    inner.style.cssText = "display:inline;white-space:nowrap;";
    if (negative) inner.appendChild(counterSymbol("-"));

    const wheels = [];

    places.forEach((place, index) => {
      if (place === -1) inner.appendChild(counterSymbol("."));
      else if (index > 0 && place >= 0 && place % 3 === 2) {
        inner.appendChild(counterSymbol(","));
      }

      const digit = document.createElement("span");
      digit.style.cssText = "position:relative;display:inline;";
      const spacer = document.createElement("span");
      spacer.style.cssText = "display:inline;visibility:hidden;";
      spacer.textContent = "0";

      const frame = document.createElement("span");
      frame.style.cssText =
        "display:block;position:absolute;top:0;left:0;right:0;bottom:0;overflow:hidden;";

      const ribbon = document.createElement("span");
      ribbon.style.cssText =
        "display:block;will-change:transform;backface-visibility:hidden;";
      COUNTER_WHEEL.forEach((number) => {
        const value = document.createElement("span");
        value.style.cssText = "display:block;text-align:center;";
        value.textContent = number;
        ribbon.appendChild(value);
      });

      frame.appendChild(ribbon);
      digit.append(spacer, frame);
      inner.appendChild(digit);

      wheels.push({ place, ribbon, frame, finalDigit: digits[index] });
    });

    if (suffix) inner.appendChild(counterSymbol(suffix));

    el.appendChild(inner);
    const cellHeight = wheels.length
      ? wheels[0].frame.getBoundingClientRect().height
      : 0;

    if (!cellHeight) return null;

    wheels.forEach((wheel) => {
      wheel.cellHeight = cellHeight;
      [...wheel.ribbon.children].forEach((value) => {
        value.style.height = `${cellHeight}px`;
        value.style.lineHeight = `${cellHeight}px`;
      });
    });

    return wheels;
  }

  function spinCounterWheel(wheel, position) {
    const offset = -position * wheel.cellHeight;
    wheel.ribbon.style.transform = `translate3d(0, ${offset}px, 0)`;
  }

  function counterSymbol(character) {
    const symbol = document.createElement("span");
    symbol.style.cssText = "display:inline;";
    symbol.textContent = character;
    return symbol;
  }

  function formatCounterValue(intPart, fracPart, negative) {
    const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${negative ? "-" : ""}${grouped}${fracPart ? `.${fracPart}` : ""}`;
  }

  function countDecimals(number) {
    const [, fraction = ""] = String(number).split(".");
    return fraction.length;
  }

  function easeInOutSine(t) {
    return (1 - Math.cos(Math.PI * t)) / 2;
  }

  function counterAnimationInit() {
    if (!exists(".cs_counter")) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const { countTo, duration, suffix } = entry.target.dataset;
          counterAnimation(entry.target, countTo, duration, suffix);
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.3,
      },
    );

    qsa(".cs_counter").forEach((counter) => observer.observe(counter));
  }

  /*--------------------------------------------------------------
    Everything that animates in after the preloader
  --------------------------------------------------------------*/
  function initReveals() {
    // Section titles: masked line reveal
    document.querySelectorAll("[data-split]").forEach(function (el) {
      SplitText.create(el, {
        type: "words",
        autoSplit: true,
        onSplit: function (self) {
          return gsap.from(self.words, {
            y: 50,
            x: -20,
            opacity: 0,
            filter: "blur(12px)",
            duration: 1.1,
            ease: "power3.out",
            stagger: 0.07,
            clearProps: "filter",
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        },
      });
    });

    // Generic fade-up, batched so grids stagger
    gsap.set("[data-reveal]", { autoAlpha: 0, y: 50 });
    ScrollTrigger.batch("[data-reveal]", {
      start: "top 88%",
      once: true,
      onEnter: function (batch) {
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.1,
          overwrite: true,
          clearProps: "transform",
          onComplete: function () {
            batch.forEach(function (el) {
              el.classList.add("is-in");
            });
          },
        });
      },
    });

    counterAnimationInit();

    // Compare slider intro sweep
    gsap.fromTo(
      cmpState,
      { pos: 92 },
      {
        pos: 50,
        duration: 1.8,
        ease: "power3.inOut",
        onUpdate: function () {
          setPos(cmpState.pos);
        },
        scrollTrigger: { trigger: compare, start: "top 75%", once: true },
      },
    );

    var mm = gsap.matchMedia();

    mm.add(
      "(min-width: 992px) and (prefers-reduced-motion: no-preference)",
      function () {
        // Hero mockup: tilted 3D -> flat on scroll
        gsap.fromTo(
          "#heroMockup",
          { rotateX: 26, scale: 0.9, y: 0 },
          {
            rotateX: 0,
            scale: 1,
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero-stage",
              start: "top 85%",
              end: "center 40%",
              scrub: 1,
            },
          },
        );

        // Floating elements drift at different speeds
        document
          .querySelectorAll("#heroMockup [data-depth]")
          .forEach(function (el) {
            gsap.to(el, {
              yPercent: -parseFloat(el.dataset.depth) * 18,
              ease: "none",
              scrollTrigger: {
                trigger: ".hero-stage",
                start: "top 70%",
                end: "bottom top",
                scrub: true,
              },
            });
          });

        // Devices: assemble on scroll
        var dtl = gsap.timeline({
          scrollTrigger: {
            trigger: "#deviceStage",
            start: "top 80%",
            end: "bottom 70%",
            scrub: 1,
          },
        });
        dtl
          .from(".dev-desktop", {
            y: 120,
            scale: 0.85,
            autoAlpha: 0,
            ease: "power2.out",
          })
          .from(
            ".dev-tablet",
            { xPercent: -80, rotate: -12, autoAlpha: 0, ease: "power2.out" },
            "<.2",
          )
          .from(
            ".dev-mobile",
            { xPercent: 80, rotate: 12, autoAlpha: 0, ease: "power2.out" },
            "<",
          );

        // CTA rings
        gsap.from(".ring", {
          scale: 0.4,
          autoAlpha: 0,
          stagger: 0.12,
          duration: 1.6,
          ease: "expo.out",
          scrollTrigger: { trigger: "#cta", start: "top 75%" },
          onComplete: function () {
            gsap.to(".ring", {
              scale: 1.08,
              repeat: -1,
              yoyo: true,
              duration: 3,
              ease: "sine.inOut",
              stagger: 0.4,
            });
          },
        });

        // Mouse parallax on hero
        var stage = document.querySelector(".hero");
        var layers = gsap.utils
          .toArray("#heroMockup [data-depth]")
          .map(function (el) {
            return {
              d: parseFloat(el.dataset.depth),
              x: gsap.quickTo(el, "x", { duration: 1, ease: "power3" }),
              y: gsap.quickTo(el, "y", { duration: 1, ease: "power3" }),
            };
          });
        var onMove = function (e) {
          var nx = e.clientX / window.innerWidth - 0.5;
          var ny = e.clientY / window.innerHeight - 0.5;
          layers.forEach(function (l) {
            l.x(nx * l.d * 30);
            l.y(ny * l.d * 30);
          });
        };
        stage.addEventListener("mousemove", onMove);
        return function () {
          stage.removeEventListener("mousemove", onMove);
        };
      },
    );

    mm.add(
      "(max-width: 991px) and (prefers-reduced-motion: no-preference)",
      function () {
        gsap.from("#heroMockup", {
          y: 60,
          scale: 0.94,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: { trigger: ".hero-stage", start: "top 90%" },
        });
        gsap.from(".dev-tablet, .dev-mobile", {
          y: 60,
          autoAlpha: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: "#deviceStage", start: "top 80%" },
        });
      },
    );

    // Background blobs float forever
    if (!reduceMotion) {
      gsap.utils.toArray(".blob").forEach(function (b, i) {
        gsap.to(b, {
          x: "random(-80, 80)",
          y: "random(-60, 60)",
          scale: "random(.85, 1.2)",
          duration: "random(6, 9)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i,
        });
      });
    }
  }

  /*--------------------------------------------------------------
    Hero intro timeline
  --------------------------------------------------------------*/
  function heroIntro() {
    var title = document.querySelector(".hero-title");
    var split = SplitText.create(title, { type: "words,chars", mask: "words" });
    gsap.set(split.masks, {
      padding: ".15em .15em .2em",
      margin: "-.15em -.15em -.2em",
    });
    var ecg = title.querySelector(".ecg-base");
    var len = ecg.getTotalLength();
    gsap.set(ecg, { strokeDasharray: len, strokeDashoffset: len });

    var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.set(title, { autoAlpha: 1 })
      .fromTo(
        ".hero-badge",
        { autoAlpha: 0, y: 30, scale: 0.9 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.9 },
      )
      .from(
        split.chars,
        {
          yPercent: 120,
          rotate: 8,
          duration: 1.1,
          stagger: 0.018,
          onComplete: function () {
            gsap.set(split.masks, { overflow: "visible" });
          },
        },
        "-=.6",
      )
      .to(
        ecg,
        {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.inOut",
          onComplete: heartbeat,
        },
        "-=.5",
      )
      .fromTo(
        ".hero-desc",
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 1 },
        "-=1.3",
      )
      .fromTo(
        ".hero-btns",
        { autoAlpha: 0, y: 30 },
        { autoAlpha: 1, y: 0, duration: 1 },
        "-=.85",
      )
      .fromTo(
        ".hero-tech .tech-pill",
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.07 },
        "-=.8",
      )
      .fromTo(
        ".hero-stage .browser",
        { y: 120, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1.5 },
        "-=1.1",
      )
      .fromTo(
        ".float-card, .float-mobile",
        { autoAlpha: 0, scale: 0.6, rotate: -8 },
        {
          autoAlpha: 1,
          scale: 1,
          rotate: 0,
          duration: 1.3,
          stagger: 0.12,
          ease: "back.out(1.4)",
        },
        "-=1.1",
      )
      .fromTo(
        ".float-badge",
        { autoAlpha: 0, scale: 0.5 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: "back.out(2)",
        },
        "-=.9",
      );

    // ECG monitor loop: a darker segment travels along the line; the line itself never changes shape
    function heartbeat() {
      gsap.set(ecg, { clearProps: "strokeDasharray,strokeDashoffset" });
      if (reduceMotion) return;
      var pulse = title.querySelector(".ecg-pulse");
      var seg = 70;

      gsap.to(ecg, { opacity: 0.45, duration: 0.6 });
      gsap.set(pulse, {
        opacity: 1,
        strokeDasharray: seg + " " + (len + seg),
        strokeDashoffset: seg,
      });
      gsap.fromTo(
        pulse,
        { strokeDashoffset: seg },
        {
          strokeDashoffset: -len,
          duration: 2,
          ease: "none",
          repeat: -1,
          repeatDelay: 0.3,
        },
      );
    }

    // Gentle idle float on badges
    if (!reduceMotion) {
      gsap.to(".float-badge .ico", {
        y: -6,
        repeat: -1,
        yoyo: true,
        duration: 1.6,
        ease: "sine.inOut",
        stagger: 0.5,
      });
    }
    return tl;
  }

  /*--------------------------------------------------------------
    Re-measure scroll positions
  --------------------------------------------------------------*/
  function keepTriggersInSync() {
    var timer = null;
    var lastHeight = document.body.offsetHeight;
    var refresh = function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        ScrollTrigger.refresh();
        lastHeight = document.body.offsetHeight;
      }, 200);
    };
    window.addEventListener("load", refresh);
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(refresh);
    document.querySelectorAll("img").forEach(function (img) {
      if (!img.complete) img.addEventListener("load", refresh, { once: true });
    });
    if (window.ResizeObserver) {
      new ResizeObserver(function () {
        if (Math.abs(document.body.offsetHeight - lastHeight) > 2) refresh();
      }).observe(document.body);
    }
  }

  /*--------------------------------------------------------------
    Preloader -> start
  --------------------------------------------------------------*/
  function start() {
    var pl = document.getElementById("preloader");
    var count = { v: 0 };
    var countEl = pl.querySelector(".js-count");
    var tl = gsap.timeline({
      onComplete: function () {
        pl.remove();
        if (lenis) lenis.start();
        ScrollTrigger.refresh();
        keepTriggersInSync();
      },
    });

    tl.from(".preloader-logo", {
      autoAlpha: 0,
      y: 20,
      duration: 0.6,
      ease: "power3.out",
    })
      .to(
        count,
        {
          v: 100,
          duration: reduceMotion ? 0.3 : 1.4,
          ease: "power2.inOut",
          onUpdate: function () {
            countEl.textContent = Math.round(count.v);
          },
        },
        "<",
      )
      .to(
        ".preloader-bar span",
        {
          width: "100%",
          duration: reduceMotion ? 0.3 : 1.4,
          ease: "power2.inOut",
        },
        "<",
      )
      .to(".preloader-inner", {
        autoAlpha: 0,
        y: -30,
        duration: 0.5,
        ease: "power2.in",
      })
      .to(pl, {
        clipPath: "inset(0 0 100% 0)",
        duration: 1,
        ease: "expo.inOut",
      })
      .add(function () {
        initReveals();
      })
      .add(heroIntro(), "-=.55");
  }

  var fontsReady =
    document.fonts && document.fonts.ready
      ? document.fonts.ready
      : Promise.resolve();
  Promise.race([
    fontsReady,
    new Promise(function (r) {
      setTimeout(r, 2500);
    }),
  ]).then(start);
})();
