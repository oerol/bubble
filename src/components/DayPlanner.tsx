import "../App.css";
import React, { SetStateAction, useEffect, useState } from "react";

import axios from "axios";
import { setConstantValue } from "typescript";
import { start } from "repl";

interface BoxState {
  id: string;
  title: string;
  height: number;
  color: string;
}

type DayPlannerProps = {
  contextMenuVisible: boolean;
  planned: boolean;
  showContextMenu: React.Dispatch<React.SetStateAction<boolean>>;
};
const DayPlanner: React.FC<DayPlannerProps> = ({
  contextMenuVisible,
  planned,
  showContextMenu,
}) => {
  const [boxes, setBoxes] = useState<BoxState[]>([]);
  const [isShown, setIsShown] = useState(false); // Context-Menu
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedBox, setSelectedBox] = useState<BoxState>();
  const [activeBox, setActiveBox] = useState("");

  const startTime = 8;

  useEffect(() => {
    setBoxes([
      { id: "1", color: "red", height: 2, title: "SLEEP" },
      { id: "2", color: "red", height: 2, title: "EAT" },
    ]);
    document.addEventListener("mouseup", releaseDrag);
    getDay(1);
    console.log(showContextMenu);
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
      if (getBoxesHeight() < 32) {
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
    showContextMenu(false);
    const newPosition = {
      x: e.pageX,
      y: e.pageY,
    };

    setPosition(newPosition);
    showContextMenu(true);
  };
  // Hide the custom context menu
  const hideContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    const node = e.target as HTMLInputElement;
    // Prevent Context-Menu from disappearing when clicking the <input> element
    if (!node.classList.contains("stay-active")) {
      showContextMenu(false);
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
        planned: planned,
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
    if (planned) {
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
    } else {
      axios
        .get("http://localhost:3001/get-actual-day/" + weekday)
        .then((response) => {
          const data = response.data;
          console.log(data);
          console.log(data[data.length - 1].bubbles);
          setBoxes(data[data.length - 1].bubbles);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  const getBoxTime = (height: number) => {
    let hours = Math.floor(height / 2);
    return height % 2 === 0 ? `${hours}:00` : `${hours}:30`;
  };
  const getBoxDuration = (id: number) => {
    let heightSum = 0;
    for (let i = 0; i < id; i++) {
      heightSum += boxes[i].height;
    }
    let startBox = startTime + heightSum * 0.5;
    let endBox = startBox + boxes[id].height * 0.5;
    let startBoxText, endBoxText;
    if (endBox % 1 === 0) {
      endBoxText = endBox + ":00";
    } else {
      endBoxText = Math.floor(endBox) + ":30";
    }

    console.log(startBox, startBoxText);
    startBox % 1 === 0
      ? (startBoxText = startBox + ":00")
      : (startBoxText = Math.floor(startBox) + ":30");

    console.log(startBox, startBoxText);
    return `${startBoxText} - ${endBoxText}`;
  };

  const activateBox = (e: React.MouseEvent<HTMLDivElement>) => {
    let node = e.target as HTMLDivElement;

    if (node.id === activeBox) {
      setActiveBox("");
    }
    let boxElement = document.getElementById(activeBox);

    if (boxElement) {
      boxElement.classList.remove("box-active");
      if (boxElement.id === node.id) {
        setActiveBox("");
        return;
      }
    }
    setActiveBox(node.id);
    node.classList.add("box-active");
  };
  return (
    <div className="App" onClick={hideContextMenu}>
      {boxes.map((box, i) => {
        return (
          <div
            key={i}
            id={"box-" + box.id}
            className={colorBox(box.color)}
            onMouseMove={handleBoxMove}
            onMouseDown={handleBoxMouseDown}
            onMouseUp={releaseDrag}
            onContextMenu={contextMenu}
            onClick={activateBox}
            style={{ height: box.height * 20 + "px" }}
          >
            {box.title}
            <span className="box-time-length">{getBoxTime(box.height)}</span>
            {box.height > 1 && <span className="box-time">{getBoxDuration(i)}</span>}
          </div>
        );
      })}
      <div onClick={saveData}>+</div>

      {contextMenuVisible && (
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
            <option value="green">green</option>
            <option value="gray">gray</option>
            <option value="purple">purple</option>
            <option value="yellow">yellow</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default DayPlanner;
