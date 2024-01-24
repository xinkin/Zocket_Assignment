'use client'
import React, { useRef, useEffect, useState } from 'react'
import { SketchPicker, CirclePicker } from 'react-color'
import template from '../utils/template.json'

class CanvasEditor {
  constructor(canvas) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')
  }

  setCanvasBackground(color) {
    this.context.fillStyle = color
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawDesignPattern(imageSrc) {
    const image = new Image()
    image.src = imageSrc
    image.onload = () => {
      this.context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height)
    }
  }

  drawMaskImage(maskImage, x, y, width, height) {
    const image = new Image()
    image.src = maskImage
    image.onload = () => {
      this.context.drawImage(image, x, y, width, height)
    }
  }

  drawUserImage(userImage, x, y, width, height) {
    const image = new Image()
    image.src = userImage
    image.onload = () => {
      this.context.drawImage(image, x, y, width, height)
    }
  }

  drawStrokeImage(maskstrokeImage, x, y, width, height) {
    const image = new Image()
    image.src = maskstrokeImage
    image.onload = () => {
      this.context.drawImage(image, x, y, width, height)
    }
  }

  drawCaption(text, x, y, fontSize, color, alignment, maxCharactersPerLine) {
    this.context.fillStyle = color
    this.context.font = `${fontSize}px Arial`
    this.context.textAlign = alignment

    const lines = this.breakTextIntoLines(text, maxCharactersPerLine)

    lines.forEach((line, index) => {
      this.context.fillText(line, x, y + index * fontSize)
    })
  }

  breakTextIntoLines(text, maxCharactersPerLine) {
    const words = text.split(' ')
    let line = ''
    let lines = []

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' '

      if (testLine.length > maxCharactersPerLine && i > 0) {
        lines.push(line.trim())
        line = words[i] + ' '
      } else {
        line = testLine
      }
    }
    lines.push(line.trim())
    return lines
  }

  drawRoundedRect(x, y, width, height, radius, color) {
    this.context.beginPath()
    this.context.fillStyle = color
    this.context.moveTo(x + radius, y)
    this.context.arcTo(x + width, y, x + width, y + height, radius)
    this.context.arcTo(x + width, y + height, x, y + height, radius)
    this.context.arcTo(x, y + height, x, y, radius)
    this.context.arcTo(x, y, x + width, y, radius)
    this.context.closePath()
    this.context.fill()
  }

  drawCTA(text, x, y, fontSize, textColor, bgColor, wrapLength = 20) {
    const textWidth = this.context.measureText(text).width
    const textHeight = fontSize

    const rectX = x - textWidth / 2 - 24
    const rectY = y - textHeight / 2 - 24

    this.drawRoundedRect(
      rectX,
      rectY,
      textWidth + 48,
      textHeight + 48,
      15,
      bgColor
    )

    this.drawCaption(
      text,
      x,
      y + fontSize / 3,
      fontSize,
      textColor,
      'center',
      wrapLength
    )
  }
}

const CanvasComponent = () => {
  const canvasRef = useRef(null)
  const [userUploadedImage, setUserUploadedImage] = useState(null)
  const [imgName, setImgName] = useState('')
  const [bgColor, setBgColor] = useState('#0369A1')
  const [lastSelectedColors, setLastSelectedColors] = useState([])
  const [toggleColorPicker, setToggleColorPicker] = useState(false)
  const [captionText, setCaptionText] = useState(template.caption.text)
  const [CTAText, setCTAText] = useState(template.cta.text)

  console.log(lastSelectedColors)
  useEffect(() => {
    const canvasEditor = new CanvasEditor(canvasRef.current)

    canvasEditor.setCanvasBackground(bgColor)

    canvasEditor.drawDesignPattern(template.urls.design_pattern)

    canvasEditor.drawMaskImage(
      template.urls.mask,
      template.image_mask.x,
      template.image_mask.y,
      template.image_mask.width,
      template.image_mask.height
    )

    canvasEditor.drawStrokeImage(
      template.urls.stroke,
      template.image_mask.x,
      template.image_mask.y,
      template.image_mask.width,
      template.image_mask.height
    )

    if (userUploadedImage) {
      canvasEditor.drawUserImage(
        userUploadedImage,
        template.image_mask.x,
        template.image_mask.y,
        template.image_mask.width,
        template.image_mask.height
      )
    }

    canvasEditor.drawCaption(
      captionText,
      template.caption.position.x,
      template.caption.position.y,
      template.caption.font_size,
      template.caption.text_color,
      template.caption.alignment,
      template.caption.max_characters_per_line
    )

    canvasEditor.drawCTA(
      CTAText,
      template.cta.position.x,
      template.cta.position.y,
      30,
      template.cta.text_color,
      template.cta.background_color
    )
  }, [userUploadedImage, bgColor, captionText, CTAText])

  const handleImageUpload = e => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onload = event => {
      setUserUploadedImage(event.target.result)
    }

    reader.readAsDataURL(file)
    setImgName(file.name)
  }

  const handleColorChange = color => {
    setBgColor(color.hex)
  }

  const handleCaptionChange = e => {
    setCaptionText(e.target.value)
  }

  const handleCTAChange = e => {
    setCTAText(e.target.value)
  }

  const updateLastSelectedColors = newColor => {
    setLastSelectedColors(prevColors => {
      const updatedColors = [...prevColors, newColor].slice(-5)
      return updatedColors
    })
  }

  const handleColorPickerClose = () => {
    setToggleColorPicker(false)
    updateLastSelectedColors(bgColor)
  }

  return (
    <div className="flex gap-40 w-3/5 justify-center">
      <canvas
        ref={canvasRef}
        id="myCanvas"
        width="1080"
        height="1080"
        style={{ width: '540px', height: '540px' }}
      ></canvas>

      <div className="flex flex-col gap-10 w-full justify-center">
        <div className="flex gap-5">
          <label className="relative text-gray-600 cursor-pointer w-fit">
            <input
              type="file"
              onChange={handleImageUpload}
              className="hidden"
            />
            <span className="bg-sky-600 py-2 text-white px-4 rounded-lg hover:bg-sky-400 transition duration-300">
              Upload Image
            </span>
          </label>
          {imgName}
        </div>

        <div className="flex flex-col">
          <div className="text-xs">Choose Your Color</div>
          <div className="flex gap-2 items-center">
            <button
              className="w-7 h-7 justify-center items-center flex bg-zinc-400 rounded-full"
              onClick={() => setToggleColorPicker(true)}
            >
              +
            </button>
            <CirclePicker
              colors={lastSelectedColors}
              onChange={handleColorChange}
            />
          </div>
        </div>

        {toggleColorPicker && (
          <div className="absolute z-10 flex flex-col bg-white rounded-lg gap-2 ">
            <SketchPicker color={bgColor} onChange={handleColorChange} />
            <button
              className="bg-sky-600 py-1 text-white text-sm px-2 rounded-lg hover:bg-sky-400 transition duration-300"
              onClick={handleColorPickerClose}
            >
              Done
            </button>
          </div>
        )}
        <div>
          <div className="text-xs">Enter Caption</div>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            type="text"
            placeholder="Enter caption text"
            value={captionText}
            onChange={handleCaptionChange}
          />
        </div>
        <div>
          <div className="text-xs">Enter CTA</div>
          <input
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
            type="text"
            placeholder="Enter CTA text"
            value={CTAText}
            onChange={handleCTAChange}
          />
        </div>
      </div>
    </div>
  )
}

export default CanvasComponent
