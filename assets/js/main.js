(function ($) {
  "use strict";

  /*
  |=====================================================================
  | Template Name: Hospil
  | Author: Laralink
  | Version: 1.0.0
  |=====================================================================
  |=====================================================================
  | TABLE OF CONTENTS:
  |=====================================================================
  |
  | 00. Text Direction (LTR / RTL)
  | 01. Preloader
  | 02. Mobile Menu
  | 03. Sticky Header
  | 04. Dynamic Background
  | 05. Swiper Slider
  | 06. Language Select
  | 07. Smooth Page Scroll (Lenis)
  | 08. Counter Animation
  | 09. Modal Video
  | 10. Review
  | 11. Tabs
  | 12. Accordian
  | 13. Service Hover Tabs
  | 14. Scroll Up
  | 15. Hobble / Particle Move
  | 16. Section Title Word Reveal (GSAP + SplitText)
  | 17. Sticky Card Animation (GSAP)
  | 18. Parallax Image
  | 19. Pricing Value Toggle
  | 20. Packages Sidebar Filter
  | 21. Toggle Active Class
  | 22. Ecommerce
  | 23. Countdown Timer
  | 24. Prescription Upload
  | 25. Pharmacy Hero Slider
  | 26. Cart Drawer (mini cart)
  | 27. Physio Pain Map
  | 27b. Hero Background Video
  | 28. In-View Reveal
  | 29. Vet Pet Selector Tabs
  | 30. Physio Footer Live Hours
  | 31. Marquee Edge Zoom
  | 32. Physio Exercise Video Switcher
  |
  */

  /*====================================================================
    Scripts initialization
  ======================================================================*/
  $.exists = function (selector) {
    return $(selector).length > 0;
  };

  // Must run before anything reads `dir` (Swiper, Flatpickr, SplitText)
  const directionStorageKey = "hospil_dir";
  const isRTL = directionInit();
  let generatedFieldCount = 0;

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  try {
    window.scrollTo(0, 0);
  } catch (e) {}

  $(window).on("load", function () {
    preloader();
  });

  $(function () {
    mainNav();
    stickyHeader();
    dynamicBackground();
    swiperInit();
    languageSwitch();
    smoothScroll();
    counterInit();
    modalVideo();
    review();
    tabs();
    accordian();
    serviceHoverTabs();
    expertsHoverTabs();
    scrollUp();
    hobbleEffectInit();
    sectionTitleRevealInit();
    stickyCardInit();
    parallaxImageInit();
    pricingToggleInit();
    packagesFilterInit();
    toggleActiveClass();
    ecommerceInit();
    countdownInit();
    prescriptionUploadInit();
    pharmacyHeroSliderInit();
    cartDrawerInit();
    physioPainMapInit();
    heroVideoInit();
    inViewInit();
    vetPetTabsInit();
    physioFooterHoursInit();
    marqueeEdgeZoomInit();
    exerciseSwitchInit();
    // Choices JS for Select
    $(".cs_choice").each(function () {
      const el = this;

      const choice = new Choices(el, {
        searchEnabled: false,
        itemSelectText: "",
        shouldSort: false,
      });
      fieldIdInit($(el).closest(".choices"));

      $(el).on("showDropdown", function () {
        $(el).closest(".choices").addClass("active");
      });

      $(el).on("hideDropdown", function () {
        $(el).closest(".choices").removeClass("active");
      });
    });
    // Flatpickr for date and time picker
    $(".cs_datepicker").each(function () {
      const $this = $(this);
      const format = $this.data("format") || "Y-m-d";

      $this.flatpickr({
        enableTime: false,
        dateFormat: format,
        disableMobile: true,
        position: isRTL ? "auto right" : "auto",

        onReady: function (selectedDates, dateStr, instance) {
          fieldIdInit(instance.calendarContainer);
        },

        onOpen: function (selectedDates, dateStr, instance) {
          $(instance.calendarContainer).addClass("active");
        },
        onClose: function (selectedDates, dateStr, instance) {
          $(instance.calendarContainer).removeClass("active");
        },
      });
    });

    $(".cs_timepicker").each(function () {
      const $this = $(this);
      const format = $this.data("format") || "H:i";

      $this.flatpickr({
        enableTime: true,
        noCalendar: true,
        dateFormat: format,
        time_24hr: false,
        minuteIncrement: 1,
        disableMobile: true,
        position: isRTL ? "auto right" : "auto",

        onReady: function (selectedDates, dateStr, instance) {
          fieldIdInit(instance.calendarContainer);
        },

        onOpen: function (selectedDates, dateStr, instance) {
          $(instance.calendarContainer).addClass("active");
        },
        onClose: function (selectedDates, dateStr, instance) {
          $(instance.calendarContainer).removeClass("active");
        },
      });
    });
    // Dynamic year as footer text
    if ($.exists(".cs_getting_year")) {
      const date = new Date();
      $(".cs_getting_year").text(date.getFullYear());
    }
  });
  /*=============================================================
   Run on window Scroll
  ===============================================================*/
  $(window).on("scroll", function () {
    stickyHeader();
    showScrollUp();
  });
  /*=============================================================
   Run on window resize
  ===============================================================*/
  $(window).on("resize", function () {
    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.refresh();
    }
  });
  /*=============================================================
    00. Text Direction (LTR / RTL)
  ===============================================================*/
  function directionInit() {
    const html = document.documentElement;
    let dir = html.getAttribute("dir") === "rtl" ? "rtl" : "ltr";

    try {
      localStorage.removeItem(directionStorageKey);
      const urlDir = new URLSearchParams(window.location.search).get("dir");
      if (urlDir === "rtl" || urlDir === "ltr") dir = urlDir;
    } catch (e) {}

    html.setAttribute("dir", dir);
    return dir === "rtl";
  }

  // Reload with ?dir= so every plugin re-inits with the new direction
  function setDirection(newDir) {
    if (newDir === document.documentElement.getAttribute("dir")) return;

    const url = new URL(window.location.href);
    url.searchParams.set("dir", newDir);
    window.location.href = url.toString();
  }
  // Give plugin-generated fields (Choices, Flatpickr)
  function fieldIdInit(container) {
    $(container)
      .find("input, select, textarea")
      .each(function () {
        if (!this.id && !this.name) {
          this.id = "cs_field_" + ++generatedFieldCount;
        }
      });
  }
  /*=============================================================
    01. Preloader
  ===============================================================*/
  function preloader() {
    var $preloader = $(".cs_preloader");
    if (!$preloader.length) return;
    $preloader.addClass("cs_loaded");
    setTimeout(function () {
      $preloader.remove();
    }, 600);
  }
  /*=============================================================
    02. Mobile Menu
  ===============================================================*/
  function mainNav() {
    $(".cs_nav").append('<span class="cs_menu_toggle"><span></span></span>');
    $(".menu-item-has-children").append(
      '<span class="cs_menu_dropdown_toggle"><span></span></span>',
    );
    $(".cs_menu_toggle").on("click", function () {
      $(this)
        .toggleClass("active")
        .siblings(".cs_nav_list_wrapper")
        .toggleClass("active");
      $(".cs_close_nav").toggleClass("active");
    });

    $(".cs_menu_dropdown_toggle").on("click", function () {
      $(this).toggleClass("active").siblings("ul").slideToggle();
      $(this).parent().toggleClass("active");
    });
    //Header Search Toggle
    $(".cs_search_btn").on("click", function () {
      $(".cs_header_search").addClass("active");
      $(".cs_user_content").slideUp();
    });
    $(".cs_close, .cs_sidenav_overlay").on("click", function () {
      $(".cs_sidenav, .cs_header_search").removeClass("active");
    });
    //Side Header Toggle
    $(".cs_sidebar_btn").on("click", function () {
      $(".cs_side_header").addClass("active");
    });
    $(".cs_close, .cs_side_header_overlay").on("click", function () {
      $(".cs_side_header").removeClass("active");
    });
    $(".cs_close_nav").on("click", function () {
      $(this)
        .toggleClass("active")
        .parent(".cs_nav_list_wrapper")
        .toggleClass("active");
      $(".cs_menu_toggle").toggleClass("active");
    });
  }
  /*=============================================================
    03. Sticky Header
  ===============================================================*/
  function stickyHeader() {
    var scroll = $(window).scrollTop();
    if (scroll >= 10) {
      $(".cs_sticky_header").addClass("cs_sticky_active");
    } else {
      $(".cs_sticky_header").removeClass("cs_sticky_active");
    }
  }
  /*=============================================================
    04. Dynamic Background
  ===============================================================*/
  function dynamicBackground() {
    $("[data-src]").each(function () {
      var src = $(this).attr("data-src");
      $(this).css({
        "background-image": "url(" + src + ")",
      });
    });
  }
  /*============================================================
    05. Swiper Slider
  ==============================================================*/
  function swiperInit() {
    $(".swiper").each(function () {
      var $swiperEl = $(this);
      var $wrapper = $swiperEl.find(".swiper-wrapper");
      var $slides = $wrapper.find(".swiper-slide");
      var totalSlides = $slides.length;

      if (!$wrapper.length) return;
      // Sliders with their own initializer (e.g. pharmacy hero)
      if ($swiperEl.is("[data-custom-init]")) return;

      // ===== DATA ATTRIBUTES =====
      var autoplayVal = Boolean(parseInt($swiperEl.data("autoplay"), 10));
      var loopVal = Boolean(parseInt($swiperEl.data("loop"), 10));
      var centerVal = Boolean(parseInt($swiperEl.data("center"), 10));
      var variableVal = Boolean(parseInt($swiperEl.data("variable-width"), 10));
      var speedVal = parseInt($swiperEl.data("speed")) || 600;
      var isResponsiveMode = $swiperEl.data("slides-per-view") === "responsive";
      var isSingleSlideMode = parseInt($swiperEl.data("slides-per-view")) === 1;

      var slidesPerView = !isResponsiveMode
        ? parseInt($swiperEl.data("slides-per-view")) || 1
        : 1;

      var effect = $swiperEl.data("effect") || "slide";
      // data-gap="none" for edge-to-edge slides (a plain 0 falls back to 24)
      var spaceBetween =
        $swiperEl.data("gap") === "none" ? 0 : parseInt($swiperEl.data("gap")) || 24;
      var autoHeight = parseInt($swiperEl.data("auto-height")) === 1;
      var keyboardEnabled = parseInt($swiperEl.data("keyboard")) === 1;
      var mousewheelEnabled = parseInt($swiperEl.data("mousewheel")) === 1;
      var marqueeVal = Boolean(parseInt($swiperEl.data("marquee"), 10));

      // ===== RESPONSIVE VALUES =====
      var mobileSlides = parseInt($swiperEl.data("mobile-slides")) || 1;
      var tabletSlides = parseInt($swiperEl.data("tablet-slides")) || 2;
      var desktopSlides = parseInt($swiperEl.data("desktop-slides")) || 3;
      var largeDesktopSlides =
        parseInt($swiperEl.data("large-desktop-slides")) || desktopSlides;
      var extraLargeSlides =
        parseInt($swiperEl.data("extra-large-slides")) || largeDesktopSlides;
      var addSlidesPerView =
        parseInt($swiperEl.data("add-slides")) || largeDesktopSlides;

      var mobileGap = parseInt($swiperEl.data("mobile-gap")) || spaceBetween;
      var tabletGap = parseInt($swiperEl.data("tablet-gap")) || spaceBetween;
      var desktopGap = parseInt($swiperEl.data("desktop-gap")) || spaceBetween;
      var largeDesktopGap =
        parseInt($swiperEl.data("large-desktop-gap")) || spaceBetween;
      var extraLargeGap =
        parseInt($swiperEl.data("extra-large-gap")) || spaceBetween;

      // ===== NAVIGATION =====
      var $prevBtn = $swiperEl.find(".slider-prev");
      var $nextBtn = $swiperEl.find(".slider-next");

      if (!$prevBtn.length) {
        $prevBtn = $swiperEl.closest(".slider-section").find(".slider-prev");
      }
      if (!$nextBtn.length) {
        $nextBtn = $swiperEl.closest(".slider-section").find(".slider-next");
      }

      // ===== PAGINATION =====
      var $pagination = $swiperEl.find(".swiper-pagination");
      var paginationType = $swiperEl.data("pagination-type") || "fraction";
      var showPagination = parseInt($swiperEl.data("show-pagination")) !== 0;

      if (!$pagination.length) {
        $pagination = $swiperEl.siblings(".swiper-pagination");
      }

      // ===== VARIABLE WIDTH =====
      var enableVariableWidth = variableVal === true;

      // ===== OVERRIDE FOR SINGLE SLIDE MODE =====
      if (isSingleSlideMode) {
        isResponsiveMode = false;
      }

      // ===== FIXED slidesPerView =====
      var finalSlidesPerView;

      if (isResponsiveMode && !isSingleSlideMode) {
        finalSlidesPerView = enableVariableWidth ? "auto" : mobileSlides;
      } else {
        finalSlidesPerView = 1;
      }

      // ===== BREAKPOINTS =====
      var breakpointsObj = {};

      if (isResponsiveMode && !isSingleSlideMode) {
        breakpointsObj = enableVariableWidth
          ? {
              0: { slidesPerView: "auto", spaceBetween: mobileGap },
              576: { slidesPerView: "auto", spaceBetween: tabletGap },
              768: { slidesPerView: "auto", spaceBetween: desktopGap },
              992: { slidesPerView: "auto", spaceBetween: largeDesktopGap },
              1200: { slidesPerView: "auto", spaceBetween: extraLargeGap },
              1400: { slidesPerView: "auto", spaceBetween: extraLargeGap },
              1600: { slidesPerView: "auto", spaceBetween: extraLargeGap },
            }
          : {
              0: { slidesPerView: mobileSlides, spaceBetween: mobileGap },
              576: { slidesPerView: tabletSlides, spaceBetween: tabletGap },
              768: { slidesPerView: desktopSlides, spaceBetween: desktopGap },
              992: {
                slidesPerView: largeDesktopSlides,
                spaceBetween: largeDesktopGap,
              },
              1200: {
                slidesPerView: extraLargeSlides,
                spaceBetween: extraLargeGap,
              },
              1400: {
                slidesPerView: extraLargeSlides,
                spaceBetween: extraLargeGap,
              },
              1600: {
                slidesPerView: addSlidesPerView,
                spaceBetween: extraLargeGap,
              },
            };
      } else {
        breakpointsObj = {
          0: { slidesPerView: 1, spaceBetween: mobileGap },
          576: { slidesPerView: 1, spaceBetween: tabletGap },
          768: { slidesPerView: 1, spaceBetween: desktopGap },
          992: { slidesPerView: 1, spaceBetween: largeDesktopGap },
          1200: { slidesPerView: 1, spaceBetween: extraLargeGap },
          1400: { slidesPerView: 1, spaceBetween: extraLargeGap },
          1600: { slidesPerView: 1, spaceBetween: extraLargeGap },
        };
      }

      // ===== OPTIONS =====
      var swiperOptions = {
        slidesPerView: finalSlidesPerView,
        spaceBetween: spaceBetween,
        speed: speedVal,
        loop: loopVal,
        autoHeight: autoHeight,
        centeredSlides: centerVal,
        effect: effect,
        grabCursor: true,
        watchOverflow: true,
        breakpoints: breakpointsObj,

        autoplay: autoplayVal
          ? {
              delay: 3000,
              disableOnInteraction: false,
            }
          : false,
      };

      // ===== NAVIGATION =====
      if ($prevBtn.length && $nextBtn.length) {
        swiperOptions.navigation = {
          nextEl: $nextBtn[0],
          prevEl: $prevBtn[0],
        };
      }

      // ===== PAGINATION =====
      if (showPagination && $pagination.length) {
        swiperOptions.pagination = {
          el: $pagination[0],
          clickable: true,
          type: paginationType === "fraction" ? "fraction" : "bullets",
        };
      }

      // ===== MARQUEE (continuous horizontal text slider) =====
      // Moves slides slowly and infinitely to the left with no stops.
      if (marqueeVal) {
        swiperOptions.loop = true;
        swiperOptions.slidesPerView = "auto";
        swiperOptions.allowTouchMove = true;
        swiperOptions.speed = speedVal; // use a high data-speed (e.g. 6000)
        swiperOptions.autoplay = {
          delay: 0,
          disableOnInteraction: false,
        };
        swiperOptions.navigation = false;
        swiperOptions.pagination = false;
      }

      // ===== DESTROY OLD =====
      if ($swiperEl[0].swiper) {
        $swiperEl[0].swiper.destroy(true, true);
      }

      // ===== VARIABLE WIDTH CSS =====
      if (enableVariableWidth && !isSingleSlideMode) {
        $slides.css({
          width: "auto",
          flexShrink: 0,
        });
        $wrapper.css("display", "flex");
      }

      // ===== INIT =====
      var swiperInstance = new Swiper($swiperEl[0], swiperOptions);

      // ===== MARQUEE: constant (linear) movement =====
      if (marqueeVal) {
        $wrapper.css("transition-timing-function", "linear");
      }

      // ===== ARROW VISIBILITY =====
      function updateArrows() {
        if (!$prevBtn.length || !$nextBtn.length) return;

        if (loopVal) {
          $prevBtn.show();
          $nextBtn.show();
          return;
        }

        var currentView = finalSlidesPerView;

        if (isResponsiveMode && !enableVariableWidth && !isSingleSlideMode) {
          var w = window.innerWidth;

          if (w >= 1600) currentView = addSlidesPerView;
          else if (w >= 1400) currentView = extraLargeSlides;
          else if (w >= 1200) currentView = extraLargeSlides;
          else if (w >= 992) currentView = largeDesktopSlides;
          else if (w >= 768) currentView = desktopSlides;
          else if (w >= 576) currentView = tabletSlides;
          else currentView = mobileSlides;
        } else if (isSingleSlideMode) {
          currentView = 1;
        }

        if (totalSlides > currentView) {
          $prevBtn.show();
          $nextBtn.show();
        } else {
          $prevBtn.hide();
          $nextBtn.hide();
        }
      }

      setTimeout(function () {
        swiperInstance.update();
        updateArrows();
      }, 100);

      swiperInstance.on("resize breakpoint slideChange", function () {
        updateArrows();
      });
    });
  }
  /*===========================================================
    06. Language Select
  =============================================================*/
  function languageSwitch() {
    const rtlLangs = ["ara"];

    if (isRTL) {
      $(".cs_language").text(rtlLangs[0]);
    }

    // Language Update Functionality
    $(".cs_language_switcher").on("click", function () {
      $(".cs_language_dropdown").slideToggle(250);
    });

    // Handle flag click
    $(".cs_language_dropdown button").on("click", function () {
      const selectedLang = $(this).data("lang");
      // Replace the selected flag in switcher
      $(".cs_language").text(selectedLang);
      $(".cs_language_dropdown").slideUp(250);
      // Switch layout direction (RTL languages)
      setDirection(rtlLangs.includes(selectedLang) ? "rtl" : "ltr");
    });

    // Close dropdown when clicking outside
    $(document).on("click", function (e) {
      if (!$(e.target).closest(".cs_language_select").length) {
        $(".cs_language_dropdown").slideUp(250);
      }
    });
  }
  /*============================================================
    07. Smooth Page Scroll
  ==============================================================*/
  function smoothScroll() {
    if (typeof Lenis === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.lenisInstance) return;

    const lenis = new Lenis({
      duration: 1.2,
      smooth: true,
      smoothTouch: false,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      prevent: (node) => {
        return (
          node.classList?.contains("choices__list--dropdown") ||
          node.classList?.contains("choices__list") ||
          node.closest?.(".choices__list--dropdown") !== null
        );
      },
    });

    window.lenisInstance = lenis;

    // GSAP + ScrollTrigger integration
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }
  /*============================================================
    08. Counter Animation
  ==============================================================*/
  function counterInit() {
    if (!$.exists(".odometer")) return;

    const observer = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const el = $(entry.target);
            el.html(el.data("count-to"));
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.3,
      },
    );

    $(".odometer").each(function () {
      observer.observe(this);
    });
  }
  /*============================================================
    09. Modal Video
  ==============================================================*/
  function modalVideo() {
    if ($.exists(".cs_video_open")) {
      $("body").append(`
        <div class="cs_video_popup">
          <div class="cs_video_popup-overlay"></div>
          <div class="cs_video_popup-content">
            <div class="cs_video_popup-layer"></div>
            <div class="cs_video_popup_container">
              <div class="cs_video_popup-align">
                <div class="embed-responsive embed-responsive-16by9">
                  <iframe class="embed-responsive-item" src="about:blank"></iframe>
                </div>
              </div>
              <div class="cs_video_popup_close"></div>
            </div>
          </div>
        </div>
      `);
      $(document).on("click", ".cs_video_open", function (e) {
        e.preventDefault();
        var video = $(this).attr("href");

        $(".cs_video_popup_container iframe").attr("src", `${video}`);

        $(".cs_video_popup").addClass("active");
      });
      $(".cs_video_popup_close, .cs_video_popup-layer").on(
        "click",
        function (e) {
          $(".cs_video_popup").removeClass("active");
          $("html").removeClass("overflow-hidden");
          $(".cs_video_popup_container iframe").attr("src", "about:blank");
          e.preventDefault();
        },
      );
    }
  }
  /*============================================================
    10. Review
  ==============================================================*/
  function review() {
    $(".cs_rating").each(function () {
      var review = $(this).data("rating");
      var reviewVal = review * 20 + "%";
      $(this).find(".cs_rating_percentage").css("width", reviewVal);
    });
  }
  /*============================================================
    11. Tabs
  ===============================================================*/
  function tabs() {
    $(".cs_tab_links > li > a").on("click", function (e) {
      var currentAttrValue = $(this).attr("href");
      //Tab and slider both activation code
      $(".cs_tabs " + currentAttrValue)
        .addClass("active")
        .siblings()
        .removeClass("active");
      $(this).parents("li").addClass("active").siblings().removeClass("active");
      e.preventDefault();
    });
  }
  /*===========================================================
    12. Accordian
  =============================================================*/
  function accordian() {
    $(".cs_accordian").children(".cs_accordian_body").hide();
    $(".cs_accordian.active").children(".cs_accordian_body").show();
    $(".cs_accordian_head").on("click", function () {
      $(this)
        .parent(".cs_accordian")
        .siblings()
        .children(".cs_accordian_body")
        .slideUp(250);
      $(this).siblings().slideDown(400);
      $(this)
        .parents(".col-lg-6")
        .siblings()
        .find(".cs_accordian_body")
        .slideUp(250);
      /* Accordian Active Class */
      $(this).parents(".cs_accordian").addClass("active");
      $(this).parent(".cs_accordian").siblings().removeClass("active");
      $(this)
        .parents(".col-lg-6")
        .siblings()
        .find(".cs_accordian")
        .removeClass("active");
    });
  }
  /*===========================================================
    13. Service Hover Tabs (cs_service_section_3)
  =============================================================*/
  function serviceHoverTabs() {
    $(".cs_service_section_3").each(function () {
      var $section = $(this);
      var $items = $section.find(".cs_service_menu_item");
      var $panes = $section.find(".cs_service_pane");

      if (!$items.length || !$panes.length) return;

      $items.on("mouseenter focus", function () {
        var idx = $items.index(this);
        $items.removeClass("cs_active");
        $(this).addClass("cs_active");
        $panes.removeClass("cs_active");
        $panes.eq(idx).addClass("cs_active");
      });
    });
  }
  /*===========================================================
    13b. Experts Hover Tabs (Team Section 4)
  =============================================================*/
  function expertsHoverTabs() {
    $(".cs_team_section_4").each(function () {
      var $section = $(this);
      var $items = $section.find(".cs_expert_item");
      if (!$items.length) return;

      $items.on("mouseenter focusin", function () {
        var $item = $(this);
        var target = $item.attr("data-expert-tab");
        // Activate the matching image tab on the left.
        if (target) {
          $section
            .find(target)
            .addClass("active")
            .siblings()
            .removeClass("active");
        }
        // Activate the hovered expert row (shows bio, socials & book btn).
        $item.addClass("active").siblings().removeClass("active");
      });
    });
  }
  /*===========================================================
    14. Scroll Up
  =============================================================*/
  function scrollUp() {
    $(".cs_scrollup_btn").on("click", function (e) {
      e.preventDefault();
      $("html,body").animate(
        {
          scrollTop: 0,
        },
        0,
      );
    });
  }
  /* For Scroll Up */
  function showScrollUp() {
    let scroll = $(window).scrollTop();
    if (scroll >= 350) {
      $(".cs_scrollup_btn").addClass("show");
    } else {
      $(".cs_scrollup_btn").removeClass("show");
    }
  }
  /*===========================================================
    15. Hobble / Particle Move
  =============================================================*/
  function hobbleEffectInit() {
    var $sections = $(".cs_hobble");
    if (!$sections.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    $sections.each(function () {
      var $section = $(this);
      var $target = $section.find(".cs_hobble_particle").first();
      if (!$target.length) return;

      var target = $target[0];
      var section = this;
      var rafId = null;
      var nextX = 0;
      var nextY = 0;

      var apply = function () {
        rafId = null;
        target.style.setProperty("--mx", nextX.toFixed(3));
        target.style.setProperty("--my", nextY.toFixed(3));
      };

      $section.on("mousemove", function (e) {
        var rect = section.getBoundingClientRect();
        nextX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        nextY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        if (rafId === null) rafId = requestAnimationFrame(apply);
      });

      $section.on("mouseleave", function () {
        nextX = 0;
        nextY = 0;
        if (rafId === null) rafId = requestAnimationFrame(apply);
      });
    });
  }
  /*===========================================================
    16. Section Title Word Reveal (GSAP + SplitText)
  =============================================================*/
  function sectionTitleRevealInit() {
    if (
      typeof gsap === "undefined" ||
      typeof ScrollTrigger === "undefined" ||
      typeof SplitText === "undefined"
    )
      return;

    const titles = document.querySelectorAll(".cs_section_title");
    if (!titles.length) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // True when the element is already visible in the viewport, so it should
    function isInViewport(el) {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < vh * 1 && rect.bottom > 0;
    }

    titles.forEach(function (title) {
      SplitText.create(title, {
        // Word blocks break bidi order in RTL, so split by lines there
        type: isRTL ? "lines" : "words",
        wordsClass: "cs_reveal_word",
        linesClass: "cs_reveal_line",
        autoSplit: true,
        onSplit: function (self) {
          const tween = gsap.from(isRTL ? self.lines : self.words, {
            opacity: 0,
            y: 24,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
            paused: true,
          });

          if (isInViewport(title)) {
            // Already on screen (no scroll required) — play immediately.
            tween.play();
          } else {
            // Below the fold — reveal once it scrolls into view.
            ScrollTrigger.create({
              trigger: title,
              start: "top 85%",
              once: true,
              onEnter: function () {
                tween.play();
              },
            });
          }

          return tween;
        },
      });
    });
  }
  /*===========================================================
    17. Sticky Card Animation (GSAP)
  =============================================================*/
  function stickyCardInit() {
    const $sections = $(".cs_sticky_section");
    if (!$sections.length) return;

    const OFFSET_TOP = 100;
    const BREAKPOINT = 992;
    const MIN_SCALE = 0.5;

    const entries = [];
    $sections.each(function () {
      const $cards = $(this).find(".cs_sticky_card");
      if ($cards.length < 2) return;
      const cards = [];
      $cards.each(function () {
        cards.push(this);
      });
      entries.push({ section: this, cards: cards });
    });

    if (!entries.length) return;

    function applyStickyStyles(enabled) {
      entries.forEach(function (entry) {
        entry.cards.forEach(function (card, index) {
          if (enabled && index < entry.cards.length - 1) {
            card.style.position = "sticky";
            card.style.top = OFFSET_TOP + "px";
            card.style.willChange = "transform, opacity";
          } else {
            card.style.position = "";
            card.style.top = "";
            card.style.transform = "";
            card.style.opacity = "";
            card.style.willChange = "";
          }
        });
      });
    }

    let isDesktop = $(window).width() >= BREAKPOINT;
    applyStickyStyles(isDesktop);

    let rafId = null;
    const tick = function () {
      if (isDesktop) {
        const vh =
          $(window).height() || document.documentElement.clientHeight || 0;
        const animDistance = vh - OFFSET_TOP;

        for (let i = 0; i < entries.length; i++) {
          const cards = entries[i].cards;
          const lastIndex = cards.length - 1;
          const sectionRect = entries[i].section.getBoundingClientRect();
          if (sectionRect.bottom < -50 || sectionRect.top > vh + 50) continue;

          for (let j = 0; j < lastIndex; j++) {
            const card = cards[j];
            const nextCard = cards[j + 1];
            const nextTop = nextCard.getBoundingClientRect().top;

            let progress = (vh - nextTop) / animDistance;
            if (progress < 0) progress = 0;
            else if (progress > 1) progress = 1;

            const scale = 1 - (1 - MIN_SCALE) * progress;
            card.style.transform = "scale(" + scale + ")";
            card.style.opacity = 1 - progress;
          }
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    const start = function () {
      if (rafId !== null) return;
      tick();
    };

    const stop = function () {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    let resizeTimer;
    $(window).on("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        const nowDesktop = $(window).width() >= BREAKPOINT;
        if (nowDesktop !== isDesktop) {
          isDesktop = nowDesktop;
          applyStickyStyles(isDesktop);
        }
      }, 150);
    });

    $(window).on("orientationchange", function () {
      setTimeout(function () {
        isDesktop = $(window).width() >= BREAKPOINT;
        applyStickyStyles(isDesktop);
      }, 250);
    });

    $(document).on("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });

    $(window).on("pageshow", start);

    start();
  }
  /*===========================================================
    18. Parallax Image
  =============================================================*/
  function parallaxImageInit() {
    const $banners = $(".cs_parallax");
    if (!$banners.length) return;
    const Y_RANGE = 20;
    const SCALE = 1.15;

    const entries = [];
    $banners.each(function () {
      const $banner = $(this);
      const $img = $banner.find("img").first();
      if (!$img.length) return;

      $banner.css({
        overflow: "hidden",
        clipPath:
          $banner.attr("data-cs-revealed") === "1"
            ? "inset(0% 0% 0% 0%)"
            : "inset(100% 0% 0% 0%)",
        transition: "clip-path 1.1s cubic-bezier(0.22, 1, 0.36, 1)",
      });

      $img.css({
        willChange: "transform",
        height: "100%",
        transformOrigin: "center center",
      });

      entries.push({ $banner: $banner, $img: $img });
    });

    if (!entries.length) return;
    let rafId = null;
    const tick = function () {
      const vh =
        $(window).height() || document.documentElement.clientHeight || 0;

      for (let i = 0; i < entries.length; i++) {
        const $banner = entries[i].$banner;
        const $img = entries[i].$img;
        const rect = $banner[0].getBoundingClientRect();

        if (rect.bottom < -50 || rect.top > vh + 50) continue;

        const total = vh + rect.height;
        const traversed = vh - rect.top;
        let progress = traversed / total;
        if (progress < 0) progress = 0;
        else if (progress > 1) progress = 1;

        const yPercent = -Y_RANGE + Y_RANGE * 2 * progress;
        $img.css(
          "transform",
          "scale(" + SCALE + ") translate3d(0, " + yPercent + "%, 0)",
        );

        if ($banner.attr("data-cs-revealed") !== "1" && rect.top < vh * 0.9) {
          $banner.attr("data-cs-revealed", "1");
          $banner.css("clipPath", "inset(0% 0% 0% 0%)");
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    const start = function () {
      if (rafId !== null) return;
      tick();
    };

    const stop = function () {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    $(document).on("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });

    $(window).on("pageshow", start);

    start();
  }
  /*===========================================================
    19. Pricing Value Toggle
  =============================================================*/
  function pricingToggleInit() {
    var $toggle = $("#cs_billing_toggle");
    if (!$toggle.length) return;

    var $labels = $(".cs_pricing_toggle_label");
    var $amounts = $(".cs_pricing_amount");
    var $periods = $(".cs_pricing_value small");

    function update(isYearly) {
      $labels.each(function () {
        $(this).toggleClass(
          "active",
          $(this).data("period") === (isYearly ? "yearly" : "monthly"),
        );
      });
      $amounts.each(function () {
        $(this).text(
          isYearly ? $(this).data("yearly") : $(this).data("monthly"),
        );
      });
      $periods.text(isYearly ? "/ year" : "/ month");
    }

    $toggle.on("change", function () {
      update($toggle.is(":checked"));
    });

    $labels.on("click", function () {
      var yearly = $(this).data("period") === "yearly";
      $toggle.prop("checked", yearly);
      update(yearly);
    });
  }
  /*===========================================================
    20. Packages Sidebar Filter
  =============================================================*/
  function packagesFilterInit() {
    var $grid = $("#cs_packages_grid");
    if (!$grid.length) return;

    var $items = $grid.find(".cs_package_item");
    var $empty = $grid.find(".cs_packages_empty");
    var activeFilters = {};

    function applyFilters() {
      var visibleCount = 0;

      $items.each(function () {
        var tokens = ($(this).data("filter") || "").toString().split(/\s+/);
        var matched = true;

        $.each(activeFilters, function (group, value) {
          if (value !== "all" && $.inArray(value, tokens) === -1) {
            matched = false;
            return false;
          }
        });

        $(this).toggle(matched);
        if (matched) visibleCount++;
      });

      $empty.prop("hidden", visibleCount !== 0);
    }

    $(".cs_filter_list").each(function () {
      activeFilters[$(this).data("filter-group")] = "all";
    });

    $(".cs_filter_list .cs_filter_btn").on("click", function () {
      var $btn = $(this);
      var group = $btn.closest(".cs_filter_list").data("filter-group");

      activeFilters[group] = $btn.data("filter");
      $btn
        .addClass("active")
        .closest(".cs_filter_list")
        .find(".cs_filter_btn")
        .not($btn)
        .removeClass("active");

      applyFilters();
    });
  }
  /*===============================================================
    21. Toggle Active Class
  =================================================================*/
  function toggleActiveClass() {
    $('[data-active="toggle"]').click(function () {
      $(this).addClass("active").siblings().removeClass("active");
    });
  }
  /*=====================================================
    22. Ecommerce
  =======================================================*/
  function ecommerceInit() {
    // Star Rating Input
    $(".cs_input_rating i").on("click", function () {
      $(this).siblings().removeClass("fa-solid");
      $(this).addClass("fa-solid").prevAll().addClass("fa-solid");
    });
    // Check All
    $("#checkAll").change(function () {
      var isChecked = $(this).prop("checked");
      $('table input[type="checkbox"]').prop("checked", isChecked);
    });
    // Counter
    $(".cs_increment").click(function () {
      var countElement = $(this).siblings(".cs_quantity_input");
      var count = parseInt(countElement.text());
      count++;
      count < 10 ? countElement.text("0" + count) : countElement.text(count);
    });

    $(".cs_decrement").click(function () {
      var countElement = $(this).siblings(".cs_quantity_input");
      var count = parseInt(countElement.text());
      if (count > 1) {
        count--;
        count < 10 ? countElement.text("0" + count) : countElement.text(count);
      }
    });
  }
  /*=====================================================
    23. Countdown Timer
    Counts down from the values written in the HTML
    (e.g. <span data-unit="hours">11</span>). Optional
    data-end="YYYY-MM-DDTHH:MM:SS" counts down to a fixed date
    instead. If every value is 00, counts down to the end of the
    current day. When time is up, .cs_ended is added and the
    .cs_countdown_ended message is shown.
  =======================================================*/
  function countdownInit() {
    $(".cs_countdown").each(function () {
      var $el = $(this);
      var endAttr = $el.attr("data-end");
      var units = { days: 86400, hours: 3600, minutes: 60, seconds: 1 };
      var hasDays = $el.find("[data-unit='days']").length > 0;
      var duration = 0;
      $.each(units, function (unit, secs) {
        var val = parseInt($el.find("[data-unit='" + unit + "']").text(), 10);
        if (!isNaN(val)) duration += val * secs;
      });
      var end;
      var setEnd = function () {
        if (endAttr) {
          end = new Date(endAttr).getTime();
        } else if (duration > 0) {
          end = Date.now() + duration * 1000;
        } else {
          var d = new Date();
          d.setHours(23, 59, 59, 999);
          end = d.getTime();
        }
      };
      var pad = function (n) {
        return n < 10 ? "0" + n : String(n);
      };
      var timer;
      var update = function () {
        var s = Math.floor(Math.max(0, end - Date.now()) / 1000);
        if (s === 0) {
          if (!$el.find(".cs_countdown_ended").length) {
            $el.append(
              '<div class="cs_countdown_ended">This offer has ended</div>',
            );
          }
          $el.addClass("cs_ended").attr("aria-label", "Offer ended");
          clearInterval(timer);
        }
        $el.find("[data-unit='days']").text(pad(Math.floor(s / 86400)));
        $el
          .find("[data-unit='hours']")
          .text(pad(Math.floor((hasDays ? s % 86400 : s) / 3600)));
        $el
          .find("[data-unit='minutes']")
          .text(pad(Math.floor((s % 3600) / 60)));
        $el.find("[data-unit='seconds']").text(pad(s % 60));
      };
      setEnd();
      timer = setInterval(update, 1000);
      update();
    });
  }
  /*=====================================================
    24. Prescription Upload (show selected file name)
  =======================================================*/
  function prescriptionUploadInit() {
    $(".cs_rx_upload input[type='file']").on("change", function () {
      var $label = $(this).closest(".cs_rx_upload").find(".cs_rx_upload_text");
      if (!$label.data("default")) $label.data("default", $label.text());
      var names = $.map(this.files || [], function (f) {
        return f.name;
      });
      $label.text(names.length ? names.join(", ") : $label.data("default"));
    });

    // Loop the steps: complete one after another, hold, reset, repeat.
    // Runs only while the steps are on screen.
    $(".cs_rx_steps").each(function () {
      var $wrap = $(this);
      var $steps = $wrap.find(".cs_rx_step");
      var completeTime = $steps.length * 1600; // matches the CSS 1.6s stagger
      var holdTime = 2500;
      var resetTime = 600;
      var timer = null;
      var reduceMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      $steps.each(function (i) {
        this.style.setProperty("--i", i);
      });
      if (reduceMotion || !("IntersectionObserver" in window)) {
        $steps.addClass("is-complete");
        return;
      }

      var play = function () {
        $wrap.removeClass("is-resetting");
        $steps.addClass("is-complete");
        timer = setTimeout(function () {
          $wrap.addClass("is-resetting");
          $steps.removeClass("is-complete");
          timer = setTimeout(play, resetTime);
        }, completeTime + holdTime);
      };
      var stop = function () {
        clearTimeout(timer);
        timer = null;
        $wrap.removeClass("is-resetting");
        $steps.removeClass("is-complete");
      };

      new IntersectionObserver(
        function (entries) {
          if (entries[0].isIntersecting) {
            if (!timer) play();
          } else {
            stop();
          }
        },
        { threshold: 0.3 },
      ).observe(this);
    });
  }
  /*=====================================================
    25. Pharmacy Hero Slider
  =======================================================*/
  function pharmacyHeroSliderInit() {
    $(".cs_pharmacy_hero_slider").each(function () {
      var $root = $(this).closest(".cs_pharmacy_hero");
      var $bullets = $root.find(".cs_hero_bullet");
      var reduceMotion =
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      var setActive = function (index) {
        $bullets
          .removeClass("active")
          .attr("aria-current", null)
          .find(".cs_hero_bullet_bar")
          .css("transform", "");
        $bullets.eq(index).addClass("active").attr("aria-current", "true");
      };

      var slider = new Swiper(this, {
        effect: "fade",
        fadeEffect: { crossFade: true },
        speed: reduceMotion ? 0 : 1000,
        rewind: true,
        allowTouchMove: true,
        autoHeight: false,
        navigation: {
          prevEl: $root.find(".cs_hero_prev")[0],
          nextEl: $root.find(".cs_hero_next")[0],
        },
        autoplay: reduceMotion
          ? false
          : {
              delay: 6000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            },
        on: {
          init: function () {
            setActive(0);
            $root.addClass("cs_hero_ready");
          },
          slideChange: function () {
            setActive(this.realIndex);
          },
          autoplayTimeLeft: function (s, time, progress) {
            $bullets
              .eq(s.realIndex)
              .find(".cs_hero_bullet_bar")
              .css("transform", "scaleX(" + (1 - progress) + ")");
          },
        },
      });

      $bullets.on("click", function () {
        slider.slideTo($bullets.index(this));
      });

      // Don't change slides while the visitor is typing a search
      $root
        .find(".cs_hero_search input")
        .on("focus", function () {
          if (slider.autoplay && slider.autoplay.running)
            slider.autoplay.pause();
        })
        .on("blur", function () {
          if (slider.autoplay && slider.autoplay.running)
            slider.autoplay.resume();
        });
    });
  }
  /*=====================================================
    26. Cart Drawer (mini cart)
    - ".addToCart" adds the product without leaving the page
    - header ".cs_cart_btn" opens the drawer
    Cart is kept in localStorage so it survives page changes.
    Only pages that include ".cs_cart_drawer" intercept clicks.
  =======================================================*/
  function cartDrawerInit() {
    var storageKey = "hospil_cart";
    var memoryCart = [];
    var $drawer = $(".cs_cart_drawer");
    var hasDrawer = $drawer.length > 0;
    var $list = $drawer.find(".cs_cart_drawer_list");
    var $toast = $(".cs_cart_toast");
    var lastTrigger = null;
    var toastTimer = null;

    var readCart = function () {
      try {
        var data = JSON.parse(window.localStorage.getItem(storageKey));
        return Array.isArray(data) ? data : [];
      } catch (e) {
        return memoryCart;
      }
    };
    var writeCart = function (cart) {
      memoryCart = cart;
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(cart));
      } catch (e) {}
    };
    var money = function (n) {
      return "$" + (Math.round(n * 100) / 100).toFixed(2);
    };
    var slug = function (s) {
      return String(s)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    };

    // Read product details from any supported product markup
    var productFrom = function ($btn) {
      var $root = $btn.closest(
        ".cs_pharmacy_product, .cs_product_card_1, .cs_product_summary",
      );
      if (!$root.length) return null;
      var $title = $root.find(".cs_product_title").first();
      var $price = $root.find(".cs_product_price").first().clone();
      $price.find("del").remove();
      var price = parseFloat($price.text().replace(/[^0-9.]/g, "")) || 0;
      var $img = $root.find(".cs_product_thumb img").first();
      if (!$img.length)
        $img = $root.closest("section").find(".cs_product_gallery img").first();
      var $link = $title.find("a");
      var qty =
        parseInt($root.find(".cs_quantity_input").first().text(), 10) || 1;
      var name = $.trim($title.text());
      return {
        id: slug(name),
        name: name,
        price: price,
        img: $img.attr("src") || "",
        url: $link.attr("href") || "shop-details.html",
        qty: qty,
      };
    };

    var render = function () {
      var cart = readCart();
      var count = 0;
      var total = 0;
      $.each(cart, function (i, item) {
        count += item.qty;
        total += item.qty * item.price;
      });
      $(".cs_site_header .cs_cart_badge").text(count);
      if (!hasDrawer) return;

      $list.empty();
      $.each(cart, function (i, item) {
        var $li = $('<li class="cs_cart_drawer_item"></li>').attr(
          "data-id",
          item.id,
        );
        $('<a class="cs_cart_item_img"></a>')
          .attr({ href: item.url, "aria-label": item.name })
          .append(
            $('<img width="76" height="76">').attr({
              src: item.img,
              alt: item.name,
            }),
          )
          .appendTo($li);
        var $info = $('<div class="cs_cart_item_info"></div>').appendTo($li);
        $(
          '<h3 class="cs_cart_item_title cs_fs_16 cs_semibold cs_primary_color"></h3>',
        )
          .append($("<a></a>").attr("href", item.url).text(item.name))
          .appendTo($info);
        $('<span class="cs_cart_item_price cs_fs_14"></span>')
          .text(
            money(item.price) +
              " × " +
              item.qty +
              " = " +
              money(item.price * item.qty),
          )
          .appendTo($info);
        $('<div class="cs_cart_item_qty"></div>')
          .append(
            '<button type="button" data-cart-action="dec" aria-label="Decrease quantity"><i class="fa-solid fa-minus"></i></button>',
          )
          .append($("<span></span>").text(item.qty))
          .append(
            '<button type="button" data-cart-action="inc" aria-label="Increase quantity"><i class="fa-solid fa-plus"></i></button>',
          )
          .appendTo($info);
        $li.append(
          '<button type="button" class="cs_cart_item_remove cs_center" data-cart-action="remove" aria-label="Remove item"><i class="fa-regular fa-trash-can"></i></button>',
        );
        $list.append($li);
      });
      $drawer.find(".cs_cart_drawer_count").text("(" + count + ")");
      $drawer.find(".cs_cart_drawer_total").text(money(total));
      $drawer.toggleClass("cs_cart_is_empty", cart.length === 0);
    };

    var addItem = function (product) {
      var cart = readCart();
      var found = false;
      $.each(cart, function (i, item) {
        if (item.id === product.id) {
          item.qty += product.qty;
          found = true;
        }
      });
      if (!found) cart.push(product);
      writeCart(cart);
      render();
      $(".cs_site_header .cs_cart_badge")
        .removeClass("cs_bump")
        .each(function () {
          void this.offsetWidth; // restart animation
        })
        .addClass("cs_bump");
    };

    var updateItem = function (id, action) {
      var cart = readCart();
      cart = $.grep(cart, function (item) {
        if (item.id !== id) return true;
        if (action === "inc") item.qty += 1;
        if (action === "dec") item.qty -= 1;
        return action !== "remove" && item.qty > 0;
      });
      writeCart(cart);
      render();
    };

    var openDrawer = function () {
      lastTrigger = document.activeElement;
      render();
      $drawer.addClass("active").attr("aria-hidden", "false");
      $("html").addClass("cs_cart_open").css("overflow", "hidden");
      if (window.lenisInstance) window.lenisInstance.stop();
      setTimeout(function () {
        $drawer.find(".cs_cart_drawer_panel").trigger("focus");
      }, 50);
    };
    var closeDrawer = function () {
      $drawer.removeClass("active").attr("aria-hidden", "true");
      $("html").removeClass("cs_cart_open").css("overflow", "");
      if (window.lenisInstance) window.lenisInstance.start();
      if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
    };

    var showToast = function (name) {
      if (!$toast.length) return;
      $toast.find(".cs_toast_name").text(name);
      $toast.addClass("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(function () {
        $toast.removeClass("show");
      }, 3500);
    };

    render();
    if (!hasDrawer) return;

    // Add to cart (stay on page)
    $(document).on("click", ".addToCart", function (e) {
      var $btn = $(this);
      var product = productFrom($btn);
      if (!product) return;
      e.preventDefault();
      addItem(product);
      showToast(product.name);

      var $label = $btn.children("span").first();
      $btn.addClass("cs_added");
      if ($label.length) {
        if (!$label.data("label")) $label.data("label", $label.text());
        $label.text("Added");
      }
      setTimeout(function () {
        $btn.removeClass("cs_added");
        if ($label.length) $label.text($label.data("label"));
      }, 1500);
    });

    // Header cart icon opens the drawer
    $(".cs_site_header .cs_cart_btn").on("click", function (e) {
      e.preventDefault();
      openDrawer();
    });
    $toast.find(".cs_toast_btn").on("click", function () {
      $toast.removeClass("show");
      openDrawer();
    });

    $drawer.on(
      "click",
      ".cs_cart_drawer_overlay, .cs_cart_drawer_close",
      closeDrawer,
    );
    $drawer.on("click", "[data-cart-action]", function () {
      updateItem(
        $(this).closest(".cs_cart_drawer_item").attr("data-id"),
        $(this).attr("data-cart-action"),
      );
    });
    $(document).on("keydown", function (e) {
      if (e.key === "Escape" && $drawer.hasClass("active")) closeDrawer();
    });
    // keep other tabs in sync
    $(window).on("storage", function (e) {
      if (e.originalEvent && e.originalEvent.key === storageKey) render();
    });
  }
  /*=====================================================
    27. Physio Pain Map (home-v7)
  =======================================================*/
  function physioPainMapInit() {
    $("[data-painmap]").each(function () {
      var $map = $(this);
      var $figure = $map.find(".cs_painmap_figure");
      var $views = $map.find(".cs_painmap_view");
      var $spots = $map.find(".cs_hotspot");
      var $panels = $map.find(".cs_painmap_panel");

      var showArea = function ($spot) {
        $spots.removeClass("active").attr("aria-pressed", "false");
        $spot.addClass("active").attr("aria-pressed", "true");
        $panels.removeClass("active");
        $("#" + $spot.data("target")).addClass("active");
      };

      $spots.each(function () {
        $(this)
          .attr("aria-pressed", $(this).hasClass("active") ? "true" : "false")
          .attr("aria-controls", $(this).data("target"));
      });

      $spots.on("click", function () {
        showArea($(this));
      });

      // Front / back toggle: switch view and open its first area
      $views.on("click", function () {
        var view = $(this).data("view");
        $views.removeClass("active").attr("aria-pressed", "false");
        $(this).addClass("active").attr("aria-pressed", "true");
        $figure.attr("data-current-view", view);
        showArea($spots.filter(".cs_view_" + view).first());
      });
    });
  }
  /*=====================================================
    27b. Hero Background Video (pause / play toggle)
  =======================================================*/
  function heroVideoInit() {
    $(".cs_hero_video_toggle").each(function () {
      var $btn = $(this);
      var video = $btn.siblings("video")[0];
      if (!video) return;

      var sync = function () {
        var paused = video.paused;
        $btn
          .attr("aria-pressed", paused ? "true" : "false")
          .attr(
            "aria-label",
            paused ? "Play background video" : "Pause background video",
          )
          .find("i")
          .toggleClass("fa-pause", !paused)
          .toggleClass("fa-play", paused);
      };

      // Respect reduced motion: keep the poster frame instead of autoplay
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        video.removeAttribute("autoplay");
        video.pause();
      }

      $btn.on("click", function () {
        if (video.paused) video.play();
        else video.pause();
      });
      $(video).on("play pause", sync);
      sync();
    });
  }
  /*=====================================================
    28. In-View Reveal ([data-inview] gets .is-visible)
  =======================================================*/
  function inViewInit() {
    var $items = $("[data-inview]");
    if (!$items.length) return;

    if (!("IntersectionObserver" in window)) {
      $items.addClass("is-visible");
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            $(entry.target).addClass("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    $items.each(function () {
      observer.observe(this);
    });
  }
  /*=====================================================
    29. Vet Pet Selector Tabs (home-v8)
  =======================================================*/
  function vetPetTabsInit() {
    $("[data-pet-tabs]").each(function () {
      var $wrap = $(this);
      var $tabs = $wrap.find("[role='tab']");
      var $panels = $wrap.find("[role='tabpanel']");

      var activate = function ($tab, focus) {
        $tabs
          .removeClass("active")
          .attr({ "aria-selected": "false", tabindex: "-1" });
        $tab
          .addClass("active")
          .attr({ "aria-selected": "true", tabindex: "0" });
        $panels.removeClass("active").attr("hidden", true);
        $("#" + $tab.attr("aria-controls"))
          .addClass("active")
          .removeAttr("hidden");
        if (focus) $tab.trigger("focus");
      };

      $tabs.on("click", function () {
        activate($(this));
      });

      // Arrow keys move between tabs (reversed in RTL)
      $tabs.on("keydown", function (e) {
        var index = $tabs.index(this);
        var next = isRTL ? -1 : 1;
        if (e.key === "ArrowRight") index += next;
        else if (e.key === "ArrowLeft") index -= next;
        else if (e.key === "Home") index = 0;
        else if (e.key === "End") index = $tabs.length - 1;
        else return;
        e.preventDefault();
        activate($tabs.eq((index + $tabs.length) % $tabs.length), true);
      });
    });
  }
  /*=====================================================
    30. Physio Footer Live Hours (home-v7)
  =======================================================*/
  function physioFooterHoursInit() {
    $("[data-pf-hours]").each(function () {
      var $card = $(this);
      var $status = $card.find("[data-pf-status]");
      var now = new Date();
      var day = String(now.getDay());
      var hour = now.getHours() + now.getMinutes() / 60;
      var isOpen = false;

      $card.find("[data-days]").each(function () {
        var $row = $(this);
        if ($row.attr("data-days").split(",").indexOf(day) === -1) return;
        $row.addClass("cs_today");
        var open = parseFloat($row.attr("data-open"));
        var close = parseFloat($row.attr("data-close"));
        isOpen = hour >= open && hour < close;
      });

      $status
        .text(isOpen ? "Open now" : "Closed now")
        .addClass(isOpen ? "cs_open" : "cs_closed");
    });
  }
  /*=====================================================
    31. Marquee Edge Zoom ([data-edge-zoom], home-v8)
    Slides grow in at the start edge and shrink out at the end.
  =======================================================*/
  function marqueeEdgeZoomInit() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    $("[data-edge-zoom]").each(function () {
      var el = this;
      var zone = parseInt($(el).data("edge-zoom"), 10) || 70;
      var inScale = 0.3; // entering edge
      var outScale = parseFloat($(el).data("edge-zoom-out")) || 0.6; // leaving edge
      var visible = true;

      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
        }).observe(el);
      }

      function tick() {
        if (visible) {
          var box = el.getBoundingClientRect();
          var slides = el.querySelectorAll(".swiper-slide");
          for (var i = 0; i < slides.length; i++) {
            var r = slides[i].getBoundingClientRect();
            var center = r.left + r.width / 2;
            var fromLeft = center - box.left;
            var fromRight = box.right - center;
            // Marquee runs right-to-left (reversed in RTL), so slides leave on the left
            var leaving = isRTL ? fromRight < fromLeft : fromLeft < fromRight;
            var minScale = leaving ? outScale : inScale;
            var t = Math.max(
              0,
              Math.min(1, Math.min(fromLeft, fromRight) / zone),
            );
            t = t * t * (3 - 2 * t); // smoothstep
            slides[i].style.scale = minScale + (1 - minScale) * t;
            slides[i].style.opacity = t;
          }
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }
  /*=====================================================
    32. Physio Exercise Video Switcher (home-v7)
    Hovering or focusing an exercise swaps the preview and play link.
  =======================================================*/
  function exerciseSwitchInit() {
    $("[data-exercise-switch]").each(function () {
      var $box = $(this);
      var $media = $box.find("[data-exercise-media]");
      var $play = $box.find(".cs_video_play");
      var $tabs = $box.find("[data-exercise]");

      $tabs.on("mouseenter focus", function () {
        var $tab = $(this);
        var key = $tab.attr("data-exercise");
        if ($tab.hasClass("active")) return;

        $tabs.removeClass("active");
        $tab.addClass("active");
        $media
          .removeClass("active")
          .filter('[data-exercise-media="' + key + '"]')
          .addClass("active");
        $play.attr({
          href: $tab.attr("href"),
          "aria-label": $tab.attr("aria-label"),
        });
      });
    });
  }
})(jQuery); // End of use strict
