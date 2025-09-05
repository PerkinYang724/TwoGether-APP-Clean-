// Example: How to integrate Focus Music with Timer
// This shows how to add music controls to your timer component

import { useEffect } from 'react'
import { useMusic } from '../context/MusicContext'

// Example integration in your timer component:
export function TimerWithMusic() {
  const { play, pause, enabled } = useMusic()

  // Example timer event handlers:
  const handleStart = async () => {
    // Start timer logic here...
    console.log('Timer started')

    // Start music if enabled (this counts as user gesture)
    if (enabled) {
      await play()
    }
  }

  const handlePause = () => {
    // Pause timer logic here...
    console.log('Timer paused')

    // Pause music
    pause()
  }

  const handleStop = () => {
    // Stop timer logic here...
    console.log('Timer stopped')

    // Pause music
    pause()
  }

  return (
    <div>
      {/* Your timer UI here */}
      <button onClick={handleStart}>Start</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  )
}

// Alternative: If you want to automatically start/stop music with timer state
export function useTimerMusicIntegration(isRunning: boolean) {
  const { play, pause, enabled } = useMusic()

  // Auto-start music when timer starts
  useEffect(() => {
    if (enabled && isRunning) {
      play() // This counts as user gesture
    } else if (!isRunning) {
      pause()
    }
  }, [isRunning, enabled, play, pause])
}

// Usage in your TimerCard component:
/*
import { useMusic } from '../context/MusicContext'

const TimerCard: React.FC<TimerCardProps> = ({ isRunning, ... }) => {
  const { play, pause, enabled } = useMusic()

  // Auto-start music when timer starts
  useEffect(() => {
    if (enabled && isRunning) {
      play() // This counts as user gesture
    } else if (!isRunning) {
      pause()
    }
  }, [isRunning, enabled, play, pause])

  const handleStart = async () => {
    // Your existing start logic
    onStart()
    
    // Music will auto-start via useEffect above
  }

  const handlePause = () => {
    // Your existing pause logic
    onStop()
    
    // Music will auto-pause via useEffect above
  }

  // Rest of your component...
}
*/
