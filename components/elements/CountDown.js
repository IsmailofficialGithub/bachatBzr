"use client";
import { useEffect, useState } from "react";

const msInSecond = 1000;
const msInMinute = 60 * msInSecond;
const msInHour = 60 * msInMinute;
const msInDay = 24 * msInHour;

const getPartsofTimeDuration = (duration) => {
  const days = Math.floor(duration / msInDay);
  const hours = Math.floor((duration % msInDay) / msInHour);
  const minutes = Math.floor((duration % msInHour) / msInMinute);
  const seconds = Math.floor((duration % msInMinute) / msInSecond);
  return { days, hours, minutes, seconds };
};

const Countdown = ({ endDateTime }) => {
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    const now = Date.now();
    setTimeRemaining(Math.max(new Date(endDateTime).getTime() - now, 0));

    const interval = setInterval(() => {
      setTimeRemaining((prev) => Math.max(prev - 1000, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [endDateTime]);

  if (timeRemaining === null) {
    return null; // Prevents hydration mismatch
  }

  const timeParts = getPartsofTimeDuration(timeRemaining);

  return (
    <div className="countdown" style={{display:"flex",flexDirection:"row"}}>
      <span className="cdown days">
        <span className="time-count">{timeParts.days}</span>
        <p>Days</p>
      </span>
      <span className="cdown hour">
        <span className="time-count">{timeParts.hours}</span>
        <p>Hours</p>
      </span>
      <span className="cdown minutes">
        <span className="time-count">{timeParts.minutes}</span>
        <p>Minutes</p>
      </span>
      <span className="cdown second">
        <span className="time-count">{timeParts.seconds}</span>
        <p>Seconds</p>
      </span>
    </div>
  );
};

export default Countdown;
