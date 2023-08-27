"use client";
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h1>Counter: {count}</h1>
      <button onClick={handleIncrement}>Increment</button>

      <a href="https://backend.headpat.de/api/connect/discord/callback">
        {" "}
        Login with Discord
      </a>
    </div>
  );
}
