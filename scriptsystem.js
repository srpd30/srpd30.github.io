window.addEventListener("scroll", () => {
  const rotX3d = window.scrollY * 0.25;
  document.documentElement.style.setProperty("--rotX3d", rotX3d + "deg");
});


function updateViewportVars() {
  const root = document.documentElement;

  root.style.setProperty("--window-width", window.innerWidth + "px");
  root.style.setProperty("--window-height", window.innerHeight + "px");
  root.style.setProperty("--scrollXport", window.scrollX + "px");
  root.style.setProperty("--scrollYport", window.scrollY + "px");
}

window.addEventListener("resize", updateViewportVars);
window.addEventListener("scroll", updateViewportVars);

updateViewportVars();
