import { useMusic, BUILT_IN_TRACKS } from '../context/MusicContext'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'

interface MusicBarProps {
  className?: string
}

export default function MusicBar({ className = '' }: MusicBarProps) {
  const {
    playing,
    volume,
    muted,
    track,
    toggle,
    setTrack,
    next,
    prev,
    setVolume,
    toggleMute
  } = useMusic()


  const allTracks = BUILT_IN_TRACKS


  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white/90">Focus Music</h3>
      </div>

      {/* Track Selection */}
      <div className="space-y-3">
        {allTracks.length > 0 ? (
          <div>
            <label className="text-xs text-white/70 mb-1 block">Track</label>
            <select
              value={track?.id || ''}
              onChange={(e) => setTrack(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              {allTracks.map((track) => (
                <option key={track.id} value={track.id} className="bg-black text-white">
                  {track.title} {track.artist && `- ${track.artist}`}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="text-center py-4 bg-white/5 rounded-lg border border-white/10">
            <p className="text-white/70 text-sm">No music tracks available</p>
          </div>
        )}

        {/* Track Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={prev}
            disabled={allTracks.length === 0}
            className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous track"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={toggle}
            disabled={allTracks.length === 0}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${allTracks.length === 0
              ? 'bg-white/5 text-white/50 cursor-not-allowed'
              : playing
                ? 'bg-white text-black hover:bg-white/90'
                : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            aria-label={playing ? 'Pause music' : 'Play music'}
          >
            {playing ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>

          <button
            onClick={next}
            disabled={allTracks.length === 0}
            className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next track"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-white/70">Volume</label>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="w-6 h-6 rounded flex items-center justify-center text-white/70 hover:text-white transition-colors"
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <span className="text-xs text-white/60 w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #ffffff 0%, #ffffff ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) ${(muted ? 0 : volume) * 100}%, rgba(255,255,255,0.2) 100%)`
            }}
          />
        </div>


      </div>
    </div>
  )
}
