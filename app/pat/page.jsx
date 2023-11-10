'use client'
// pages/index.js
import { useEffect, useState } from 'react';

const IndexPage = () => {
  const [counter, setCounter] = useState(0);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Establish a WebSocket connection
    const ws = new WebSocket('wss://counter.fayevr.workers.dev');

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'counterUpdate') {
        setCounter(data.value);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setSocket(ws);

    // Cleanup function to close the WebSocket connection when the component unmounts
    return () => {
      ws.close();
    };
  }, []); // Run this effect only once when the component mounts

  const handleIncrement = () => {
    // Send a message to the Cloudflare Worker to increment the counter
    socket.send(JSON.stringify({ type: 'increment' }));
  };

  const handleDecrement = () => {
    // Send a message to the Cloudflare Worker to decrement the counter
    socket.send(JSON.stringify({ type: 'decrement' }));
  };

  return (
    <div>
      <h1>Live Counter: {counter}</h1>
      <button onClick={handleIncrement}>Increment</button>
      <button onClick={handleDecrement}>Decrement</button>
    </div>
  );
};

export default IndexPage;
