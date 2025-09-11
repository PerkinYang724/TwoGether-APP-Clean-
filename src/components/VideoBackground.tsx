import { useRef, useEffect } from 'react'

interface VideoBackgroundProps {
    videoSrc: string
    className?: string
    loop?: boolean
    muted?: boolean
    autoPlay?: boolean
    overlay?: boolean
    overlayOpacity?: number
    shouldPlay?: boolean
}

export default function VideoBackground({
    videoSrc,
    className = '',
    loop = true,
    muted = true,
    autoPlay = true, // Enable autoplay by default
    overlay = true,
    overlayOpacity = 0.3,
    shouldPlay = true // Enable shouldPlay by default
}: VideoBackgroundProps) {
    const videoRef = useRef<HTMLVideoElement>(null)

    // Immediate play attempt when component mounts
    useEffect(() => {
        const video = videoRef.current
        if (video && shouldPlay) {
            console.log('VideoBackground: Attempting immediate play on mount')
            video.play().catch(error => {
                console.log('VideoBackground: Immediate play failed:', error)
            })
        }
    }, [shouldPlay])

    useEffect(() => {
        const video = videoRef.current
        if (!video) {
            console.log('Video ref not found')
            return
        }

        console.log('Video element found, setting up video:', videoSrc)

        // Handle video loading
        const handleLoadedData = async () => {
            console.log('Video data loaded')
            video.currentTime = 0

            // Auto-play when video is loaded if shouldPlay is true
            if (shouldPlay) {
                try {
                    await video.play()
                    console.log('Video auto-played successfully on load')
                } catch (error) {
                    console.log('Video auto-play failed on load:', error)
                    // Try again after a short delay for browser autoplay restrictions
                    setTimeout(async () => {
                        try {
                            await video.play()
                            console.log('Video auto-played successfully on retry')
                        } catch (retryError) {
                            console.log('Video auto-play failed on retry:', retryError)
                        }
                    }, 500)
                }
            }
        }

        const handleCanPlay = async () => {
            console.log('Video can play')
            if (shouldPlay && video.paused) {
                try {
                    await video.play()
                    console.log('Video started playing on canplay event')
                } catch (error) {
                    console.log('Video play failed on canplay:', error)
                }
            }
        }

        const handleError = (e: any) => {
            console.error('Video error:', e)
        }

        video.addEventListener('loadeddata', handleLoadedData)
        video.addEventListener('canplay', handleCanPlay)
        video.addEventListener('error', handleError)

        return () => {
            video.removeEventListener('loadeddata', handleLoadedData)
            video.removeEventListener('canplay', handleCanPlay)
            video.removeEventListener('error', handleError)
        }
    }, [videoSrc, shouldPlay])

    // Effect to handle play/pause based on shouldPlay prop
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const playVideo = async () => {
            try {
                console.log('Attempting to play video...')
                await video.play()
                console.log('Video playing successfully')
            } catch (error) {
                console.log('Video play failed:', error)
                // Try again after a short delay
                setTimeout(async () => {
                    try {
                        await video.play()
                        console.log('Video playing successfully on retry')
                    } catch (retryError) {
                        console.log('Video play failed on retry:', retryError)
                    }
                }, 1000)
            }
        }

        if (shouldPlay) {
            playVideo()
        } else {
            video.pause()
        }
    }, [shouldPlay])

    // Effect to handle video source changes
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        console.log('VideoBackground: Video source changed to:', videoSrc)

        // When video source changes, force reload and play if shouldPlay is true
        const handleVideoChange = async () => {
            console.log('VideoBackground: Handling video change, shouldPlay:', shouldPlay)

            // Force video to reload by setting load() and then setting source
            video.load()

            // Wait for video to be ready
            const handleCanPlay = async () => {
                video.currentTime = 0
                if (shouldPlay) {
                    try {
                        await video.play()
                        console.log('New video playing successfully')
                    } catch (error) {
                        console.log('New video play failed:', error)
                    }
                }
                video.removeEventListener('canplay', handleCanPlay)
            }

            video.addEventListener('canplay', handleCanPlay)
        }

        handleVideoChange()
    }, [videoSrc, shouldPlay])

    return (
        <div className={`fixed inset-0 w-full h-full overflow-hidden bg-black ${className}`} style={{ zIndex: -1 }}>
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                loop={loop}
                muted={muted}
                autoPlay={autoPlay}
                playsInline
                preload="auto"
                controls={false}
                style={{ pointerEvents: 'none' }}
            >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Optional overlay for better text readability */}
            {overlay && (
                <div
                    className="absolute inset-0 bg-black"
                    style={{ opacity: overlayOpacity }}
                />
            )}
        </div>
    )
}
