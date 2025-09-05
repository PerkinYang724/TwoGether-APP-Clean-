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
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)
  const interactionHandledRef = useRef<boolean>(false)

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

  // Resume audio context if suspended
  const resumeAudioContext = useCallback(async () => {
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      console.log('🎵 Resuming suspended AudioContext...')
      try {
        await audioContextRef.current.resume()
        console.log('🎵 AudioContext resumed:', audioContextRef.current.state)
        return true
      } catch (error) {
        console.error('🎵 Failed to resume AudioContext:', error)
        return false
      }
    }
    return true
  }, [])

  // Initialize audio context and nodes
  const initializeAudioContext = useCallback(async () => {
    if (audioContextRef.current) {
      console.log('🎵 AudioContext already exists:', audioContextRef.current.state)
      const resumed = await resumeAudioContext()
      if (!resumed) {
        console.error('🎵 Failed to resume AudioContext')
        return false
      }
      return true
    }

    try {
      console.log('🎵 Creating new AudioContext...')
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      console.log('🎵 AudioContext created:', audioContextRef.current.state)

      // Resume the audio context if it's suspended
      if (audioContextRef.current.state === 'suspended') {
        console.log('🎵 AudioContext is suspended, attempting to resume...')
        await audioContextRef.current.resume()
        console.log('🎵 AudioContext resumed:', audioContextRef.current.state)
      }

      gainNodeRef.current = audioContextRef.current.createGain()
      gainNodeRef.current.connect(audioContextRef.current.destination)
      console.log('🎵 GainNode created and connected')
      return true
    } catch (error) {
      console.error('🎵 AudioContext creation failed:', error)
      return false
    }
  }, [])

  // Initialize audio element
  useEffect(() => {
    if (typeof window === 'undefined') return

    console.log('🎵 Initializing audio element...')
    audioRef.current = new Audio()
    audioRef.current.loop = true
    audioRef.current.preload = 'metadata'
    audioRef.current.crossOrigin = 'anonymous'

    console.log('🎵 Audio element created:', {
      loop: audioRef.current.loop,
      preload: audioRef.current.preload,
      crossOrigin: audioRef.current.crossOrigin,
      readyState: audioRef.current.readyState
    })

    // Set up audio context connection
    const connectAudioContext = () => {
      console.log('🎵 connectAudioContext called', {
        hasAudio: !!audioRef.current,
        hasAudioContext: !!audioContextRef.current,
        hasSourceNode: !!sourceNodeRef.current,
        audioContextState: audioContextRef.current?.state
      })

      if (audioRef.current && audioContextRef.current) {
        if (sourceNodeRef.current) {
          console.log('🎵 MediaElementSource already exists, skipping creation')
          return
        }

        // Check if audio element is ready
        if (audioRef.current.readyState < 1) {
          console.log('🎵 Audio element not ready, waiting for loadedmetadata...')
          audioRef.current.addEventListener('loadedmetadata', () => {
            console.log('🎵 Audio element ready, creating MediaElementSource...')
            try {
              sourceNodeRef.current = audioContextRef.current!.createMediaElementSource(audioRef.current!)
              sourceNodeRef.current.connect(gainNodeRef.current!)
              console.log('🎵 MediaElementSource created and connected')
            } catch (error) {
              console.error('🎵 Failed to connect audio context:', error)
            }
          }, { once: true })
          return
        }

        try {
          console.log('🎵 Creating MediaElementSource...')
          sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current)
          sourceNodeRef.current.connect(gainNodeRef.current!)
          console.log('🎵 MediaElementSource created and connected')
        } catch (error) {
          console.error('🎵 Failed to connect audio context:', error)
        }
      } else {
        console.log('🎵 Cannot connect audio context - missing requirements:', {
          hasAudio: !!audioRef.current,
          hasAudioContext: !!audioContextRef.current
        })
      }
    }

    // Connect on first user interaction
    const handleUserInteraction = async () => {
      if (interactionHandledRef.current) {
        console.log('🎵 User interaction already handled, skipping...')
        return
      }
      interactionHandledRef.current = true

      console.log('🎵 User interaction detected, initializing audio context...')
      console.log('🎵 Audio element before interaction:', {
        hasAudio: !!audioRef.current,
        audioSrc: audioRef.current?.src,
        audioReadyState: audioRef.current?.readyState
      })
      await initializeAudioContext()
      connectAudioContext()
      document.removeEventListener('click', handleUserInteraction)
      document.removeEventListener('touchstart', handleUserInteraction)
    }

    console.log('🎵 Adding user interaction listeners...')
    document.addEventListener('click', handleUserInteraction)
    document.addEventListener('touchstart', handleUserInteraction)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }, [initializeAudioContext])

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current && state.track) {
      console.log('🎵 Setting audio source:', state.track.url)
      console.log('🎵 Audio element readyState before:', audioRef.current.readyState)

      // Test if the URL is accessible
      fetch(state.track.url, { method: 'HEAD' })
        .then(response => {
          console.log('🎵 URL test response:', response.status, response.statusText)
          if (!response.ok) {
            console.error('🎵 URL not accessible:', response.status, response.statusText)
          }
        })
        .catch(error => {
          console.error('🎵 URL test failed:', error)
        })

      audioRef.current.src = state.track.url
      console.log('🎵 Audio src set to:', audioRef.current.src)

      // Add event listeners for debugging
      const handleLoadStart = () => console.log('🎵 Audio loadstart')
      const handleLoadedMetadata = () => console.log('🎵 Audio loadedmetadata')
      const handleCanPlay = () => console.log('🎵 Audio canplay - ready to play!')
      const handleError = (e: any) => console.error('🎵 Audio error:', e)
      const handleLoad = () => console.log('🎵 Audio load')
      const handleLoadedData = () => console.log('🎵 Audio loadeddata')
      const handleStalled = () => console.log('🎵 Audio stalled')
      const handleSuspend = () => console.log('🎵 Audio suspend')

      audioRef.current.addEventListener('loadstart', handleLoadStart)
      audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata)
      audioRef.current.addEventListener('canplay', handleCanPlay)
      audioRef.current.addEventListener('error', handleError)
      audioRef.current.addEventListener('load', handleLoad)
      audioRef.current.addEventListener('loadeddata', handleLoadedData)
      audioRef.current.addEventListener('stalled', handleStalled)
      audioRef.current.addEventListener('suspend', handleSuspend)

      // Cleanup function
      return () => {
        audioRef.current?.removeEventListener('loadstart', handleLoadStart)
        audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata)
        audioRef.current?.removeEventListener('canplay', handleCanPlay)
        audioRef.current?.removeEventListener('error', handleError)
        audioRef.current?.removeEventListener('load', handleLoad)
        audioRef.current?.removeEventListener('loadeddata', handleLoadedData)
        audioRef.current?.removeEventListener('stalled', handleStalled)
        audioRef.current?.removeEventListener('suspend', handleSuspend)
      }
    }
  }, [state.track])

  // Update volume via GainNode
  useEffect(() => {
    if (gainNodeRef.current) {
      const volume = state.muted ? 0 : state.volume
      gainNodeRef.current.gain.value = volume
      console.log('🎵 Volume updated via GainNode:', {
        volume,
        muted: state.muted,
        gainValue: gainNodeRef.current.gain.value
      })
    }

    // Also set audio element volume as backup
    if (audioRef.current) {
      audioRef.current.volume = state.muted ? 0 : state.volume
      console.log('🎵 Audio element volume set:', {
        volume: audioRef.current.volume,
        muted: state.muted
      })
    }
  }, [state.volume, state.muted])

  // Fade in function
  const fadeIn = useCallback(() => {
    if (!audioContextRef.current || !gainNodeRef.current) return

    const gain = gainNodeRef.current
    const targetVolume = state.muted ? 0 : state.volume
    const duration = 400 // 400ms fade
    const startTime = audioContextRef.current.currentTime

    gain.gain.cancelScheduledValues(startTime)
    gain.gain.setValueAtTime(gain.gain.value, startTime)
    gain.gain.linearRampToValueAtTime(targetVolume, startTime + duration / 1000)
  }, [state.volume, state.muted])

  // Fade out function
  const fadeOut = useCallback(() => {
    if (!audioContextRef.current || !gainNodeRef.current) return

    const gain = gainNodeRef.current
    const duration = 400 // 400ms fade
    const startTime = audioContextRef.current.currentTime

    gain.gain.cancelScheduledValues(startTime)
    gain.gain.setValueAtTime(gain.gain.value, startTime)
    gain.gain.linearRampToValueAtTime(0, startTime + duration / 1000)
  }, [])

  // Play function
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
      audioContextState: audioContextRef.current?.state,
      hasGainNode: !!gainNodeRef.current,
      hasSourceNode: !!sourceNodeRef.current,
      usingProvidedTrack: !!trackToPlay
    })

    // Use direct audio approach instead of AudioContext for simplicity
    if (trackToPlay && track) {
      console.log('🎵 Using direct audio approach for intro music')
      try {
        // Create a new audio element for this track
        const directAudio = new Audio(track.url)
        directAudio.volume = state.muted ? 0 : state.volume
        directAudio.loop = true

        console.log('🎵 Direct audio created:', {
          src: directAudio.src,
          volume: directAudio.volume,
          loop: directAudio.loop
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
        // Fall through to regular audio context approach
      }
    }

    // Test if the URL is accessible
    if (track?.url) {
      console.log('🎵 Testing URL accessibility:', track.url)
      try {
        const response = await fetch(track.url, { method: 'HEAD' })
        console.log('🎵 URL test response:', response.status, response.statusText)
        if (!response.ok) {
          console.error('🎵 URL not accessible:', response.status, response.statusText)
          alert(`Audio file not accessible: ${response.status} ${response.statusText}`)
          return
        }
      } catch (error) {
        console.error('🎵 URL test failed:', error)
        alert(`Cannot access audio file: ${error}`)
        return
      }
    }

    if (!audioRef.current) {
      console.warn('🎵 Cannot play: missing audio element')
      return
    }

    if (!track) {
      console.warn('🎵 Cannot play: no track selected')
      return
    }

    try {
      const audioContextReady = await initializeAudioContext()
      if (!audioContextReady) {
        console.error('🎵 AudioContext not ready, cannot play audio')
        return
      }

      // Ensure AudioContext is running before proceeding
      if (audioContextRef.current && audioContextRef.current.state !== 'running') {
        console.log('🎵 AudioContext not running, attempting to resume...')
        try {
          await audioContextRef.current.resume()
          console.log('🎵 AudioContext resumed to:', audioContextRef.current.state)
        } catch (error) {
          console.error('🎵 Failed to resume AudioContext:', error)
          return
        }
      }

      // Always set the audio source to ensure it's correct
      console.log('🎵 Setting audio source:', track.url)
      console.log('🎵 Current audio src:', audioRef.current.src)

      // Pause and reset the audio element
      audioRef.current.pause()
      audioRef.current.currentTime = 0

      // Set new source
      audioRef.current.src = track.url
      audioRef.current.load() // Reload the audio element
      console.log('🎵 Audio src after setting:', audioRef.current.src)

      // Ensure audio context is connected (only if source node doesn't exist)
      if (audioRef.current && audioContextRef.current && !sourceNodeRef.current) {
        try {
          sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current)
          sourceNodeRef.current.connect(gainNodeRef.current!)
          console.log('🎵 Audio context connected with new source node')
        } catch (error) {
          console.warn('🎵 Failed to connect audio context:', error)
        }
      } else if (sourceNodeRef.current) {
        console.log('🎵 MediaElementSource already exists, skipping creation')
      }

      // Check if audio is ready to play
      if (audioRef.current.readyState < 2) {
        console.log('🎵 Audio not ready, waiting for canplay... (readyState:', audioRef.current.readyState, ')')

        // Wait for canplay with timeout
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            console.error('🎵 Audio loading timeout after 10 seconds')
            audioRef.current?.removeEventListener('canplay', handleCanPlay)
            audioRef.current?.removeEventListener('error', handleError)
            reject(new Error('Audio loading timeout'))
          }, 10000) // 10 second timeout

          const handleCanPlay = () => {
            console.log('🎵 Audio is now ready to play!')
            clearTimeout(timeout)
            audioRef.current?.removeEventListener('canplay', handleCanPlay)
            audioRef.current?.removeEventListener('error', handleError)
            resolve(undefined)
          }

          const handleError = (e: any) => {
            console.error('🎵 Audio error while waiting:', e)
            clearTimeout(timeout)
            audioRef.current?.removeEventListener('canplay', handleCanPlay)
            audioRef.current?.removeEventListener('error', handleError)
            reject(e)
          }

          audioRef.current?.addEventListener('canplay', handleCanPlay)
          audioRef.current?.addEventListener('error', handleError)
        })
      }

      console.log('🎵 Attempting to play audio... (readyState:', audioRef.current.readyState, ')')
      console.log('🎵 Audio element details before play:', {
        src: audioRef.current.src,
        currentTime: audioRef.current.currentTime,
        duration: audioRef.current.duration,
        paused: audioRef.current.paused,
        ended: audioRef.current.ended,
        networkState: audioRef.current.networkState,
        readyState: audioRef.current.readyState,
        volume: audioRef.current.volume,
        muted: audioRef.current.muted
      })

      // Ensure audio element volume is set
      audioRef.current.volume = state.muted ? 0 : state.volume
      audioRef.current.muted = state.muted
      console.log('🎵 Audio element volume set before play:', {
        volume: audioRef.current.volume,
        muted: audioRef.current.muted,
        stateVolume: state.volume,
        stateMuted: state.muted
      })

      const playPromise = audioRef.current.play()
      console.log('🎵 Play promise created:', playPromise)

      await playPromise
      console.log('🎵 Audio playing successfully!')

      setState(prev => ({ ...prev, playing: true, enabled: true }))
      saveState({ playing: true, enabled: true })
      fadeIn()
      console.log('🎵 ===== PLAY FUNCTION SUCCESS =====')
    } catch (error) {
      console.error('🎵 ===== PLAY FUNCTION ERROR =====')
      console.error('🎵 Failed to play audio:', error)
      setState(prev => ({ ...prev, playing: false }))

      // Show user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes('timeout')) {
          alert('Audio failed to load. This might be due to CORS restrictions. Try using a CORS proxy like cors-anywhere.herokuapp.com before your URL.')
        } else if (error.message.includes('NotAllowedError')) {
          alert('Audio playback was blocked. Please click the play button again to allow audio.')
        } else if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
          alert('CORS error: The audio file cannot be loaded due to cross-origin restrictions. Try using a CORS proxy or upload to a different service.')
        } else {
          alert(`Audio playback failed: ${error.message}. Try using a CORS proxy if the URL is from Google Drive, Dropbox, or other file hosting services.`)
        }
      }
      console.log('🎵 ===== PLAY FUNCTION END =====')
    }
  }, [state.track, initializeAudioContext, saveState, fadeIn])

  // Pause function
  const pause = useCallback(() => {
    if (audioRef.current) {
      fadeOut()
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause()
          setState(prev => ({ ...prev, playing: false }))
          saveState({ playing: false })
        }
      }, 400) // Wait for fade out
    }
  }, [fadeOut, saveState])

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

  // Play intro music function
  const playIntroMusic = useCallback(async () => {
    console.log('🎵 ===== PLAY INTRO MUSIC START =====')
    console.log('🎵 playIntroMusic called', {
      currentTrack: state.track?.id,
      hasAudio: !!audioRef.current,
      audioSrc: audioRef.current?.src,
      audioReadyState: audioRef.current?.readyState,
      audioContextState: audioContextRef.current?.state
    })

    // Test direct audio immediately
    console.log('🎵 Testing direct audio creation...')
    try {
      const testAudio = new Audio('/music/music-for-intro.mp3')
      testAudio.volume = 0.5
      console.log('🎵 Test audio created:', {
        src: testAudio.src,
        volume: testAudio.volume
      })

      await testAudio.play()
      console.log('🎵 Test audio playing successfully!')

      // Keep the test audio playing
      testAudio.loop = true
      if (audioRef.current) {
        audioRef.current.pause()
      }
      audioRef.current = testAudio

      setState(prev => ({ ...prev, playing: true, enabled: true }))
      saveState({ playing: true, enabled: true })
      console.log('🎵 ===== PLAY INTRO MUSIC SUCCESS (DIRECT TEST) =====')
      return
    } catch (error) {
      console.error('🎵 Test audio failed:', error)
    }

    const introTrack = BUILT_IN_TRACKS.find(t => t.id === 'intro')
    if (!introTrack) {
      console.error('🎵 Intro track not found in BUILT_IN_TRACKS:', BUILT_IN_TRACKS.map(t => t.id))
      return
    }

    console.log('🎵 Found intro track:', introTrack)
    console.log('🎵 Playing intro music:', introTrack.title, 'URL:', introTrack.url)

    // Test the URL first
    try {
      console.log('🎵 Testing intro track URL accessibility...')
      const response = await fetch(introTrack.url, { method: 'HEAD' })
      console.log('🎵 Intro track URL test response:', response.status, response.statusText)
      if (!response.ok) {
        console.error('🎵 Intro track URL not accessible:', response.status, response.statusText)
        return
      }
    } catch (error) {
      console.error('🎵 Intro track URL test failed:', error)
      return
    }

    // Set the intro track as current and play it
    console.log('🎵 Setting intro track as current track...')
    setState(prev => ({ ...prev, track: introTrack }))
    saveState({ track: introTrack })

    // Small delay to ensure state is updated
    await new Promise(resolve => setTimeout(resolve, 100))

    // Play the music
    try {
      console.log('🎵 Attempting to play intro music...')
      await play(introTrack)
      console.log('🎵 Intro music started successfully')
    } catch (error) {
      console.error('🎵 Failed to play intro music:', error)
    }
    console.log('🎵 ===== PLAY INTRO MUSIC END =====')
  }, [state.track, saveState, play])


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
