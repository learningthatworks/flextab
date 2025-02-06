/**
 * ColorPicker Component
 * 
 * This component provides a color input field with a color picker and a text input
 * for manually entering color values. It's used in the TabEditor for selecting
 * various colors for the tab styling.
 */

import React from 'react'
import { Input } from "@/components/ui/input"

/**
 * Props for the ColorPicker component
 * @property {string} color - The current color value
 * @property {function} onChange - Callback function to handle color changes
 */
interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

/**
 * ColorPicker component for selecting and inputting color values
 * @param {ColorPickerProps} props - The props for the ColorPicker component
 */
export function ColorPicker({ color, onChange }: ColorPickerProps) {
  return (
    <div className="flex items-center space-x-2">
      <Input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-10 h-10 p-0 border-0"
      />
      <Input
        type="text"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="flex-grow"
      />
    </div>
  )
}

