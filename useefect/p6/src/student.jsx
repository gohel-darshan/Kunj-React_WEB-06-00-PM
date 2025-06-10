import React, { use, useEffect } from 'react'

const student = () => {

    const [count,setcount]=useState(0)

    useEffect(()=>{
        fetch(`https://jsonplaceholder.typicode.com/users/${count}`)
    },[count])
  return (
    <div>
        <h1>Student Component</h1>
        <button onClick={() => setcount(count + 1)}>Increment</button>
        <p>Current Count: {count}</p>
        <button onClick={() => setcount(count - 1)}>Decrement</button>
    </div>
  )
}

export default student