# Hospil — RTL Support Audit

Scope: every line of `assets/sass/**` (24 partials), `assets/js/main.js`, vendor CSS/JS, and all 34 HTML pages.
Current state: **zero RTL support** — no `dir` attribute, no `[dir=rtl]` rule, LTR Bootstrap build, Latin-only fonts.

Severity: **[H]** layout visibly breaks · **[M]** noticeable misalignment · **[L]** cosmetic.
Line numbers refer to the SCSS source (not compiled `style.css`).

---

## 0. Recommended strategy

1. **Convert physical → logical properties in SCSS** (`margin-left` → `margin-inline-start`, `left` → `inset-inline-start`, `text-align:right` → `text-align:end`, 4-value padding → `padding-block` + `padding-inline`). These work in both LTR and RTL with no duplication, and fix ~80% of the findings below.
2. **Use `[dir=rtl] &` overrides only** where logical properties can't help: `transform: translateX()`, keyframes, `transition: left/right`, gradients, `transform-origin`, `clip-path`, icon mirroring.
3. **Isolate LTR content** (numbers, odometers, phone, email, prices, times, slider fraction) with `direction:ltr; unicode-bidi:isolate` or `<bdi dir="ltr">`.
4. **Put `dir="rtl"` in the markup** (not set via JS) — Swiper 12 and Choices detect direction at init.

---

## 1. Global setup (do first)

| # | Where | Change | Sev |
|---|---|---|---|
| G1 | All 34 `*.html` L2 | `<html lang="en">` → `<html lang="ar" dir="rtl">` (for RTL build) | H |
| G2 | All `*.html` L13 | Single `bootstrap.min.css` (5.3.8 LTR) for both directions. The LTR-only Bootstrap rules the theme uses are mirrored in `common/_rtl.scss` (see §5.3). `dir` is resolved by `directionInit()` in `main.js` (`?dir=` > saved choice > `<html dir>`) | H |
| G3 | `sass/style.scss` L35-67 | Add `@import "default/rtl";` (mixins) after variables, and `@import "common/rtl";` last (global overrides) | H |
| G4 | `sass/default/_fonts.scss` L7-40 | Montserrat / Open Sans have no Arabic glyphs → add Arabic `@font-face` (Cairo / IBM Plex Sans Arabic / Tajawal) with `unicode-range: U+0600-06FF, U+0750-077F, U+0870-08FF, U+FB50-FDFF, U+FE70-FEFF` | H |
| G5 | `sass/default/_variable.scss` L22-23 | `--primary-font` / `--secondary-font`: append Arabic family, or `:root:lang(ar){--primary-font:...}` | H |
| G6 | `sass/default/_typhography.scss` L77, L82 | `ul`/`ol` `padding-left:20px` → `padding-inline-start:20px` | H |
| G7 | `_typhography.scss` L86-98 | `em,i,cite,dfn,blockquote` italic → `[dir=rtl] { font-style: normal }` (Arabic has no italic) | L |
| G8 | Global | `[dir=rtl]` reset `letter-spacing:0` on text: `.cs_section_subtitle` (`_general` L601), `.cs_preloader_text` (`_preloader` L82), `.cs_hero_subtitle` (`_hero` L176), `.cs_cta_subtitle` (`_layouts` L1534), `.cs_cta_phone` (`_layouts` L1233) — letter-spacing breaks Arabic joining | L |

**Suggested `default/_rtl.scss`:**
```scss
@mixin rtl { [dir=rtl] & { @content; } }
@mixin flip-x { @include rtl { transform: scaleX(-1); } }
.cs_rtl_flip { @include flip-x; }
```

**Suggested `common/_rtl.scss` (global overrides):**
```scss
.odometer, .swiper-pagination-fraction, .cs_hero_slider_counter,
.cs_funfact_number, .cs_ltr { direction: ltr; unicode-bidi: isolate; }

[dir=rtl] {
  img[src*="arrow-right.svg"], img[src*="arrow2-right.svg"],
  img[src*="arrow_shape_"], .fa-arrow-right, .fa-arrow-left { transform: scaleX(-1); }
  // prev buttons are already rotate(180deg) in LTR → in RTL un-rotate prev, rotate next
  .slider-prev img { transform: none; }
  .slider-next img { transform: rotate(180deg); }
  .cs_ticker_content { animation-name: scrollingAnimationRtl; }
}
@keyframes scrollingAnimationRtl { 100% { transform: translateX(100%); } }
```
> Watch for transform stacking: any element that already has a hover `translateX()` or animation needs a combined value (see §2 notes).

---

## 2. SCSS findings (per file)

Fix column shorthand: **ISS** = `inset-inline-start`, **IIE** = `inset-inline-end`, **PIS/PIE** = `padding-inline-start/end`, **MIS/MIE** = `margin-inline-start/end`, **flip** = `[dir=rtl] & { transform: scaleX(-1) }`.

### 2.1 `common/_general.scss`
| Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| 565 | `.cs_scrollup_btn` | `right:20px` | IIE | L |
| 701 | `.cs_progress_in span` | `right:0` | IIE | H |
| 711-712 | `.cs_progress_in::after` | `right:0; rotate(-45deg)` | IIE + RTL `rotate(45deg)` | H |
| 730 | `.cs_rating::before`, `.cs_rating_percentage::before` | `left:0` | ISS | H |
| 750 | `.cs_rating .cs_rating_percentage` | `left:0` (JS sets width → star fill from wrong side) | ISS | H |
| 762-773 | `.odometer` | none | `direction:ltr; unicode-bidi:isolate` (digits otherwise render reversed: 98 → 89) | H |
| 411-513 | `.cs_btn_style_1/2 img` arrows | not mirrored | flip (global rule §1) | M |

### 2.2 `common/_header.scss`
| Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| 34 | `.cs_main_header_right.cs_shop` btn | `margin-right:0` | MIE | L |
| 50 | `.cs_cart_badge` | `right:0` | IIE | M |
| 142 | `.cs_style_3 .cs_main_header_in` | `padding:0 24px 0 0` | `padding-inline:0 24px` | H |
| 197 | `.cs_style_4 .cs_search_btn,.cs_sidebar_btn` | `margin-right:0` | MIE | L |
| 229 / 242 | `.cs_header_btns_wrapper .cs_search_btn` | `margin-right:10px / 20px` | MIE | M |
| 286 | `.menu-item-has-children>a` | `padding-right:20px` | PIE | H |
| 294-296 | `.menu-item-has-children>a::after` | `right:0` | IIE | H |
| 302 | dropdown `ul` | `left:0` | ISS | H |
| 312 / 334 | dropdown `ul` | `transform-origin: bottom right → top left` | RTL: `bottom left → top right` | L |
| 300 | nested `ul ul` | no rule (3rd level overlaps) | `ul ul{top:0; inset-inline-start:100%}` if used | M |
| 348 | ≤1279 `.cs_style_3 .cs_main_header_left` | `padding:0 0 0 24px` | `padding-inline:24px 0` | H |
| 381 / 388 | ≤1279 `.cs_nav_list_wrapper` | `transform-origin` right/left | RTL swap | L |
| 406 | `.cs_nav_list>li` | `margin-right:0` | MIE | L |
| 410 | ≤1279 `.cs_nav_list ul` | `padding-left:15px` | PIS | H |
| 431 | ≤1279 `.cs_main_header_right` | `padding-right:40px` | PIE | H |
| 532 | ≤767 `.cs_search_btn` | `margin-right:0` | MIE | L |
| 538 | ≤767 `.cs_menu_toggle` | `right:12px` | IIE | H |
| 563 | ≤767 `.cs_style_3 .cs_main_header_left` | `padding-left:12px` | PIS | H |
| 567 | ≤767 `.cs_style_3 .cs_main_header_right` | `padding-right:0` | PIE | M |
| 584 | ≤767 `.cs_main_header_right.cs_shop` | `padding-right:35px` | PIE | H |
| 663 | `.cs_language_switcher::after` | `right:10px` | IIE | M |
| 671 | `.cs_language_dropdown` | `right:0` | IIE | M |
| 701 | `.cs_menu_toggle` | `right:15px` | IIE | H |
| 807 | `.cs_search_form input` | `padding:10px 80px 10px 35px` | `padding-inline:35px 80px` | H |
| 815 | `.cs_header_search .cs_search_btn` | `right:30px` | IIE | H |
| 858 | ≤575 `.cs_search_btn` | `right:15px` | IIE | H |
| 888 | `.cs_side_header_in` | `margin-left:auto` | MIS | H |
| 893-894 / 949 | `.cs_side_header_in` off-canvas | `right:-600px; transition:right` → `.active right:0` | `inset-inline-end:-600px; transition: inset-inline-end .4s` (or RTL left override) | H |
| 959 / 965 | `.cs_side_header .cs_contact_list li` / `img` | `padding-left:34px` / `left:0` | PIS / ISS | H |
| 978 | `.cs_side_header .cs_close` | `right:24px` | IIE | M |

### 2.3 `common/_footer.scss`
| Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| 41 / 49 | `.cs_footer_widget_nav a` / `::before` | `padding-left:16px` / `left:0` | PIS / ISS | H |
| 68 / 87 | `.cs_footer_contact li` / `img` | `padding-left:36px` / `left:0` | PIS / ISS | H |
| 116 | `.cs_newsletter_input` | text runs under absolute button | add `padding-inline-end` = btn width | M |
| 121 / 235 | `.cs_newsletter_style_1 .cs_btn_style_1` | `right:2px` / `right:0` | IIE | H |
| 158 / 167 / 173 | `.cs_footer_bottom_nav li` / `::before` / `:first-child` | `padding-left:21px` / `left:0` / `padding-left:0` | PIS / ISS / PIS | H |
| 274 | `.cs_footer_style_2 .cs_footer_main` | `radial-gradient(... at 0.9% 2.98%)` | RTL `at 99.1% 2.98%` | L |

### 2.4 `common/_slider.scss`
| Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| 77 | `.cs_controller_1..4` | `right: calc((100vw - 1620px)/2)` | IIE | H |
| 117 / 121 | same ≤1643 / ≤1399 | `right:12px` | IIE | H |
| 125-127 | same ≤991 | `right:50%; translateX(50%)` | keep physical but add `left:auto` in RTL (or IIE + RTL `translateX(-50%)`) | M |
| 103-114, 160, 248 | `.swiper-pagination` fraction, `.cs_hero_slider_counter` | none | `direction:ltr; unicode-bidi:isolate` ("05 / 01" otherwise) | M |
| 148 | `.cs_controller_2` | `right:0` | IIE | H |
| 200-204 | `.cs_controller_3/4 .slider-prev img` | `rotate(180deg)` | RTL: prev `none`, next `rotate(180deg)` | H |
| 239-241 | `.cs_controller_4::before` | `left:0` (inherited) | ISS | M |
| 271 + 387-391 | `.cs_ticker_content` / `@keyframes scrollingAnimation` | `translateX(-100%)` | add `scrollingAnimationRtl` → `translateX(100%)` (§1) | H |
| 289 | ≤991 `.cs_ticker_in` | `animation-duration:24s` on non-animated element | **existing bug** — move to `.cs_ticker_content` | — |

### 2.5 `common/_video-modal.scss`
| Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| 10 / 15-17 | `.cs_video_popup` | `left:-100%` → `.active left:0` | ISS (or leave; hidden only) | M |
| 68 | `.cs_video_popup_container` | `text-align:left` | `text-align:start` | M |
| 108 | `.cs_video_popup_close` | `right:0` | IIE | M |

### 2.6 `common/_preloader.scss`
Only L82 letter-spacing (G8). Spinner rotation is fine.

### 2.7 `shortcode/_hero.scss`
| Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| 31 | `.cs_hero_style_1 .cs_hero_parallax_bg::after` | `radial-gradient(... at 70.57% 40.5%)` | RTL `at 29.43% 40.5%` | M |
| 160 / 260 | `.cs_hero_style_2 .cs_hero_text` | `padding:110px 0 50px 24px` / `60px 0 50px 24px` | `padding-block` + `padding-inline:24px 0` | M |
| 183 | `.cs_hero_style_2 .cs_hero_img_wrapper` | `margin-left:auto` | MIS | H |
| 201-202 / 303-304 | `.cs_hero_img_2` | `padding-left:47%; padding-right:6%` (and 57%/10%) | PIS / PIE | H |
| 207 | `.cs_visiting_info` | `left:24px` | ISS | H |
| 212 / 225 / 238 | `.cs_hero_shape_1/2/3` | `left:0` / `left:27%` / `right:0` | ISS / ISS / IIE | M |
| 317 | ≤767 `.cs_hero_text` | `padding-left:0` | PIS | M |
| 360 | `.cs_hero_style_3 .cs_hero_overlay` | `radial-gradient(... at 30% 45%)` | RTL `at 70% 45%` | M |
| 419 / 639 / 910 | avatars `+` sibling | `margin-left:-12px` | MIS | M |
| 438 | `.cs_hero_style_3 .cs_hero_text` | `margin-left:auto` | MIS | H |
| 462 | `.cs_hero_style_3 .cs_hero_features` | `left:0` | ISS | H |
| 525-526 | ≤991 `.cs_hero_style_3 .cs_hero_text` | `text-align:left; margin-left:0` | `start` / MIS | H |
| 605 / 701 | `.cs_hero_style_4 .cs_hero_meta` | `margin-left:auto` / `0` | MIS | H |
| 616 | `.cs_hero_style_4 .cs_hero_users` | `padding:5px 20px 5px 5px` | `padding-inline:5px 20px` | M |
| 844 / 925 | `.cs_hero_style_5 .cs_hero_image` | `right:0` / `right:5%` | IIE | H |
| 868 / 966 | `.cs_hero_style_5 .cs_hero_info` | `margin-left:auto` / `0` | MIS | H |
| 1117 / 1120 | `.cs_page_header_style_1 .breadcrumb-item` / `::before` | `padding-left:8px` / `padding-right:8px` | PIS / PIE | M |

### 2.8 `shortcode/_about.scss`
| Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| 9 / 144 / 155 | `.cs_about_style_1 .cs_about_img` | `translateX(-150px / -80px / -30px)` | RTL positive values | H |
| 20 | `.cs_about_rating` | `left:24px` | ISS | M |
| 59 / 148 / 166 | `.cs_about_style_1 .cs_about_text` | `padding-left:100px / 60px / 0` | PIS | H |
| 102 / 106 | `.cs_avatar` / `:first-child` | `margin-left:-10px / 0` | MIS | M |
| 127 / 397 | `.cs_funfact_item::after` (divider) | `right:0` | IIE | M |
| 133 / 186 / 403 / 526 | `.cs_funfact_item:last-child` | `margin-left:auto / 0` | MIS | M |
| 209 / 281 | `.cs_about_style_2 .cs_about_content` | `padding-left:112px / 0` | PIS | H |
| 244 / 312 | `.cs_about_style_2 .cs_quote_icon` | `right:30px / 15px` | IIE + flip glyph | M |
| 274 | `.cs_about_shape_1` | `right:0` | IIE | M |
| 374 | `.cs_about_style_3 .cs_funfact_style_1` | `left:24px` | ISS | M |
| 423 / 616 | `.cs_btn_style_2 img` | arrow | flip | M |
| 557 / 565 | `.cs_about_style_4 .cs_about_features li` / `img` | `padding-left:34px` / `left:0` | PIS / ISS | H |
| 584 / 698 | `.cs_experience_badge` | `right:24px / 16px` | IIE | M |
| 597 / 666 | `.cs_about_style_4 .cs_about_content` | `padding-left:110px / 0` | PIS | H |
| 706 | ≤575 `.cs_about_recognition` | `text-align:left` | `start` | H |
| 757 | `.cs_about_style_5 .cs_about_desc` | `margin-left:auto` | MIS | H |
| 766 / 863 | `.cs_accredited_badge` | `left:-82px / -67px` | ISS | M |
| 878 | ≤575 `.cs_card_icon` | `margin-left:0` | MIS | L |

### 2.9 `shortcode/_services.scss`
| Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| 11 | `.cs_service_card_1` | `background-position:right` | RTL `left` | M |
| 74 / 78 | `.cs_service_features li` / `img` | `padding-left:26px` / `left:0` | PIS / ISS | H |
| 88-90 / 114 | `.cs_service_card_1 .cs_service_btn` | `right:90px / 30px` | IIE + flip arrow | H |
| 176 | `.cs_service_card_2 .cs_service_left` | `padding:24px 100px 24px 24px` | `padding-inline:24px 100px` | H |
| 201 | `.cs_service_card_2 .cs_btn_style_2 img` | arrow | flip | M |
| 219 | `.cs_service_card_2 .cs_service_img` | `right:0` | IIE | H |
| 239 | `.active .cs_service_left` | `padding-right:0` | PIE | H |
| 313-314 | ≤575 `.cs_service_left` | `padding-left/right:15px !important` | `padding-inline:15px !important` (to beat converted L176) | L |
| 415 / 475 | `.cs_service_card_3 .cs_service_features` | `padding-right:120px / 0` | PIE | H |
| 418 / 425 | `... li` / `img` | `padding-left:26px` / `left:0` | PIS / ISS | H |
| 434 / 483 / 485 | `.cs_service_card_3 .cs_card_btn` | `right:24px` / `right:initial` / `margin-left:auto` | IIE / IIE / MIS | H |
| 442 / 565 | `.cs_card_btn img` | arrow | flip | M |
| 508 / 589 | `.cs_service_card_4 .cs_card_body` | `padding-left:14px / 5px` | PIS | M |
| 561 | `.cs_service_card_4 .cs_card_btn` | `right:20px` | IIE | H |
| 736 / 820-822 | `.cs_service_arrow_btn` | `left:20px` / `right:20px; left:initial` | ISS / IIE | H |
| 745 | `.cs_service_arrow_btn > img` | arrow | flip | M |
| 752 | `.cs_service_arrow_btn:hover` | `translateX(3px)` | RTL `translateX(-3px)` | M |
| 758 / 831-832 | `.cs_service_section_3 .cs_service_card` | `right:0` / `left:15px; right:15px` | IIE / `inset-inline:15px` | H |
| 799 | ≤991 `.cs_service_panes` | `padding-right:0` | PIE | L |
| 880 | `.cs_services_section_5 .cs_vector_shape` | `left:0` | ISS (+ optional flip) | M |
| 900 | `.cs_controller_3` | `right:initial` | IIE | M |
| 951 | `.cs_service_details .cs_condition_item::before` (timeline line) | `left:12px` | ISS | H |

### 2.10 `shortcode/_layouts.scss`
| Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| 76 | `.cs_feature_section_4 .cs_hero_feature_card` | `radial-gradient(... at 0.9% 2.98%)` | RTL `at 99.1%` | L |
| 270 / 1569 | `.cs_funfact_style_1 .odometer`, `.cs_cta_funfact .cs_funfact_number` | no direction | `direction:ltr` (global rule) | H |
| 276-283 | `.cs_feature_card_2 .cs_funfact_number` (flex number + suffix) | suffix jumps to left | `direction:ltr` | M |
| 399 | `.cs_feature_card_3 .cs_feature_card_back` | `translateX(-100%)` | RTL `translateX(100%)` | M |
| 467 / 572 / 579 | `.cs_technology_section_1 .cs_technology_img` | `translateX(-150 / -80 / -30px)` | RTL positive | H |
| 518 / 523 | `.cs_feature_list li` / `img` | `padding-left:26px` / `left:0` | PIS / ISS | M |
| 639 / 644 / 651 | `.cs_technology_section_2 .cs_technology_img` | `translateX(110 / 30px)` | RTL negative | H |
| 847 / 861 / 873 | `.cs_work_card_shape` | `left:85% / 88% / 90%` | ISS | H |
| 847-849 + 898-901 | `.cs_work_card_shape` arrow + `@keyframes indication` | animation transform overrides static flip | add `indicationRtl` keyframes with `scaleX(-1)` baked in | H |
| 953 / 1065 / 1096 | `.cs_admission_badge` | `right:24 / 18 / 14px` | IIE | M |
| 1026-1040 | `.cs_btn_style_2 img` + hover `translateX(2px)` | arrow | RTL `scaleX(-1) translateX(2px)` | M |
| 1089 | ≤575 `.cs_admission_step_number` | `writing-mode: lr` (deprecated) | `horizontal-tb` (**bug**, not RTL) | L |
| 1115 | `.cs_cta_section_3 .cs_cta_card` | `padding:88px 48px 88px 110px` | `padding-inline:110px 48px` | H |
| 1141 / 1265 / 1286 | `.cs_cta_visual` | `right:120 / 100px / initial` | IIE | H |
| 1184 / 1269 / 1294 | `.cs_cta_offer` | `left:0 / 25% / 0` | ISS | M |
| 1209 | `.cs_cta_actions` | `right:48px` | IIE | H |
| 1226-1227 | `.cs_cta_phone` (vertical-rl) | phone digits | `.cs_cta_phone_number{direction:ltr;unicode-bidi:isolate}` | M |
| 1357 | `.cs_equipment_slider .cs_controller_3` | `left:0` | ISS | H |
| 1417 / 1445 / 1456 | `.cs_equipment_info` | `right:9% / 24px / initial` | IIE | H |
| 1479 / 1497 | `.cs_cta_style_1` | `padding:120px 0 120px 112px` / `30px` | `padding-inline:112px 0` | H |
| 1489 | `.cs_cta_style_1 .cs_cta_img` | `padding:24px 24px 0 45%` | `padding-inline:45% 24px` | H |
| 1517 | `.cs_cta_style_2` | `padding:125px 20px 110px 120px` | `padding-inline:120px 20px` | H |
| 1522 | `.cs_cta_style_2 .cs_cta_overlay` | `linear-gradient(90deg, ...)` | RTL `270deg` (text otherwise unshaded) | H |
| 1555 / 1561 | `.cs_cta_funfact .cs_funfact_item::after` / `:last-child` | `right:0` / `margin-left:auto` | IIE / MIS | M |
| 1624-1638 | `.cs_cta_style_3 .cs_btn_style_2 img` | arrow | flip | M |
| 1651 | `.cs_sidebar_style_1` | `margin-left:auto` | MIS | H |
| 1678 | `.cs_widget_title::after` | `left:0` | ISS | M |
| 1699 / 1707 | `.cs_service_category_list a` / `::before` | `padding-left:30px` / `left:12px` | PIS / ISS | M |
| 1731 | `.cs_visiting_hours li span:last-child` | `text-align:right` | `end` | M |
| 1800-1816 | `.cs_appointment_form .choices::after` (duplicated rule) | `right:10px` | IIE; merge duplicate | M |
| 1821 | `.cs_appointment_form .cs_date_icon` | `right:10px` | IIE | M |
| 1859 | `.cs_search_form input` | `padding:13px 32px 13px 12px` | `padding-inline:12px 32px` | M |
| 1869 | `.cs_search_form button` | `right:16px` | IIE | H |
| 1952-1953 | `.cs_promo_widget .cs_widget_title::after` | `left:50%` centered, inherits L1678 | keep physical `left:50%` after L1678 converts (add `inset-inline-start:auto`) | M |
| 1976 / 1982 | `.cs_venue_address/_date` / `img` | `padding-left:26px` / `left:0` | PIS / ISS | M |
| 2273-2287 | `.cs_estimate_section_1 .cs_btn_style_2 img` | arrow | flip | M |
| 2530 | `.cs_error_section .cs_btn_style_1 img` | `rotate(180deg)` | RTL `transform:none` | M |
| 2590 | `.cs_event_card_badge` | `left:20px` | ISS | M |
| 2656-2691 / 2722-2729 | event card / CTA btn img + hover `translateX(3px)` | arrow | RTL `scaleX(-1) translateX(3px)` | M |
| 2789 | `.cs_event_details_badge` | `left:24px` | ISS | M |
| 2812 / 2819 | `.cs_event_highlight_list li` / `img` | `padding-left:26px` / `left:0` | PIS / ISS | M |

### 2.11 `shortcode/_blog.scss`
| Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| 26 / 36 | `.cs_post_style_1 .cs_post_category` / `.cs_post_date` | `left:20px / 24px` | ISS | M |
| 101 / 1057 / 1086 / 935 | btn / comment submit / pagination / post-nav img | arrow | flip | M |
| 301-311, 390 | `.cs_post_style_3 .cs_post_img::after` shine | `left:-100%`, `120deg`, `skewX(-45deg)`, `transition:left` → hover `left:200%` | RTL mirror: `right`, `240deg`, `skewX(45deg)` | L |
| 319 / 720 | `.cs_post_date` | `left:24px / 20px` | ISS | M |
| 642 / 649 | `.cs_blog_shape_1` | `left:20px / -190px` | ISS | L |
| 794 / 802 | `.cs_blog_check_list li` / `img` | `padding-left:26px` / `left:0` | PIS / ISS | H |
| 830 / 835 | `.cs_blog_quote_icon` | `right:24px` | IIE + flip glyph | M |
| 947 | `.cs_post_nav_item.cs_post_nav_next` | `text-align:right` | `end` | M |

### 2.12 `shortcode/_team.scss`
| Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| 50 / 63 | `.cs_team_Style_1 .cs_team_designation` / `.cs_team_contact` | `left:20px / 0` | ISS | M |
| 76 | `.cs_team_social` | `clip-path: inset(0 100% 0 0)` | RTL `inset(0 0 0 100%)` | L |
| 315 / 328 | `.cs_team_style_3 .cs_team_social` / `a` | `left:20px` / `translateX(-30px)` | ISS / RTL `30px` | M |
| 416 / 483 / 487 | `.cs_experts_list` | `padding-left:112 / 60 / 0` | PIS | H |
| 429 / 439 / 503 | `.cs_expert_bio`, `.cs_expert_actions` | `margin-left:auto / 0` | MIS | H |
| 467 | `.cs_expert_item .cs_btn_style_1 i` | `margin-right:6px` | MIE | M |
| 553 | `.cs_doctor_filter .cs_search_icon` | `right:18px` | IIE | H |
| 596 | `.cs_doctor_filter .choices::after` | `right:15px` | IIE | H |
| 689 | `.cs_doctor_hero .cs_doctor_info` | `margin-left:auto` | MIS | H |
| 749 / 758 | `.cs_doctor_list li` / `img` | `padding-left:26px` / `left:0` | PIS / ISS | H |

### 2.13 `shortcode/_ecommerce.scss`
| Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| 42 | `.cs_shop_sort .choices__inner` | `padding:14px 40px 14px 20px !important` | `padding-inline:20px 40px !important` | H |
| 63 / 750 | `.choices::after` | `right:20px / 2px` | IIE | H |
| 161 | `.cs_product_price` | `$12.00` | `unicode-bidi:isolate` | L |
| 211 | `.cs_product_summary` | `margin-left:auto` | MIS | H |
| 228 | `.cs_product_feature_list` | `padding-left:30px` | PIS | H |
| 274-308 | `.cs_quantity` | − / + swap sides | accept, or `direction:ltr` | L |
| 319 / 326 | `.cs_product_assurance li` / `img` | `padding-left:26px` / `left:0` | PIS / ISS | H |
| 569 / 581 / 659 / 802 | coupon / cart / totals / checkout btn img | arrow | flip | M |
| 578 | `.cs_cart_actions .cs_btn_style_2` | `margin-left:auto` | MIS | H |
| 631 / 776 | `.cs_cart_totals_title::after`, `.cs_checkout_box_title::after` | `left:0` | ISS | M |
| 852 | `.cs_payment_methods .cs_payment_desc` | `margin:6px 0 0 30px` | `margin-block-start:6px; margin-inline-start:30px` | H |

### 2.14 `shortcode/_contact.scss`
| Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| 5 | `.cs_contact_section_1` | `@extend .cs_about_style_3` | inherits `_about` fixes | M |
| 69 / 80 | `.cs_location_contact_list li` / `.cs_location_contact_icon` | `padding-left:40px` / `left:0` | PIS / ISS | H |
| 107 / 205 | `.cs_visiting_time` | `text-align:right` / `left !important` | `end` / `start !important` | M |
| 256 | `.cs_contact_dept_list / .cs_contact_hours_list a` | `text-align:right` | `end` | M |
| 438 | `.cs_career_job_card .cs_btn_style_2 img` | arrow | flip | M |
| 475 / 483 | `.cs_career_benefits_list li` / `img` | `padding-left:26px` / `left:0` | PIS / ISS | H |

### 2.15 `shortcode/_appointment.scss`
| Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| 15 / 22 | `.cs_appointment_help_cta` | `left:0`; `border-radius:0 50px 50px 0` | ISS; `border-start-end-radius` + `border-end-end-radius` | H / M |
| 36 | `.cs_appointment_2` | `margin-left:auto` | MIS | H |
| 40 / 103 / 111 | `.cs_appointment_form_wrapper` | `padding-left:115px / 0` | PIS | H |
| 129 / 133 | `.cs_appountment_features li` / `img` | `padding-left:34px` / `left:0` | PIS / ISS | H |
| 140 / 178 / 184 / 583 | `.cs_content_bottom` | `padding-right:112px / 0` | PIE | M |
| 161 / 167 | `.cs_funfact_item::after` / `:last-child` | `right:0` / `margin-left:auto` | IIE / MIS | M |
| 239 / 247 / 350 | `.cs_date_icon` / `.cs_time_icon` | `right:12 / 15 / 15px` | IIE | H |
| 288 / 345 / 385 | `.choices::after` | `right:5 / 15 / 5px` | IIE | H |
| 230 / 339 | `.cs_form_field`, `.choices__inner` | text runs under icon | `padding-inline-end:~30px` | L |
| 300-311 | `.cs_btn_style_2 img` | arrow | flip | M |
| 471 / 483 | `.cs_appointment_heading` | `padding-right:60px / 0` | PIE | M |
| 534 / 550 | `.cs_appointment_section_4 .cs_appointment_img` | `translateX(-12px / -40px)` | RTL positive | M |

### 2.16 `shortcode/_pricing.scss`
| Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| 40 / 45 | `.cs_pricing_table_1 .cs_pricing_feature_list li` / `img` | `padding-left:26px` / `left:0` | PIS / ISS | H |
| 54-64 / 218-220 | `.cs_btn_style_2 img`, `.cs_btn_style_1 img` | arrow | flip | M |
| 79 / 81 / 82 | `.cs_pricing_banner_wrap .cs_ticker_container` | `left:0`; `padding-right:40px`; `radius 0 50px 50px 0` | ISS; PIE; logical radius | H / M / M |
| 97 / 103 | ≥1650 `.cs_pricing_banner_wrap` / `.cs_pricing_info_wrap` | `padding-right:76px` / `padding-left:36px` | PIE / PIS | M |
| 122 | `.cs_pricing_shape_1` | `right:0` | IIE (+ flip if asymmetric) | M |
| 192 / 202 | `.cs_pricing_table_2 ... li` / `img` | `padding-left:26px` / `left:0` | PIS / ISS | H |
| 321 / 340 | `.cs_pricing_switch` knob | `left:3px`; checked `translateX(41px)` | ISS; RTL `translateX(-41px)` | H |
| 419 | `.cs_filter_list .cs_filter_btn` | `text-align:left` | `start` | H |

### 2.17 `shortcode/_testimonials.scss`
| Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| 11 | ≤991 `.cs_controller_2` | `right:initial` | IIE | L |
| 18 / 21 | `.cs_testimonial_content` | `padding:120px 112px 120px 0` / `padding-right:0` | `padding-inline:0 112px` / PIE | H |
| 102 / 104 / 106 | `.cs_testimonial_img .cs_ticker_container` | `padding-left:38px`; `right:0`; `radius 50px 0 0 50px` | PIS; IIE; logical radius | M / H / M |
| 377 | `.cs_testimonial_section_2` | `border-radius:20px 20px 0 20px` | `border-radius:20px; border-end-end-radius:0` | L |
| 389-390 | `.cs_testimonial_section_3 .cs_controller_4` | `right:initial` | IIE | M |
| 402 / 439 / 443 | `.cs_testimonial_image_wrap` | `padding-right:100 / 50 / 0` | PIE | H |
| 414 / 447 | `.cs_testimonial_badge` | `right:24px / 10px` | IIE | H / M |

### 2.18 `shortcode/_faq.scss`
| Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| 34 / 78 / 105 | `.cs_accordians_style_1 .cs_accordian_head` | `padding:40px 20px 40px 74px` (+ 66px, 45px) | `padding-inline:74px 20px` etc. | H |
| 42 | `.cs_accordian_icon` | `left:0` | ISS | H |
| 50 / 268 | `.cs_accordian_toggler` | `right:0` | IIE | H |
| 131 / 162 | `.cs_faq_badge` | `right:30px / 24px` | IIE | M |
| 227 | `.cs_faq_section_2 .cs_faq_callout` | `left:24px` | ISS | M |
| 258 | `.cs_accordians_style_2 .cs_accordian_head` | `padding:26px 50px 26px 0` | `padding-inline:0 50px` | H |
| 316 / 324 | `.cs_accordians_style_3 .cs_accordian_body` | `padding-right:45px / 0` | PIE | M |

### 2.19 `shortcode/_privacy.scss`
| Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| 87 / 93 | `.cs_policy_list li` / `img` | `padding-left:26px` / `left:0` | PIS / ISS | H |
| 166 / 176 | `.cs_policy_note` (+ `.cs_type_warning`) | `border-left` / `border-left-color` | `border-inline-start(-color)` | M |

### 2.20 `shortcode/_facilities.scss`
| Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| 15 | `.cs_facility_item` | `padding:10px 50px 10px 60px` | `padding-inline:60px 50px` | M |
| 23 / 30 / 38 | `::before` divider / `:first-child` / `:last-child` | `left:0` / `padding-left:10px` / `padding-right:10px` | ISS / PIS / PIE | M |
| 87 / 130 | `.cs_facility_card_1 .cs_card_header` | `padding-left:20px / 5px` | PIS | M |
| 110 / 116 | `.cs_about_features_list li` / `img` | `padding-left:26px` / `left:0` | PIS / ISS | H |

### 2.21 `shortcode/_login.scss`, `_partners.scss`
| File:Line | Selector | Current | Fix | Sev |
|---|---|---|---|---|
| `_login` 37 | `.cs_login_form_wrap` | `margin-left:auto` | MIS | H |
| `_partners` 23 | `.cs_partners_label` | `padding:0 42px 0 150px` | `padding-inline:150px 42px` | H |
| `_partners` 44 | ≤1023 `.cs_partners_slider` | `padding-left:30px` | PIS | M |

`_tabs.scss`, `_portfolio.scss`, `_healthcare_center.scss`, `_spacing.scss`: **no findings**.

---

## 3. JavaScript — `assets/js/main.js`

Add once at top of IIFE (L2): `const isRTL = document.documentElement.dir === 'rtl';`

| Line | Context | Issue / Fix | Sev |
|---|---|---|---|
| 437 | `new Swiper(...)` | Swiper 12.1.1 auto-detects RTL from computed `direction` → **no option needed**, but `dir="rtl"` must be in markup. If switching language at runtime: `swiper.changeLanguageDirection(...)` | H |
| 286-295, 391-396 | `.slider-prev/.slider-next` mapping | Logic correct; only icons need CSS (§1) | M |
| 407-442 | marquee (`data-marquee`) | Scrolls rightward in RTL (natural). If LTR-direction wanted: `autoplay.reverseDirection = isRTL`. Update comment | L |
| 492-505 | `languageSwitch` | Only swaps label text; `data-lang="ara"` exists but does nothing. Either reload to an RTL page, or set `dir`/`lang`, swap Bootstrap CSS, `changeLanguageDirection`, `ScrollTrigger.refresh()` | M |
| 550-571 | Odometer | Digits reversed in RTL → CSS `.odometer{direction:ltr}` (§1). Keep Latin digits | H |
| 615-621 | star rating width | Works once `.cs_rating_percentage` uses ISS (`_general` L750) | M |
| 796-799 | SplitText `type:"words"` | OK (no `chars`, which would break Arabic shaping). Never add `chars`. Add `.cs_reveal_word{unicode-bidi:isolate}` for mixed Arabic/Latin titles | M |
| 1057 | `pricingToggleInit` | Hardcoded `"/ year"` / `"/ month"` → read from `data-yearly-label` / `data-monthly-label` | H |
| 84-88 | Choices init | Pass `noResultsText`, `noChoicesText`, `loadingText`, `itemSelectText` localized | M |
| 103-114 | flatpickr date | No RTL support in 4.6.13. Load `l10n/ar.js`, `locale: isRTL ? 'ar' : 'default'`, `position: isRTL ? 'auto right' : 'auto'` | H |
| 121-136 | flatpickr time | `locale` for AM/PM; CSS `[dir=rtl] .flatpickr-time{direction:ltr}` | M |
| 758-763 | hobble mouse parallax | Physical pointer coords — **correct, don't flip** | — |
| Others | Lenis, tabs, accordion, scrollUp, stickyCard, parallaxImage, packagesFilter, star input, quantity | No change needed | — |

---

## 4. Vendor CSS

| File | Status | Action | Sev |
|---|---|---|---|
| `bootstrap.min.css` 5.3.8 | LTR build, used for both directions | Physical rules used by the theme (reboot `ol/ul`, `.list-unstyled`, `offset-xl-1`, `ms-0`, `me-0`, `ms-sm-auto`, `end-0`, breadcrumb) mirrored in `common/_rtl.scss` | H |
| `swiper.min.css` | Self-handles `.swiper-rtl` | None | — |
| `choices.min.css` | Has `[dir=rtl]` rules | None (but theme overrides in §2 must use logical props) | — |
| `flatpickr.min.css` | No RTL (14 `left`, 9 `right`) | Add `[dir=rtl] .flatpickr-calendar{direction:rtl}`, swap prev/next month arrows, flip arrow SVGs | H |
| `odometer.min.css` | No direction | `.odometer{direction:ltr;unicode-bidi:isolate}` | M |

---

## 5. HTML

### 5.1 Directional icons to mirror (≈ 160 occurrences — solve with the global CSS in §1, no HTML edits needed)
| Pattern | Where |
|---|---|
| `img[src*="arrow-right.svg"]` | 62 in inner pages + ~60 in home pages (buttons, `.cs_card_btn`, `.cs_service_arrow_btn`, submits) |
| `img[src*="arrow2-right.svg"]` | home-v2/v3/v5 buttons **and** both `.slider-prev`/`.slider-next` (prev rotated via SCSS `_slider` L200) |
| `.fa-arrow-right` / `.fa-arrow-left` | index L328, L330, L415, L1103, L1106; v2 L275, L343; v4 L1001, L1004; about-us L263 |
| `img[src*="arrow_shape_1/2.svg"]` in `.cs_work_card_shape` | v2 L849/864/879; v4 L645/660/675; v5 L904/919/934; about-us L448/463/478 (animated → needs RTL keyframes, `_layouts` L898) |
| Optional: `fa-paper-plane`, `quote.svg` | footer newsletter; about/testimonial quotes |
| **Do NOT flip** | `fa-arrow-up`, `arrow-down.svg`, `check-double.svg`, play `polygon.svg`, brand icons, stars |

### 5.2 Inline styles (must remove — they conflict with RTL flipping)
`style="transform: rotate(180deg);"` on "Previous" arrow: **blog.html L478, blog-sidebar.html L381, blog-details.html L327, shop.html L441** → replace with a `.cs_prev_icon` class handled in SCSS. [H]


- `end-0`: home-v2 L716, L1077; home-v5 L446
- `offset-xl-1`: home-v2 L741, L900; home-v3 L378, L947; faq L230; patient-resource L308
- `ms-sm-auto`: home-v5 L236
- `ms-0` on `.cs_sidebar_style_1`: packages L223, privacy-policy L219, term-condition L220 (the custom `margin-left:auto` at `_layouts` L1651 must become MIS, otherwise the reset targets the wrong side)
- `me-0`: shop-family header L161 (cart, checkout, shop, shop-details)

### 5.4 LTR content needing `<bdi dir="ltr">` / `dir="ltr"` [H/M]
- **Phones** (shared header L54, footer ~L1295, side header v4 L248, and pages: appointment L243, contact-us L230/265, doctor-details L359/361, event-details L450, faq L328, location L229/273, packages L272, patient-resource L318, term-condition L339, home-v2 L1109, v3 L120/L633, v5 L741/L1069/L1257)
- **Emails** (header L48, footer ~L1302, contact-us L253/254, doctor-details L360, event-details L450, location L234, packages L275, privacy-policy L377, term-condition L335, v5 L749/L1264)
- **Prices** (~90: cart, checkout, packages, pricing, shop, shop-details, home-v2 L573…, v3 L792/L806, v4 L828…L954). `pricing.html` L238/274/310: JS swaps text via `data-monthly/yearly` — put the wrapper outside the swapped span.
- **Time ranges** (`08:00 AM - 10:00 PM` etc.): index L219/260/301, v2 L219/L1115-1123, v3 L299/303, v5 L717/721, contact-us, doctor-details, event(-details), faq, location, patient-resource, privacy-policy, service-details, career
- **Ratings / stats**: `4.9/5`, `24/7`, `1M+`, `20/20`, `98.6%`; index L922 `24/7` built from two odometers → `dir="ltr"` on parent (renders "7/24" otherwise) [H]
- **Dates** "April 05, 2026" → localize (blog, event, patient-resource, policy pages, home pages)

### 5.5 Form fields
| Change | Where | Sev |
|---|---|---|
| `type="email"` → add `dir="ltr"` | index L952, L1320 (newsletter, all pages); v2 L1401; v3 L851, L1274; v4 L1200; v5 L646, L1194; about-us L806, appointment L271, blog-details L355, career L456, checkout L279, contact-us L293, event-details L396, login L238, password L238, register L242, testimonials L403 | H |
| Phone `type="text"` → `type="tel" dir="ltr"` | index L946; v2 L1143; v3 L845; v5 L640; about-us L800, appointment L265, career L462, contact-us L299, event-details L392, service-details L461 (checkout L273, doctor-details L373 already `tel` → add `dir`) | H |
| `type="password"` / `url` / zip / coupon → `dir="ltr"` | login L242, register L246/250, blog-details L361, checkout L267, cart L322 | M |
| Choices selects (`.cs_choice`) — 26 total | fixed by SCSS `::after` changes | M |
| Flatpickr inputs + absolute `.cs_date_icon/.cs_time_icon` | index L983/990, v2 L1188/1194, v3 L881/888, v5 L677/684, about-us L836-844, appointment L303-311 | M |

### 5.6 Other HTML
- Google Maps iframes: add `&hl=ar` / change `!1sen` → `!1sar` — about-us L876, contact-us L364, event-details L376, location L265, packages L286, home-v3 L921 [L]
- `cart.html` `data-label` attributes (15), `pricing.html` `data-monthly/yearly`, all `alt` (~1140), `aria-label` (~490), `placeholder` (~100), `title` need translation.
- home-v4 L1053-1103 before/after images are LTR-ordered — content decision.

---

## 6. Unrelated bugs found during the audit
- `mailto:` missing on header email link — index L48, home-v2 L48, home-v3 L116, home-v4 L48
- Typo "Read Sull Story" — index L1152, L1187, L1222
- home-v4 L168 menu button has `aria-label="Search"`
- home-v4 L260 duplicate "Get in Touch" heading (should be social)
- Terms/Privacy footer links have `aria-label="Style Guide"` on all pages
- Shop-family header L165: `alt="Phone icon"` on `user.svg`
- `_slider.scss` L289: `animation-duration` on non-animated `.cs_ticker_in`
- `_layouts.scss` L1089: `writing-mode: lr` (deprecated) → `horizontal-tb`
- `_layouts.scss` L1800/1816: duplicated `.choices::after` rule
- checkout L321: submit button outside `<form>`

---

## 7. Totals (approx.)

| Area | H | M | L |
|---|---|---|---|
| Common SCSS (header, footer, general, slider, typography, modal) | 45 | 17 | 16 |
| `_layouts.scss` | 24 | ~40 | 9 |
| `_hero` / `_about` / `_services` | ~39 | ~33 | ~12 |
| `_blog` / `_team` / `_ecommerce` / `_contact` | 27 | 24 | 22 |
| Other shortcodes | 53 | 38 | 7 |
| `main.js` + vendors | 8 | 9 | 20 |
| HTML (icons, inputs, bidi, utilities) | ~120 | ~90 | ~60 |

**Suggested order of work:** §1 global setup → convert SCSS to logical properties file by file (§2) → global icon/bidi/ticker rules → JS (flatpickr, pricing labels, language switch) → HTML (inline styles, inputs, `<bdi>`) → translation.
