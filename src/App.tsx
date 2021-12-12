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
    const node = e.target as HTMLElement;
    console.log(node.getBoundingClientRect());

    document.onmousemove = (e: MouseEvent) => {
      dragBox(e);
    };
  };
  const dragBox = (e: MouseEvent) => {
    let rect = boxElement.current!.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    document.body.style.cursor = "ns-resize";
    let height = Math.floor(y / 30) + 1;
    if (y > 21 && height <= 31) {
      /* 9 pixel less than original css size */
      setBoxes([{ id: "1", height: height }]);

      boxElement.current!.style.height = `${height * 30}px`;
    }
  };

  const handleBoxMouseUp = (e: MouseEvent | React.MouseEvent<HTMLElement>) => {
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
          onMouseUp={handleBoxMouseUp}
          ref={boxElement}
        ></div>
        {boxes.map((box) => {
          return <div className="box box-violet"></div>;
        })}
      </div>
      <button onClick={addBox}>add</button>
    </div>
  );
};

export default App;
