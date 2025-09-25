"use client"

import { useEffect, useState } from "react"

export function ScrollLiquidEffect() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Efeito de tinta líquida dourada */}
      <div
        className="absolute -top-20 left-0 w-full h-screen"
        style={{
          background: `linear-gradient(180deg, 
            transparent 0%, 
            rgba(245, 158, 11, 0.03) ${Math.min(scrollY / 10, 30)}%, 
            rgba(245, 158, 11, 0.08) ${Math.min(scrollY / 8, 60)}%, 
            rgba(245, 158, 11, 0.12) ${Math.min(scrollY / 6, 100)}%)`,
          transform: `translateY(${scrollY * 0.4}px)`,
        }}
      />

      {/* Gotas que descem */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${5 + i * 8}%`,
            top: `-${20 + i * 10}px`,
            transform: `translateY(${scrollY * (0.6 + i * 0.05)}px)`,
            animationDelay: `${i * 0.3}s`,
          }}
        >
          <div
            className="w-1 h-16 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent rounded-full"
            style={{
              height: `${16 + Math.sin(scrollY * 0.01 + i) * 8}px`,
            }}
          />
        </div>
      ))}

      {/* Ondas de energia */}
      <div
        className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        style={{
          transform: `translateY(${scrollY * 0.8}px) scaleX(${1 + scrollY * 0.001})`,
        }}
      />
    </div>
  )
}
