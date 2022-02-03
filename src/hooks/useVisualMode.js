import { useState } from "react";
export default function useVisualMode(initial) {
  const [history, setHistory] = useState([initial]);

  function transition(mode, replace = false) {
    console.log("history", history, mode);
    setHistory((prev) => {
      const result = replace
        ? [...prev.slice(0, prev.length - 1), mode]
        : [...prev, mode];
      console.log("History Array", result);
      return result;
    });
  }

  function back() {
    if (history.length < 2) return;
    setHistory((prev) => [...prev.slice(0, history.length - 1)]);
  }

  return { mode: history[history.length - 1], transition, back };
}
