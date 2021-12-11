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

    /* 9 pixel less than original css size */
    if (y > 41) {
      let height = Math.floor(y / 50) + 1;
      console.log(y / 50);
      boxElement.current!.style.height = `${height * 50}px`;
    }
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
