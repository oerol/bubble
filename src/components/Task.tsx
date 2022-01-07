import React, { useState, useEffect } from "react";
import axios from "axios";

import "../App.css";

interface TaskProps {
  activeBox: string;
}

interface TaskState {
  bubble: string;
  id: number;
  title: string;
  checked: boolean;
  tags: string[];
}

const Task: React.FC<TaskProps> = ({ activeBox }) => {
  const [tasks, setTasks] = useState<TaskState[]>([]);
  useEffect(() => {
    setTasks([
      { bubble: "box-2", id: 1, title: "kill sponge", checked: false, tags: [] },
      { bubble: "box-3", id: 2, title: "kill pat", checked: false, tags: [] },
    ]);
  }, []);
  const addTask = () => {
    let id = tasks[tasks.length - 1].id + 1;
    let title = (document.getElementById("input-task") as HTMLInputElement)!.value;
    let newTask = { bubble: activeBox, id: id, title, checked: false, tags: [] };
    setTasks([...tasks, newTask]);
  };
  const checkChecked = (id: number) => {
    let taskIndex = tasks.findIndex((task) => task.id === id);
    let copy = [...tasks];
    copy[taskIndex].checked = !copy[taskIndex].checked;
    setTasks(copy);
  };
  const saveTasks = () => {
    axios
      .post("http://localhost:3001/task", {
        tasks: tasks,
      })
      .then((response) => {})
      .catch(() => {
        console.log("Fehler saveData");
      });
  };

  return (
    <React.Fragment>
      What do you have to do?
      <input type="text" id="input-task" />
      <button onClick={addTask}>add</button>
      <span onClick={saveTasks}>+</span>
      <div>
        {tasks.map((task) => {
          return (
            task.bubble === activeBox && (
              <div className="task">
                {task.title}{" "}
                <span onClick={() => checkChecked(task.id)}>{task.checked ? "x" : "o"}</span>
              </div>
            )
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default Task;
