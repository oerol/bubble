import "./App.css";
import React, { useEffect, useRef, useState } from "react";

interface BoxState {
  id: string;
  height: number;
}

const App: React.FC = () => {
  const boxElement = useRef<HTMLDivElement>(null);
  /* const [boxes, setBoxes] = useState<BoxState | undefined>(undefined); */
  const [boxes, setBoxes] = useState<BoxState[]>([]);

  useEffect(() => {
    setBoxes([{ id: "1", height: 1 }]);

    document.addEventListener("mouseup", releaseDrag);
    (document.getElementById("box") as HTMLDivElement).addEventListener("mouseup", releaseDrag);
  }, []);

  const handleBoxMove = (e: React.MouseEvent<HTMLElement>) => {
    const node = e.target as HTMLElement;
    let rect = node.getBoundingClientRect();
    let y = e.clientY - rect.top;
    if (y > node.offsetHeight - 10) {
      node.style.cursor = "ns-resize";
    } else if (!document.onmousemove) {
      // if mouse is pressed down
      node.style.cursor = "default";
    }
  };

  const handleBoxDrag = (e: React.MouseEvent<HTMLElement>) => {};

  const handleBoxMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    const node = e.target as HTMLElement;

    document.onmousemove = (e: MouseEvent) => {
      dragBox(e, node);
    };
  };
  const dragBox = (e: MouseEvent, node: HTMLElement) => {
    console.log(node);
    let rect = node.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    document.body.style.cursor = "ns-resize";
    let height = Math.floor(y / 30) + 1;
    if (y > 21 && height <= 31) {
      /* 9 pixel less than original css size */
      node.style.height = `${height * 30}px`;
    }
  };

  const releaseDrag = (e: MouseEvent | React.MouseEvent<HTMLElement>) => {
    document.onmouseup = null;
    document.onmousemove = null;
    document.body.style.cursor = "default";
  };

  const addBox = () => {
    let copyBoxes = [...boxes];
    let newId = String(parseInt(copyBoxes[copyBoxes.length - 1].id) + 1);

    copyBoxes.push({ id: newId, height: 1 });
    setBoxes(copyBoxes);
  };

  return (
    <div className="App">
      <div id="box-holder">
        <div
          id="box"
          className="box"
          onMouseMove={handleBoxMove}
          onDrag={handleBoxDrag}
          onMouseDown={handleBoxMouseDown}
          onMouseUp={releaseDrag}
          ref={boxElement}
        ></div>
        {boxes.map((box) => {
          return (
            <div
              className="box box-violet"
              onMouseMove={handleBoxMove}
              onDrag={handleBoxDrag}
              onMouseDown={handleBoxMouseDown}
              onMouseUp={releaseDrag}
            ></div>
          );
        })}
      </div>
      <button onClick={addBox}>add</button>
    </div>
  );
};

export default App;
