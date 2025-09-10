import { createContext, useContext, useRef, useState, useEffect, useCallback, ReactNode } from 'react'

// Track interface
export interface Track {
  id: string
  title: string
  url: string
  artist?: string
  duration?: number
  isCustom?: boolean
  warning?: string
}

// Music state interface
interface MusicState {
  enabled: boolean
  playing: boolean
  volume: number
  muted: boolean
  track: Track | null
}

// Music actions interface
interface MusicActions {
  play: (trackToPlay?: Track) => Promise<void>
  pause: () => void
  toggle: () => Promise<void>
  setTrack: (id: string) => void
  next: () => void
  prev: () => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  playIntroMusic: () => Promise<void>
}

// Combined context type
type MusicContextType = MusicState & MusicActions

// Built-in tracks - Mobile-optimized with simple filenames
const BUILT_IN_TRACKS: Track[] = [
  {
    id: '001',
    title: 'Rainy Lofi Vibes 🌧️ Chill Balcony Beats for Study',
    artist: 'Lofi Vibes',
    duration: 3600, // 60 minutes
    url: '/music/rainy-lofi-vibes.mp3'
  },
  {
    id: '002',
    title: 'Jazz background music for deep focus',
    artist: 'Cafe Music',
    duration: 10800, // 3 hours
    url: '/music/jazz-background-music.mp3'
  },
  {
    id: '003',
    title: 'Lofi music hippop mix & Chillhop',
    artist: 'Chill Lofi Mix to Study and Relax',
    duration: 10800, // 3 hours
    url: '/music/lofi-hiphop-mix.mp3'
  },
  {
    id: 'intro',
    title: 'Music for Intro',
    artist: 'Focus Starter',
    duration: 300, // 5 minutes
    url: '/music/music-for-intro.mp3'
  }
]

// Create context
const MusicContext = createContext<MusicContextType | undefined>(undefined)

// Music provider component
export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Load state from localStorage
  const [state, setState] = useState<MusicState>(() => {
    console.log('🎵 Initializing music state...')
    if (typeof window === 'undefined') {
      console.log('🎵 Server-side rendering, using default state')
      return {
        enabled: false,
        playing: false,
        volume: 0.3,
        muted: false,
        track: BUILT_IN_TRACKS[0]
      }
    }

    try {
      const saved = localStorage.getItem('music')
      console.log('🎵 Saved music state from localStorage:', saved)
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          console.log('🎵 Parsed music state:', parsed)
          const track = BUILT_IN_TRACKS.find(t => t.id === parsed.trackId) || BUILT_IN_TRACKS[0]
          console.log('🎵 Selected track:', track)

          // Check if the track is valid (not a Google Drive URL that causes CORS errors)
          if (track && track.url && track.url.includes('drive.google.com')) {
            console.log('🎵 Clearing invalid Google Drive track from localStorage')
            localStorage.removeItem('music')
            return {
              enabled: false,
              playing: false,
              volume: 0.3,
              muted: false,
              track: BUILT_IN_TRACKS[0]
            }
          }

          const finalState = {
            enabled: parsed.enabled || false,
            playing: false,
            volume: parsed.volume || 0.3,
            muted: parsed.muted || false,
            track
          }
          console.log('🎵 Final music state:', finalState)
          return finalState
        } catch (error) {
          console.log('🎵 Error parsing saved music state:', error)
          // Fallback to defaults
          localStorage.removeItem('music')
        }
      }

      const defaultState = {
        enabled: false,
        playing: false,
        volume: 0.3,
        muted: false,
        track: BUILT_IN_TRACKS[0]
      }
      console.log('🎵 Using default music state:', defaultState)
      return defaultState
    } catch (error) {
      console.error('🎵 Error initializing music state:', error)
      return {
        enabled: false,
        playing: false,
        volume: 0.3,
        muted: false,
        track: BUILT_IN_TRACKS[0]
      }
    }
  })

  // Save state to localStorage
  const saveState = useCallback((newState: Partial<MusicState>) => {
    const updatedState = { ...state, ...newState }
    setState(updatedState)

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('music', JSON.stringify({
          enabled: updatedState.enabled,
          trackId: updatedState.track?.id,
          volume: updatedState.volume,
          muted: updatedState.muted
        }))
      } catch (error) {
        console.error('🎵 Error saving music state to localStorage:', error)
      }
    }
  }, [state])


  // Initialize audio element - Simplified
  useEffect(() => {
    if (typeof window === 'undefined') return

    console.log('🎵 Initializing audio element...')
    audioRef.current = new Audio()
    audioRef.current.loop = true
    audioRef.current.preload = 'metadata'

    console.log('🎵 Audio element created:', {
      loop: audioRef.current.loop,
      preload: audioRef.current.preload,
      readyState: audioRef.current.readyState
    })

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  // Update audio source when track changes - Simplified
  useEffect(() => {
    if (audioRef.current && state.track) {
      console.log('🎵 Setting audio source:', state.track.url)
      audioRef.current.src = state.track.url
      console.log('🎵 Audio src set to:', audioRef.current.src)
    }
  }, [state.track])

  // Update volume - Simplified for direct audio
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.muted ? 0 : state.volume
      console.log('🎵 Audio element volume set:', {
        volume: audioRef.current.volume,
        muted: state.muted
      })
    }
  }, [state.volume, state.muted])


  // Play function - Mobile-optimized with better error handling
  const play = useCallback(async (trackToPlay?: Track) => {
    const track = trackToPlay || state.track
    console.log('🎵 ===== PLAY FUNCTION START =====')
    console.log('🎵 Play function called', {
      hasAudio: !!audioRef.current,
      hasTrack: !!track,
      trackUrl: track?.url,
      audioSrc: audioRef.current?.src,
      audioReadyState: audioRef.current?.readyState,
      currentState: state,
      usingProvidedTrack: !!trackToPlay,
      userAgent: navigator.userAgent
    })

    if (!track) {
      console.warn('🎵 Cannot play: no track selected')
      return
    }

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    console.log('🎵 Mobile device detected:', isMobile)

    try {
      console.log('🎵 Using mobile-optimized audio approach')
      console.log('🎵 Track URL:', track.url)
      console.log('🎵 Current location:', window.location.href)

      // For mobile, skip the fetch test as it might cause CORS issues
      if (!isMobile) {
        // Test URL accessibility first (desktop only)
        try {
          const response = await fetch(track.url, { method: 'HEAD' })
          console.log('🎵 URL accessibility test:', response.status, response.statusText)
          if (!response.ok) {
            console.error('🎵 URL not accessible:', response.status, response.statusText)
            throw new Error(`URL not accessible: ${response.status} ${response.statusText}`)
          }
        } catch (fetchError) {
          console.error('🎵 URL test failed:', fetchError)
          const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error'
          throw new Error(`Cannot access audio file: ${errorMessage}`)
        }
      }

      // Create a new audio element for this track
      const directAudio = new Audio(track.url)
      directAudio.volume = state.muted ? 0 : state.volume
      directAudio.loop = true
      directAudio.preload = isMobile ? 'metadata' : 'auto' // Use metadata for mobile to avoid loading issues

      console.log('🎵 Direct audio created:', {
        src: directAudio.src,
        volume: directAudio.volume,
        loop: directAudio.loop,
        preload: directAudio.preload,
        isMobile
      })

      // Add comprehensive event listeners for debugging
      directAudio.addEventListener('loadstart', () => console.log('🎵 Audio loadstart'))
      directAudio.addEventListener('loadedmetadata', () => console.log('🎵 Audio loadedmetadata'))
      directAudio.addEventListener('canplay', () => console.log('🎵 Audio canplay'))
      directAudio.addEventListener('canplaythrough', () => console.log('🎵 Audio canplaythrough'))
      directAudio.addEventListener('play', () => console.log('🎵 Audio play event fired'))
      directAudio.addEventListener('error', (e) => {
        console.error('🎵 Audio error:', e)
        console.error('🎵 Audio error details:', {
          error: e,
          src: directAudio.src,
          networkState: directAudio.networkState,
          readyState: directAudio.readyState,
          errorCode: directAudio.error?.code,
          errorMessage: directAudio.error?.message
        })
      })

      // For mobile, wait for canplay event before attempting to play
      if (isMobile) {
        await new Promise<void>((resolve, reject) => {
          const playWhenReady = () => {
            directAudio.play()
              .then(() => {
                console.log('🎵 Mobile audio playing successfully!')
                // Update the main audio ref
                if (audioRef.current) {
                  audioRef.current.pause()
                }
                audioRef.current = directAudio

                setState(prev => ({ ...prev, playing: true, enabled: true }))
                saveState({ playing: true, enabled: true })
                console.log('🎵 ===== PLAY FUNCTION SUCCESS (MOBILE) =====')
                resolve()
              })
              .catch((playError) => {
                console.error('🎵 Mobile play failed:', playError)
                reject(playError)
              })
          }

          if (directAudio.readyState >= 3) { // HAVE_FUTURE_DATA
            playWhenReady()
          } else {
            directAudio.addEventListener('canplay', playWhenReady, { once: true })
            directAudio.addEventListener('error', (e) => {
              console.error('🎵 Mobile audio load error:', e)
              reject(e)
            }, { once: true })
          }
        })
      } else {
        // Desktop approach
        await directAudio.play()
        console.log('🎵 Desktop audio playing successfully!')

        // Update the main audio ref
        if (audioRef.current) {
          audioRef.current.pause()
        }
        audioRef.current = directAudio

        setState(prev => ({ ...prev, playing: true, enabled: true }))
        saveState({ playing: true, enabled: true })
        console.log('🎵 ===== PLAY FUNCTION SUCCESS (DESKTOP) =====')
      }
    } catch (error) {
      console.error('🎵 Audio playback failed:', error)

      // Show user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes('NotAllowedError')) {
          console.log('🎵 Audio playback was blocked - user interaction required')
        } else if (error.message.includes('404')) {
          console.error('🎵 Audio file not found (404) - check file paths and server configuration')
        } else {
          console.error('🎵 Audio playback failed:', error.message)
        }
      }
      return
    }

  }, [state.track, state.volume, state.muted, saveState])

  // Pause function - Simplified
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setState(prev => ({ ...prev, playing: false }))
      saveState({ playing: false })
    }
  }, [saveState])

  // Toggle function
  const toggle = useCallback(async () => {
    if (state.playing) {
      pause()
    } else {
      await play()
    }
  }, [state.playing, play, pause])

  // Set track function
  const setTrack = useCallback((id: string) => {
    console.log('🎵 setTrack called with ID:', id)
    console.log('🎵 Available tracks:', BUILT_IN_TRACKS.map(t => ({ id: t.id, title: t.title, url: t.url })))
    const track = BUILT_IN_TRACKS.find(t => t.id === id)
    if (track) {
      console.log('🎵 Found track:', track)
      setState(prev => ({ ...prev, track }))
      saveState({ track })
    } else {
      console.warn('🎵 Track not found with ID:', id)
      console.warn('🎵 Available track IDs:', BUILT_IN_TRACKS.map(t => t.id))
    }
  }, [saveState])

  // Next track function
  const next = useCallback(() => {
    if (!state.track) return

    const currentIndex = BUILT_IN_TRACKS.findIndex(t => t.id === state.track!.id)
    const nextIndex = (currentIndex + 1) % BUILT_IN_TRACKS.length
    setTrack(BUILT_IN_TRACKS[nextIndex].id)
  }, [state.track, setTrack])

  // Previous track function
  const prev = useCallback(() => {
    if (!state.track) return

    const currentIndex = BUILT_IN_TRACKS.findIndex(t => t.id === state.track!.id)
    const prevIndex = currentIndex === 0 ? BUILT_IN_TRACKS.length - 1 : currentIndex - 1
    setTrack(BUILT_IN_TRACKS[prevIndex].id)
  }, [state.track, setTrack])

  // Set volume function
  const setVolume = useCallback((volume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, volume))
    setState(prev => ({ ...prev, volume: clampedVolume }))
    saveState({ volume: clampedVolume })
  }, [saveState])

  // Toggle mute function
  const toggleMute = useCallback(() => {
    setState(prev => ({ ...prev, muted: !prev.muted }))
    saveState({ muted: !state.muted })
  }, [state.muted, saveState])

  // Play intro music function - Mobile-optimized
  const playIntroMusic = useCallback(async () => {
    console.log('🎵 ===== PLAY INTRO MUSIC START =====')
    console.log('🎵 playIntroMusic called', {
      currentTrack: state.track?.id,
      hasAudio: !!audioRef.current,
      userAgent: navigator.userAgent
    })

    const introTrack = BUILT_IN_TRACKS.find(t => t.id === 'intro')
    if (!introTrack) {
      console.error('🎵 Intro track not found in BUILT_IN_TRACKS:', BUILT_IN_TRACKS.map(t => t.id))
      return
    }

    console.log('🎵 Found intro track:', introTrack)
    console.log('🎵 Playing intro music:', introTrack.title, 'URL:', introTrack.url)

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    console.log('🎵 Mobile device detected for intro music:', isMobile)

    try {
      // Create a new audio element for better compatibility
      const directAudio = new Audio(introTrack.url)
      directAudio.volume = state.muted ? 0 : state.volume
      directAudio.loop = true
      directAudio.preload = isMobile ? 'metadata' : 'auto' // Use metadata for mobile

      console.log('🎵 Direct audio created for intro:', {
        src: directAudio.src,
        volume: directAudio.volume,
        loop: directAudio.loop,
        preload: directAudio.preload,
        isMobile
      })

      // Add comprehensive error handling
      directAudio.addEventListener('error', (e) => {
        console.error('🎵 Intro audio error:', e)
        console.error('🎵 Intro audio error details:', {
          error: e,
          src: directAudio.src,
          networkState: directAudio.networkState,
          readyState: directAudio.readyState,
          errorCode: directAudio.error?.code,
          errorMessage: directAudio.error?.message
        })
      })

      // Add success event listeners
      directAudio.addEventListener('canplay', () => console.log('🎵 Intro audio can play'))
      directAudio.addEventListener('play', () => console.log('🎵 Intro audio play event fired'))

      // For mobile, wait for canplay event before attempting to play
      if (isMobile) {
        await new Promise<void>((resolve, reject) => {
          const playWhenReady = () => {
            directAudio.play()
              .then(() => {
                console.log('🎵 Mobile intro audio playing successfully!')

                // Update the main audio ref
                if (audioRef.current) {
                  audioRef.current.pause()
                }
                audioRef.current = directAudio

                // Update state
                setState(prev => ({ ...prev, track: introTrack, playing: true, enabled: true }))
                saveState({ track: introTrack, playing: true, enabled: true })

                console.log('🎵 ===== PLAY INTRO MUSIC SUCCESS (MOBILE) =====')
                resolve()
              })
              .catch((playError) => {
                console.error('🎵 Mobile intro play failed:', playError)
                reject(playError)
              })
          }

          if (directAudio.readyState >= 3) { // HAVE_FUTURE_DATA
            playWhenReady()
          } else {
            directAudio.addEventListener('canplay', playWhenReady, { once: true })
            directAudio.addEventListener('error', (e) => {
              console.error('🎵 Mobile intro audio load error:', e)
              reject(e)
            }, { once: true })
          }
        })
      } else {
        // Desktop approach
        const playPromise = directAudio.play()
        if (playPromise !== undefined) {
          await playPromise
          console.log('🎵 Desktop intro audio playing successfully!')
        }

        // Update the main audio ref
        if (audioRef.current) {
          audioRef.current.pause()
        }
        audioRef.current = directAudio

        // Update state
        setState(prev => ({ ...prev, track: introTrack, playing: true, enabled: true }))
        saveState({ track: introTrack, playing: true, enabled: true })

        console.log('🎵 ===== PLAY INTRO MUSIC SUCCESS (DESKTOP) =====')
      }
    } catch (error) {
      console.error('🎵 Failed to play intro music:', error)

      // Show user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes('NotAllowedError')) {
          console.log('🎵 Audio playback was blocked - user interaction required')
        } else if (error.message.includes('404')) {
          console.error('🎵 Audio file not found (404) - check file paths')
        } else {
          console.error('🎵 Audio playback failed:', error.message)
        }
      }
    }

    console.log('🎵 ===== PLAY INTRO MUSIC END =====')
  }, [state.volume, state.muted, saveState])


  const contextValue: MusicContextType = {
    ...state,
    play,
    pause,
    toggle,
    setTrack,
    next,
    prev,
    setVolume,
    toggleMute,
    playIntroMusic
  }

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  )
}

// Hook to use music context
export function useMusic(): MusicContextType {
  const context = useContext(MusicContext)
  if (context === undefined) {
    throw new Error('useMusic must be used within a MusicProvider')
  }
  return context
}

// Export built-in tracks for external use
export { BUILT_IN_TRACKS }
