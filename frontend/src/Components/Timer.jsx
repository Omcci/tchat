import { useEffect } from "react";

function Timer({ time, setCounter }) {
  useEffect(() => {
    const timer = time > 0 && setInterval(() => setCounter(time - 1), 1000);
    return () => clearInterval(timer);
  }, [time]);

  return (
    <div>
      <div className="textTimer"> {time} s</div>
    </div>
  );
}

export default Timer;
