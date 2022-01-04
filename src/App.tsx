import "./App.css";
import React, { useEffect, useState } from "react";
import DayPlanner from "./components/DayPlanner";
import CurrentDate from "./components/CurrentDate";
import Task from "./components/Task";

const App: React.FC = () => {
  const [isShown, setIsShown] = useState(false); // Context-Menu
  const [activeBox, setActiveBox] = useState("");
  const hideContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    const node = e.target as HTMLInputElement;
    // Prevent Context-Menu from disappearing when clicking the <input> element
    if (!node.classList.contains("stay-active")) {
      setIsShown(false);
    }
  };

  return (
    <div className="App" onClick={hideContextMenu}>
      <div id="main">
        <CurrentDate />

        <div id="planned-day">
          <span>Your Plan for Today:</span>
          <DayPlanner
            contextMenuVisible={isShown}
            showContextMenu={setIsShown}
            planned={true}
            globalActiveBox={setActiveBox}
          />
        </div>
        <div id="actual-day">
          <span>Your Day so far:</span>
          <DayPlanner
            contextMenuVisible={isShown}
            showContextMenu={setIsShown}
            planned={false}
            globalActiveBox={setActiveBox}
          />
        </div>
        <div id="tasks">
          <Task activeBox={activeBox} />
        </div>
        {/*         <div id="right-content">
          <label htmlFor="new-box-name">Activity</label>
          <input type="text" id="new-box-name" placeholder="Heute lerne ich..." />
                     <button onClick={addBox}>Add</button>
          <button onClick={getData}>get data</button>
          <button onClick={saveData}>save data</button> 
        </div> */}
      </div>
    </div>
  );
};

export default App;
