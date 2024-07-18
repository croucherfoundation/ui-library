(function () {
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
  var navbarSubContainer = document.querySelector('.navbar_sub_container');
  var breadcrumbContainer = document.querySelector('.breadcrumb-container');

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
      if (navbarSubContainer) searchBar.classList.add('mt');
      if (breadcrumbContainer) breadcrumbContainer.classList.remove('pt');
    });

    searchCrossIcon.addEventListener('click', function () {
      var searchBarOpen = searchBar.classList.contains(
        'croucher_search_container--open'
      );
      if (!searchBarOpen) return;
      searchBar.classList.remove('croucher_search_container--open');
      if (navbarSubContainer) searchBar.classList.remove('mt');
      if (breadcrumbContainer) breadcrumbContainer.classList.add('pt');
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
        if (grandParent && grandParent.classList.contains('active')) {
          grandParent.classList.remove('active');
        }
      });
    });
  }

  /**
   * ===========================
   * Main and Sub Navbar Container
   * ===========================
   * need to add lodash cdn link
   */

  window.addEventListener('DOMContentLoaded', function () {
    function insertAfter(newNode, referenceNode) {
      // return
      // console.log(newNode, referenceNode)
      if (!newNode || !referenceNode) return;
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    var navbar = document.querySelector('.main_sub_navbar_container');
    var spacer = document.createElement('div');
    var { height } = navbar.getBoundingClientRect();
    spacer.style.height = `${height}px`;
    spacer.setAttribute('class', 'spacer');
    insertAfter(spacer, navbar);
    var mainNavContainer = document.querySelector('.nav_wrapper');
    var prevY = 0;
    var startPixel = 120; // to start show and hide
    function handleScroll() {
      var scrolledPixels = document.documentElement.scrollTop;
      var { height } = mainNavContainer.getBoundingClientRect();
      if (scrolledPixels < prevY) {
        navbar.style.top = '0px';
        if (scrolledPixels > startPixel) {
          mainNavContainer.classList.add('no_padding');
        } else {
          mainNavContainer.classList.remove('no_padding');
        }
      } else if (scrolledPixels > 0) {
        navbar.style.top = `-${height}px`;
      }
      prevY = scrolledPixels <= 0 ? 0 : scrolledPixels;
    }
    if (navbar) {
      window.addEventListener('scroll', _.throttle(handleScroll, 250));
    }
  });

  /*
    Footer - Back to top
  */
  document.addEventListener('DOMContentLoaded', () => {
    const backToTopButton = document.querySelector('.back-to-top');

    if (backToTopButton) {
      backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  });


  /**
   * Checke Height for footer
   */
  (function positionFooter() {
    var bodyHeight = document.body.clientHeight;
    var windownHeight = window.innerHeight;
    var footer = document.querySelector(".croucher-footer");
    var { height: footerHeight } = footer.getBoundingClientRect();
    var contentHeight = windownHeight - footerHeight;
    if(footer && bodyHeight < contentHeight) {
      footer.classList.add("fixed-position")
    } else {
      footer.classList.remove("fixed-position")
    }
  })()
})();
