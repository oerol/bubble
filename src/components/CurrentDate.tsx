import { useEffect, useState } from "react";

const CurrentDate = () => {
  const [weekday, setWeekday] = useState("");
  const [day, setDay] = useState(0);
  const weekdays = ["Sunday", "Monday"];
  useEffect(() => {
    let day = new Date();
    let weekday = weekdays[day.getDay()];
    let dayNumber = day.getDate();
    setWeekday(weekday);
    setDay(dayNumber);
  });

  return (
    <div style={{ marginBottom: 5 }}>
      <span style={{ fontWeight: "900" }}>{weekday}</span> <span>{day}</span>
    </div>
  );
};

export default CurrentDate;
