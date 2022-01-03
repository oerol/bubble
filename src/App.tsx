import "./App.css";
import React, { useEffect, useState } from "react";
import DayPlanner from "./components/DayPlanner";
import CurrentDate from "./components/CurrentDate";

const App: React.FC = () => {
  const [isShown, setIsShown] = useState(false); // Context-Menu
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
        <div id="left-content">
          <CurrentDate />
          <div id="box-holder">
            <DayPlanner contextMenuVisible={isShown} showContextMenu={setIsShown} planned={true} />
            <DayPlanner contextMenuVisible={isShown} showContextMenu={setIsShown} planned={false} />
          </div>
        </div>
        <div id="right-content">
          <label htmlFor="new-box-name">Activity</label>
          <input type="text" id="new-box-name" placeholder="Heute lerne ich..." />
          {/*           <button onClick={addBox}>Add</button>
          <button onClick={getData}>get data</button>
          <button onClick={saveData}>save data</button> */}
        </div>
      </div>
    </div>
  );
};

export default App;
