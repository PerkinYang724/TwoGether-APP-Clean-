import { useRef, useEffect, useState } from 'react'

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
    autoPlay = true,
    overlay = true,
    overlayOpacity = 0.3,
    shouldPlay = true
}: VideoBackgroundProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [videoError, setVideoError] = useState(false)

    // Handle video playback
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        console.log('VideoBackground: Setting up video:', videoSrc)
        console.log('VideoBackground: Video element:', video)
        console.log('VideoBackground: Video src will be set to:', videoSrc)

        const handleLoadedData = async () => {
            console.log('VideoBackground: Video data loaded for:', videoSrc)
            if (shouldPlay) {
                try {
                    await video.play()
                    console.log('VideoBackground: Video started playing for:', videoSrc)
                } catch (error) {
                    console.log('VideoBackground: Video play failed for:', videoSrc, error)
                    // Try again after a short delay
                    setTimeout(async () => {
                        try {
                            await video.play()
                            console.log('VideoBackground: Video started playing on retry for:', videoSrc)
                        } catch (retryError) {
                            console.log('VideoBackground: Video play failed on retry for:', videoSrc, retryError)
                        }
                    }, 500)
                }
            }
        }

        const handleCanPlay = async () => {
            console.log('VideoBackground: Video can play for:', videoSrc)
            if (shouldPlay && video.paused) {
                try {
                    await video.play()
                    console.log('VideoBackground: Video started playing on canplay for:', videoSrc)
                } catch (error) {
                    console.log('VideoBackground: Video play failed on canplay for:', videoSrc, error)
                }
            }
        }

        const handleError = (e: any) => {
            console.error('VideoBackground: Video error for:', videoSrc, e)
            console.error('VideoBackground: Error details:', {
                error: e.target?.error,
                networkState: e.target?.networkState,
                readyState: e.target?.readyState
            })
            setVideoError(true)
        }

        const handleLoadStart = () => {
            console.log('VideoBackground: Video load started for:', videoSrc)
        }

        const handleLoad = () => {
            console.log('VideoBackground: Video load completed for:', videoSrc)
        }

        video.addEventListener('loadstart', handleLoadStart)
        video.addEventListener('load', handleLoad)
        video.addEventListener('loadeddata', handleLoadedData)
        video.addEventListener('canplay', handleCanPlay)
        video.addEventListener('error', handleError)

        return () => {
            video.removeEventListener('loadstart', handleLoadStart)
            video.removeEventListener('load', handleLoad)
            video.removeEventListener('loadeddata', handleLoadedData)
            video.removeEventListener('canplay', handleCanPlay)
            video.removeEventListener('error', handleError)
        }
    }, [videoSrc, shouldPlay])

    // Handle user interaction to enable video playback
    useEffect(() => {
        const handleUserInteraction = async () => {
            const video = videoRef.current
            if (video && video.paused && shouldPlay) {
                try {
                    await video.play()
                    console.log('VideoBackground: Video started after user interaction')
                } catch (error) {
                    console.log('VideoBackground: Video play failed after user interaction:', error)
                }
            }
        }

        document.addEventListener('click', handleUserInteraction, { once: true })
        document.addEventListener('touchstart', handleUserInteraction, { once: true })

        return () => {
            document.removeEventListener('click', handleUserInteraction)
            document.removeEventListener('touchstart', handleUserInteraction)
        }
    }, [shouldPlay])

    return (
        <div
            className={`fixed inset-0 w-full h-full overflow-hidden ${className}`}
            style={{
                zIndex: 0,
                backgroundColor: 'black',
                transition: 'none'
            }}
        >
            {!videoError ? (
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    loop={loop}
                    muted={muted}
                    autoPlay={autoPlay}
                    playsInline
                    preload="auto"
                    controls={false}
                    webkit-playsinline="true"
                    style={{
                        pointerEvents: 'none',
                        zIndex: 1,
                        transition: 'none'
                    }}
                >
                    <source src={videoSrc} type={videoSrc.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
                    Your browser does not support the video tag.
                </video>
            ) : (
                /* Fallback gradient background when video fails to load */
                <div
                    className="absolute inset-0 w-full h-full"
                    style={{
                        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 50%, #334155 100%)',
                        zIndex: 1
                    }}
                />
            )}

            {/* Optional overlay for better text readability */}
            {overlay && (
                <div
                    className="absolute inset-0 bg-black"
                    style={{
                        opacity: overlayOpacity,
                        zIndex: 2,
                        transition: 'none'
                    }}
                />
            )}
        </div>
    )
}