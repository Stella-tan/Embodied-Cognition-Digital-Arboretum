"use client"

import { useEffect, useRef } from "react"

export function DNAHelix() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 400
    canvas.height = 500

    let animationFrame: number
    let time = 0

    const colors = {
      primary: "#00ffa3",
      secondary: "#00d4ff",
      accent: "#ff6b35",
      muted: "#8888a0",
    }

    const basePairs = [
      { left: "A", right: "T", color: colors.primary },
      { left: "G", right: "C", color: colors.secondary },
      { left: "T", right: "A", color: colors.accent },
      { left: "C", right: "G", color: colors.primary },
    ]

    function draw() {
      if (!ctx || !canvas) return

      ctx.fillStyle = "rgba(10, 10, 15, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const amplitude = 80
      const frequency = 0.02
      const verticalSpacing = 25

      for (let i = 0; i < 20; i++) {
        const y = i * verticalSpacing + 50
        const phase = time * 0.02 + i * 0.3

        const leftX = centerX + Math.sin(phase) * amplitude
        const rightX = centerX - Math.sin(phase) * amplitude

        const pair = basePairs[i % basePairs.length]
        const alpha = 0.6 + Math.sin(phase) * 0.4

        // Draw connecting line
        ctx.beginPath()
        ctx.moveTo(leftX, y)
        ctx.lineTo(rightX, y)
        ctx.strokeStyle = `rgba(42, 42, 62, ${alpha})`
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw nodes
        ctx.beginPath()
        ctx.arc(leftX, y, 8, 0, Math.PI * 2)
        ctx.fillStyle = pair.color
        ctx.fill()

        ctx.beginPath()
        ctx.arc(rightX, y, 8, 0, Math.PI * 2)
        ctx.fillStyle = pair.color
        ctx.fill()

        // Draw base letters
        ctx.font = "bold 10px monospace"
        ctx.fillStyle = "#0a0a0f"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(pair.left, leftX, y)
        ctx.fillText(pair.right, rightX, y)
      }

      // Draw backbone
      ctx.beginPath()
      ctx.strokeStyle = colors.primary
      ctx.lineWidth = 3
      for (let i = 0; i < 20; i++) {
        const y = i * verticalSpacing + 50
        const phase = time * 0.02 + i * 0.3
        const x = centerX + Math.sin(phase) * amplitude
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      ctx.beginPath()
      ctx.strokeStyle = colors.secondary
      for (let i = 0; i < 20; i++) {
        const y = i * verticalSpacing + 50
        const phase = time * 0.02 + i * 0.3
        const x = centerX - Math.sin(phase) * amplitude
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      time++
      animationFrame = requestAnimationFrame(draw)
    }

    draw()

    return () => cancelAnimationFrame(animationFrame)
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ maxWidth: "400px", maxHeight: "500px" }} />
}
