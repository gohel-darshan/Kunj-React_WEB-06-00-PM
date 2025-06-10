import { useState } from 'react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
function App() {

  // count hai instilation
  // setCount hai function jo count ko update karta hai
  // useState hook hai jo state ko manage karta hai

  const [count, setCount] = useState(0)



  return (
    <>
      <button onClick={() => setCount(count + 1)}> +</button>
      <p>{count}</p>
      <button onClick={() => setCount(count > 0 ? count - 1 : 0)}> -</button><br />

      <button onClick={() => setCount(0)}> Reset</button>           
      
    </>
  )
}

export default App
