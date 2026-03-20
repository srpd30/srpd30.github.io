
function updateRandom() {
  document.documentElement.style.setProperty(
    "--rand",
    Math.random() / 3
  );
}

// update terus (real-time)
setInterval(updateRandom, .5);