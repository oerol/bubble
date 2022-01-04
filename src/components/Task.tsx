import React, { useState, useEffect } from "react";
import "../App.css";

interface TaskState {
  bubble: string;
  id: number;
  title: string;
  checked: boolean;
}

const Task: React.FC = () => {
  const [tasks, setTasks] = useState<TaskState[]>([]);
  useEffect(() => {
    setTasks([
      { bubble: "", id: 1, title: "kill sponge", checked: false },
      { bubble: "", id: 2, title: "kill pat", checked: false },
    ]);
  }, []);
  const addTask = () => {
    let id = tasks[tasks.length - 1].id + 1;
    let title = (document.getElementById("input-task") as HTMLInputElement)!.value;
    let newTask = { bubble: "", id: id, title, checked: false };
    setTasks([...tasks, newTask]);
  };
  const checkChecked = (id: number) => {
    let taskIndex = tasks.findIndex((task) => task.id === id);
    let copy = [...tasks];
    copy[taskIndex].checked = !copy[taskIndex].checked;
    setTasks(copy);
  };
  return (
    <React.Fragment>
      What do you have to do?
      <input type="text" id="input-task" />
      <button onClick={addTask}>add</button>
      <div>
        {tasks.map((task) => {
          return (
            <div className="task">
              {task.title}{" "}
              <span onClick={() => checkChecked(task.id)}>{task.checked ? "x" : "o"}</span>
            </div>
          );
        })}
      </div>
    </React.Fragment>
  );
};

export default Task;
