"use client"

import { useEffect, useState, useRef } from "react"

export function MagneticElements() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const elementsRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      // Efeito magnético nos elementos
      elementsRef.current.forEach((element, index) => {
        if (element) {
          const rect = element.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2

          const distance = Math.sqrt(Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2))

          if (distance < 150) {
            const strength = (150 - distance) / 150
            const moveX = (e.clientX - centerX) * strength * 0.3
            const moveY = (e.clientY - centerY) * strength * 0.3

            element.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + strength * 0.1})`
          } else {
            element.style.transform = "translate(0px, 0px) scale(1)"
          }
        }
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Elementos magnéticos flutuantes */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) elementsRef.current[i] = el
          }}
          className="absolute transition-transform duration-200 ease-out"
          style={{
            left: `${20 + i * 15}%`,
            top: `${30 + (i % 2) * 40}%`,
          }}
        >
          <div
            className="w-8 h-8 bg-primary/20 rounded-full blur-sm animate-pulse"
            style={{ animationDelay: `${i * 0.5}s` }}
          />
        </div>
      ))}

      {/* Hexágonos magnéticos (tema da logo) */}
      {[...Array(4)].map((_, i) => (
        <div
          key={`hex-${i}`}
          ref={(el) => {
            if (el) elementsRef.current[6 + i] = el
          }}
          className="absolute transition-transform duration-300 ease-out"
          style={{
            right: `${10 + i * 20}%`,
            top: `${20 + i * 25}%`,
          }}
        >
          <div
            className="w-6 h-6 border border-primary/30 rotate-45 animate-spin-slow"
            style={{
              clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
              animationDuration: `${8 + i * 2}s`,
            }}
          />
        </div>
      ))}
    </div>
  )
}
