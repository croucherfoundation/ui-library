const standardSubNavbar = document.querySelector(".navbar_sub_container");

const rows = document.querySelectorAll(".header-row");
const applicationTable = document.getElementById("applicationTable");
const handleScroll = _.throttle(() => {
  const { top } = applicationTable.getBoundingClientRect();
  if (top <= 0) {
    standardSubNavbar.style.backgroundColor = "white";
    standardSubNavbar.style.boxShadow = "0 1px 1px rgba(0,0,0,0.1)";
    // rows.forEach((row) => {
    //   const { top } = row.getBoundingClientRect();

    // });
  } else {
    standardSubNavbar.style.backgroundColor = "#f8f8f5";
    standardSubNavbar.style.boxShadow = "none"

  }
}, 400);

window.addEventListener("scroll", handleScroll, { passive: true });
