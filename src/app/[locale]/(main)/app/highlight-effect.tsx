"use client"

import React, { useState, useCallback } from "react"

interface CursorPosition {
  x: number
  y: number
}

export default function HighlightEffect({
  highlightColor,
}: {
  highlightColor: string
}) {
  const [cursorPosition, setCursorPosition] = useState<CursorPosition | null>(
    null
  )

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()
      setCursorPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      })
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    setCursorPosition(null)
  }, [])

  return (
    <div
      className="pointer-events-none absolute inset-0"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {cursorPosition && (
        <div
          className="pointer-events-none absolute h-64 w-64 transition-all duration-100 ease-out"
          style={{
            left: cursorPosition.x - 128,
            top: cursorPosition.y - 128,
            background: `radial-gradient(circle, ${highlightColor} 0%, rgba(0,0,0,0) 70%)`,
          }}
        />
      )}
    </div>
  )
}
