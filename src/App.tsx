import "./App.css";
import React, { useEffect, useRef } from "react";

function App() {
  const boxElement = useRef<HTMLDivElement>(null);
  let positionElement: HTMLDivElement;

  useEffect(() => {});

  const handleBoxMove = (e: React.MouseEvent<HTMLElement>) => {
    let rect = boxElement.current!.getBoundingClientRect();
    let y = e.clientY - rect.top;
    if (y > boxElement.current!.offsetHeight - 10) {
      boxElement.current!.style.cursor = "ns-resize";
    } else {
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

    /* positionElement = document.getElementById("position") as HTMLDivElement; */
    /* positionElement.innerText = `x: ${x}, y: ${y}`; */

    boxElement.current!.style.height = `${e.clientY}px`;
  };

  const handleBoxMouseUp = (e: React.MouseEvent<HTMLElement>) => {
    document.onmouseup = null;
    document.onmousemove = null;
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
