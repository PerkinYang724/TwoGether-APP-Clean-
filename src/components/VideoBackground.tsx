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
    autoPlay = true, // Enable autoplay by default
    overlay = true,
    overlayOpacity = 0.3,
    shouldPlay = true // Enable shouldPlay by default
}: VideoBackgroundProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [userInteracted, setUserInteracted] = useState(false)
    const [videoError, setVideoError] = useState(false)
    const [showPlayButton, setShowPlayButton] = useState(false)

    // Handle user interaction to enable video playback on mobile
    useEffect(() => {
        const handleUserInteraction = async () => {
            if (!userInteracted && shouldPlay) {
                setUserInteracted(true)
                setShowPlayButton(false)
                const video = videoRef.current
                if (video && video.paused) {
                    try {
                        await video.play()
                        console.log('VideoBackground: Video started after user interaction')
                    } catch (error) {
                        console.log('VideoBackground: Video play failed after user interaction:', error)
                        setShowPlayButton(true)
                    }
                }
            }
        }

        // Listen for any user interaction
        document.addEventListener('touchstart', handleUserInteraction, { once: true })
        document.addEventListener('click', handleUserInteraction, { once: true })

        return () => {
            document.removeEventListener('touchstart', handleUserInteraction)
            document.removeEventListener('click', handleUserInteraction)
        }
    }, [shouldPlay, userInteracted])

    // Show play button if video fails to autoplay
    useEffect(() => {
        const timer = setTimeout(() => {
            const video = videoRef.current
            if (video && video.paused && shouldPlay) {
                setShowPlayButton(true)
            }
        }, 3000) // Show play button after 3 seconds if video hasn't started

        return () => clearTimeout(timer)
    }, [shouldPlay])

    // Immediate play attempt when component mounts
    useEffect(() => {
        const video = videoRef.current
        if (video && shouldPlay) {
            console.log('VideoBackground: Attempting immediate play on mount')
            video.play().catch(error => {
                console.log('VideoBackground: Immediate play failed:', error)
                // For iOS Safari, try playing after a user gesture
                if (error.name === 'NotAllowedError') {
                    console.log('VideoBackground: Autoplay blocked, will retry on user interaction')
                }
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
            {/* Fallback gradient background - always visible */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" style={{ zIndex: -2 }} />
            
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden" style={{ zIndex: -1 }}>
                {/* Floating circles for visual interest */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-3/4 right-1/4 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            {/* Video element - only if video files are available */}
            {!videoError && (
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
                    style={{ pointerEvents: 'none' }}
                    onLoadStart={() => console.log('Video: Load started')}
                    onLoadedData={() => console.log('Video: Data loaded')}
                    onCanPlay={() => console.log('Video: Can play')}
                    onPlay={() => console.log('Video: Playing')}
                    onPause={() => console.log('Video: Paused')}
                    onError={(e) => {
                        console.error('Video: Error', e)
                        setVideoError(true)
                        setShowPlayButton(true)
                    }}
                >
                    <source src={videoSrc} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            )}

            {/* Debug info for mobile */}
            <div className="absolute top-4 left-4 text-white text-xs bg-black/50 p-2 rounded z-10">
                <div>Video: {videoSrc.split('/').pop()}</div>
                <div>Should Play: {shouldPlay ? 'Yes' : 'No'}</div>
                <div>User Interacted: {userInteracted ? 'Yes' : 'No'}</div>
                <div>AutoPlay: {autoPlay ? 'Yes' : 'No'}</div>
                <div>Video Error: {videoError ? 'Yes' : 'No'}</div>
                <div>Status: {videoError ? 'Using Fallback' : 'Loading Video'}</div>
            </div>

            {/* Play button overlay for mobile */}
            {showPlayButton && !videoError && (
                <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/50 z-20"
                    onClick={async () => {
                        const video = videoRef.current
                        if (video) {
                            try {
                                await video.play()
                                setShowPlayButton(false)
                                console.log('Video: Started via play button')
                            } catch (error) {
                                console.error('Video: Play button failed', error)
                            }
                        }
                    }}
                >
                    <div className="bg-white/90 text-black px-8 py-4 rounded-full text-lg font-semibold cursor-pointer hover:bg-white transition-colors">
                        ▶️ Tap to Play Video
                    </div>
                </div>
            )}

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
