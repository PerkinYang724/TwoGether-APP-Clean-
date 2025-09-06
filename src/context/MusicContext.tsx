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
  play: () => Promise<void>
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

// Built-in tracks - Working audio sources
const BUILT_IN_TRACKS: Track[] = [
  {
    id: '001',
    title: 'Rainy Lofi Vibes 🌧️ Chill Balcony Beats for Study',
    artist: 'Lofi Vibes',
    duration: 3600, // 60 minutes
    url: '/music/Rainy Lofi Vibes 🌧️ Chill Balcony Beats for Study & Sleep.mp3'
  },
  {
    id: '002',
    title: 'Jazz background music for deep focus',
    artist: 'Cafe Music',
    duration: 10800, // 3 hours
    url: '/music/Jazz music ROYALTY FREE Background Cafe Music [Jazz no copyright] - Creative Commons Music.mp3'
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
  })

  // Save state to localStorage
  const saveState = useCallback((newState: Partial<MusicState>) => {
    const updatedState = { ...state, ...newState }
    setState(updatedState)

    if (typeof window !== 'undefined') {
      localStorage.setItem('music', JSON.stringify({
        enabled: updatedState.enabled,
        trackId: updatedState.track?.id,
        volume: updatedState.volume,
        muted: updatedState.muted
      }))
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


  // Play function - Simplified for mobile compatibility
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
      usingProvidedTrack: !!trackToPlay
    })

    if (!track) {
      console.warn('🎵 Cannot play: no track selected')
      return
    }

    // Use direct audio approach for better mobile compatibility
    try {
      console.log('🎵 Using direct audio approach for better mobile compatibility')
      console.log('🎵 Track URL:', track.url)
      console.log('🎵 Current location:', window.location.href)

      // Test URL accessibility first
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

      // Create a new audio element for this track
      const directAudio = new Audio(track.url)
      directAudio.volume = state.muted ? 0 : state.volume
      directAudio.loop = true
      directAudio.preload = 'auto'

      console.log('🎵 Direct audio created:', {
        src: directAudio.src,
        volume: directAudio.volume,
        loop: directAudio.loop,
        preload: directAudio.preload
      })

      // Add event listeners for debugging
      directAudio.addEventListener('loadstart', () => console.log('🎵 Audio loadstart'))
      directAudio.addEventListener('loadedmetadata', () => console.log('🎵 Audio loadedmetadata'))
      directAudio.addEventListener('canplay', () => console.log('🎵 Audio canplay'))
      directAudio.addEventListener('error', (e) => {
        console.error('🎵 Audio error:', e)
        console.error('🎵 Audio error details:', {
          error: e,
          src: directAudio.src,
          networkState: directAudio.networkState,
          readyState: directAudio.readyState
        })
      })

      await directAudio.play()
      console.log('🎵 Direct audio playing successfully!')

      // Update the main audio ref to use this direct audio
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = directAudio

      setState(prev => ({ ...prev, playing: true, enabled: true }))
      saveState({ playing: true, enabled: true })
      console.log('🎵 ===== PLAY FUNCTION SUCCESS (DIRECT) =====')
      return
    } catch (error) {
      console.error('🎵 Direct audio failed:', error)

      // Show user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes('NotAllowedError')) {
          console.log('🎵 Audio playback was blocked - this is normal on mobile without user interaction')
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

  // Play intro music function - Simplified for mobile
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

    // Set the intro track as current
    console.log('🎵 Setting intro track as current track...')
    setState(prev => ({ ...prev, track: introTrack }))
    saveState({ track: introTrack })

    // For mobile, try direct audio approach first
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (isMobile) {
      console.log('🎵 Mobile: Using direct audio approach for intro music')
      try {
        const directAudio = new Audio(introTrack.url)
        directAudio.volume = state.muted ? 0 : state.volume
        directAudio.loop = true
        directAudio.preload = 'auto'

        console.log('🎵 Mobile: Direct audio created for intro:', {
          src: directAudio.src,
          volume: directAudio.volume,
          loop: directAudio.loop
        })

        await directAudio.play()
        console.log('🎵 Mobile: Direct intro audio playing successfully!')

        // Update the main audio ref
        if (audioRef.current) {
          audioRef.current.pause()
        }
        audioRef.current = directAudio

        setState(prev => ({ ...prev, playing: true, enabled: true }))
        saveState({ playing: true, enabled: true })
        console.log('🎵 ===== PLAY INTRO MUSIC SUCCESS (MOBILE DIRECT) =====')
        return
      } catch (error) {
        console.error('🎵 Mobile: Direct intro audio failed:', error)
        // Fall through to regular approach
      }
    }

    // Regular approach (desktop or mobile fallback)
    try {
      console.log('🎵 Attempting to play intro music with regular approach...')
      await play(introTrack)
      console.log('🎵 Intro music started successfully')
    } catch (error) {
      console.error('🎵 Failed to play intro music:', error)
    }
    console.log('🎵 ===== PLAY INTRO MUSIC END =====')
  }, [state.track, state.volume, state.muted, saveState, play])


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
