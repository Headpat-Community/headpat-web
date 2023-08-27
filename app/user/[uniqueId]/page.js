'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h1>hi :3</h1>
    </div>
  );
}