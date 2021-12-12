import "./App.css";
import React, { useEffect, useRef } from "react";

function App() {
  const boxElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("mouseup", handleBoxMouseUp);
    (document.getElementById("box") as HTMLDivElement).addEventListener(
      "mouseup",
      handleBoxMouseUp
    );
  });

  const handleBoxMove = (e: React.MouseEvent<HTMLElement>) => {
    let rect = boxElement.current!.getBoundingClientRect();
    let y = e.clientY - rect.top;
    if (y > boxElement.current!.offsetHeight - 10) {
      boxElement.current!.style.cursor = "ns-resize";
    } else if (!document.onmousemove) {
      // if mouse is pressed down
      boxElement.current!.style.cursor = "default";
    }
  };

  const handleBoxDrag = (e: React.MouseEvent<HTMLElement>) => {};

  const handleBoxMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    document.onmousemove = (e: MouseEvent) => {
      dragBox(e);
    };
  };
  const dragBox = (e: MouseEvent) => {
    let rect = boxElement.current!.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    document.body.style.cursor = "ns-resize";
    console.log(boxElement.current!.style.cursor);
    let height = Math.floor(y / 30) + 1;
    if (y > 21 && height <= 31) {
      /* 9 pixel less than original css size */
      boxElement.current!.style.height = `${height * 30}px`;
    }
  };

  const handleBoxMouseUp = (e: MouseEvent | React.MouseEvent<HTMLElement>) => {
    document.onmouseup = null;
    document.onmousemove = null;
    document.body.style.cursor = "default";
  };

  return (
    <div className="App">
      <div
        id="box"
        onMouseMove={handleBoxMove}
        onDrag={handleBoxDrag}
        onMouseDown={handleBoxMouseDown}
        onMouseUp={handleBoxMouseUp}
        ref={boxElement}
      ></div>
      {/* <div id="position">x: 0, y: 0</div> */}
    </div>
  );
}

export default App;
