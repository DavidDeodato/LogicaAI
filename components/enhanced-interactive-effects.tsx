"use client"

import { useEffect, useState } from "react"

export function EnhancedInteractiveEffects() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [clickRipples, setClickRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleClick = (e: MouseEvent) => {
      const newRipple = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      }
      setClickRipples((prev) => [...prev, newRipple])

      // Remove ripple após animação
      setTimeout(() => {
        setClickRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id))
      }, 1000)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("click", handleClick)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleClick)
    }
  }, [])

  return (
    <>
      {/* Efeito de clique - ripples dourados */}
      {clickRipples.map((ripple) => (
        <div
          key={ripple.id}
          className="fixed pointer-events-none z-40"
          style={{
            left: ripple.x - 25,
            top: ripple.y - 25,
          }}
        >
          <div className="w-12 h-12 border-2 border-primary/50 rounded-full animate-ping" />
          <div
            className="w-6 h-6 bg-primary/30 rounded-full animate-ping absolute top-3 left-3"
            style={{ animationDelay: "0.1s" }}
          />
        </div>
      ))}

      <div
        className="fixed pointer-events-none z-20 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 100,
          top: mousePosition.y - 100,
        }}
      >
        <div className="w-48 h-48 bg-gradient-radial from-primary/20 via-primary/10 to-transparent rounded-full blur-xl animate-pulse" />
      </div>

      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="fixed inset-0 pointer-events-none z-5">
        <div className="absolute top-20 right-20 w-32 h-32 border border-primary/20 rotate-45 animate-spin-slow" />
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-primary/10 rounded-full blur-sm animate-pulse" />
        <div
          className="absolute top-1/2 left-10 w-16 h-16 border-2 border-primary/15 rounded-full animate-bounce"
          style={{ animationDuration: "4s" }}
        />
      </div>
    </>
  )
}
