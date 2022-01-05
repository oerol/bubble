import { useEffect, useState } from "react";
import Folder from "../folder.png";
import "../App.css";

const CurrentDate = () => {
  const [weekday, setWeekday] = useState("");
  const [day, setDay] = useState(0);
  const [wakeupTime, setWakeupTime] = useState("| Wake-Up Time: 08:00");
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  useEffect(() => {
    let day = new Date();
    let weekday = weekdays[day.getDay()];
    let dayNumber = day.getDate();
    setWeekday(weekday);
    setDay(dayNumber);
  });

  return (
    <div className="day-overview" style={{ marginBottom: 20 }}>
      <div>
        <span style={{ fontWeight: "900" }}>{weekday}</span> <span>{day}</span>{" "}
        <span>{wakeupTime}</span>
      </div>
    </div>
  );
};

export default CurrentDate;
