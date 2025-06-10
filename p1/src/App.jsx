import React from 'react'

const App = () => {

    let Student = ["std1", "std2", "std3", "std4", "std5"];
    return (
    <>
    {Student.forEach((e, index) => {
        console.log(e);
    })}
    </>

  )
}

export default App
