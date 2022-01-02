import "./App.css";
import React, { useEffect, useState } from "react";

import axios from "axios";

interface BoxState {
  id: string;
  title: string;
  height: number;
  color: string;
}
/**
 * * I was in love in my tutor.
 * ! Don't kill an innocent soul
 * ? Is this really worth it
 * TODO: Prevent add to go over the height limit
 *
 */
const App: React.FC = () => {
  const [boxes, setBoxes] = useState<BoxState[]>([]);
  const [isShown, setIsShown] = useState(false); // Context-Menu
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedBox, setSelectedBox] = useState<BoxState>();

  useEffect(() => {
    setBoxes([{ id: "1", title: "Schlafen", height: 1, color: "green" }]);

    document.addEventListener("mouseup", releaseDrag);

    // get data
    getDay(0);
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
    let rect = node.getBoundingClientRect();
    let y = e.clientY - rect.top;

    if (y > node.offsetHeight - 10) {
      node.style.cursor = "ns-resize";
      document.onmousemove = (e: MouseEvent) => {
        dragBox(e, node);
      };
    }
  };
  const dragBox = (e: MouseEvent, node: HTMLElement) => {
    let rect = node.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    document.body.style.cursor = "ns-resize";
    let height = Math.floor(y / 20) + 1;

    if (height > getBoxHeight(node.id)) {
      if (getBoxesHeight() < 36) {
        saveBoxWidth(node, height);
        node.style.height = `${height * 20}px`;
      }
    } else if (height > 0) {
      saveBoxWidth(node, height);
      node.style.height = `${height * 20}px`;
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

    let boxTitle = (document.getElementById("new-box-name") as HTMLInputElement).value;

    copyBoxes.push({ id: newId, title: boxTitle, height: 1, color: "" });
    setBoxes(copyBoxes);

    document.cookie = JSON.stringify(copyBoxes);

    getData();
  };

  const colorBox = (color: string) => {
    let boxClass = "box";

    return boxClass + " " + color;
  };

  const saveBoxWidth = (node: HTMLElement, height: number) => {
    const position = boxes.findIndex((box) => node.id === "box-" + box.id);
    let copyBoxes = [...boxes];
    copyBoxes[position].height = height;
    setBoxes(copyBoxes);
  };

  const getBoxesHeight = () => {
    let height = 0;
    for (let box of boxes) {
      height += box.height;
    }
    console.log(height);
    return height;
  };

  const getBoxHeight = (id: string) => {
    const currentBox = boxes.find((box) => id === "box-" + box.id);
    return currentBox!.height;
  };

  const contextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    const node = e.target as HTMLElement;
    setSelectedBox(boxes.find((box) => node.id === "box-" + box.id));

    e.preventDefault();
    setIsShown(false);
    const newPosition = {
      x: e.pageX,
      y: e.pageY,
    };

    setPosition(newPosition);
    setIsShown(true);
    /*let setBoxNameElement = document.getElementById("set-new-name") as HTMLInputElement;
     setBoxNameElement.value = ""; */
  };
  // Hide the custom context menu
  const hideContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    const node = e.target as HTMLInputElement;
    // Prevent Context-Menu from disappearing when clicking the <input> element
    if (!node.classList.contains("stay-active")) {
      setIsShown(false);
    }
  };

  const removeBox = (e: React.MouseEvent<HTMLDivElement>) => {
    let copyBoxes = [...boxes];
    copyBoxes = copyBoxes.filter((box) => box !== selectedBox);
    setBoxes(copyBoxes);
  };
  const changeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const node = e.target as HTMLInputElement;
    let copyBoxes = [...boxes];
    let index = copyBoxes.indexOf(selectedBox!);
    let copySelectedBox = selectedBox;
    copySelectedBox!.title = node.value;

    setSelectedBox(copySelectedBox);
    copyBoxes[index] = copySelectedBox!;
    setBoxes(copyBoxes);
  };

  const setColor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let node = document.getElementById("box-" + selectedBox!.id);
    let newColor = "box-" + e.target.value;
    for (let className of node!.classList as any) {
      if (className.includes("box-")) {
        console.log(className);
        node!.classList.remove(className);
      }
    }
    node!.classList.add(newColor);

    let copyBoxes = [...boxes];
    let currentBoxIndex = copyBoxes.findIndex((element) => element.id === selectedBox!.id);
    copyBoxes[currentBoxIndex].color = newColor;
    setBoxes(copyBoxes);
  };

  const getData = () => {
    axios
      .get("http://localhost:3001/all-days")
      .then((response) => {
        const data = response.data;
        console.log(data);
      })
      .catch(() => {
        console.log("Fehler getData");
      });
  };
  const saveData = () => {
    let date = new Date();
    axios
      .post("http://localhost:3001/day", {
        weekday: date.getDay(),
        bubbles: boxes,
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
      })
      .catch(() => {
        console.log("Fehler getData");
      });
  };

  const getDay = (weekday: number) => {
    axios
      .get("http://localhost:3001/get-day/" + weekday)
      .then((response) => {
        const data = response.data;
        console.log(data[data.length - 1].bubbles);
        setBoxes(data[data.length - 1].bubbles);
      })
      .catch(() => {
        console.log("Fehler getData");
      });
  };
  const getBoxTime = (height: number) => {
    let hours = Math.floor(height / 2);
    return height % 2 === 0 ? `${hours}:00` : `${hours}:30`;
  };
  return (
    <div className="App" onClick={hideContextMenu}>
      <div id="main">
        <div id="left-content">
          <div id="box-holder">
            {boxes.map((box, i) => {
              return (
                <div
                  key={i}
                  id={"box-" + box.id}
                  className={colorBox(box.color)}
                  onMouseMove={handleBoxMove}
                  onDrag={handleBoxDrag}
                  onMouseDown={handleBoxMouseDown}
                  onMouseUp={releaseDrag}
                  onContextMenu={contextMenu}
                  style={{ height: box.height * 20 + "px" }}
                >
                  {box.title}
                  <span>{getBoxTime(box.height)}</span>
                </div>
              );
            })}
          </div>
          {isShown && (
            <div style={{ top: position.y, left: position.x }} className="custom-context-menu">
              <div className="option" onClick={removeBox}>
                Löschen
              </div>
              <input
                className="option stay-active"
                type="text"
                onChange={changeTitle}
                placeholder="Nicht Schlafen"
                id="set-new-name"
                value={selectedBox?.title}
              />
              <select className="option stay-active" id="change-color" onChange={setColor}>
                <option value="blue">blue</option>
                <option value="orange">orange</option>
                <option value="red">red</option>
                <option value="grey">grey</option>
                <option value="green">green</option>
                <option value="gray">gray</option>
              </select>
            </div>
          )}
        </div>
        <div id="right-content">
          <label htmlFor="new-box-name">Activity</label>
          <input type="text" id="new-box-name" placeholder="Heute lerne ich..." />
          <button onClick={addBox}>Add</button>
          <button onClick={getData}>get data</button>
          <button onClick={saveData}>save data</button>
        </div>
      </div>
    </div>
  );
};

export default App;
