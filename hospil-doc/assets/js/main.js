// Highlight the active sidebar link as you scroll
(function () {
  var links = Array.prototype.slice.call(
    document.querySelectorAll(".docs-nav a"),
  );
  var sections = links
    .map(function (l) {
      return document.querySelector(l.getAttribute("href"));
    })
    .filter(Boolean);

  function setActive(href) {
    links.forEach(function (l) {
      l.classList.toggle("active", l.getAttribute("href") === href);
    });
  }

  function onScroll() {
    var pos = window.scrollY + 0;
    var current = sections[0];
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= pos) current = sections[i];
    }
    setActive("#" + current.id);
  }

  links.forEach(function (l) {
    l.addEventListener("click", function () {
      setActive(l.getAttribute("href"));
    });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();
