import { useEffect, useRef } from "react"

export default function BallFill({
    progress,
    accent = "#A855F7",
    bgBlur = 12,
    isRunning = false,
}: {
    progress: number
    accent?: string
    bgBlur?: number
    isRunning?: boolean
}) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null)

    useEffect(() => {
        const cvs = canvasRef.current!
        const ctx = cvs.getContext("2d")!
        let dpr = Math.max(1, window.devicePixelRatio || 1)

        const ro = new ResizeObserver(() => {
            const parent = cvs.parentElement!
            const w = parent.clientWidth
            const h = parent.clientHeight
            cvs.style.width = w + "px"
            cvs.style.height = h + "px"
            cvs.width = Math.round(w * dpr)
            cvs.height = Math.round(h * dpr)
        })
        ro.observe(cvs.parentElement!)

        const draw = () => {
            const width = cvs.width
            const height = cvs.height

            ctx.clearRect(0, 0, width, height)

            // Draw solid fill based on progress
            if (progress > 0) {
                ctx.filter = `blur(${bgBlur}px)`
                ctx.globalAlpha = 0.9
                ctx.fillStyle = accent

                // Fill from bottom up based on progress
                const fillHeight = height * progress
                ctx.fillRect(0, height - fillHeight, width, fillHeight)

                ctx.filter = "none"
                ctx.globalAlpha = 1
            }
        }

        draw()

        return () => {
            ro.disconnect()
        }
    }, [progress, accent, bgBlur, isRunning])

    return (
        <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        />
    )
}
