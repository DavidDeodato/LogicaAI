"use client"

import { useEffect, useState } from "react"

export function FloatingElements() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div
        className="absolute w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192 + scrollY * 0.1,
          transition: "all 0.3s ease-out",
        }}
      />

      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            transform: `translateY(${scrollY * (0.1 + Math.random() * 0.2)}px)`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
          }}
        />
      ))}

      <div
        className="absolute w-32 h-32 border border-primary/10 rounded-full"
        style={{
          left: "10%",
          top: "20%",
          transform: `rotate(${scrollY * 0.1}deg) translateY(${scrollY * 0.05}px)`,
        }}
      />

      <div
        className="absolute w-24 h-24 border border-primary/10 rotate-45"
        style={{
          right: "15%",
          top: "60%",
          transform: `rotate(${45 + scrollY * 0.15}deg) translateY(${scrollY * 0.08}px)`,
        }}
      />

      {/* Grid de fundo */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
    </div>
  )
}
