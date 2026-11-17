(function () {
    "use strict";

    function applyTheme() {
        var t = null;
        try { t = localStorage.getItem("mlp-theme"); } catch (e) {}
        if (t === "light" || t === "dark") document.documentElement.setAttribute("data-theme", t);
    }

    document.addEventListener("click", function (e) {
        if (e.target.closest("#theme-toggle")) {
            var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", next);
            try { localStorage.setItem("mlp-theme", next); } catch (err) {}
            return;
        }
        var btn = e.target.closest("#mobile-menu-btn");
        if (btn) {
            var menu = document.getElementById("mobile-menu");
            var open = menu.classList.toggle("hidden") === false;
            btn.setAttribute("aria-expanded", open ? "true" : "false");
            btn.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
        }
    });

    window.addEventListener("scroll", function () {
        var nav = document.getElementById("main-nav");
        if (nav) nav.classList.toggle("shadow-[0_8px_24px_-18px_rgba(0,0,0,.45)]", window.scrollY > 20);
    }, { passive: true });

    function initReveal() {
        var els = document.querySelectorAll(".reveal-on-scroll:not(.is-revealed)");
        if (!("IntersectionObserver" in window)) {
            els.forEach(function (el) { el.classList.add("is-revealed"); });
            return;
        }
        var obs = new IntersectionObserver(function (entries, o) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { en.target.classList.add("is-revealed"); o.unobserve(en.target); }
            });
        }, { threshold: 0.08 });
        els.forEach(function (el) {
            var d = el.getAttribute("data-delay");
            if (d) el.style.transitionDelay = d + "ms";
            obs.observe(el);
        });
    }

    function initFilters() {
        document.querySelectorAll("[data-filter-items]").forEach(function (bar) {
            var buttons = bar.querySelectorAll(".filter-btn");
            var items = document.querySelectorAll(bar.dataset.filterItems);
            var empty = bar.dataset.filterEmpty ? document.querySelector(bar.dataset.filterEmpty) : null;
            if (!buttons.length || !items.length) return;

            function setActive(active) {
                buttons.forEach(function (b) {
                    var on = b === active;
                    b.classList.toggle("is-active", on);
                    b.setAttribute("aria-pressed", on ? "true" : "false");
                });
            }
            setActive(bar.querySelector(".filter-btn.is-active") || buttons[0]);

            buttons.forEach(function (btn) {
                btn.addEventListener("click", function () {
                    setActive(btn);
                    var cat = btn.dataset.category, shown = 0;
                    items.forEach(function (item) {
                        var match = cat === "Semua" || item.dataset.category === cat;
                        item.style.display = match ? "" : "none";
                        if (match) { item.classList.add("is-revealed"); shown++; }
                    });
                    if (empty) empty.classList.toggle("hidden", shown > 0);
                });
            });
        });
    }

    applyTheme();
    document.addEventListener("DOMContentLoaded", function () { initReveal(); initFilters(); });
})();
