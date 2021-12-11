let boxElement, boxWidth, boxHeight;

function getBoxSize(boxElement) {
  boxWidth = boxElement.offsetWidth;
  boxHeight = boxElement.offsetHeight;
}

window.onload = function () {
  boxElement = document.getElementById("box");
  getBoxSize(boxElement);
  boxElement.onmousemove = (e) => {
    let rect = e.target.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    document.getElementById("position").innerText = `x: ${x}, y: ${y}`;

    if (y > boxHeight - 8) {
      boxElement.classList.add("ns-resize");
    } else {
      boxElement.classList.remove("ns-resize");
    }
  };

  boxElement.ondrag = (e) => {
    console.log(e);
  };
};
