(function () {
  /**
   * ===========================
   * Navbar Scroll Show Hide Start
   * ===========================
   */

  var navbar = document.querySelector('.nav_wrapper');
  var logoContainer = document.querySelector('.logo_container');
  var prevY = 0;
  var startPixel = 30; // to start show and hide
  if (navbar) {
    window.addEventListener('scroll', () => {
      var scrolledPixels = document.documentElement.scrollTop;
      if (scrolledPixels < prevY && scrolledPixels > startPixel) {
        // navbar.style.top = '0%';
        navbar.style.paddingTop = '0';
        logoContainer.classList.add('logo_container--small');
        navbar.classList.remove("hide");
      } else if (scrolledPixels < prevY) {
        // navbar.style.top = '0%';
        navbar.style.paddingTop = '25px';
        logoContainer.classList.remove('logo_container--small');
        navbar.classList.remove("hide");
      } else if (scrolledPixels > startPixel) {
        // navbar.style.top = '-100%';
        navbar.classList.add("hide");
      }
      prevY = scrolledPixels;
    });
  }
  /* ---- Navbar Scroll Finished ---- */

  /**
   * ===========================
   * Search Bar Toggle
   * ===========================
   */
  var searchIcon = document.querySelector('.links_container .search_button');
  var searchBar = document.querySelector('.croucher_search_container');
  var searchCrossIcon = document.querySelector(
    '.croucher_search_container .cross_icon'
  );
  if (searchIcon && searchBar && searchCrossIcon) {
    var scrollToTopWithScroll = function (time = 350) {
      setTimeout(function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, time);
    };

    searchIcon.addEventListener('click', function () {
      var searchBarOpen = searchBar.classList.contains(
        'croucher_search_container--open'
      );
      scrollToTopWithScroll(searchBarOpen ? 0 : 200);
      if (searchBarOpen) return;
      searchBar.classList.add('croucher_search_container--open');
    });

    searchCrossIcon.addEventListener('click', function () {
      var searchBarOpen = searchBar.classList.contains(
        'croucher_search_container--open'
      );
      if (!searchBarOpen) return;
      searchBar.classList.remove('croucher_search_container--open');
    });
  }

  /**
   * ===========================
   * I-Format Photo Text
   * ===========================
   */
  var iFormats = document.querySelectorAll('.active-icon');
  if (iFormats && iFormats.length > 0) {
    iFormats.forEach(function (iIcon) {
      iIcon.addEventListener('click', function () {
        var parent = this.parentElement;
        if (parent && !parent.classList.contains('active')) {
          parent.classList.add('active');
        }
      });
    });
  }
  var iCloseIcons = document.querySelectorAll('.close-icon');
  if (iCloseIcons && iCloseIcons.length > 0) {
    iCloseIcons.forEach(function (closeIcon) {
      closeIcon.addEventListener('click', function () {
        var parent = this.parentElement;
        if (parent && parent.classList.contains('active')) {
          parent.classList.remove('active');
        }
        
        var grandParent = parent.parentElement;
        if (grandParent && grandParent.classList.contains("active")) {
          grandParent.classList.remove("active");
        }
      });
    });
  }
})();
