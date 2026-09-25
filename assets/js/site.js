(() => {
  const root = document.documentElement;
  const toggle = document.querySelector(".theme-toggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');

  const syncThemeControl = () => {
    const dark = root.dataset.theme === "dark";
    toggle.setAttribute("aria-label", `Switch to ${dark ? "light" : "dark"} mode`);
    if (themeColor) themeColor.content = dark ? "#111316" : "#f4f4f1";
  };

  if (toggle) {
    syncThemeControl();
    toggle.addEventListener("click", () => {
      root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("trust-theme", root.dataset.theme);
      } catch (_) {
        // The selected theme still applies for this visit when storage is unavailable.
      }
      syncThemeControl();
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reducedMotion) root.classList.add("has-motion");

  const revealItems = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window) || reducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
  );

  revealItems.forEach((item) => observer.observe(item));
})();
