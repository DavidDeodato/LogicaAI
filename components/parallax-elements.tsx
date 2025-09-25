"use client"

import { useEffect, useState } from "react"

export function ParallaxElements() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Elementos geométricos que seguem o scroll e mouse */}
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 border-2 border-primary/10 rounded-full"
        style={{
          transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02 + scrollY * 0.3}px) rotate(${scrollY * 0.1}deg)`,
        }}
      />

      <div
        className="absolute top-1/2 right-1/4 w-32 h-32 bg-primary/5 rotate-45"
        style={{
          transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01 + scrollY * 0.2}px) rotate(${45 + scrollY * 0.05}deg)`,
        }}
      />

      {/* Hexágonos temáticos da LogicaAI */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${20 + i * 15}%`,
            top: `${10 + i * 20}%`,
            transform: `translate(${mousePosition.x * (0.01 + i * 0.002)}px, ${mousePosition.y * (0.01 + i * 0.002) + scrollY * (0.1 + i * 0.05)}px) rotate(${scrollY * (0.02 + i * 0.01)}deg)`,
          }}
        >
          <div
            className="w-16 h-16 border border-primary/20 animate-pulse"
            style={{
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.5}s`,
            }}
          />
        </div>
      ))}

      {/* Circuitos animados */}
      <div
        className="absolute top-1/3 right-1/3 w-48 h-48"
        style={{
          transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015 + scrollY * 0.25}px)`,
        }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full opacity-20">
          <path
            d="M20,20 L80,20 L80,50 L50,50 L50,80 L20,80 Z"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            className="text-primary animate-pulse"
          />
          <circle cx="20" cy="20" r="2" fill="currentColor" className="text-primary animate-ping" />
          <circle
            cx="80"
            cy="50"
            r="2"
            fill="currentColor"
            className="text-primary animate-ping"
            style={{ animationDelay: "0.5s" }}
          />
          <circle
            cx="50"
            cy="80"
            r="2"
            fill="currentColor"
            className="text-primary animate-ping"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </div>

      {/* Ondas de energia */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"
            style={{
              top: `${30 + i * 25}%`,
              transform: `translateY(${scrollY * (0.4 + i * 0.1)}px) scaleX(${1 + Math.sin(scrollY * 0.01 + i) * 0.2})`,
              opacity: 0.6 - i * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  )
}
