(function () {
  /**
   * ===========================
   * Navbar Scroll Show Hide Start
   * ===========================
   */
  var navbar = document.querySelector(".nav_wrapper");
  var logoContainer = document.querySelector(".logo_container");
  var prevY = 0;
  var startPixel = 30; // to start show and hide
  if (navbar) {
    window.addEventListener("scroll", () => {
      var scrolledPixels = document.documentElement.scrollTop;
      if (scrolledPixels < prevY && scrolledPixels > startPixel) {
        navbar.style.top = "0%";
        navbar.style.paddingTop = "0";
        logoContainer.classList.add("logo_container--small");
      } else if (scrolledPixels < prevY) {
        navbar.style.top = "0%";
        navbar.style.paddingTop = "25px";
        logoContainer.classList.remove("logo_container--small");
      } else if (scrolledPixels > startPixel) {
        navbar.style.top = "-100%";
      }
      prevY = scrolledPixels;
    });
  }
  /* ---- Navbar Scroll Finished ---- */
  
})();
