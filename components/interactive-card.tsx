"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"

interface InteractiveCardProps {
  children: React.ReactNode
  className?: string
  glowOnHover?: boolean
  tiltEffect?: boolean
}

export function InteractiveCard({
  children,
  className = "",
  glowOnHover = true,
  tiltEffect = true,
}: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current || !tiltEffect) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setMousePosition({ x, y })

    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 10
    const rotateY = (centerX - x) / 10

    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (cardRef.current && tiltEffect) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)"
    }
  }

  return (
    <Card
      ref={cardRef}
      className={`
        relative overflow-hidden transition-all duration-300 cursor-pointer interactive-hover
        ${isHovered ? "scale-105 -translate-y-2" : ""}
        ${glowOnHover && isHovered ? "glow-effect" : ""}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {isHovered && (
        <div
          className="absolute pointer-events-none opacity-30 transition-opacity duration-300"
          style={{
            left: mousePosition.x - 100,
            top: mousePosition.y - 100,
            width: 200,
            height: 200,
            background: "radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      )}

      {/* Efeito de brilho no hover */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent
          transition-transform duration-700 -translate-x-full
          ${isHovered ? "translate-x-full" : ""}
        `}
      />

      <div style={{ transform: "translateZ(20px)" }}>{children}</div>
    </Card>
  )
}
