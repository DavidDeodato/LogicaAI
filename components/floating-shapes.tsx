"use client"

import { useEffect, useState } from "react"

interface Shape {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  rotationSpeed: number
  floatSpeed: number
  type: "hexagon" | "triangle" | "diamond" | "circle"
  opacity: number
}

export function FloatingShapes() {
  const [shapes, setShapes] = useState<Shape[]>([])

  useEffect(() => {
    const newShapes: Shape[] = []
    const shapeTypes: Shape["type"][] = ["hexagon", "triangle", "diamond", "circle"]

    for (let i = 0; i < 8; i++) {
      newShapes.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 40 + 15, // Tamanhos menores
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1, // Rotação mais lenta
        floatSpeed: Math.random() * 0.3 + 0.1, // Movimento mais lento
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        opacity: Math.random() * 0.15 + 0.05, // Muito mais sutil
      })
    }

    setShapes(newShapes)
  }, [])

  useEffect(() => {
    const animateShapes = () => {
      setShapes((prevShapes) =>
        prevShapes.map((shape) => ({
          ...shape,
          rotation: shape.rotation + shape.rotationSpeed,
          y: shape.y + shape.floatSpeed,
          // Reset position when shape goes off screen
          ...(shape.y > window.innerHeight + shape.size && {
            y: -shape.size,
            x: Math.random() * window.innerWidth,
          }),
        })),
      )
    }

    const interval = setInterval(animateShapes, 100) // Animação mais lenta
    return () => clearInterval(interval)
  }, [])

  const renderShape = (shape: Shape) => {
    const style = {
      position: "absolute" as const,
      left: shape.x,
      top: shape.y,
      width: shape.size,
      height: shape.size,
      transform: `rotate(${shape.rotation}deg)`,
      opacity: shape.opacity,
      pointerEvents: "none" as const,
    }

    const strokeStyle = {
      stroke: "#F59E0B",
      strokeWidth: 0.8,
      fill: "none",
      filter: "drop-shadow(0 0 2px rgba(245, 158, 11, 0.2))",
    }

    switch (shape.type) {
      case "hexagon":
        return (
          <div key={shape.id} style={style}>
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <polygon points="50,5 85,25 85,75 50,95 15,75 15,25" style={strokeStyle} />
            </svg>
          </div>
        )

      case "triangle":
        return (
          <div key={shape.id} style={style}>
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <polygon points="50,10 90,90 10,90" style={strokeStyle} />
            </svg>
          </div>
        )

      case "diamond":
        return (
          <div key={shape.id} style={style}>
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <polygon points="50,10 90,50 50,90 10,50" style={strokeStyle} />
            </svg>
          </div>
        )

      case "circle":
        return (
          <div key={shape.id} style={style}>
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" style={strokeStyle} />
            </svg>
          </div>
        )

      default:
        return null
    }
  }

  return <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">{shapes.map(renderShape)}</div>
}
