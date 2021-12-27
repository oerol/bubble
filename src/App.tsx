import "./App.css";
import React, { useEffect, useState } from "react";

import axios from "axios";

interface BoxState {
  id: string;
  title: string;
  height: number;
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
    setBoxes([{ id: "1", title: "Schlafen", height: 1 }]);

    document.addEventListener("mouseup", releaseDrag);

    // get data
    getDay(2);
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
    let height = Math.floor(y / 30) + 1;

    if (height > getBoxHeight(node.id)) {
      if (getBoxesHeight() < 24) {
        saveBoxWidth(node, height);
        node.style.height = `${height * 30}px`;
      }
    } else if (height > 0) {
      saveBoxWidth(node, height);
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

    let boxTitle = (document.getElementById("new-box-name") as HTMLInputElement).value;

    copyBoxes.push({ id: newId, title: boxTitle, height: 1 });
    setBoxes(copyBoxes);

    document.cookie = JSON.stringify(copyBoxes);

    getData();
  };

  const colorBox = (i: number) => {
    let boxClass = "box";
    switch (i % 10) {
      case 0:
        return boxClass + " box-violet";
      case 1:
        return boxClass + " box-orange";
      case 2:
        return boxClass + " box-teal";
      case 3:
        return boxClass + " box-green";
      default:
        return boxClass;
    }
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

  const changeColor = (node: HTMLElement, newColor: string) => {
    for (let className of node.classList as any) {
      if (className.includes("box-")) {
        node.classList.remove(className);
      }
    }
    node.classList.add("box-" + newColor);
  };

  const setColor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    let node = document.getElementById("box-" + selectedBox!.id);
    for (let className of node!.classList as any) {
      if (className.includes("box-")) {
        console.log(className);
        node!.classList.remove(className);
      }
    }
    node!.classList.add("box-" + e.target.value);
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
    axios
      .post("http://localhost:3001/day", {
        weekday: 2,
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
        console.log(data[0].bubbles);
        setBoxes(data[0].bubbles);
      })
      .catch(() => {
        console.log("Fehler getData");
      });
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
                  className={colorBox(parseInt(box.id))}
                  onMouseMove={handleBoxMove}
                  onDrag={handleBoxDrag}
                  onMouseDown={handleBoxMouseDown}
                  onMouseUp={releaseDrag}
                  onContextMenu={contextMenu}
                  style={{ height: box.height * 30 + "px" }}
                >
                  {box.title}
                  <span>{box.height}:00</span>
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
