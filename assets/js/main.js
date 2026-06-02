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
  | 01. Preloader
  | 02. Mobile Menu
  | 03. Sticky Header
  | 04. Dynamic Background
  | 05. Swiper Slider
  | 06. Search Modal Toggle
  | 07. Smooth Page Scroll(Lenis)
  | 08. Counter Animation
  | 09. Modal Video
  | 10. Review
  | 11. Tabs
  | 12. Progress Bar
  | 13. Accordian
  | 14. Service Steps Animation
  | 15. Card Hover
  | 16. Scroll Up
  | 17. Hobble Animation With Mouse Move
  | 18. Animation With GSAP
  | 19. Dynamic contact form
  |
  */

  /*====================================================================
    Scripts initialization
  ======================================================================*/
  $.exists = function (selector) {
    return $(selector).length > 0;
  };

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
    stickyFooter();
    swiperInit();
    languageSwitch();
    modalToggle();
    smoothScroll();
    counterInit();
    modalVideo();
    review();
    tabs();
    accordian();
    serviceSteps();
    serviceHoverTabs();
    scrollUp();
    animationOnHover();
    hobbleEffectInit();
    progressBar();
    cardHoverActive();
    stickyCardInit();
    parallaxImageInit();
    pricingToggleInit();
    //scrollRevealInit();
    //transformSwitcher();
    //gsapAnimation();
    //parallaxImage();
    //stickyInit();
    toggleActiveClass();
    ecommerceInit();
    dynamicContactForm();
    // Choices JS for Select
    $(".cs_choice").each(function () {
      const el = this;

      const choice = new Choices(el, {
        searchEnabled: false,
        itemSelectText: "",
        shouldSort: false,
      });

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
    01. Preloader
  ===============================================================*/
  function preloader() {}
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
  /*=============================================================
    8. Footer Sticky
  ===============================================================*/
  function stickyFooter() {
    // Sticky Footer
    var footerHeight = $(".cs_sticky_footer").height();
    var windowHeight = $(window).height();
    var footerHeightPx = footerHeight + "px";
    $(".cs_sticky_content").css("margin-bottom", footerHeightPx);
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
      var spaceBetween = parseInt($swiperEl.data("gap")) || 24;
      var autoHeight = parseInt($swiperEl.data("auto-height")) === 1;
      var keyboardEnabled = parseInt($swiperEl.data("keyboard")) === 1;
      var mousewheelEnabled = parseInt($swiperEl.data("mousewheel")) === 1;

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
    });
  }
  /*============================================================
    06. Search Modal Toggle
  ==============================================================*/
  function modalToggle() {
    $(".cs_open_modal").on("click", function () {
      $(".cs_advanced_search_modal").addClass("active");
      $("body").addClass("scroll_off");
    });
    $(".cs_close_modal").on("click", function () {
      $(".cs_advanced_search_modal").removeClass("active");
      $("body").removeClass("scroll_off");
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
  /*=============================================================
    12. Progress Bar
  ==============================================================*/
  function progressBar() {
    $(".cs_progress").each(function () {
      var progressPercentage = $(this).data("progress") + "%";
      $(this).find(".cs_progress_in").css("width", progressPercentage);
    });
  }
  /*===========================================================
    13. Accordian
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
    14. Pricing Value Toggle
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
    14. Service Steps Animation
  =============================================================*/
  function serviceSteps() {
    let tabInterval;
    let currentIndex = 0;

    const $tabs = $(".cs_service_menu_list li");
    const $tabContents = $(".cs_service_thumbnails_wrapper");
    const intervalTime = 5000;

    if ($tabs.length > 0 && $tabContents.length > 0) {
      function activateTab(index) {
        $tabs.eq(index).addClass("active").siblings().removeClass("active");
        $tabContents.eq(index).fadeIn(600).siblings().hide();
      }

      function startAutoplay() {
        stopAutoplay();
        tabInterval = setInterval(function () {
          currentIndex = (currentIndex + 1) % $tabs.length;
          activateTab(currentIndex);
        }, intervalTime);
      }

      function stopAutoplay() {
        if (tabInterval) clearInterval(tabInterval);
      }

      $tabs.on("click", function (e) {
        e.preventDefault();
        stopAutoplay();
        currentIndex = $(this).index();
        activateTab(currentIndex);
        startAutoplay();
      });

      // Init
      $tabContents.hide();
      activateTab(currentIndex);
      startAutoplay();
    }
  }
  /*===========================================================
    Service Hover Tabs (cs_service_section_3)
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
   15. Card Hover
  =============================================================*/
  function cardHoverActive() {
    $(".cs_card_style_6").on("mouseenter", function () {
      $(this)
        .addClass("active")
        .siblings(".cs_card_style_6")
        .removeClass("active");
    });
  }
  /*===========================================================
    16. Scroll Up
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
    16. Parallax Image
  =============================================================*/
  function parallaxImageInit() {
    const $banners = $(".cs_parallax");
    if (!$banners.length) return;
    const Y_RANGE = 20;
    const SCALE = 1;

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
    17. Reveal Animation
  =============================================================*/
  // function scrollRevealInit() {
  //   const $items = $(".cs_reveal");
  //   if (!$items.length) return;

  //   const START_AT = 0.5; // animation starts when element top is at 50% of viewport
  //   const MIN_WIDTH = 992; // animation only active above this viewport width

  //   const DEFAULT_X_RANGE = 150; // fallback if data-slide is missing
  //   const DEFAULT_END_AT = 120; // fallback if data-stop is missing

  //   const entries = [];
  //   $items.each(function () {
  //     const $el = $(this);
  //     $el.css({
  //       willChange: "transform,width",
  //     });

  //     // Read per-element values from HTML data attributes
  //     const slide = parseFloat($el.attr("data-slide"));
  //     const stop = parseFloat($el.attr("data-stop"));

  //     entries.push({
  //       $el: $el,
  //       xRange: isNaN(slide) ? DEFAULT_X_RANGE : slide,
  //       endAt: isNaN(stop) ? DEFAULT_END_AT : stop,
  //     });
  //   });

  //   if (!entries.length) return;
  //   let rafId = null;

  //   const tick = function () {
  //     const ww = $(window).width() || document.documentElement.clientWidth || 0;
  //     const vh =
  //       $(window).height() || document.documentElement.clientHeight || 0;

  //     // Below 992px: reset elements to original position and skip animation
  //     if (ww < MIN_WIDTH) {
  //       for (let i = 0; i < entries.length; i++) {
  //         entries[i].$el.css("transform", "translate3d(0, 0, 0)");
  //       }
  //       rafId = requestAnimationFrame(tick);
  //       return;
  //     }

  //     const startY = vh * START_AT; // viewport Y where progress = 0

  //     for (let i = 0; i < entries.length; i++) {
  //       const $el = entries[i].$el;
  //       const xRange = entries[i].xRange;
  //       const endY = entries[i].endAt; // viewport Y where progress = 1
  //       const rect = $el[0].getBoundingClientRect();

  //       if (rect.bottom < -50 || rect.top > vh + 50) continue;

  //       // progress: 0 when element top is at 50% of viewport,
  //       //           1 when element top reaches data-stop px from the top
  //       const total = startY - endY;
  //       const traversed = startY - rect.top;
  //       let progress = total > 0 ? traversed / total : 1;
  //       if (progress < 0) progress = 0;
  //       else if (progress > 1) progress = 1;

  //       // x goes from -xRange (off-position) to 0 (original position)
  //       const x = -xRange + xRange * progress;

  //       $el.css({
  //         transform: "translate3d(" + x + "px, 0, 0)",
  //       });
  //     }

  //     rafId = requestAnimationFrame(tick);
  //   };

  //   const start = function () {
  //     if (rafId !== null) return;
  //     tick();
  //   };

  //   const stop = function () {
  //     if (rafId !== null) {
  //       cancelAnimationFrame(rafId);
  //       rafId = null;
  //     }
  //   };

  //   $(document).on("visibilitychange", function () {
  //     if (document.hidden) stop();
  //     else start();
  //   });

  //   $(window).on("pageshow", start);

  //   start();
  // }
  /*===========================================================
    17. Hobble Animation With Mouse Move
  =============================================================*/
  function animationOnHover() {
    let cards = document.querySelectorAll(".animationonhover");

    cards.forEach((tmpOnHover) => {
      // Set initial value
      tmpOnHover.style.setProperty("--x", "-1px");
      tmpOnHover.style.setProperty("--y", "-1px");

      tmpOnHover.onmousemove = function (e) {
        let rect = tmpOnHover.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        tmpOnHover.style.setProperty("--x", `${x}px`);
        tmpOnHover.style.setProperty("--y", `${y}px`);
      };
    });
  }
  /*===========================================================
    Particle Move
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
    18. Sticky Animation With GSAP
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
  /*===============================================================
    19. Toggle Active Class
  =================================================================*/
  function toggleActiveClass() {
    $('[data-active="toggle"]').click(function () {
      $(this).addClass("active").siblings().removeClass("active");
    });
  }

  /*=====================================================
    17. Ecommerce
  =======================================================*/
  function ecommerceInit() {
    // Star Rating Input
    $(".cs_input_rating i").on("click", function () {
      $(this).siblings().removeClass("fa-solid");
      $(this).addClass("fa-solid").prevAll().addClass("fa-solid");
    });
    // Product Single Slider
    // if ($.exists(".cs_single_product_thumb")) {
    //   $(".cs_single_product_thumb").slick({
    //     slidesToShow: 1,
    //     slidesToScroll: 1,
    //     arrows: false,
    //     asNavFor: ".cs_single_product_nav",
    //   });
    // }

    // if ($.exists(".cs_single_product_nav")) {
    //   $(".cs_single_product_nav").slick({
    //     slidesToShow: 4,
    //     slidesToScroll: 1,
    //     asNavFor: ".cs_single_product_thumb",
    //     focusOnSelect: true,
    //     arrows: false,
    //   });
    // }
    // Check All
    $("#checkAll").change(function () {
      var isChecked = $(this).prop("checked");
      $('table input[type="checkbox"]').prop("checked", isChecked);
    });
    // Range Slider
    if ($.exists("#slider-range")) {
      $("#slider-range").slider({
        range: true,
        min: 0,
        max: 1000,
        values: [100, 600],
        slide: function (event, ui) {
          $("#amount").val("Price: $" + ui.values[0] + " - $" + ui.values[1]);
        },
      });
    }
    if ($.exists("#amount")) {
      $("#amount").val(
        "Price: $" +
          $("#slider-range").slider("values", 0) +
          " - $" +
          $("#slider-range").slider("values", 1),
      );
    }
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
  /*===============================================================
    19. Dynamic contact form
  =================================================================*/
  function dynamicContactForm() {
    if ($.exists("#cs_form")) {
      const form = document.getElementById("cs_form");
      const result = document.getElementById("cs_result");

      form.addEventListener("submit", function (e) {
        const formData = new FormData(form);
        e.preventDefault();
        var object = {};
        formData.forEach((value, key) => {
          object[key] = value;
        });
        var json = JSON.stringify(object);
        result.innerHTML = "Please wait...";

        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: json,
        })
          .then(async (response) => {
            let json = await response.json();
            if (response.status == 200) {
              result.innerHTML = json.message;
            } else {
              console.log(response);
              result.innerHTML = json.message;
            }
          })
          .catch((error) => {
            console.log(error);
            result.innerHTML = "Something went wrong!";
          })
          .then(function () {
            form.reset();
            setTimeout(() => {
              result.style.display = "none";
            }, 5000);
          });
      });
    }
  }
})(jQuery); // End of use strict
