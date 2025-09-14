import { useRef, useEffect, useState } from 'react'
import { errorHandler } from '../lib/errorHandler'

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
    const [isLoading, setIsLoading] = useState(true)
    const [retryCount, setRetryCount] = useState(0)
    const maxRetries = 3

    // Handle video playback
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        console.log('VideoBackground: Setting up video:', videoSrc)
        console.log('VideoBackground: Video element:', video)
        console.log('VideoBackground: Video src will be set to:', videoSrc)

        // Reset states when video source changes
        setVideoError(false)
        setIsLoading(true)
        setRetryCount(0)

        const playVideo = async () => {
            if (shouldPlay && video.paused) {
                try {
                    await video.play()
                    console.log('VideoBackground: Video started playing for:', videoSrc)
                    setIsLoading(false)
                } catch (error) {
                    console.log('VideoBackground: Video play failed for:', videoSrc, error)
                    errorHandler.logError({
                        message: `Video play failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                        code: 'VIDEO_PLAY_ERROR',
                        context: `VideoBackground: ${videoSrc}`
                    })

                    // Retry logic
                    if (retryCount < maxRetries) {
                        setTimeout(async () => {
                            try {
                                setRetryCount(prev => prev + 1)
                                await video.play()
                                console.log('VideoBackground: Video started playing on retry for:', videoSrc)
                                setIsLoading(false)
                            } catch (retryError) {
                                console.log('VideoBackground: Video play failed on retry for:', videoSrc, retryError)
                                if (retryCount + 1 >= maxRetries) {
                                    setVideoError(true)
                                    setIsLoading(false)
                                }
                            }
                        }, 1000 * (retryCount + 1)) // Exponential backoff
                    } else {
                        setVideoError(true)
                        setIsLoading(false)
                    }
                }
            }
        }

        const handleLoadedData = async () => {
            console.log('VideoBackground: Video data loaded for:', videoSrc)
            await playVideo()
        }

        const handleCanPlay = async () => {
            console.log('VideoBackground: Video can play for:', videoSrc)
            await playVideo()
        }

        const handleCanPlayThrough = async () => {
            console.log('VideoBackground: Video can play through for:', videoSrc)
            await playVideo()
        }

        const handleError = (e: any) => {
            console.error('VideoBackground: Video error for:', videoSrc, e)
            console.error('VideoBackground: Error details:', {
                error: e.target?.error,
                networkState: e.target?.networkState,
                readyState: e.target?.readyState
            })

            errorHandler.logError({
                message: `Video load error: ${e.target?.error?.message || 'Unknown video error'}`,
                code: 'VIDEO_LOAD_ERROR',
                context: `VideoBackground: ${videoSrc}`
            })

            setVideoError(true)
            setIsLoading(false)
        }

        const handleLoadStart = () => {
            console.log('VideoBackground: Video load started for:', videoSrc)
        }

        const handleLoad = () => {
            console.log('VideoBackground: Video load completed for:', videoSrc)
            setIsLoading(false)
        }

        video.addEventListener('loadstart', handleLoadStart)
        video.addEventListener('load', handleLoad)
        video.addEventListener('loadeddata', handleLoadedData)
        video.addEventListener('canplay', handleCanPlay)
        video.addEventListener('canplaythrough', handleCanPlayThrough)
        video.addEventListener('error', handleError)

        // Try to play immediately if video is already loaded
        if (video.readyState >= 3) { // HAVE_FUTURE_DATA
            playVideo()
        }

        // Also try to play after a short delay to handle async loading
        const playTimeout = setTimeout(() => {
            playVideo()
        }, 1000)

        return () => {
            clearTimeout(playTimeout)
            video.removeEventListener('loadstart', handleLoadStart)
            video.removeEventListener('load', handleLoad)
            video.removeEventListener('loadeddata', handleLoadedData)
            video.removeEventListener('canplay', handleCanPlay)
            video.removeEventListener('canplaythrough', handleCanPlayThrough)
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

        // Add multiple event listeners for better coverage
        const events = ['click', 'touchstart', 'keydown', 'mousedown']
        events.forEach(event => {
            document.addEventListener(event, handleUserInteraction, { once: true })
        })

        return () => {
            events.forEach(event => {
                document.removeEventListener(event, handleUserInteraction)
            })
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
                <>
                    <video
                        ref={videoRef}
                        className="absolute inset-0 w-full h-full object-cover"
                        loop={loop}
                        muted={muted}
                        autoPlay={autoPlay}
                        playsInline
                        preload="metadata"
                        controls={false}
                        webkit-playsinline="true"
                        style={{
                            pointerEvents: 'none',
                            zIndex: 1,
                            transition: 'none',
                            opacity: isLoading ? 0.5 : 1
                        }}
                    >
                        <source src={videoSrc} type={videoSrc.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} />
                        Your browser does not support the video tag.
                    </video>

                    {/* Loading indicator */}
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
                            <div className="text-white/70 text-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                                <div className="text-sm">Loading video...</div>
                            </div>
                        </div>
                    )}
                </>
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