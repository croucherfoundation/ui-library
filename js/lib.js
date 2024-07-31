(function () {
  /**
   * ===========================
   * Search Bar Toggle
   * ===========================
   */
  var searchIcon = document.querySelector(".links_container .search_button");
  var searchBar = document.querySelector(".croucher_search_container");
  var searchCrossIcon = document.querySelector(
    ".croucher_search_container .cross_icon"
  );
  var navbarSubContainer = document.querySelector(".navbar_sub_container");
  var breadcrumbContainer = document.querySelector(".breadcrumb-container");

  if (searchIcon && searchBar && searchCrossIcon) {
    var scrollToTopWithScroll = function (time = 350) {
      setTimeout(function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, time);
    };

    searchIcon.addEventListener("click", function () {
      var searchBarOpen = searchBar.classList.contains(
        "croucher_search_container--open"
      );
      scrollToTopWithScroll(searchBarOpen ? 0 : 200);
      if (searchBarOpen) return;
      searchBar.classList.add("croucher_search_container--open");
      if (navbarSubContainer) searchBar.classList.add("mt");
      if (breadcrumbContainer) breadcrumbContainer.classList.remove("pt");
    });

    searchCrossIcon.addEventListener("click", function () {
      var searchBarOpen = searchBar.classList.contains(
        "croucher_search_container--open"
      );
      if (!searchBarOpen) return;
      searchBar.classList.remove("croucher_search_container--open");
      if (navbarSubContainer) searchBar.classList.remove("mt");
      if (breadcrumbContainer) breadcrumbContainer.classList.add("pt");
    });
  }

  /**
   * ===========================
   * I-Format Photo Text
   * ===========================
   */
  var iFormats = document.querySelectorAll(".active-icon");
  if (iFormats && iFormats.length > 0) {
    iFormats.forEach(function (iIcon) {
      iIcon.addEventListener("click", function () {
        var parent = this.parentElement;
        if (parent && !parent.classList.contains("active")) {
          parent.classList.add("active");
        }
      });
    });
  }
  var iCloseIcons = document.querySelectorAll(".close-icon");
  if (iCloseIcons && iCloseIcons.length > 0) {
    iCloseIcons.forEach(function (closeIcon) {
      closeIcon.addEventListener("click", function () {
        var parent = this.parentElement;
        if (parent && parent.classList.contains("active")) {
          parent.classList.remove("active");
        }

        var grandParent = parent.parentElement;
        if (grandParent && grandParent.classList.contains("active")) {
          grandParent.classList.remove("active");
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

  window.addEventListener("DOMContentLoaded", function () {
    function insertAfter(newNode, referenceNode) {
      // return
      // console.log(newNode, referenceNode)
      if (!newNode || !referenceNode) return;
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    var navbar = document.querySelector(".main_sub_navbar_container");
    var spacer = document.createElement("div");
    var { height } = navbar.getBoundingClientRect();
    spacer.style.height = `${height}px`;
    spacer.setAttribute("class", "spacer");
    insertAfter(spacer, navbar);
    var mainNavContainer = document.querySelector(".nav_wrapper");
    var prevY = 0;
    var startPixel = 120; // to start show and hide
    function handleScroll() {
      var scrolledPixels = document.documentElement.scrollTop;
      var { height } = mainNavContainer.getBoundingClientRect();
      if (scrolledPixels < prevY) {
        navbar.style.top = "0px";
        if (scrolledPixels > startPixel) {
          mainNavContainer.classList.add("no_padding");
        } else {
          mainNavContainer.classList.remove("no_padding");
        }
      } else if (scrolledPixels > 0) {
        navbar.style.top = `-${height}px`;
      }
      prevY = scrolledPixels <= 0 ? 0 : scrolledPixels;
    }
    if (navbar) {
      window.addEventListener("scroll", _.throttle(handleScroll, 250));
    }
  });

  /*
    Footer - Back to top
  */
  document.addEventListener("DOMContentLoaded", () => {
    const backToTopButton = document.querySelector(".back-to-top");

    if (backToTopButton) {
      backToTopButton.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  });

  /**
   * Check Height for footer position
   */
  document.addEventListener("DOMContentLoaded", () => {
    function positionFooter() {
      var footer = document.querySelector(".croucher-footer");
      if (footer) {
        var { height } = footer.getBoundingClientRect();
        var { height: bodyHeight } = document.body.getBoundingClientRect();
        var windownHeight = window.innerHeight;
        if (bodyHeight < windownHeight) {
          footer.classList.add("fixed-position");
        } else {
          footer.classList.remove("fixed-position");
        }
      }
    }
    window.addEventListener("resize", positionFooter);
  });

  /**
   * --- HELPER functions
   */

  function callLater(cb, delay = 100) {
    setTimeout(cb, delay);
  }

  function removeClassName(el, name) {
    el.classList.remove(name);
    return el;
  }

  function addClassName(el, name) {
    el.classList.add(name);
    return el;
  }

  function transformTimeZone(timezones) {
    return timezones.map(([value, label]) => ({
      value,
      label,
    }));
  }

  /**
   * -----------------------------
   * ---START: Modal Dialogs ----
   * -----------------------------
   */

  function createModalBackdrop() {
    var el = document.createElement("div");
    el.className = "modal-backdrop fade";
    document.body.appendChild(el);
    return el;
  }
  document.addEventListener("DOMContentLoaded", () => {
    var allModalDialogBtns = document.querySelectorAll("[data-toggle='modal']");

    allModalDialogBtns.forEach((openBt) => {
      openBt.addEventListener("click", () => {
        // var modal = document.querySelector(".modal");
        var targeModalId = openBt.getAttribute("data-target");
        console.log("target modal id", targeModalId);
        var modal = document.getElementById(targeModalId);
        // return;
        var backdrop = createModalBackdrop();
        var closeBtn = modal.querySelector(".cancel");
        var saveBtn = modal.querySelector(".save");

        callLater(function () {
          backdrop.classList.add("show");
          modal.classList.add("modal-open");
        });

        closeBtn.addEventListener("click", function () {
          closeModal();
        });
        saveBtn.addEventListener("click", function (e) {
          closeModal();
        });
        backdrop.addEventListener("click", function () {
          closeModal();
        });

        function closeModal() {
          removeClassName(backdrop, "show");
          removeClassName(modal, "modal-open");
          callLater(() => backdrop.remove(), 100);
        }
      });
    });
  });

  /**
   * ---END: Modal Dialogs
   */

  /**
   * -----------------------------
   * ---START: Select---
   * -----------------------------
   */
  class MySelect {
    constructor(containerId, config) {
      this.options = config.options;
      this.searchable = document.getElementById(containerId);
      this.searchableInput = this.searchable.querySelector(
        ".searchable-input input"
      );
      this.toggleBtn = this.searchable.querySelector(".searchable-toggle");

      if (!this.searchableInput) {
        throw new Error(`
        
          MySelect: There is no element with searchable-input class with it's direct children input element.
          It should be the following structure.
          <div id="yourId">
            <div class='searchable-input'>
              <input type='text' />
            </div>
          </div>
        
        `);
      }
      this.listenToggleBtn();
      this.listenInputFocus();
    }

    listenToggleBtn() {
      this.toggleBtn.addEventListener("click", () => {
        this.searchable.classList.toggle("searchable-visible");
        var searchableList = this.searchable.querySelector(".searchable-list");

        if (searchableList) {
          searchableList.remove();
        } else {
          var list = document.createElement("div");
          this.searchableList = list;
          list.className = "searchable-list";
          callLater(() => {
            list.style.transform = "scaleY(1)";
          }, 100);
          this.searchable.appendChild(list);
          this.renderAndListenInputChange();
          console.log("created");
        }
      });
    }

    listenInputFocus() {
      this.searchableInput.addEventListener("focus", () => {
        var searchableList = this.searchable.querySelector(".searchable-list");

        if (!searchableList) {
          var list = document.createElement("div");
          list.className = "searchable-list";
          callLater(() => {
            list.style.transform = "scaleY(1)";
          }, 100);
          this.searchable.appendChild(list);
          this.renderAndListenInputChange();
        }
      });
    }
    createListItemElement(item) {
      let li = document.createElement("li");
      li.textContent = item.label;
      li.setAttribute("value", item.value);
      li.addEventListener("click", () => {
        this.searchableInput.value = item.value;
        let searchableList = this.searchable.querySelector(".searchable-list");
        if (searchableList) searchableList.remove();
      });
      return li;
    }

    createList() {
      let ul = document.createElement("ul");
      return ul;
    }

    renderList(options) {
      let searchableList = this.searchable.querySelector(".searchable-list");

      searchableList.innerHTML = "";
      let list = this.createList();

      if (options.length == 0) {
        list.innerHTML = `<li>No items found</li>`;
        searchableList.appendChild(list);
        return;
      }
      options.forEach((item) => {
        let li = this.createListItemElement(item);
        list.appendChild(li);
      });
      searchableList.appendChild(list);
    }

    renderAndListenInputChange() {
      this.renderList(this.options);
      this.searchableInput.addEventListener("input", (e) =>
        this.onSearchChange(e)
      );
    }

    onSearchChange(event) {
      var value = event.target.value;
      var filteredList = this.filterOptions(value.toLowerCase());
      this.renderList(filteredList);
    }

    filterOptions(query) {
      return this.options.filter(
        (item) =>
          query.trim() == "" ||
          item.label.toLowerCase().includes(query) ||
          item.value.toLowerCase().includes(query)
      );
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    let options = [
      {
        value: "null",
        label: "Select timezone",
      },
      {
        value: "Pacific/Midway",
        label: "Midway",
      },
      {
        value: "Pacific/Niue",
        label: "Niue",
      },
      {
        value: "Pacific/Pago_Pago",
        label: "Pago Pago",
      },
      {
        value: "Pacific/Samoa,US/Samoa",
        label: "Samoa",
      },
      {
        value: "America/Adak",
        label: "Adak",
      },
      {
        value: "America/Atka",
        label: "Atka",
      },
      {
        value: "HST",
        label: "HST",
      },
      {
        value: "Pacific/Honolulu",
        label: "Honolulu",
      },
      {
        value: "Pacific/Johnston",
        label: "Johnston",
      },
    ];
    new MySelect("timezonesSelect", {
      options,
    });
  });

  /**
   * -----------------------------
   * ---END: Select---
   * -----------------------------
   */

  /**
   * ----------------------------
   * ---START: Account Email Type Selector
   * -----------------------------
   */
  document.addEventListener("DOMContentLoaded", () => {
    let emailTypeElements = document.querySelectorAll(".email .email-type");

    emailTypeElements.forEach((emailType) => {
      let selected = emailType.querySelector(".email-type-selected");
      let selectedInput = emailType.querySelector(".email-type-selected input");
      let typeLists = emailType.querySelector(".email-type-list");
      let listBtns = typeLists.querySelectorAll("button");

      selected.addEventListener("click", function () {
        typeLists.classList.toggle("hidden-list");
        callLater(() => {
          if (typeLists.classList.contains("hidden-list")) {
            typeLists.classList.remove("show-list");
          } else {
            typeLists.classList.add("show-list");
            listBtns.forEach((btn) => {
              let span = btn.querySelector("span");
              if (span.textContent === selectedInput.value) {
                btn.classList.add("active");
              } else {
                btn.classList.remove("active");
              }
              btn.addEventListener("click", () => {
                selectedInput.value = span.textContent;
                typeLists.classList.add("hidden-list");
              });
            });
          }
        }, 1);
      });
    });
  });

  /**
   * -----------------------------
   * ---END: Account Email Type Selector
   * -----------------------------
   */
})();
