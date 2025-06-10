import React from 'react'
import { useState } from 'react'

const Button = ({n2}) => {

const [theme,setTheme] = useState("light")
const handlein = (() => {
    setTheme(theme == "light" ? "dark" : "light")
})           
  return (
    <button onClick={handlein}>{theme}  {n2}</button>
  )
}

export default Button