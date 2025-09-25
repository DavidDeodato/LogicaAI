"use client"

import { useEffect } from "react"

export function AdvancedHoverEffects() {
  useEffect(() => {
    const cards = document.querySelectorAll(".hover-card")

    cards.forEach((card) => {
      const cardElement = card as HTMLElement

      cardElement.addEventListener("mouseenter", () => {
        cardElement.style.transform = "translateY(-10px) rotateX(5deg) rotateY(5deg) scale(1.02)"
        cardElement.style.boxShadow = "0 25px 50px rgba(245, 158, 11, 0.3)"
        cardElement.style.transition = "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      })

      cardElement.addEventListener("mouseleave", () => {
        cardElement.style.transform = "translateY(0) rotateX(0) rotateY(0) scale(1)"
        cardElement.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"
      })

      cardElement.addEventListener("mousemove", (e) => {
        const rect = cardElement.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2

        const rotateX = ((y - centerY) / centerY) * -10
        const rotateY = ((x - centerX) / centerX) * 10

        cardElement.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
      })
    })

    // Efeito de brilho nos botões
    const buttons = document.querySelectorAll(".glow-button")
    buttons.forEach((button) => {
      const buttonElement = button as HTMLElement

      buttonElement.addEventListener("mouseenter", () => {
        buttonElement.style.boxShadow = "0 0 30px rgba(245, 158, 11, 0.6), inset 0 0 30px rgba(245, 158, 11, 0.1)"
        buttonElement.style.transform = "scale(1.05)"
      })

      buttonElement.addEventListener("mouseleave", () => {
        buttonElement.style.boxShadow = "0 0 20px rgba(245, 158, 11, 0.3)"
        buttonElement.style.transform = "scale(1)"
      })
    })
  }, [])

  return null
}
