import { useEffect, useState } from 'react'

interface Flake {
    id: number
    x: number
    y: number
    size: number
    speed: number
    opacity: number
    rotation: number
    rotationSpeed: number
}

export default function AnimatedFlakes() {
    const [flakes, setFlakes] = useState<Flake[]>([])

    useEffect(() => {
        // Create initial flakes
        const createFlakes = () => {
            const newFlakes: Flake[] = []
            for (let i = 0; i < 50; i++) {
                newFlakes.push({
                    id: i,
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    size: Math.random() * 4 + 2, // 2-6px
                    speed: Math.random() * 2 + 0.5, // 0.5-2.5px per frame
                    opacity: Math.random() * 0.6 + 0.2, // 0.2-0.8
                    rotation: Math.random() * 360,
                    rotationSpeed: Math.random() * 2 - 1, // -1 to 1 degrees per frame
                })
            }
            setFlakes(newFlakes)
        }

        createFlakes()

        // Animation loop
        const animate = () => {
            setFlakes(prevFlakes =>
                prevFlakes.map(flake => {
                    let newY = flake.y + flake.speed
                    let newX = flake.x + Math.sin(flake.y * 0.01) * 0.5 // Gentle swaying motion

                    // Reset flake when it goes off screen
                    if (newY > window.innerHeight) {
                        newY = -10
                        newX = Math.random() * window.innerWidth
                    }

                    // Keep flakes within screen bounds horizontally
                    if (newX < 0) newX = window.innerWidth
                    if (newX > window.innerWidth) newX = 0

                    return {
                        ...flake,
                        x: newX,
                        y: newY,
                        rotation: flake.rotation + flake.rotationSpeed,
                    }
                })
            )
        }

        const interval = setInterval(animate, 50) // 20 FPS

        // Handle window resize
        const handleResize = () => {
            createFlakes()
        }

        window.addEventListener('resize', handleResize)

        return () => {
            clearInterval(interval)
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {flakes.map(flake => (
                <div
                    key={flake.id}
                    className="absolute text-white/30"
                    style={{
                        left: flake.x,
                        top: flake.y,
                        fontSize: `${flake.size}px`,
                        opacity: flake.opacity,
                        transform: `rotate(${flake.rotation}deg)`,
                        transition: 'none',
                    }}
                >
                    ❄
                </div>
            ))}
        </div>
    )
}
