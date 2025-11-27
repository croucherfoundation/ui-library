// import { StandardDropdown, convertSelectToDropdown, createDropdownItem } from './dropdown.js';

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
      var secondarySearchBox = document.getElementById("search-scholar-box");
      var defaultSearchBox = document.querySelector(".search-scholar-box");

      scrollToTopWithScroll(searchBarOpen ? 0 : 200);

      if (searchBarOpen) {
        // Close the main search bar
        searchBar.classList.remove("croucher_search_container--open");
        if (navbarSubContainer) searchBar.classList.remove("mt");
        if (breadcrumbContainer) breadcrumbContainer.classList.add("pt");

        // Show the default search box if secondary is hidden
        if (secondarySearchBox)
          secondarySearchBox.classList.remove(
            "croucher_search_container--open"
          );
        if (defaultSearchBox) defaultSearchBox.style.display = "block";
      } else {
        // Open the main search bar
        searchBar.classList.add("croucher_search_container--open");
        if (navbarSubContainer) searchBar.classList.add("mt");
        if (breadcrumbContainer) breadcrumbContainer.classList.remove("pt");

        // Hide the default search box and open the secondary search box
        if (secondarySearchBox)
          secondarySearchBox.classList.add("croucher_search_container--open");
        if (defaultSearchBox) defaultSearchBox.style.display = "none";
      }

      // close signout box if search box open
      let signinBox = document.getElementById("signin-box");
      if (signinBox) signinBox.classList.remove("auth_container_open");
      disableEmailAndPassword();
      let signoutBox = document.getElementById("signout-box");
      if (signoutBox) signoutBox.classList.remove("auth_container_open");
    });

    var crossButtons = document.querySelectorAll(
      ".cross_icon_container button, .cross_icon"
    );

    crossButtons.forEach(function (crossButton) {
      crossButton.addEventListener("click", function () {
        var secondarySearchBox = document.getElementById("search-scholar-box");
        var defaultSearchBox = document.querySelector(".search-scholar-box");

        if (secondarySearchBox)
          secondarySearchBox.classList.remove(
            "croucher_search_container--open"
          );

        if (defaultSearchBox) defaultSearchBox.style.display = "block";
      });
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
    const applicationTable = document.getElementById("applicationTable");
    function insertAfter(newNode, referenceNode) {
      if (!newNode || !referenceNode) return;
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }

    const navbar = document.querySelector(".main_sub_navbar_container");

    if (navbar) {
      const spacer = document.createElement("div");
      const resizeObserver = new ResizeObserver(() => {
        const { height } = navbar.getBoundingClientRect();
        spacer.setAttribute("class", "spacer");
        spacer.style.height = `${height}px`;
        insertAfter(spacer, navbar);
      });
      resizeObserver.observe(navbar);
    }

    var mainNavContainer = document.querySelector(".nav_wrapper");
    var prevY = 0;
    var startPixel = 120; // to start show and hide
    var rows = document.querySelectorAll(".header-row");

    function handleScroll() {
      var top = 0;
      if( applicationTable ) {
        top = applicationTable.getBoundingClientRect();
      }
      // const { top } = applicationTable.getBoundingClientRect();
      var scrolledPixels = document.documentElement.scrollTop;
      var { height } = mainNavContainer.getBoundingClientRect();
      console.log(navbarSubContainer.getBoundingClientRect());
      rows.forEach((e) => {
        if (top < 164) {
          e.style.top = `${
            navbarSubContainer.getBoundingClientRect().top + 54
          }px`;
        }
        if(top < 54) {
          e.classList.add('blur-bg')
        } else {
          e.classList.remove('blur-bg')
          
        }
      });

      // if (
      //   applicationTable &&
      //   applicationTable.getBoundingClientRect().top < height
      // ) {
      //   console.log(applicationTable.getBoundingClientRect().top)
      //   // return;
      // }

      if (scrolledPixels < prevY) {
        navbar.style.top = "0px";
        if (scrolledPixels > startPixel) {
          mainNavContainer.classList.add("no_padding");
        } else {
          mainNavContainer.classList.remove("no_padding");
        }
      } else if (scrolledPixels > 0) {
        navbar.style.top = `-${height}px`;
        // console.log('seeting ', scrolledPixels)
      }
      prevY = scrolledPixels <= 0 ? 0 : scrolledPixels;
    }
    if (navbar) {
      window.addEventListener("scroll", _.throttle(handleScroll, 280));
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
   * ---START: Auth  ----
   * -----------------------------
   */
  document.addEventListener("DOMContentLoaded", () => {
    // show modal when user confirm email is sent
    let emailConfirmModal = document.getElementById("emailConfirmModal");
    if (emailConfirmModal) {
      var backdrop = createModalBackdrop();
      callLater(function () {
        backdrop.classList.add("show");
        emailConfirmModal.classList.add("modal-open");
      });
    }

    let linksContainer = document.querySelector(".links_container");
    let openSignInBtn = document.querySelectorAll(".sign_in");
    let signinBox = document.getElementById("signin-box");
    if (signinBox) {
      let signinCrossBtn = signinBox.querySelector(
        ".cross_icon_container button"
      );
      if (signinCrossBtn) {
        signinCrossBtn.addEventListener("click", () => {
          signinBox.classList.remove("auth_container_open");
          signinBox.classList.remove("mt_open");
          disableEmailAndPassword();
        });
      }
    }
    let openSignOutElements = document.querySelectorAll(
      ".user_avatar, .user_avatar_mobile"
    );
    let signoutBox = document.getElementById("signout-box");
    if (signoutBox) {
      let signoutCrossBtn = signoutBox.querySelector(
        ".cross_icon_container button"
      );
      if (signoutCrossBtn) {
        signoutCrossBtn.addEventListener("click", () => {
          signoutBox.classList.remove("auth_container_open");
          signoutBox.classList.remove("mt_open");
        });
      }
    }

    if (openSignInBtn) {
      openSignInBtn.forEach((btn) => {
        if (btn) {
          btn.addEventListener("click", () => {
            // open sign in box
            if (signinBox) {
              var isSignBoxOpen = signinBox.classList.contains(
                "auth_container_open"
              );
              if (!isSignBoxOpen) {
                enableEmailAndPassword();
                signinBox.classList.add("auth_container_open");
                if (navbarSubContainer) signinBox.classList.add("mt_open");
              }
            }

            // close the hamburger menu in mobile view
            if (linksContainer) {
              linksContainer.classList.remove("links_container--open");
            }

            // close croucher_search_container
            if (searchBar) {
              var searchBarOpen = searchBar.classList.contains(
                "croucher_search_container--open"
              );
              if (!searchBarOpen) return;
              searchBar.classList.remove("croucher_search_container--open");
              if (navbarSubContainer) searchBar.classList.remove("mt");
              if (breadcrumbContainer) breadcrumbContainer.classList.add("pt");
            }
          });
        }
      });
    }

    openSignOutElements.forEach((openSignOut) => {
      openSignOut.addEventListener("click", () => {
        // Open & close signout box
        if (signoutBox) {
          var isSignOutBoxOpen = signoutBox.classList.contains(
            "auth_container_open"
          );
          if (isSignOutBoxOpen) {
            signoutBox.classList.remove("auth_container_open");
            if (navbarSubContainer) signoutBox.classList.remove("mt_open");

            // Show the default search box when signout box is closed
            let defaultSearchBox = document.querySelector(
              ".search-scholar-box"
            );
            if (defaultSearchBox) defaultSearchBox.style.display = "block";
          } else {
            signoutBox.classList.add("auth_container_open");
            if (navbarSubContainer) signoutBox.classList.add("mt_open");

            // Hide the default search box when signout box is open
            let defaultSearchBox = document.querySelector(
              ".search-scholar-box"
            );
            if (defaultSearchBox) defaultSearchBox.style.display = "none";
          }
        }

        // Close croucher_search_container
        if (searchBar) {
          var searchBarOpen = searchBar.classList.contains(
            "croucher_search_container--open"
          );
          if (!searchBarOpen) return;
          searchBar.classList.remove("croucher_search_container--open");
          if (navbarSubContainer) searchBar.classList.remove("mt");
          if (breadcrumbContainer) breadcrumbContainer.classList.add("pt");
        }
      });
    });
  });

  function enableEmailAndPassword() {
    var emailField = document.getElementById("u_s_e_a");
    var passwordField = document.getElementById("u_s_p_f");
    if (emailField) {
      emailField.removeAttribute("disabled");
      emailField.style.display = "block";
    }
    if (passwordField) {
      passwordField.removeAttribute("disabled");
      passwordField.style.display = "block";
    }
  }

  function disableEmailAndPassword() {
    var emailField = document.getElementById("u_s_e_a");
    var passwordField = document.getElementById("u_s_p_f");
    if (emailField) {
      emailField.setAttribute("disabled", "true");
      emailField.style.display = "none";
    }
    if (passwordField) {
      passwordField.setAttribute("disabled", "true");
      passwordField.style.display = "none";
    }
  }

  /**
   * -----------------------------
   * ---END: Auth  ----
   * -----------------------------
   */

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
  function closeModal(modalId) {
    var backdrop = document.querySelector(".modal-backdrop");
    if (!backdrop) return;
    removeClassName(backdrop, "show");
    removeClassName(document.getElementById(modalId), "modal-open");
    callLater(() => backdrop.remove(), 100);
  }
  document.addEventListener("DOMContentLoaded", () => {
    var allModalDialogBtns = document.querySelectorAll("[data-toggle='modal']");

    var modalCancelBtns = document.querySelectorAll("button.modal-btn.cancel");

    modalCancelBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        var modal = btn.closest(".modal");
        console.log("modal cl", modal);
        var backdrop = document.querySelector(".modal-backdrop");
        removeClassName(backdrop, "show");
        removeClassName(modal, "modal-open");
        callLater(() => backdrop.remove(), 100);
      });
    });

    allModalDialogBtns.forEach((openBt) => {
      openBt.addEventListener("click", () => {
        // var modal = document.querySelector(".modal");
        var targeModalId = openBt.getAttribute("data-target");
        console.log("target modal id", targeModalId);
        var modal = document.getElementById(targeModalId);
        // return;
        var backdrop = createModalBackdrop();
        callLater(function () {
          backdrop.classList.add("show");
          modal.classList.add("modal-open");
        });
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
      this.searchable = document.getElementById(containerId);

      if (!this.searchable) {
        return;
        // throw new Error(`
        //     My Select: There is no element with id: ${containerId}.
        //     It should be the following structure.
        //     <div id="yourId">
        //       <div class='searchable-input'>
        //         <input type='text' />
        //       </div>
        //     </div>
        //   `);
      }

      this.searchableInput = this.searchable.querySelector(
        ".searchable-input input"
      );
      this.toggleBtn = this.searchable.querySelector(".searchable-toggle");
      this.hiddenSelect = document.getElementById(config.hiddenSelectId);
      this.hiddenSelectInput = document.getElementById("input_user_timezone");

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

      this.options = this.extractOptionsFromSelect(this.hiddenSelect);
      this.setInitialValue();
      this.listenToggleBtn();
      this.listenInputFocus();
    }

    extractOptionsFromSelect(selectElement) {
      const options = [];
      for (const option of selectElement.options) {
        options.push({ value: option.value, label: option.text });
      }
      return options;
    }

    setInitialValue() {
      if (this.hiddenSelect && this.hiddenSelectInput.value) {
        const selectedOption = this.options.find(
          (option) => option.value === this.hiddenSelectInput.value
        );
        if (selectedOption) {
          this.searchableInput.value = selectedOption.label;
        }
      }
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
        this.searchableInput.value = item.label;
        if (this.hiddenSelect) {
          this.hiddenSelect.value = item.value;
          this.hiddenSelectInput.value = item.value;
        }
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
    try {
      new MySelect("timezonesSelect", {
        hiddenSelectId: "hidden_timezone_select",
      });
    } catch (error) {
      console.error(error);
    }
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
  function initializeEmailTypeSelect() {
    let emailTypeElements = document.querySelectorAll(".email .email-type");

    emailTypeElements.forEach((emailType) => {
      let selected = emailType.querySelector(".email-type-selected");
      let selectedPreview = emailType.querySelector(".email-type-selected p");
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
              if (span.textContent === selectedPreview.textContent) {
                btn.classList.add("active");
              } else {
                btn.classList.remove("active");
              }
              btn.addEventListener("click", () => {
                selectedInput.value = btn.getAttribute("data-value");
                selectedPreview.textContent = span.textContent;
                typeLists.classList.add("hidden-list");
              });
            });
          }
        }, 1);
      });
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    initializeEmailTypeSelect();
  });

  /**
   * -----------------------------
   * ---END: Account Email Type Selector
   * -----------------------------
   */

  /**
   * -----------------------------
   * ---START: Password Input Eye Show Hide
   */
  document.addEventListener("DOMContentLoaded", () => {
    // For Sign In
    var signInInput = document.querySelector(
      ".sign_in_form .input_group .sign_in_password"
    );
    var signInPassowrdEyeBtn = document.querySelector(
      ".sign_in_form .input_group .eye"
    );
    if (signInPassowrdEyeBtn) {
      var signInPassowrdEyeImg = signInPassowrdEyeBtn.querySelector("img");
      signInPassowrdEyeBtn.addEventListener("click", () => {
        if (signInInput.type == "password") {
          signInInput.type = "text";
          signInPassowrdEyeImg.src =
            "https://cmss.croucher.org.hk/assets/images/icons/eye-01.svg";
        } else {
          signInInput.type = "password";
          signInPassowrdEyeImg.src =
            "https://cmss.croucher.org.hk/assets/images/icons/eye-02.svg";
        }
      });
    }

    // For Account Settings
    var passwordInputs = document.querySelectorAll(".passwords-input");
    passwordInputs.forEach((passwordInput) => {
      var span = passwordInput.querySelector("span");
      span.addEventListener("click", () => {
        passwordInputs.forEach((item) => {
          var input = item.querySelector("input");
          var eyeImage = item.querySelector("img");

          if (input.type === "password") {
            input.type = "text";
            eyeImage.src =
              "https://cmss.croucher.org.hk/assets/images/icons/eye-01.svg";
          } else {
            input.type = "password";
            eyeImage.src =
              "https://cmss.croucher.org.hk/assets/images/icons/eye-02.svg";
          }
        });
      });
    });
  });
  /**
   * -----------------------------
   * ---END: Password Input Eye Show Hide
   * -----------------------------
   */

  /**
   * -------------------------------
   * ---- START: Password validation for Account Settings
   * -----------------------------
   */
  /**
   * password validation
   *  - Password must be at least 8 characters
   *  - Password should not contain repeated characters like "aaa"
   *  - Password should not contain sequences like abc, 6543, etc.
   *
   */

  function validatePassword(password) {
    var errorMessage = "";

    if (password.trim() === "") {
      errorMessage = "";
    } else if (password.trim().length < 8) {
      errorMessage = "Password must be at least 8 characters long.";
    } else if (/(\w)\1\1/.test(password)) {
      errorMessage =
        'Password should not contain repeated characters like "aaa".';
    }

    var sequences = [
      "0123456789",
      "9876543210",
      "abcdefghijklmnopqrstuvwxyz",
      "zyxwvutsrqponmlkjihgfedcba",
    ];

    for (var i = 0; i < sequences.length; i++) {
      for (var j = 0; j < sequences[i].length - 2; j++) {
        var sequence = sequences[i].substring(j, j + 3);
        if (password.includes(sequence)) {
          errorMessage =
            'Password should not contain sequences like "abc" or "6543".';
          break;
        }
      }
    }

    return errorMessage;
  }
  var formSubmitted = false;
  var passwordPrimary = document.querySelector(".passwords-input-primary");
  var passwordConfirm = document.querySelector(".passwords-input-confirm");

  var passwordPrimaryInput;
  var passwordConfirmInput;

  if (passwordPrimary && passwordConfirm) {
    passwordPrimaryInput = passwordPrimary.querySelector("input");
    passwordConfirmInput = passwordConfirm.querySelector("input");
  }

  var modalSaveBtns = document.querySelectorAll(".modal .modal-btn.save");
  console.log("modalSaveBtns", modalSaveBtns);

  modalSaveBtns.forEach((saveBtn) => {
    saveBtn.addEventListener("click", function (e) {
      e.preventDefault();
      formSubmitted = true;

      if (
        passwordConfirmInput &&
        passwordPrimaryInput &&
        passwordPrimaryInput?.value?.length > 0
      ) {
        var formValid = true;
        var errorMsg = validatePassword(passwordPrimaryInput.value);
        var errorEl = passwordPrimary.querySelector(".error_message");
        if (errorEl) {
          errorEl.textContent = errorMsg;
        }

        var confirmErrEl = passwordConfirm.querySelector(".error_message");

        if (passwordConfirmInput.value !== passwordPrimaryInput.value) {
          passwordConfirmInput.classList.add("croucher_input_invalid");
          confirmErrEl.textContent = "Passwords do not match.";
          formValid = false;
        } else {
          passwordConfirmInput.classList.remove("croucher_input_invalid");
        }

        if (errorMsg) {
          passwordPrimaryInput.classList.add("croucher_input_invalid");
          formValid = false;
        }

        if (formValid) {
          console.log("submitted");
          passwordPrimaryInput.classList.remove("croucher_input_invalid");
          var form = this.closest("form");
          var modal = saveBtn.closest(".modal");
          closeModal(modal.id);
          if (form) {
            form.submit();
          }
        }
      } else {
        var form = this.closest("form");
        var formValid = true;

        // Validate the email input
        var emailInput = form.querySelector('input[type="email"]');
        if (emailInput) {
          var emailValue = emailInput.value.trim();
          formValid = validateEmail(emailValue);
        }

        if (formValid) {
          if (form) {
            fetch(form.action, {
              method: form.method,
              headers: {
                "X-Requested-With": "XMLHttpRequest",
              },
              body: new FormData(form),
            })
              .then(async (response) => {
                const modal = saveBtn.closest(".modal");
                const backdrop = document.querySelector(".modal-backdrop");

                // Safely attempt to read JSON only if the server says it's JSON
                const contentType = response.headers.get("content-type") || "";
                const isJson = contentType.includes("application/json");

                if (!isJson) {
                  // Not JSON? Page probably returned HTML, reload
                  window.location.reload();
                  return;
                }

                let data = {};
                try {
                  data = await response.json();
                } catch (e) {
                  console.warn("JSON parse failed, reloading page.");
                  window.location.reload();
                  return;
                }

                if (!response.ok) {
                  // ❌ FAILURE: Show error message
                  const validate_email = data.validate_email;

                  if (validate_email) {
                    const newEmails = document.querySelectorAll(".new-email");
                    newEmails.forEach((emailField) => {
                      emailField.remove();
                    });
                  }

                  const errorMessage =
                    data.error_message ||
                    "Something went wrong. Please try again.";

                  const flashes = document.getElementById("flashes");
                  if (flashes) {
                    flashes.innerHTML = `
                      <p class="alert ready unexpandable" style="display: block; grid-row-end: span 2;">
                        <a href="#" class="closer timezone-flash-close" onclick="this.parentElement.style.display='none'; return false;">close</a>
                        ${errorMessage}
                      </p>
                    `;
                  }

                  console.log("This is error message:", errorMessage);
                } else {
                  // ✅ SUCCESS
                  if (data.redirect_url) {
                    window.location.href = data.redirect_url;
                    return;
                  }

                  const flashes = document.getElementById("flashes");
                  if (flashes) {
                    flashes.innerHTML = "";
                  }
                }

                form.reset();
                removeClassName(backdrop, "show");
                removeClassName(modal, "modal-open");
                callLater(() => backdrop.remove(), 100);
              })
              .catch((error) => {
                // 💥 Network failure or fetch threw unexpectedly
                console.error("Fetch error:", error);

                const flashes = document.getElementById("flashes");
                if (flashes) {
                  flashes.innerHTML = `
                    <p class="alert ready unexpandable" style="display: block; grid-row-end: span 2;">
                      <a href="#" class="closer timezone-flash-close" onclick="this.parentElement.style.display='none'; return false;">close</a>
                      An unexpected error occurred.
                    </p>
                  `;
                }
              });
          }
        } else {
          // ✋ Invalid form: Close modal anyway
          const modal = saveBtn.closest(".modal");
          const backdrop = document.querySelector(".modal-backdrop");
          removeClassName(backdrop, "show");
          removeClassName(modal, "modal-open");
          callLater(() => backdrop.remove(), 100);
        }
        // Function to validate email
        function validateEmail(email) {
          var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        }
      }
    });
  });

  if (
    passwordPrimaryInput &&
    passwordConfirmInput &&
    passwordPrimaryInput?.value?.length > 0
  ) {
    passwordPrimaryInput.addEventListener("input", function (e) {
      var value = this.value;
      var confirmErrEl = passwordConfirm.querySelector(".error_message");
      if (value === passwordConfirmInput.value) {
        confirmErrEl.textContent = "";
      } else {
        confirmErrEl.textContent = "Passwords do not match.";
      }
      if (!formSubmitted) return;
      var errorMsg = validatePassword(value);
      var errorEl = passwordPrimary.querySelector(".error_message");
      errorEl.textContent = errorMsg;
      if (errorMsg) {
        passwordPrimaryInput.classList.add("croucher_input_invalid");
      } else {
        passwordPrimaryInput.classList.remove("croucher_input_invalid");
      }
    });

    passwordConfirmInput.addEventListener("input", function (e) {
      var value = this.value;
      var errorMsg =
        this.value !== passwordPrimaryInput.value
          ? "Passwords do not match."
          : "";
      var errorEl = passwordConfirm.querySelector(".error_message");
      errorEl.textContent = errorMsg;
      if (errorMsg) {
        passwordConfirmInput.classList.add("croucher_input_invalid");
      } else {
        passwordConfirmInput.classList.remove("croucher_input_invalid");
      }
    });
  }

  /**
   * -------------------------------
   * ---- END: Password validation for Account Settings
   * -----------------------------
   */

  /**
   * --------------------------
   * --- START: Accordion
   * --------------------------
   */
  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".standard-accordion-title").forEach((header) => {
      header.addEventListener("click", function () {
        const item = this.parentElement;
        item.classList.toggle("active");
      });
    });
  });
  /**
   * --------------------------
   * --- END: Accordion
   * --------------------------
   */
})();

document.addEventListener("DOMContentLoaded", function () {
  var emailField = document.getElementById("u_s_e_a");
  var passwordField = document.getElementById("u_s_p_f");

  const hostname = window.location.hostname;
  const subdomain = hostname.split(".")[0];
  const currentPath = window.location.pathname;

  if (
    !(
      subdomain === "wiki" ||
      subdomain === "wikis" ||
      currentPath.endsWith("/sign_in")
    )
  ) {
    // Disable and hide fields if subdomain is not 'wiki' or 'wikis' or 'sign in page'
    if (emailField) {
      emailField.setAttribute("disabled", "true");
      emailField.style.display = "none";
    }

    if (passwordField) {
      passwordField.setAttribute("disabled", "true");
      passwordField.style.display = "none";
    }
  }
});

/**
 * START: Dropdown
 */

document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".croucher_dropdown");

  dropdowns.forEach((p) => {
    const selectBox = p.querySelector(".croucher_dropdown_button");
    const optionsList = p.querySelector(".croucher_dropdown_list");
    const selectedOptionsContainer = p.querySelector(
      ".croucher_dropdown_selected"
    );
    const selectedValuesInput = p.querySelector(".selected-values");

    const toggleOptionsList = () => {
      optionsList.style.display =
        optionsList.style.display === "block" ? "none" : "block";
    };

    const updateSelectedOptions = () => {
      const selectedOptions = Array.from(
        optionsList.querySelectorAll(".selected")
      ).map((option) => option.dataset.value);

      selectedOptionsContainer.innerHTML = selectedOptions
        .map((value, idx) => {
          let v = idx !== selectedOptions.length - 1 ? `${value},` : `${value}`;
          return v;
        })
        .join("");

      selectedValuesInput.value = selectedOptions.join(",");
    };

    const handleOptionClick = (event) => {
      const option = event.target;
      const li = option.closest("li");

      if (li.classList.contains("selected")) {
        li.classList.remove("selected");
      } else {
        li.classList.add("selected");
      }

      updateSelectedOptions();
    };

    const handleRemoveClick = (event) => {
      if (event.target.classList.contains("remove")) {
        const valueToRemove = event.target.parentElement.textContent.slice(
          0,
          -1
        );
        const option = optionsList.querySelector(
          `[data-value="${valueToRemove}"]`
        );
        option.classList.remove("selected");
        updateSelectedOptions();
      }
    };

    selectBox.addEventListener("click", toggleOptionsList);
    optionsList.addEventListener("click", handleOptionClick);
    selectedOptionsContainer.addEventListener("click", handleRemoveClick);

    document.addEventListener("click", (event) => {
      if (!selectBox.contains(event.target)) {
        optionsList.style.display = "none";
      }
    });
  });
});
/**
 * END: Dropdown
 */

// document.addEventListener("click", function (e) {
//   const modalContainer = document.querySelector(".standard-modal-container");
//   const overlay = document.querySelector(".standard-modal-overlay");

//   if (!modalContainer || !overlay) return;

//   // If modal open and click is to the overlay (outside container)
//   if (overlay.classList.contains("active") && !modalContainer.contains(e.target)) {
//     // Close modal
//     overlay.classList.remove("active");
//     modalContainer.classList.remove("active");
//     document.querySelector(".popup").style.display = "none"; // optional
//   }
// });
