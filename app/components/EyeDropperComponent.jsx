import React from 'react'
import { useEffect } from 'react'
import { FaEyeDropper } from 'react-icons/fa6'

const EyeDropperComponent = ({ setEyedropperColor }) => {
  useEffect(() => {
    if (!window.EyeDropper) {
      console.warn('EyeDropper API is not supported')
      return
    }

    const eyedropper = new EyeDropper()

    const handleClick = async () => {
      try {
        const { sRGBHex } = await eyedropper.open()
        setEyedropperColor(sRGBHex)
      } catch (error) {
        console.error(error)
      }
    }

    const button = document.getElementById('color-picker-button')
    button.addEventListener('click', handleClick)
  }, [])

  return (
    <div>
      <button
        id="color-picker-button"
        className="w-7 h-7 justify-center items-center flex bg-zinc-400 rounded-full text-sm"
      >
        <FaEyeDropper />
      </button>
    </div>
  )
}

export default EyeDropperComponent
