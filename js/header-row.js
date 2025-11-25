const headerRow = document.getElementById("headerRow");
  let hasStickyShadow = false;

  window.addEventListener("DOMContentLoaded", () => {
    const thead = document.querySelector("thead");
    if (thead) {
      thead.style.width = `${document.documentElement.clientWidth}px`;
    }
  });

  const handleScroll = _.throttle(() => {
    const rows = document.querySelectorAll(".header-row");
    rows.forEach((row) => {
      const headerRect = row.getBoundingClientRect();
      const shouldShowShadow = headerRect.top <= 0;

      if (shouldShowShadow && !hasStickyShadow) {
        headerRow.classList.add("sticky");
        hasStickyShadow = true;
      } else if (!shouldShowShadow && hasStickyShadow) {
        headerRow.classList.remove("sticky");
        hasStickyShadow = false;
      }
    });
  }, 100);

  window.addEventListener("scroll", handleScroll, { passive: true });